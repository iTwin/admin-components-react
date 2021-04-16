/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  ProjectFull,
  ProjectSortOptions,
  ProjectSortOptionsKeys,
} from "../../types";

/** Runtime check that we are not fed invalid sort type */
function isSupportedSortType(
  sortType: string | undefined
): sortType is ProjectSortOptionsKeys {
  return (
    !!sortType &&
    [
      "displayName",
      "projectNumber",
      "registrationDateTime",
      "industry",
      "projectType",
      "geographicLocation",
      "dataCenterLocation",
      "billingCountry",
      "status",
      "allowExternalTeamMembers",
    ].includes(sortType)
  );
}

const sortEitherEmptyValues = (a: any, b: any) => (!a && !b ? 0 : !a ? 1 : -1);
const sortBooleanOrEqualValues = (a: any, b: any) => (a === b ? 0 : a ? -1 : 1);
const sortDateTimeStringValues = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime();
const sortStringValues = (a: string, b: string) => a.localeCompare(b);

export const useProjectSort = (
  projects: ProjectFull[],
  options?: ProjectSortOptions
) => {
  const sortType =
    typeof options !== "function" ? options?.sortType : undefined;
  const descending =
    typeof options !== "function" ? options?.descending ?? false : undefined;
  const sortFn = typeof options === "function" ? options : undefined;
  return React.useMemo(() => {
    if (sortFn) {
      return [...projects].sort(sortFn);
    }
    if (!isSupportedSortType(sortType)) {
      return projects;
    }
    const sorted = [...projects].sort(
      (projectA: ProjectFull, projectB: ProjectFull) => {
        const a = projectA[sortType];
        const b = projectB[sortType];
        if (typeof a === "boolean" || typeof b === "boolean" || a === b) {
          return sortBooleanOrEqualValues(a, b);
        }
        if (!a || !b) {
          return sortEitherEmptyValues(a, b);
        }
        if (sortType === "registrationDateTime") {
          return sortDateTimeStringValues(a, b);
        }
        return sortStringValues(a, b);
      }
    );
    return descending ? sorted.reverse() : sorted;
  }, [sortFn, sortType, projects, descending]);
};
