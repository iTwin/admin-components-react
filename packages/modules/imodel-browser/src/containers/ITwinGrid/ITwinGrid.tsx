/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { InView } from "react-intersection-observer";

import { GridStructure } from "../../components/gridStructure/GridStructure";
import { NoResults } from "../../components/noResults/NoResults";
import {
  ApiOverrides,
  DataStatus,
  ITwinFilterOptions,
  ITwinFull,
  ITwinSubClass,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelGhostTile } from "../iModelTiles/IModelGhostTile";
import { ITwinTile, ITwinTileProps } from "./ITwinTile";
import { useITwinData } from "./useITwinData";

export type IndividualITwinStateHook = (
  iTwin: ITwinFull,
  iTwinTileProps: ITwinTileProps & {
    gridProps: ITwinGridProps;
  }
) => Partial<ITwinTileProps>;

export interface ITwinGridProps {
  /** Access token that requires the `itwins:read` scope. */
  accessToken?: string | undefined;
  /** Type of iTwin to request */
  requestType?: "favorites" | "recents" | "";
  /** Sub class of iTwin, defaults to Project */
  iTwinSubClass?: ITwinSubClass;
  /** Thumbnail click handler. */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** String/function that configure iTwin filtering behavior.
   * A string will filter on displayed text only ().
   * A function allow filtering on anything, is used in a normal array.filter.
   */
  filterOptions?: ITwinFilterOptions;
  /** List of actions to build for each iTwin context menu. */
  iTwinActions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
  useIndividualState?: IndividualITwinStateHook;
  /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
  tileOverrides?: Partial<ITwinTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
    /** Displayed after successful fetch, but no iTwins are returned. */
    noITwins?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
  };
  /** Object that configures different overrides for the API.
   * @property `data`: Array of iTwins used in the grid.
   * @property `serverEnvironmentPrefix`: Either qa or dev.
   */
  apiOverrides?: ApiOverrides<ITwinFull[]>;
  /**
   * Allow final transformation of the iTwin array before display
   * This function MUST be memoized.
   */
  postProcessCallback?: (
    iTwins: ITwinFull[],
    fetchStatus: DataStatus | undefined
  ) => ITwinFull[];
}

/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 */
export const ITwinGrid = ({
  accessToken,
  apiOverrides,
  filterOptions,
  onThumbnailClick,
  iTwinActions,
  requestType,
  iTwinSubClass,
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
}: ITwinGridProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      noITwins: "No iTwin found.",
      noAuthentication: "No access token provided",
      error: "An error occurred",
    },
    stringsOverrides
  );
  const {
    iTwins: fetchedItwins,
    status: fetchStatus,
    fetchMore,
  } = useITwinData({
    requestType,
    iTwinSubClass,
    accessToken,
    apiOverrides,
    filterOptions,
  });

  const iTwins = React.useMemo(
    () =>
      postProcessCallback?.([...fetchedItwins], fetchStatus) ?? fetchedItwins,
    [postProcessCallback, fetchedItwins, fetchStatus]
  );

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noITwins,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: "",
  }[fetchStatus ?? DataStatus.Fetching];

  return iTwins.length === 0 && noResultsText ? (
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
        <>
          {iTwins?.map((iTwin) => (
            <ITwinHookedTile
              gridProps={{
                accessToken,
                apiOverrides,
                filterOptions,
                onThumbnailClick,
                requestType,
                stringsOverrides,
                tileOverrides,
                useIndividualState,
              }}
              key={iTwin.id}
              iTwin={iTwin}
              iTwinOptions={iTwinActions}
              onThumbnailClick={onThumbnailClick}
              useTileState={useIndividualState}
              {...tileOverrides}
            />
          ))}
          {fetchMore ? (
            <>
              <InView onChange={fetchMore}>
                <IModelGhostTile />
              </InView>
              <IModelGhostTile />
              <IModelGhostTile />
            </>
          ) : null}
        </>
      )}
    </GridStructure>
  );
};

type ITwinHookedTileProps = ITwinTileProps & {
  gridProps: ITwinGridProps;
  useTileState?: IndividualITwinStateHook;
};
const noOp = () => ({} as Partial<ITwinTileProps>);
const ITwinHookedTile = (props: ITwinHookedTileProps) => {
  const { useTileState = noOp, ...iTwinTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iTwin, iTwinTileProps);
  return <ITwinTile {...iTwinTileProps} {...tileState} />;
};
