/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { IModelFilterOptions, IModelFull } from "../../types";

export const useIModelFilter = (
  iModels: IModelFull[],
  options?: IModelFilterOptions
) => {
  return React.useMemo(
    () =>
      !options
        ? iModels
        : iModels.filter(
            typeof options === "function"
              ? options
              : (iModel) =>
                  (iModel.displayName ?? "").includes(options) ||
                  (iModel.description ?? "").includes(options)
          ),
    [options, iModels]
  );
};
