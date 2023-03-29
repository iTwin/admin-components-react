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
  ProjectFilterOptions,
  ProjectFull,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelGhostTile } from "../iModelTiles/IModelGhostTile";
import { ProjectTile, ProjectTileProps } from "./ProjectTile";
import { useProjectData } from "./useProjectData";

export type IndividualProjectStateHook = (
  project: ProjectFull,
  projectTileProps: ProjectTileProps & {
    gridProps: ProjectGridProps;
  }
) => Partial<ProjectTileProps>;

export interface ProjectGridProps {
  /**
   * Access token that requires the `projects:read` scope. */
  accessToken?: string | undefined;
  /** Type of project to request */
  requestType?: "favorites" | "recents" | "";
  /** Thumbnail click handler. */
  onThumbnailClick?(project: ProjectFull): void;
  /** String/function that configure Project filtering behavior.
   * A string will filter on displayed text only ().
   * A function allow filtering on anything, is used in a normal array.filter.
   */
  filterOptions?: ProjectFilterOptions;
  /** List of actions to build for each project context menu. */
  projectActions?: ContextMenuBuilderItem<ProjectFull>[];
  /** Function (can be a react hook) that returns state for a project, returned values will be applied as props to the ProjectTile, overrides ProjectGrid provided values */
  useIndividualState?: IndividualProjectStateHook;
  /** Static props to apply over each tile, mainly used for tileProps, overrides ProjectGrid provided values */
  tileOverrides?: Partial<ProjectTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial projects */
    trialBadge?: string;
    /** Badge text for inactive projects */
    inactiveBadge?: string;
    /** Displayed after successful fetch, but no projects are returned. */
    noProjects?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
  };
  /** Object that configures different overrides for the API.
   * @property `data`: Array of Projects used in the grid.
   * @property `serverEnvironmentPrefix`: Either qa or dev.
   */
  apiOverrides?: ApiOverrides<ProjectFull[]>;
  /**
   * Allow final transformation of the project array before display
   * This function MUST be memoized.
   */
  postProcessCallback?: (
    projects: ProjectFull[],
    fetchStatus: DataStatus | undefined
  ) => ProjectFull[];
}

/**
 * Component that will allow displaying a grid of projects, given a requestType
 */
export const ProjectGrid = ({
  accessToken,
  apiOverrides,
  filterOptions,
  onThumbnailClick,
  projectActions,
  requestType,
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
}: ProjectGridProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      noProjects: "No project found.",
      noAuthentication: "No access token provided",
      error: "An error occurred",
    },
    stringsOverrides
  );
  const {
    projects: fetchedProjects,
    status: fetchStatus,
    fetchMore,
  } = useProjectData({
    requestType,
    accessToken,
    apiOverrides,
    filterOptions,
  });

  const projects = React.useMemo(
    () =>
      postProcessCallback?.([...fetchedProjects], fetchStatus) ??
      fetchedProjects,
    [postProcessCallback, fetchedProjects, fetchStatus]
  );

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noProjects,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: "",
  }[fetchStatus ?? DataStatus.Fetching];

  return projects.length === 0 && noResultsText ? (
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
          {projects?.map((project) => (
            <ProjectHookedTile
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
              key={project.id}
              project={project}
              projectOptions={projectActions}
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

type ProjectHookedTileProps = ProjectTileProps & {
  gridProps: ProjectGridProps;
  useTileState?: IndividualProjectStateHook;
};
const noOp = () => ({} as Partial<ProjectTileProps>);
const ProjectHookedTile = (props: ProjectHookedTileProps) => {
  const { useTileState = noOp, ...projectTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.project, projectTileProps);
  return <ProjectTile {...projectTileProps} {...tileState} />;
};
