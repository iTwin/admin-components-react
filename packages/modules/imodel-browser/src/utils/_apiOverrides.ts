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
) => `https://${apiOverrides?.serverEnvironmentPrefix ?? ""}api.bentley.com`;
