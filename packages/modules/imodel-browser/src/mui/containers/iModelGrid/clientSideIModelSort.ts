/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { IModelFull, IModelSortOptions, ViewType } from "../../../types";

export interface ClientSideIModelSortOptions {
  viewMode: ViewType | undefined;
  requestType: "favorites" | "recents" | "" | undefined;
  sort: IModelSortOptions;
}

/**
 * Client-side sort applied to the MUI iModel grid for tile view when the
 * request type is "recents" or "favorites" — the server does not honor sort
 * options for those request types, so we sort on the client.
 */
export const clientSideIModelSort = (
  iModels: IModelFull[],
  { viewMode, requestType, sort }: ClientSideIModelSortOptions
): IModelFull[] => {
  if (viewMode === "cells") {
    return iModels;
  }
  if (requestType !== "recents" && requestType !== "favorites") {
    return iModels;
  }

  const sortValue = (iModel: IModelFull) => {
    const currValue =
      sort.sortType === "name"
        ? iModel.displayName ?? iModel.name ?? ""
        : iModel[sort.sortType] ?? "";
    return currValue.toLocaleLowerCase();
  };

  return [...iModels].sort((a, b) => {
    const aValue = sortValue(a);
    const bValue = sortValue(b);
    return sort.descending
      ? bValue.localeCompare(aValue)
      : aValue.localeCompare(bValue);
  });
};
