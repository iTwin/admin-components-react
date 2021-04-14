/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  IModelFull,
  IModelSortOptions,
  IModelSortOptionsKeys,
} from "../../types";

/** Runtime check that we are not fed invalid sort type */
function isSupportedSortType(
  sortType: string | undefined
): sortType is IModelSortOptionsKeys {
  return (
    !!sortType &&
    [
      "displayName",
      "name",
      "description",
      "initialized",
      "createdDateTime",
    ].includes(sortType)
  );
}

const sortEitherEmptyValues = (a: any, b: any) => (!a && !b ? 0 : !a ? 1 : -1);
const sortBooleanOrEqualValues = (a: any, b: any) => (a === b ? 0 : a ? -1 : 1);
const sortDateTimeStringValues = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime();
const sortStringValues = (a: string, b: string) => a.localeCompare(b);

export const useIModelSort = (
  iModels: IModelFull[],
  options?: IModelSortOptions
) => {
  const sortType =
    typeof options !== "function" ? options?.sortType : undefined;
  const descending =
    typeof options !== "function" ? options?.descending ?? false : undefined;
  const sortFn = typeof options === "function" ? options : undefined;
  return React.useMemo(() => {
    if (sortFn) {
      return [...iModels].sort(sortFn);
    }
    if (!isSupportedSortType(sortType)) {
      return iModels;
    }
    const sorted = [...iModels].sort(
      (iModelA: IModelFull, iModelB: IModelFull) => {
        const a = iModelA[sortType];
        const b = iModelB[sortType];
        if (typeof a === "boolean" || typeof b === "boolean" || a === b) {
          return sortBooleanOrEqualValues(a, b);
        }
        if (!a || !b) {
          return sortEitherEmptyValues(a, b);
        }
        if (sortType === "createdDateTime") {
          return sortDateTimeStringValues(a, b);
        }
        return sortStringValues(a, b);
      }
    );
    return descending ? sorted.reverse() : sorted;
  }, [sortFn, sortType, iModels, descending]);
};
