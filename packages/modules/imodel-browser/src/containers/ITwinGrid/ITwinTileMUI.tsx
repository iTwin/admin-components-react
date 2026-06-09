/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Chip from "@mui/material/Chip";
import svgItwin from "@stratakit/icons/itwin.svg";
import React from "react";

import {
  type BaseCardMoreActionItem,
  type BaseCardProps,
  BaseCard,
} from "../../components/baseCard/BaseCard";
import { SvgThumbnail } from "../../components/baseCard/SvgThumbnail";
import { FavoriteIconMUI } from "../../components/tileFavoriteIcon/FavoriteIconMUI";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { ITwinTileProps } from "./ITwinTile";

/** @alpha */
export interface ITwinTilePropsMUI
  extends Omit<ITwinTileProps, "onThumbnailClick" | "tileProps" | "fullWidth">,
    Omit<
      BaseCardProps,
      | "statusIcon"
      | "onSelect"
      | "onOpen"
      | "title"
      | "description"
      | "thumbnailBottomRight"
      | "thumbnailTopRight"
      | "thumbnailBottomLeft"
      | "moreActions"
    > {
  /** Defaults to iTwin.displayName */
  title?: string;
  /** If not provided, iTwin number will be used */
  description?: string;
  /** Items for the three-dot context menu */
  moreActions?: ContextMenuBuilderItemMUI<ITwinFull>[];
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
  moreActions: moreActionItems,
  stringsOverrides,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  refetchITwins,
  hideFavoriteIcon,
  loading,
  disabled,
  status,
  thumbnail,
  getBadge,
  title,
  description,
  actions,
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

  const moreActions: BaseCardMoreActionItem[] | undefined = React.useMemo(
    () =>
      moreActionItems
        ?.filter(({ visible }) =>
          typeof visible === "function" ? visible(iTwin) : visible ?? true
        )
        .map(({ key, children, icon, onClick, disabled }) => ({
          key,
          label: typeof children === "function" ? children(iTwin) : children,
          icon,
          onClick: onClick ? () => onClick(iTwin, refetchITwins) : undefined,
          disabled: typeof disabled === "function" ? disabled(iTwin) : disabled,
        })),
    [moreActionItems, iTwin, refetchITwins]
  );

  const favoriteIcon =
    !hideFavoriteIcon &&
    isFavorite !== undefined &&
    addToFavorites &&
    removeFromFavorites ? (
      <FavoriteIconMUI
        isFavorite={isFavorite}
        onAddToFavorites={() => addToFavorites(iTwin.id)}
        onRemoveFromFavorites={() => removeFromFavorites(iTwin.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        disabled={disabled}
      />
    ) : undefined;

  const additionalDescription = iTwin.lastModifiedDateTime
    ? new Date(iTwin.lastModifiedDateTime).toDateString()
    : undefined;

  return (
    <BaseCard
      className={className}
      sx={{
        "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
          opacity: 1,
        },
      }}
      disabled={disabled}
      loading={loading}
      thumbnail={thumbnail ?? <DefaultThumbnail />}
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomRight={
        getBadge?.(iTwin) ?? (
          <StatusBadge status={iTwin.status} strings={strings} />
        )
      }
      title={title ?? iTwin.displayName ?? ""}
      actions={actions}
      moreActions={moreActions}
      status={status}
      statusIconHref={svgItwin}
      description={description ?? iTwin.number ?? ""}
      subheader={additionalDescription}
      data-testid={`itwin-tile-${iTwin.id}`}
      stringsOverrides={stringsOverrides}
      {...rest}
    />
  );
};

export function DefaultThumbnail() {
  return <SvgThumbnail src={`${svgItwin}#icon-large`} />;
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
