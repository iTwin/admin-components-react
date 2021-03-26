/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Tile } from "@bentley/itwinui-react";
import React from "react";

import { ApiOverrides, IModelFull } from "../../types";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";
import { IModelThumbnail } from "../iModelThumbnail/IModelThumbnail";

export interface IModelTileProps {
  /** iModel to display */
  iModel: IModelFull;
  /** Access token to display */
  accessToken?: string;
  /** List of options to build for the imodel context menu */
  iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(iModel: IModelFull): void;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides;
}

/**
 * Representation of an IModel
 */
export const IModelTile = ({
  iModel,
  iModelOptions,
  accessToken,
  onThumbnailClick,
  apiOverrides,
}: IModelTileProps) => {
  const moreOptions = React.useMemo(
    () => _buildManagedContextMenuOptions(iModelOptions, iModel),
    [iModelOptions, iModel]
  );
  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? {
          ...(apiOverrides ?? {}),
          data: iModel.thumbnail,
        }
      : undefined;
  return (
    <Tile
      key={iModel.id}
      name={iModel.displayName}
      description={iModel.description || ""}
      moreOptions={moreOptions}
      thumbnail={
        <IModelThumbnail
          iModelId={iModel.id}
          accessToken={accessToken}
          onClick={() => onThumbnailClick?.(iModel)}
          apiOverrides={thumbnailApiOverride}
        />
      }
      // {...(generatedProps ?? {})}
    />
  );
};
