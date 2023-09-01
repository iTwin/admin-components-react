/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { useEffect, useMemo } from "react";

import {
  ApiOverrides,
  DataStatus,
  IModelFull,
  IModelSortOptions,
} from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";
import { useIModelSort } from "./useIModelSort";

export interface IModelDataHookOptions {
  iTwinId?: string | undefined;
  accessToken?: string | undefined;
  sortOptions?: IModelSortOptions;
  apiOverrides?: ApiOverrides<IModelFull[]>;
  searchText?: string | undefined;
  maxCount?: number;
}
const PAGE_SIZE = 100;

export const useIModelData = ({
  iTwinId,
  accessToken,
  sortOptions,
  apiOverrides,
  searchText,
  maxCount,
}: IModelDataHookOptions) => {
  const sortType = sortOptions?.sortType === "name" ? "name" : undefined; //Only available sort by API at the moment.
  const sortDescending = sortOptions?.descending;
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const sortedIModels = useIModelSort(iModels, sortOptions);
  const [status, setStatus] = React.useState<DataStatus>();
  const [page, setPage] = React.useState(0);
  const [morePages, setMorePages] = React.useState(true);
  const fetchMore = React.useCallback(() => {
    setPage(page + 1);
  }, [page]);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const abortController = useMemo(() => new AbortController(), [searchText]);
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
    const paging = `&$skip=${page * (maxCount ?? PAGE_SIZE)}&$top=${
      maxCount ?? PAGE_SIZE
    }`;
    const searching = searchText?.trim() ? `&name=${searchText}` : "";

    const url = `${_getAPIServer(
      apiOverrides
    )}/imodels/${selection}${sorting}${paging}${searching}`;
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        Authorization: accessToken,
        Prefer: "return=representation",
        Accept: "application/vnd.bentley.itwin-platform.v2+json",
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
        if (
          result.iModels.length !== PAGE_SIZE ||
          result.iModels.length === maxCount
        ) {
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
  }, [
    abortController,
    accessToken,
    apiOverrides,
    apiOverrides?.data,
    morePages,
    page,
    iTwinId,
    searchText,
    sortDescending,
    sortType,
    maxCount,
  ]);

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [abortController]);
  return {
    iModels: sortedIModels,
    status,
    fetchMore: morePages ? fetchMore : undefined,
  };
};
