/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// MUI beta surface: keep public names aligned with legacy exports while reusing *MUI internals.
export {
  IModelGridMUI as IModelGrid,
  type IModelGridMUIProps as IModelGridProps,
} from "../containers/iModelGrid/IModelGridMUI";
export {
  IModelTileMUI as IModelTile,
  type IModelTileMUIProps as IModelTileProps,
} from "../containers/iModelTiles/IModelTileMUI";
export {
  IModelThumbnailMUI as IModelThumbnail,
  type IModelThumbnailMUIProps as IModelThumbnailProps,
} from "../containers/iModelThumbnail/IModelThumbnailMUI";

export {
  ITwinGridMUI as ITwinGrid,
  type ITwinGridMUIProps as ITwinGridProps,
  type IndividualITwinStateHookMUI as IndividualITwinStateHook,
  type ITwinGridStrings,
} from "../containers/ITwinGrid/ITwinGridMUI";
export {
  ITwinTileMUI as ITwinTile,
  type ITwinTileMUIProps as ITwinTileProps,
} from "../containers/ITwinGrid/ITwinTileMUI";

export {
  NoResultsMUI as NoResults,
  type NoResultsMUIProps as NoResultsProps,
} from "../components/noResults/NoResultsMUI";
export * from "../types";
