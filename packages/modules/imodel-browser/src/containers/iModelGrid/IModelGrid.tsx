/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";

import React from "react";

import { GridStructure } from "../../components/gridStructure/GridStructure";
import { NoResults } from "../../components/noResults/NoResults";
import {
  ApiOverrides,
  DataStatus,
  IModelFull,
  IModelSortOptions,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelGhostTile } from "../iModelTiles/IModelGhostTile";
import { IModelTile, IModelTileProps } from "../iModelTiles/IModelTile";
import { useIModelData } from "./useIModelData";

export interface IModelGridProps {
  /**
   * Access token that requires the `imodels:read` scope. */
  accessToken?: string | undefined;
  /** Project Id to list the iModels from (mutually exclusive to assetId) */
  projectId?: string | undefined;
  /** Asset Id to list the iModels from (mutually exclusive to projectId) */
  assetId?: string | undefined;
  /** Thumbnail click handler. */
  onThumbnailClick?(iModel: IModelFull): void;
  /** Object/function that configure IModel sorting behavior. */
  sortOptions?: IModelSortOptions;
  /** List of options to build for each imodel context menu. */
  iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
  /** Function (can be a react hook) that returns state for an iModel, returned values will be applied as props to the IModelTile, overrides IModelGrid provided values */
  useIndividualState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
  /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
  tileOverrides?: Partial<IModelTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Displayed after successful fetch, but no iModels are returned. */
    noIModels?: string;
    /** Displayed when the component is mounted and there is no project or asset Id. */
    noContext?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
  };
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
  sortOptions,
  onThumbnailClick,
  useIndividualState,
  tileOverrides,
  stringsOverrides,
  apiOverrides,
}: IModelGridProps) => {
  const strings = _mergeStrings(
    {
      noIModels: "There are no iModels in this project.",
      noContext: "No context provided",
      noAuthentication: "No access token provided",
      error: "An error occured",
    },
    stringsOverrides
  );
  const { iModels, status: fetchStatus } = useIModelData({
    projectId,
    assetId,
    accessToken,
    apiOverrides,
    sortOptions,
  });

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noIModels,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: strings.noContext,
  }[fetchStatus ?? DataStatus.Fetching];

  const tileApiOverrides = apiOverrides
    ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
    : undefined;
  return iModels.length === 0 && noResultsText ? (
    <NoResults text={noResultsText} />
  ) : (
    <GridStructure>
      {fetchStatus === DataStatus.Fetching ? (
        <>
          <IModelGhostTile />
          <IModelGhostTile />
          <IModelGhostTile />
        </>
      ) : (
        iModels?.map((iModel) => (
          <IModelHookedTile
            key={iModel.id}
            iModel={iModel}
            iModelOptions={iModelOptions}
            accessToken={accessToken}
            onThumbnailClick={onThumbnailClick}
            apiOverrides={tileApiOverrides}
            useTileState={useIndividualState}
            {...tileOverrides}
          />
        ))
      )}
    </GridStructure>
  );
};

type IModelHookedTileProps = IModelTileProps & {
  useTileState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
};
const noOp = () => ({} as Partial<IModelTileProps>);
const IModelHookedTile = (props: IModelHookedTileProps) => {
  const { useTileState = noOp, ...iModelTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iModel, iModelTileProps);
  return <IModelTile {...iModelTileProps} {...tileState} />;
};
