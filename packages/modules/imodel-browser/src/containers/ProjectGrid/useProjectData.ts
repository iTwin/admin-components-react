/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  ApiOverrides,
  DataStatus,
  ProjectFilterOptions,
  ProjectFull,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useProjectFilter } from "./useProjectFilter";

export interface ProjectDataHookOptions {
  requestType?: "favorites" | "recents" | "";
  accessToken?: string | undefined;
  apiOverrides?: ApiOverrides<ProjectFull[]>;
  filterOptions?: ProjectFilterOptions;
}

const PAGE_SIZE = 100;

export const useProjectData = ({
  requestType = "",
  accessToken,
  apiOverrides,
  filterOptions,
}: ProjectDataHookOptions) => {
  const data = apiOverrides?.data;
  const [projects, setProjects] = React.useState<ProjectFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const filteredProjects = useProjectFilter(projects, filterOptions);
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
  }, [accessToken, requestType, data, apiOverrides]);

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
    const paging = `?$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;
    const search =
      ["favorites", "recents"].includes(requestType) || !filterOptions
        ? ""
        : `&$search=${filterOptions}`;
    const url = `${_getAPIServer(
      apiOverrides
    )}/projects/${endpoint}${paging}${search}`;
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        Authorization: accessToken,
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
      .then((result: { projects: ProjectFull[] }) => {
        setStatus(DataStatus.Complete);
        if (result.projects.length !== PAGE_SIZE) {
          setMorePages(false);
        }
        setProjects((projects) =>
          page === 0 ? result.projects : [...projects, ...result.projects]
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
  ]);
  return {
    projects: filteredProjects,
    status,
    fetchMore: morePages ? fetchMore : undefined,
  };
};
