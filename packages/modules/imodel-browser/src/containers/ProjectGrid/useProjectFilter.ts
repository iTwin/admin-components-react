/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { ProjectFilterOptions, ProjectFull } from "../../types";

export const useProjectFilter = (
  projects: ProjectFull[],
  options?: ProjectFilterOptions
) => {
  const filter = options?.toLocaleLowerCase() ?? "";
  return React.useMemo(
    () =>
      !filter
        ? projects
        : projects.filter(
            (project) =>
              (project.displayName?.toLocaleLowerCase() ?? "").includes(
                filter
              ) ||
              (project.projectNumber?.toLocaleLowerCase() ?? "").includes(
                filter
              )
          ),
    [filter, projects]
  );
};
