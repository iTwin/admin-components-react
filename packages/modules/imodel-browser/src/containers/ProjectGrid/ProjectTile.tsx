/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ProjectTile.scss";

import { Badge, Tile, TileProps } from "@bentley/itwinui-react";
import React from "react";

import ProjectIcon from "../../images/project.svg";
import { ProjectFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";

export interface ProjectTileProps {
  /** Project to display */
  project: ProjectFull;
  /** List of options to build for the project context menu */
  projectOptions?: ContextMenuBuilderItem<ProjectFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(project: ProjectFull): void;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial projects */
    trialBadge?: string;
    /** Badge text for inactive projects */
    inactiveBadge?: string;
  };
  /** Tile props that will be applied after normal use. (Will override ProjectTile if used) */
  tileProps?: Partial<TileProps>;
}

/**
 * Representation of a Project
 */
export const ProjectTile = ({
  project,
  projectOptions,
  onThumbnailClick,
  tileProps,
  stringsOverrides,
}: ProjectTileProps) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
    },
    stringsOverrides
  );

  const moreOptions = React.useMemo(
    () => _buildManagedContextMenuOptions(projectOptions, project),
    [projectOptions, project]
  );
  return (
    <Tile
      key={project?.id}
      name={<span title={project?.displayName}>{project?.displayName}</span>}
      description={
        <span title={project?.projectNumber}>
          {project?.projectNumber ?? ""}
        </span>
      }
      badge={
        project?.status &&
        project.status !== "Active" && (
          <Badge
            backgroundColor={
              project.status === "Inactive"
                ? "#A47854" /** $iui-color-dataviz-oak */
                : "#4585A5" /** $iui-color-dataviz-steelblue */
            }
          >
            {project.status === "Inactive"
              ? strings.inactiveBadge
              : strings.trialBadge}
          </Badge>
        )
      }
      moreOptions={moreOptions}
      thumbnail={
        <span
          className={"iui-picture iac-project-thumbnail"}
          onClick={() => onThumbnailClick?.(project)}
        >
          <ProjectIcon className={"iac-project-thumbnail"} />
        </span>
      }
      {...(tileProps ?? {})}
    />
  );
};
