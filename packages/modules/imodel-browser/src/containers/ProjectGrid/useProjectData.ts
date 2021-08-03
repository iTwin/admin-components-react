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
  ProjectSortOptions,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useProjectFilter } from "./useProjectFilter";
import { useProjectSort } from "./useProjectSort";

export interface ProjectDataHookOptions {
  requestType?: "favorites" | "recents" | "" | string; //`search=${string}` |
  accessToken?: string | undefined;
  apiOverrides?: ApiOverrides<ProjectFull[]>;
  filterOptions?: ProjectFilterOptions;
  sortOptions?: ProjectSortOptions;
}

export const useProjectData = ({
  requestType = "",
  accessToken,
  apiOverrides,
  filterOptions,
  sortOptions,
}: ProjectDataHookOptions) => {
  const data = apiOverrides?.data;
  const [projects, setProjects] = React.useState<ProjectFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const filteredProjects = useProjectFilter(projects, filterOptions);
  const sortedProjects = useProjectSort(filteredProjects, sortOptions);
  React.useEffect(() => {
    if (data) {
      setProjects(data);
      setStatus(DataStatus.Complete);
      return;
    }
    if (!accessToken) {
      setStatus(DataStatus.TokenRequired);
      setProjects([]);
      return;
    }
    if (
      !!requestType &&
      !["favorites", "recents"].includes(requestType) &&
      !requestType.startsWith("search=")
    ) {
      setStatus(DataStatus.ContextRequired);
      setProjects([]);
      return;
    }
    setStatus(DataStatus.Fetching);
    const abortController = new AbortController();
    const url = `${_getAPIServer(apiOverrides)}/projects/${
      (requestType.startsWith("search") ? "?$" : "") + requestType
    }`; //[&$skip][&$top]
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
        setProjects(result.projects);
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
  }, [accessToken, requestType, data, apiOverrides]);
  return { projects: sortedProjects, status };
};
