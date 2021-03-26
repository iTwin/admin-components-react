/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import React from "react";

import { GridStructure } from "../../components/gridStructure/GridStructure";
import { ApiOverrides, IModelFull } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelTile } from "../iModelTile/IModelTile";
import { useIModelData } from "./useIModelData";

export interface IModelGridProps {
  /**
   * Access token that requires the `imodels:read` scope. */
  accessToken: string | undefined;
  /** Project Id to list the iModels from (mutually exclusive to assetId) */
  projectId: string | undefined;
  /** Asset Id to list the iModels from (mutually exclusive to projectId) */
  assetId: string | undefined;
  /** Thumbnail click handler. */
  onThumbnailClick?(iModel: IModelFull): void;
  /** List of options to build for each imodel context menu. */
  iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
  /** Object that configures different overrides for the API.
   * @property `data`: Array of iModels used in the grid.
   * @property `serverEnvironmentPrefix`: Either qa- or dev-.
   */
  apiOverrides?: ApiOverrides<IModelFull[]>;
}

/**
 * Component that will allow displaying a grid of iModels, given a contextId
 */
export const IModelGrid = ({
  accessToken,
  iModelOptions,
  projectId,
  assetId,
  onThumbnailClick,
  apiOverrides,
}: IModelGridProps) => {
  const { iModels } = useIModelData(
    projectId,
    assetId,
    accessToken,
    apiOverrides
  );
  const tileOverrides = apiOverrides
    ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
    : undefined;
  return !accessToken && !apiOverrides?.data ? (
    <div>Not authenticated</div>
  ) : (
    <GridStructure>
      {iModels?.map((iModel) => (
        <IModelTile
          key={iModel.id}
          iModel={iModel}
          iModelOptions={iModelOptions}
          accessToken={accessToken}
          onThumbnailClick={onThumbnailClick}
          apiOverrides={tileOverrides}
        />
      ))}
    </GridStructure>
  );
};
