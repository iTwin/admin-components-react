/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Chip from "@mui/material/Chip";
import svgItwin from "@stratakit/icons/itwin.svg";
import React from "react";

import {
  type BaseCardProps,
  BaseCard,
} from "../../components/baseCard/BaseCard";
import { SvgThumbnail } from "../../components/baseCard/SvgThumbnail";
import { FavoriteIconMUI } from "../../components/tileFavoriteIcon/FavoriteIconMUI";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  type MoreActionsMenuItemMUI,
  type ResolvedMoreActionsMenuItem,
} from "../../utils/_buildMenuOptions";
import { formatDate } from "../../utils/formatDate";
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
      | "thumbnailTopRight"
      | "moreActions"
    > {
  /** Defaults to iTwin.displayName */
  title?: string;
  /** If not provided, iTwin number will be used */
  description?: string;
  /** Items for the three-dot context menu */
  moreActions?: MoreActionsMenuItemMUI<ITwinFull>[];

  /** Node to display in the bottom right corner of the thumbnail. If not provided, a default status badge will be used. */
  thumbnailBottomRight?: React.ReactNode;

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
  thumbnailBottomRight,
  thumbnailTopLeft,
  thumbnailBottomLeft,
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

  const moreActions: ResolvedMoreActionsMenuItem[] | undefined = React.useMemo(
    () =>
      moreActionItems
        ?.filter(({ visible }) =>
          typeof visible === "function" ? visible(iTwin) : visible ?? true
        )
        .map(({ key, label, icon, onClick, disabled }) => ({
          key,
          label: typeof label === "function" ? label(iTwin) : label,
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
    ? formatDate(iTwin.lastModifiedDateTime)
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
      thumbnailTopLeft={thumbnailTopLeft}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomRight={
        thumbnailBottomRight ?? (
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
