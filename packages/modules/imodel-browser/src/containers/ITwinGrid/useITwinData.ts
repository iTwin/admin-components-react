/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useLogger } from "../../contexts/LoggerContext";
import {
  AccessTokenProvider,
  ApiOverrides,
  DataStatus,
  ITwinFilterOptions,
  ITwinFull,
  ITwinSubClass,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useITwinFilter } from "./useITwinFilter";

export interface ProjectDataHookOptions {
  requestType?: "favorites" | "recents" | "";
  iTwinSubClass?: ITwinSubClass;
  accessToken?: AccessTokenProvider;
  apiOverrides?: ApiOverrides<ITwinFull[]>;
  filterOptions?: ITwinFilterOptions;
  orderbyOptions?: string;
  shouldRefetchFavorites?: boolean;
  resetShouldRefetchFavorites?: () => void;
}

const PAGE_SIZE = 100;

export const useITwinData = ({
  requestType = "",
  iTwinSubClass = "Project",
  accessToken,
  apiOverrides,
  filterOptions,
  orderbyOptions,
  shouldRefetchFavorites,
  resetShouldRefetchFavorites,
}: ProjectDataHookOptions) => {
  const logger = useLogger();
  const data = apiOverrides?.data;
  const serverEnvironmentPrefix = apiOverrides?.serverEnvironmentPrefix;
  const [projects, setProjects] = React.useState<ITwinFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const [totalCount, setTotalCount] = React.useState<number>();
  const filteredProjects = useITwinFilter(projects, filterOptions);
  const [page, setPage] = React.useState(0);
  const [morePages, setMorePages] = React.useState(true);

  const resetData = React.useCallback(() => {
    setStatus(DataStatus.Fetching);
    setProjects([]);
    setPage(0);
    setMorePages(true);
    fetchingMoreRef.current = true;
  }, []);

  // We start in a fetching state
  const fetchingMoreRef = React.useRef(true);
  const fetchMore = React.useCallback(() => {
    if (fetchingMoreRef.current) {
      return;
    }
    fetchingMoreRef.current = true;
    setPage((page) => page + 1);
  }, []);

  // A full first page leaves "page" at 0 and "morePages" true, so a reset alone changes nothing the
  // fetch effect depends on. Only refetchITwins bumps this: bumping inside resetData would abort
  // and re-issue the request that a dependency change had just started.
  const [refetchCount, setRefetchCount] = React.useState(0);
  const refetchITwins = React.useCallback(() => {
    resetData();
    setRefetchCount((count) => count + 1);
  }, [resetData]);

  // Abort alone is not enough: an already-resolved response still runs its continuation.
  const activeRequestRef = React.useRef<symbol | undefined>(undefined);

  // In an effect, not during render: a discarded render must not leave an uncommitted value here.
  const morePagesRef = React.useRef(morePages);
  React.useEffect(() => {
    morePagesRef.current = morePages;
  }, [morePages]);

  React.useEffect(() => {
    // If filter changes but we already have all the data for favorites or recents,
    // let client side filtering do its job, otherwise, refetch from scratch.
    // Use ref so "morePages" changes itself does not trigger the effect.
    if (
      morePagesRef.current ||
      !["favorites", "recents"].includes(requestType)
    ) {
      resetData();
    }
  }, [filterOptions, requestType, resetData]);

  React.useEffect(() => {
    // If any of the dependencies change, always restart the fetch from scratch.
    resetData();
  }, [
    accessToken,
    requestType,
    iTwinSubClass,
    orderbyOptions,
    data,
    serverEnvironmentPrefix,
    resetData,
  ]);

  React.useEffect(() => {
    if (!morePages) {
      return;
    }
    if (data) {
      setProjects(data);
      setStatus(DataStatus.Complete);
      setMorePages(false);
      return;
    }
    if (!accessToken) {
      setStatus(DataStatus.TokenRequired);
      setProjects([]);
      return;
    }
    if (page === 0) {
      setStatus(DataStatus.Fetching);
    }
    const requestId = Symbol();
    activeRequestRef.current = requestId;
    const abortController = new AbortController();
    const endpoint = ["favorites", "recents"].includes(requestType)
      ? requestType
      : "";
    const resolvedITwinSubClass = iTwinSubClass === "All" ? "" : iTwinSubClass;
    const subClass = `?subClass=${resolvedITwinSubClass}`;
    const paging = `&$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;
    const search =
      ["favorites", "recents"].includes(requestType) || !filterOptions
        ? ""
        : `&$search=${encodeURIComponent(String(filterOptions).trim())}`;
    const orderby =
      ["favorites", "recents"].includes(requestType) || !orderbyOptions
        ? ""
        : `&$orderby=${encodeURIComponent(String(orderbyOptions).trim())}`;

    const url = `${_getAPIServer(
      serverEnvironmentPrefix
    )}/itwins/${endpoint}${subClass}${paging}${search}${orderby}`;

    const makeFetchRequest = async () => {
      const options: RequestInit = {
        signal: abortController.signal,
        headers: {
          "Cache-Control":
            requestType === "favorites" && shouldRefetchFavorites
              ? "no-cache"
              : "",
          Authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
          Prefer: "return=representation",
          "x-total-count": "true",
        },
      };

      const response = await fetch(url, options);
      const result: { iTwins: ITwinFull[] } = response.ok
        ? await response.json()
        : await response.text().then((errorText) => {
            throw new Error(errorText);
          });
      if (activeRequestRef.current !== requestId) {
        return;
      }
      const totalCountHeader = response.headers.get("x-total-count");
      if (totalCountHeader !== null) {
        setTotalCount(Number(totalCountHeader));
      }
      setStatus(DataStatus.Complete);
      fetchingMoreRef.current = false;
      requestType === "favorites" && resetShouldRefetchFavorites?.();
      if (result.iTwins.length !== PAGE_SIZE) {
        setMorePages(false);
      }
      setProjects((projects) =>
        page === 0 ? result.iTwins : [...projects, ...result.iTwins]
      );
    };

    makeFetchRequest().catch((e) => {
      if (activeRequestRef.current !== requestId || e.name === "AbortError") {
        // Superseded or aborted, not a failure worth reporting.
        return;
      }
      setProjects([]);
      setStatus(DataStatus.FetchFailed);
      fetchingMoreRef.current = false;
      logger.logError("Failed to fetch iTwins", e);
    });
    return () => {
      activeRequestRef.current = undefined;
      abortController.abort();
    };
  }, [
    accessToken,
    requestType,
    data,
    serverEnvironmentPrefix,
    filterOptions,
    orderbyOptions,
    page,
    morePages,
    refetchCount,
    iTwinSubClass,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
    logger,
  ]);
  return {
    iTwins: filteredProjects,
    status,
    totalCount,
    fetchMore: morePages ? fetchMore : undefined,
    refetchITwins,
  };
};
