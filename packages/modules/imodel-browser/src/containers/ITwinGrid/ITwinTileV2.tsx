/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import { CardProps } from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgItwin from "@stratakit/icons/itwin.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";

import {
  BaseCard,
  BaseCardSlotProps,
} from "../../components/baseCard/BaseCard";
import { TileFavoriteIcon } from "../../components/tileFavoriteIcon/TileFavoriteIcon";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import styles from "./ITwinTile.module.scss";

function TitleStatusIcon({
  status,
  loading,
  selected,
}: {
  status?: "positive" | "warning" | "negative";
  loading?: boolean;
  selected?: boolean;
}) {
  if (loading) {
    return <CircularProgress size={16} sx={{ mr: 0.5, flexShrink: 0 }} />;
  }
  if (selected) {
    return (
      <Box component="span" sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0 }}>
        <Icon href={svgCheckmark} size="regular" />
      </Box>
    );
  }
  if (status === "positive") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "success.main" }}
      >
        <Icon href={svgStatusSuccess} size="regular" />
      </Box>
    );
  }
  if (status === "warning") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "warning.main" }}
      >
        <Icon href={svgStatusWarning} size="regular" />
      </Box>
    );
  }
  if (status === "negative") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "error.main" }}
      >
        <Icon href={svgStatusError} size="regular" />
      </Box>
    );
  }
  return null;
}

function buildMenuItems<T>(
  options: ContextMenuBuilderItem<T>[] | undefined,
  value: T,
  refetchData?: () => void
): React.ReactNode[] | undefined {
  return options
    ?.filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : visible ?? true
    )
    .map(({ key, onClick, disabled, children }) => (
      <MenuItem
        key={key}
        disabled={typeof disabled === "function" ? disabled(value) : disabled}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(value, refetchData);
        }}
      >
        {children}
      </MenuItem>
    ));
}

export interface ITwinTileV2Props
  extends Omit<CardProps, "children" | "title"> {
  /** iTwin to display */
  iTwin: ITwinFull;
  /** List of options to build for the iTwin context menu */
  iTwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function to call on card click — receives the iTwin object */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** Strings displayed by the component */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
    /** Accessible text for the hollow star icon to add the iTwin to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iTwin from favorites */
    removeFromFavorites?: string;
  };
  /** Indicates whether the iTwin is marked as a favorite */
  isFavorite?: boolean;
  /** Function to add the iTwin to favorites */
  addToFavorites?(iTwinId: string): Promise<void>;
  /** Function to remove the iTwin from favorites */
  removeFromFavorites?(iTwinId: string): Promise<void>;
  /** Function to refetch iTwins */
  refetchITwins?: () => void;
  /** Hides the favorite icon when true */
  hideFavoriteIcon?: boolean;
  // ── State ───────────────────────────────────────────────────────────────────
  /** Marks the card as selected */
  selected?: boolean;
  /** Shows a loading indicator in the card header */
  loading?: boolean;
  /** Applies disabled styling and aria-disabled */
  disabled?: boolean;
  /** Status indicator shown in the card header */
  status?: "positive" | "warning" | "negative";
  // ── Thumbnail area ──────────────────────────────────────────────────────────
  /** Custom thumbnail content — replaces the default iTwin icon */
  thumbnail?: React.ReactNode;
  /** Icon shown in the top-left of the thumbnail */
  leftIcon?: React.ReactNode;
  /** Icon shown in the top-right of the thumbnail (alongside the favorite icon) */
  rightIcon?: React.ReactNode;
  /** Content shown in the bottom-left of the thumbnail */
  thumbnailBottomLeft?: React.ReactNode;
  /** Badge shown at the bottom of the thumbnail (overrides auto status badge) */
  badge?: React.ReactNode;
  // ── Content ─────────────────────────────────────────────────────────────────
  /** Override the displayed title (defaults to iTwin.displayName) */
  title?: string;
  /** Override the description (defaults to iTwin.number) */
  description?: string;
  /** Additional fineprint rendered below the description */
  fineprint?: React.ReactNode;
  /** Pre-built menu items rendered in the more-options menu */
  moreOptions?: React.ReactNode;
  /** Action buttons rendered in the card footer */
  buttons?: React.ReactNode;
  /** Additional content rendered below fineprint in the info section */
  children?: React.ReactNode;
  // ── Sub-component customization ─────────────────────────────────────────────
  slotProps?: BaseCardSlotProps;
}

/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 */
export const ITwinTileV2 = ({
  iTwin,
  iTwinOptions,
  onThumbnailClick,
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
  leftIcon,
  rightIcon,
  thumbnailBottomLeft,
  badge,
  title,
  description,
  fineprint,
  moreOptions,
  buttons,
  children,
  slotProps,
  className,
  onContextMenu: onCardContextMenu,
  ...rest
}: ITwinTileV2Props) => {
  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () => buildMenuItems(iTwinOptions, iTwin, refetchITwins),
    [iTwinOptions, iTwin, refetchITwins]
  );

  const hasMoreOptions = !!(moreOptions ?? moreOptionsBuilt?.length);

  const statusBadge =
    badge ??
    (iTwin.status && iTwin.status.toLocaleLowerCase() !== "active" ? (
      <Chip
        size="small"
        label={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? strings.inactiveBadge
            : strings.trialBadge
        }
        color={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? "default"
            : "primary"
        }
      />
    ) : null);

  const favoriteIcon =
    !hideFavoriteIcon &&
    isFavorite !== undefined &&
    addToFavorites &&
    removeFromFavorites ? (
      <TileFavoriteIcon
        isFavorite={isFavorite}
        onAddToFavorites={() => addToFavorites(iTwin.id)}
        onRemoveFromFavorites={() => removeFromFavorites(iTwin.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className={classNames(styles.iTwinTileFavoriteIcon, {
          [styles.hidden]: !isFavorite,
        })}
      />
    ) : undefined;

  const thumbnailTopRight =
    rightIcon || favoriteIcon ? (
      <>
        {rightIcon}
        {favoriteIcon}
      </>
    ) : undefined;

  const fineprintNode =
    fineprint || children ? (
      <>
        {fineprint && (
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            data-testid={`iTwin-tile-${iTwin.id}-fineprint`}
            sx={{ mt: 0.75 }}
          >
            {fineprint}
          </Typography>
        )}
        {children}
      </>
    ) : undefined;

  return (
    <BaseCard
      aria-disabled={disabled ?? undefined}
      className={classNames(styles.iTwinTile, className)}
      disabled={disabled}
      loading={loading}
      selected={selected}
      thumbnail={
        thumbnail ?? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="span"
              sx={{ lineHeight: 0, color: "text.secondary" }}
            >
              <Icon href={svgItwin} size="large" />
            </Box>
          </Box>
        )
      }
      thumbnailTopLeft={leftIcon}
      thumbnailTopRight={thumbnailTopRight}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailBottomRight={statusBadge}
      title={title ?? iTwin.displayName ?? ""}
      onTitleClick={
        onThumbnailClick ? () => onThumbnailClick(iTwin) : undefined
      }
      onContextMenu={onCardContextMenu}
      contextMenuContent={
        hasMoreOptions ? moreOptions ?? moreOptionsBuilt : undefined
      }
      statusIcon={
        <TitleStatusIcon
          status={status}
          loading={loading}
          selected={selected}
        />
      }
      description={description ?? iTwin.number ?? ""}
      fineprint={fineprintNode}
      actions={buttons}
      slotProps={slotProps}
      {...rest}
    />
  );
};
