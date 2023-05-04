/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { ITwinFilterOptions, ITwinFull } from "../../types";

export const useITwinFilter = (
  iTwins: ITwinFull[],
  options?: ITwinFilterOptions
) => {
  const filter = options?.toLocaleLowerCase() ?? "";
  return React.useMemo(
    () =>
      !filter
        ? iTwins
        : iTwins.filter(
            (iTwin) =>
              (iTwin.displayName?.toLocaleLowerCase() ?? "").includes(filter) ||
              (iTwin.number?.toLocaleLowerCase() ?? "").includes(filter)
          ),
    [filter, iTwins]
  );
};
