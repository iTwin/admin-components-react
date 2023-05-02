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
  itwin: ITwinFull,
  itwinTileProps: ITwinTileProps & {
    gridProps: ITwinGridProps;
  }
) => Partial<ITwinTileProps>;

export interface ITwinGridProps {
  /** Access token that requires the `itwins:read` scope. */
  accessToken?: string | undefined;
  /** Type of iTwin to request */
  requestType?: "favorites" | "recents" | "";
  /** Sub class of iTwin, defaults to Project */
  itwinSubClass?: ITwinSubClass;
  /** Thumbnail click handler. */
  onThumbnailClick?(itwin: ITwinFull): void;
  /** String/function that configure iTwin filtering behavior.
   * A string will filter on displayed text only ().
   * A function allow filtering on anything, is used in a normal array.filter.
   */
  filterOptions?: ITwinFilterOptions;
  /** List of actions to build for each iTwin context menu. */
  itwinActions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
  useIndividualState?: IndividualITwinStateHook;
  /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
  tileOverrides?: Partial<ITwinTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial itwins */
    trialBadge?: string;
    /** Badge text for inactive itwins */
    inactiveBadge?: string;
    /** Displayed after successful fetch, but no itwins are returned. */
    noItwins?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
  };
  /** Object that configures different overrides for the API.
   * @property `data`: Array of Itwins used in the grid.
   * @property `serverEnvironmentPrefix`: Either qa or dev.
   */
  apiOverrides?: ApiOverrides<ITwinFull[]>;
  /**
   * Allow final transformation of the itwin array before display
   * This function MUST be memoized.
   */
  postProcessCallback?: (
    itwins: ITwinFull[],
    fetchStatus: DataStatus | undefined
  ) => ITwinFull[];
}

/**
 * Component that will allow displaying a grid of itwins, given a requestType
 */
export const ITwinGrid = ({
  accessToken,
  apiOverrides,
  filterOptions,
  onThumbnailClick,
  itwinActions,
  requestType,
  itwinSubClass,
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
}: ITwinGridProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      noITwins: "No itwin found.",
      noAuthentication: "No access token provided",
      error: "An error occurred",
    },
    stringsOverrides
  );
  const {
    itwins: fetchedItwins,
    status: fetchStatus,
    fetchMore,
  } = useITwinData({
    requestType,
    itwinSubClass,
    accessToken,
    apiOverrides,
    filterOptions,
  });

  const itwins = React.useMemo(
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

  return itwins.length === 0 && noResultsText ? (
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
          {itwins?.map((itwin) => (
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
              key={itwin.id}
              itwin={itwin}
              itwinOptions={itwinActions}
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
  const { useTileState = noOp, ...itwinTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.itwin, itwinTileProps);
  return <ITwinTile {...itwinTileProps} {...tileState} />;
};
