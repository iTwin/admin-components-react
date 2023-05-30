/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteIModel as DeleteIModelDefault } from "./components/DeleteIModel";
import { withThemeProvider } from "./utils/WithThemeProvider";

export const DeleteIModel = withThemeProvider(DeleteIModelDefault);
export type { DeleteIModelProps } from "./components/DeleteIModel";
