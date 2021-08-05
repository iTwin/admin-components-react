/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  ApiOverrides,
  DataStatus,
  IModelFull,
  IModelSortOptions,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useIModelSort } from "./useIModelSort";

export interface IModelDataHookOptions {
  projectId?: string | undefined;
  accessToken?: string | undefined;
  sortOptions?: IModelSortOptions;
  apiOverrides?: ApiOverrides<IModelFull[]>;
}

const PAGE_SIZE = 100;

export const useIModelData = ({
  projectId,
  accessToken,
  sortOptions,
  apiOverrides,
}: IModelDataHookOptions) => {
  const sortType = sortOptions?.sortType === "name" ? "name" : undefined; //Only available sort by API at the moment.
  const sortDescending = sortOptions?.descending;
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const sortedIModels = useIModelSort(iModels, sortOptions);
  const [status, setStatus] = React.useState<DataStatus>();
  const [page, setPage] = React.useState(0);
  const [morePages, setMorePages] = React.useState(true);
  const fetchMore = React.useCallback(() => {
    setPage((page) => page + 1);
  }, []);
  React.useEffect(() => {
    // If sort changes but we already have all the data,
    // let client side sorting do its job, otherwise, refetch from scratch.
    if (morePages) {
      setStatus(DataStatus.Fetching);
      setIModels([]);
      setPage(0);
      setMorePages(true);
    }
  }, [sortType, sortDescending, morePages]);
  React.useEffect(() => {
    // If any of the dependencies change, always restart the fetch from scratch.
    setStatus(DataStatus.Fetching);
    setIModels([]);
    setPage(0);
    setMorePages(true);
  }, [accessToken, projectId, apiOverrides?.data, apiOverrides]);
  React.useEffect(() => {
    if (!morePages) {
      return;
    }
    if (apiOverrides?.data) {
      setIModels(apiOverrides.data);
      setStatus(DataStatus.Complete);
      return;
    }
    if (!accessToken || !projectId) {
      setStatus(
        !accessToken ? DataStatus.TokenRequired : DataStatus.ContextRequired
      );
      setIModels([]);
      return;
    }
    if (page === 0) {
      setStatus(DataStatus.Fetching);
    }
    const abortController = new AbortController();

    const selection = `?projectId=${projectId}`;
    const sorting = sortType
      ? `&$orderBy=${sortType} ${sortDescending ? "desc" : "asc"}`
      : "";
    const paging = `&$skip=${page * PAGE_SIZE}&$top=${PAGE_SIZE}`;

    const url = `${_getAPIServer(
      apiOverrides
    )}/imodels/${selection}${sorting}${paging}`;
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
      .then((result: { iModels: IModelFull[] }) => {
        setStatus(DataStatus.Complete);
        if (result.iModels.length !== PAGE_SIZE) {
          setMorePages(false);
        }
        setIModels((imodels) =>
          page === 0 ? result.iModels : [...imodels, ...result.iModels]
        );
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          // Aborting because unmounting is not an error, swallow.
          return;
        }
        setIModels([]);
        setStatus(DataStatus.FetchFailed);
        console.error(e);
      });
    return () => {
      abortController.abort();
    };
  }, [
    accessToken,
    projectId,
    apiOverrides?.data,
    apiOverrides,
    sortDescending,
    sortType,
    page,
    morePages,
  ]);
  return {
    iModels: sortedIModels,
    status,
    fetchMore: morePages ? fetchMore : undefined,
  };
};
