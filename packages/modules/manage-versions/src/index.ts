/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ManageVersions as ManageVersionsDefault } from "./components/ManageVersions/ManageVersions";
import { withThemeProvider } from "./utils/WithThemeProvider";

export const ManageVersions = withThemeProvider(ManageVersionsDefault);

export { ManageVersionsTabs } from "./components/ManageVersions/ManageVersions";
export type { ManageVersionsProps } from "./components/ManageVersions/ManageVersions";

export type {
  ApiOverrides,
  LogFunc,
  ManageVersionsStringOverrides,
} from "./components/ManageVersions/types";

export type { NamedVersion } from "./models";
