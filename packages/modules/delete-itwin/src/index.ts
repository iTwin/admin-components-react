/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteITwin as DeleteITwinDefault } from "./components/DeleteITwin";
import { withThemeProvider } from "./utils/WithThemeProvider";

export const DeleteITwin = withThemeProvider(DeleteITwinDefault);
export type { DeleteITwinProps } from "./components/DeleteITwin";
