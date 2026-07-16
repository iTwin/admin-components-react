/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Logger } from "../types";

/** Default logger for all components. */
export const defaultLogger: Logger = {
  logError: (message, error) => console.error(message, error),
  logWarning: (message) => console.warn(message),
  logInfo: (message) => console.log(message),
  logTrace: (message) => console.log(message),
};
