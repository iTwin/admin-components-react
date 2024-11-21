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
  ViewType,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useIModelSort } from "./useIModelSort";

export interface IModelDataHookOptions {
  iTwinId?: string | undefined;
  accessToken?: string | (() => Promise<string>) | undefined;
  sortOptions?: IModelSortOptions;
  apiOverrides?: ApiOverrides<IModelFull[]>;
  searchText?: string | undefined;
  maxCount?: number;
  viewMode?: ViewType;
}
const PAGE_SIZE = 100;

export const useIModelData = ({
  iTwinId,
  accessToken,
  sortOptions,
  apiOverrides,
  searchText,
  maxCount,
  viewMode,
}: IModelDataHookOptions) => {
  const sortType =
    sortOptions && ["name", "createdDateTime"].includes(sortOptions.sortType)
      ? sortOptions.sortType
      : undefined; //Only available sort by API at the moment.
  const sortDescending = sortOptions?.descending;
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const sortedIModels = useIModelSort(iModels, sortOptions);
  const [status, setStatus] = React.useState<DataStatus>();
  const [page, setPage] = React.useState(0);
  const [morePages, setMorePages] = React.useState(true);
  const fetchMore = React.useCallback(() => {
    viewMode === "cells" && setStatus(DataStatus.Fetching);
    status !== DataStatus.Fetching && setPage((page) => page + 1);
  }, [status, viewMode]);

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
  }, [
    accessToken,
    iTwinId,
    apiOverrides?.data,
    apiOverrides,
    searchText,
    maxCount,
  ]);

  React.useEffect(() => {
    if (!morePages) {
      return;
    }
    if (apiOverrides?.data) {
      setIModels(apiOverrides.data);
      setStatus(DataStatus.Complete);
      setMorePages(false);
      return;
    }
    if (!accessToken || !iTwinId) {
      setStatus(
        !accessToken ? DataStatus.TokenRequired : DataStatus.ContextRequired
      );
      setIModels([]);
      return;
    }
    if (page === 0) {
      setStatus(DataStatus.Fetching);
    }

    const selection = `?iTwinId=${iTwinId}`;
    const sorting = sortType
      ? `&$orderBy=${sortType} ${sortDescending ? "desc" : "asc"}`
      : "";
    const skip = page * PAGE_SIZE;
    let top;
    if (maxCount) {
      top = Math.min(PAGE_SIZE, maxCount - skip);
    } else {
      top = PAGE_SIZE;
    }
    const paging = `&$skip=${skip}&$top=${top}`;
    const searching = searchText?.trim() ? `&$search=${searchText}` : "";

    const abortController = new AbortController();
    const url = `${_getAPIServer({
      data: apiOverrides?.data,
      serverEnvironmentPrefix: apiOverrides?.serverEnvironmentPrefix,
    })}/imodels/${selection}${sorting}${paging}${searching}`;

    const makeFetchRequest = async () => {
      const options: RequestInit = {
        signal: abortController.signal,
        headers: {
          Authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Prefer: "return=representation",
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
      };

      const response = await fetch(url, options);
      const result: { iModels: IModelFull[] } = response.ok
        ? await response.json()
        : await response.text().then((errorText) => {
            throw new Error(errorText);
          });
      setStatus(DataStatus.Complete);
      if (
        result.iModels.length !== PAGE_SIZE ||
        result.iModels.length === maxCount
      ) {
        setMorePages(false);
      }
      setIModels((imodels) =>
        page === 0 ? result.iModels : [...imodels, ...result.iModels]
      );
    };

    makeFetchRequest().catch((e) => {
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
    apiOverrides?.serverEnvironmentPrefix,
    apiOverrides?.data,
    morePages,
    page,
    iTwinId,
    searchText,
    sortDescending,
    sortType,
    maxCount,
  ]);

  return {
    iModels: sortedIModels,
    status,
    fetchMore: morePages ? fetchMore : undefined,
  };
};
