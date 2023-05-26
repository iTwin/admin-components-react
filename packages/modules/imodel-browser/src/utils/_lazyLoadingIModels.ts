/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelFull } from "../types";

/** Lazy loading function for iModels
 * @private
 */

export const generateData = (
  start: number,
  end: number,
  iModels: IModelFull[]
) => {
  return iModels.slice(start, end);
};
