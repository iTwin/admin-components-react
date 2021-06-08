/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ApiOverrides } from "../types";

/** Build APIM server url out of overrides
 * @private
 */
export const _getAPIServer = (
  apiOverrides: ApiOverrides<unknown> | undefined
) =>
  `https://${
    apiOverrides?.serverEnvironmentPrefix
      ? `${apiOverrides.serverEnvironmentPrefix}-`
      : ""
  }api.bentley.com`;

/**
 * Merge 2 objects without overriding keys with undefined or null values.
 * @param defaults Complete string object
 * @param overrides Potentially incomplete string object
 * @returns
 */
export const _mergeStrings: <T extends { [key: string]: string }>(
  defaults: T,
  overrides: Partial<T> | undefined
) => T = (defaults, overrides) =>
  !overrides
    ? { ...defaults }
    : Object.keys(overrides).reduce(
        (red, val: keyof typeof overrides) => {
          if ((overrides[val] ?? red[val]) !== red[val]) {
            red[val] = overrides[val] as typeof red[typeof val];
          }
          return red;
        },
        { ...defaults }
      );
