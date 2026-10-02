/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { ITwinFull, ViewType } from "../../../types";
import type { ITwinSortOptionsMUI } from "../../types";

export interface ClientSideITwinSortOptions {
  viewMode: ViewType | undefined;
  requestType: "favorites" | "recents" | "" | undefined;
  sort: ITwinSortOptionsMUI | undefined;
}

/**
 * Client-side sort applied to the MUI iTwin grid for tile view when the
 * request type is "recents" or "favorites" — the server ignores `$orderby`
 * for those request types, so we sort on the client.
 */
export const clientSideITwinSort = (
  iTwins: ITwinFull[],
  { viewMode, requestType, sort }: ClientSideITwinSortOptions
): ITwinFull[] => {
  if (viewMode === "cells") {
    return iTwins;
  }
  if (requestType !== "recents" && requestType !== "favorites") {
    return iTwins;
  }
  if (!sort) {
    return iTwins;
  }

  const sortValue = (iTwin: ITwinFull) =>
    (iTwin[sort.field] ?? "").toLocaleLowerCase();

  return [...iTwins].sort((a, b) => {
    const aValue = sortValue(a);
    const bValue = sortValue(b);
    return sort.direction === "desc"
      ? bValue.localeCompare(aValue)
      : aValue.localeCompare(bValue);
  });
};
