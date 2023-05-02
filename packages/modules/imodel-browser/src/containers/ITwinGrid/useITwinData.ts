/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
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
  itwinSubClass?: ITwinSubClass;
  accessToken?: string | undefined;
  apiOverrides?: ApiOverrides<ITwinFull[]>;
  filterOptions?: ITwinFilterOptions;
}

const PAGE_SIZE = 100;

export const useITwinData = ({
  requestType = "",
  itwinSubClass = "Project",
  accessToken,
  apiOverrides,
  filterOptions,
}: ProjectDataHookOptions) => {
  const data = apiOverrides?.data;
  const [projects, setProjects] = React.useState<ITwinFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const filteredProjects = useITwinFilter(projects, filterOptions);
  const [page, setPage] = React.useState(0);
  const [morePages, setMorePages] = React.useState(true);
  const fetchMore = React.useCallback(() => {
    setPage((page) => page + 1);
  }, []);

  const morePagesRef = React.useRef(morePages);
  morePagesRef.current = morePages;

  React.useEffect(() => {
    // If filter changes but we already have all the data for favorites or recents,
    // let client side filtering do its job, otherwise, refetch from scratch.
    // Use ref so "morePages" changes itself does not trigger the effect.
    if (
      morePagesRef.current ||
      !["favorites", "recents"].includes(requestType)
    ) {
      setStatus(DataStatus.Fetching);
      setProjects([]);
      setPage(0);
      setMorePages(true);
    }
  }, [filterOptions, requestType]);

  React.useEffect(() => {
    // If any of the dependencies change, always restart the fetch from scratch.
    setStatus(DataStatus.Fetching);
    setProjects([]);
    setPage(0);
    setMorePages(true);
  }, [accessToken, requestType, itwinSubClass, data, apiOverrides]);

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
    const abortController = new AbortController();
    const endpoint = ["favorites", "recents"].includes(requestType)
      ? requestType
      : "";
    const subClass = `?subClass=${itwinSubClass}`;
    const paging = `&$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;
    const search =
      ["favorites", "recents"].includes(requestType) || !filterOptions
        ? ""
        : `&$search=${filterOptions}`;
    const url = `${_getAPIServer(
      apiOverrides
    )}/itwins/${endpoint}${subClass}${paging}${search}`;
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        Authorization: accessToken,
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        Prefer: "return=representation",
      },
    };
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
      })
      .then((result: { iTwins: ITwinFull[] }) => {
        setStatus(DataStatus.Complete);
        if (result.iTwins.length !== PAGE_SIZE) {
          setMorePages(false);
        }
        setProjects((projects) =>
          page === 0 ? result.iTwins : [...projects, ...result.iTwins]
        );
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          // Aborting because unmounting is not an error, swallow.
          return;
        }
        setProjects([]);
        setStatus(DataStatus.FetchFailed);
        console.error(e);
      });
    return () => {
      abortController.abort();
    };
  }, [
    accessToken,
    requestType,
    data,
    apiOverrides,
    filterOptions,
    page,
    morePages,
    itwinSubClass,
  ]);
  return {
    itwins: filteredProjects,
    status,
    fetchMore: morePages ? fetchMore : undefined,
  };
};
