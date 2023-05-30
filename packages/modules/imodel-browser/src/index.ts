/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { NoResults as NoResultsDefault } from "./components/noResults/NoResults";
import { IModelGrid as IModelGridDefault } from "./containers/iModelGrid/IModelGrid";
import { IModelThumbnail as IModelThumbnailDefault } from "./containers/iModelThumbnail/IModelThumbnail";
import { IModelGhostTile as IModelGhostTileDefault } from "./containers/iModelTiles/IModelGhostTile";
import { IModelTile as IModelTileDefault } from "./containers/iModelTiles/IModelTile";
import { ITwinGrid as ITwinGridDefault } from "./containers/ITwinGrid/ITwinGrid";
import { ITwinTile as ITwinTileDefault } from "./containers/ITwinGrid/ITwinTile";
import { withThemeProvider } from "./utils/WithThemeProvider";

export const IModelGrid = withThemeProvider(IModelGridDefault);
export type { IModelGridProps } from "./containers/iModelGrid/IModelGrid";

export const IModelTile = withThemeProvider(IModelTileDefault);
export type { IModelTileProps } from "./containers/iModelTiles/IModelTile";

export const IModelGhostTile = withThemeProvider(IModelGhostTileDefault);
export const IModelThumbnail = withThemeProvider(IModelThumbnailDefault);
export type { IModelThumbnailProps } from "./containers/iModelThumbnail/IModelThumbnail";

export const NoResults = withThemeProvider(NoResultsDefault);
export type { NoResultsProps } from "./components/noResults/NoResults";

export const ITwinGrid = withThemeProvider(ITwinGridDefault);
export type {
  IndividualITwinStateHook,
  ITwinGridProps,
} from "./containers/ITwinGrid/ITwinGrid";

export * from "./types";

export const ITwinTile = withThemeProvider(ITwinTileDefault);
export { TileProps } from "@itwin/itwinui-react";
