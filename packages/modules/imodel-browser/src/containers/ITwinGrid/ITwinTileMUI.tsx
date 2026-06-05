/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Chip from "@mui/material/Chip";
import React from "react";
import {
  BaseCard,
  type BaseCardProps,
} from "../../components/baseCard/BaseCard";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  buildContextMenuItemsMUI,
  ContextMenuBuilderItemMUI,
} from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";
import { SvgThumbnail } from "../../components/baseCard/SvgThumbnail";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgItwin from "@stratakit/icons/itwin.svg";

/** @alpha */
export interface ITwinTilePropsMUI
  extends Omit<ITwinTileProps, "onThumbnailClick" | "tileProps" | "fullWidth">,
    Omit<
      BaseCardProps,
      | "statusIcon"
      | "contextMenuItems"
      | "onSelect"
      | "onOpen"
      | "onDoubleClick"
      | "title"
      | "description"
      | "thumbnailBottomRight"
      | "thumbnailTopRight"
      | "thumbnailBottomLeft"
      | "contextMenuContent"
    > {
  /** Defaults to iTwin.displayName */
  title?: string;
  /** If not provided, iTwin number will be used */
  description?: string;
  /** List of options to build for the context menu */
  contextMenuItems?: ContextMenuBuilderItemMUI<ITwinFull>[];
  /** Function to call when the card is selected. */
  onSelect?(iTwin: ITwinFull): void;
  /** Function to call when the card is opened. */
  onOpen?(iTwin: ITwinFull): void;
  /** Status to display on the tile — will override iTwin.status if provided, otherwise iTwin.status will be used.  Should be a MUI {@link Chip} */
  getBadge?: (iTwin: ITwinFull) => React.ReactNode;
  stringsOverrides?: {
    trialBadge?: string;
    inactiveBadge?: string;
    addToFavorites?: string;
    removeFromFavorites?: string;
    moreOptions?: string;
  };
}

/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 * @alpha
 */
export const ITwinTileMUI = ({
  iTwin,
  contextMenuItems,
  stringsOverrides,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  refetchITwins,
  hideFavoriteIcon,
  selected,
  loading,
  disabled,
  status,
  thumbnail,
  getBadge,
  title,
  description,
  onSelect,
  onOpen,
  slotProps,
  className,
  ...rest
}: ITwinTilePropsMUI) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const contextMenuContent = React.useMemo(
    () =>
      buildContextMenuItemsMUI(
        contextMenuItems,
        iTwin,
        undefined,
        refetchITwins
      ),
    [contextMenuItems, iTwin, refetchITwins]
  );

  const favoriteIcon =
    !hideFavoriteIcon &&
    isFavorite !== undefined &&
    addToFavorites &&
    removeFromFavorites ? (
      <TileFavoriteIconMUI
        isFavorite={isFavorite}
        onAddToFavorites={() => addToFavorites(iTwin.id)}
        onRemoveFromFavorites={() => removeFromFavorites(iTwin.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className="ITwinTile-favoriteIcon"
        sx={{
          ...(!isFavorite && { display: "none" }),
        }}
        disabled={disabled}
      />
    ) : undefined;

  const additionalDescription = iTwin.lastModifiedDateTime
    ? new Date(iTwin.lastModifiedDateTime).toDateString()
    : undefined;

  return (
    <BaseCard
      aria-disabled={disabled ?? undefined}
      className={className}
      sx={{
        "&:hover .ITwinTile-favoriteIcon": {
          display: "flex",
        },
      }}
      disabled={disabled}
      loading={loading}
      selected={selected}
      thumbnail={thumbnail ?? <DefaultThumbnail />}
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomRight={
        getBadge?.(iTwin) ?? (
          <StatusBadge status={iTwin.status} strings={strings} />
        )
      }
      title={title ?? iTwin.displayName ?? ""}
      onClick={onSelect ? (event) => onSelect(iTwin) : undefined}
      onDoubleClick={onOpen ? (event) => onOpen(iTwin) : undefined}
      contextMenuContent={contextMenuContent}
      status={status}
      statusIconHref={selected ? svgCheckmark : svgItwin}
      description={description ?? iTwin.number ?? ""}
      additionalDescription={additionalDescription}
      slotProps={slotProps}
      data-testid={`itwin-tile-${iTwin.id}`}
      stringsOverrides={stringsOverrides}
      {...rest}
    />
  );
};

export function DefaultThumbnail() {
  return <SvgThumbnail src={svgItwin} />;
}

function StatusBadge({
  status,
  strings,
}: {
  status?: string;
  strings: {
    trialBadge: string;
    inactiveBadge: string;
  };
}) {
  if (!status || status.toLocaleLowerCase() === "active") {
    return null;
  }

  return (
    <Chip
      size="small"
      label={
        status.toLocaleLowerCase() === "inactive"
          ? strings.inactiveBadge
          : strings.trialBadge
      }
    />
  );
}
