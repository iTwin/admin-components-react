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
  return React.useMemo(
    () =>
      !options
        ? projects
        : projects.filter(
            typeof options === "function"
              ? options
              : (project) =>
                  (project.displayName ?? "").includes(options) ||
                  (project.projectNumber ?? "").includes(options)
          ),
    [options, projects]
  );
};
