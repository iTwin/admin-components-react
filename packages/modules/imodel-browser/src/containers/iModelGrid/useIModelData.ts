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
  viewMode?: ViewType; // @deprecated No longer used. Should be removed in 3.0.
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
  const [needsUpdate, setNeedsUpdate] = React.useState(true);
  const [iModels, setIModels] = React.useState<IModelFull[]>([]);
  const [status, setStatus] = React.useState<DataStatus>();
  const [page, setPage] = React.useState(0);
  const [morePagesAvailable, setMorePagesAvailable] = React.useState(true);
  const [abortController, setAbortController] = React.useState<
    AbortController | undefined
  >(undefined);
  const updateAbortController = React.useCallback(
    (val?: AbortController) => {
      if (abortController) {
        abortController.abort();
      }
      return val;
    },
    [abortController]
  );

  const sortType =
    sortOptions && ["name", "createdDateTime"].includes(sortOptions.sortType)
      ? sortOptions.sortType
      : undefined; //Only available sort-by API at the moment.
  const [previousSortOptions, setPreviousSortOptions] = React.useState<
    IModelSortOptions | undefined
  >(sortOptions && { ...sortOptions });
  const sortDescending = sortOptions?.descending;
  const sortedIModels = useIModelSort(iModels, sortOptions);
  const sortChanged =
    sortOptions?.descending !== previousSortOptions?.descending ||
    sortOptions?.sortType !== previousSortOptions?.sortType;
  if (sortChanged) {
    setPreviousSortOptions(sortOptions);
  }

  const fetchMore = React.useCallback(() => {
    if (status === DataStatus.Fetching || !morePagesAvailable) {
      return;
    }
    setPage((prev) => prev + 1);
    setNeedsUpdate(true);
  }, [status, morePagesAvailable]);

  React.useEffect(() => {
    // start from scratch when any external state changes
    setStatus(DataStatus.Fetching);
    setIModels([]);
    setPage(0);
    setMorePagesAvailable(true);
    setNeedsUpdate(true);
  }, [
    iTwinId,
    accessToken,
    sortOptions?.descending,
    sortOptions?.sortType,
    apiOverrides?.data,
    apiOverrides?.serverEnvironmentPrefix,
    searchText,
    maxCount,
  ]);

  // Main function
  React.useEffect(() => {
    if (!needsUpdate) {
      return;
    }

    setNeedsUpdate(false);
    setAbortController(updateAbortController);

    // if data is provided, use it and skip fetching
    if (apiOverrides?.data) {
      setIModels(apiOverrides?.data);
      setStatus(DataStatus.Complete);
      setMorePagesAvailable(false);
      return;
    }

    if (!accessToken || !iTwinId) {
      setStatus(
        !accessToken ? DataStatus.TokenRequired : DataStatus.ContextRequired
      );
      setIModels([]);
      return;
    }

    // If sort changes but we already have all the data, let client side sorting do its job
    if (sortChanged && !morePagesAvailable) {
      setStatus(DataStatus.Complete);
      return;
    }

    // Otherwise, fetch from server
    setStatus(DataStatus.Fetching);

    const { abortController, fetchIModels } = createFetchIModelsFn(
      iTwinId,
      accessToken,
      sortType,
      sortDescending ?? false,
      page,
      searchText,
      maxCount,
      apiOverrides?.serverEnvironmentPrefix
    );
    setAbortController(updateAbortController(abortController));

    fetchIModels()
      .then(({ iModels, morePagesAvailable }) => {
        setMorePagesAvailable(morePagesAvailable);
        setIModels((prev) =>
          page === 0 ? [...iModels] : [...prev, ...iModels]
        );
        setStatus(DataStatus.Complete);
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
      updateAbortController();
    };
  }, [
    abortController,
    accessToken,
    apiOverrides?.data,
    apiOverrides?.serverEnvironmentPrefix,
    iModels,
    iTwinId,
    maxCount,
    morePagesAvailable,
    needsUpdate,
    page,
    searchText,
    sortChanged,
    sortDescending,
    sortType,
    updateAbortController,
  ]);

  return {
    iModels: sortedIModels,
    status,
    fetchMore: morePagesAvailable ? fetchMore : undefined,
  };
};

const createFetchIModelsFn = (
  iTwinId: string,
  accessToken: string | (() => Promise<string>),
  sortType: string | undefined,
  sortDescending: boolean,
  page: number,
  searchText: string | undefined,
  maxCount: number | undefined,
  serverEnvironmentPrefix?: "" | "dev" | "qa"
): {
  abortController: AbortController;
  fetchIModels: () => Promise<{
    iModels: IModelFull[];
    morePagesAvailable: boolean;
  }>;
} => {
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
  console.log(
    `serverEnvironmentPrefix: ${serverEnvironmentPrefix}\n _getAPIServer(serverEnvironmentPrefix): ${_getAPIServer(
      serverEnvironmentPrefix
    )}`
  );
  const url = `${_getAPIServer(
    serverEnvironmentPrefix
  )}/imodels/${selection}${sorting}${paging}${searching}`;

  const makeFetchRequest = async () => {
    const options: RequestInit = {
      signal: abortController.signal,
      headers: {
        Authorization:
          typeof accessToken === "function" ? await accessToken() : accessToken,
        Prefer: "return=representation",
        Accept: "application/vnd.bentley.itwin-platform.v2+json",
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result: { iModels: IModelFull[] } = await response.json();
    console.log(result);
    return {
      iModels: result.iModels,
      morePagesAvailable:
        result.iModels.length >= PAGE_SIZE ||
        result.iModels.length === maxCount,
    };
  };

  return {
    abortController,
    fetchIModels: makeFetchRequest,
  };
};
