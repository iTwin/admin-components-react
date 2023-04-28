/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { ITwinFilterOptions, ITwinFull } from "../../types";

export const useITwinFilter = (
  itwins: ITwinFull[],
  options?: ITwinFilterOptions
) => {
  const filter = options?.toLocaleLowerCase() ?? "";
  return React.useMemo(
    () =>
      !filter
        ? itwins
        : itwins.filter(
            (itwin) =>
              (itwin.displayName?.toLocaleLowerCase() ?? "").includes(filter) ||
              (itwin.number?.toLocaleLowerCase() ?? "").includes(filter)
          ),
    [filter, itwins]
  );
};
