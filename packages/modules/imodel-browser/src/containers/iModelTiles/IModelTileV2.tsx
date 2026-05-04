/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import { CardProps } from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgMore from "@stratakit/icons/more-vertical.svg";
import svgImodel from "@stratakit/icons/imodel.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";

import {
  BaseCard,
  BaseCardSlotProps,
} from "../../components/baseCard/BaseCard";
import { TileFavoriteIcon } from "../../components/tileFavoriteIcon/TileFavoriteIcon";
import { IModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelThumbnailV2 } from "../iModelThumbnail/IModelThumbnailV2";
import styles from "./IModelTile.module.scss";

function TitleStatusIcon({
  status,
  isLoading,
  isSelected,
}: {
  status?: "positive" | "warning" | "negative";
  isLoading?: boolean;
  isSelected?: boolean;
}) {
  if (isLoading) {
    return <CircularProgress size={16} sx={{ mr: 0.5, flexShrink: 0 }} />;
  }

  const color =
    status === "positive"
      ? "success.main"
      : status === "warning"
      ? "warning.main"
      : status === "negative"
      ? "error.main"
      : undefined;

  const icon = isSelected ? svgCheckmark : svgImodel;

  return (
    <Box
      component="span"
      sx={{ mt: 0.25, mr: 0.5, flexShrink: 0, lineHeight: 0, color }}
    >
      <Icon href={icon} size="regular" />
    </Box>
  );
}

function buildMenuItems<T>(
  options: ContextMenuBuilderItem<T>[] | undefined,
  value: T,
  closeMenu: () => void,
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
          closeMenu();
          onClick?.(value, refetchData);
        }}
      >
        {children}
      </MenuItem>
    ));
}

export interface IModelTileV2Props
  extends Omit<CardProps, "children" | "title"> {
  /** iModel to display */
  iModel: IModelFull;
  /** List of options to build for the imodel context menu */
  iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
  /** Function to call on card click — receives the iModel object */
  onThumbnailClick?(iModel: IModelFull): void;
  /** Strings displayed by the component */
  stringsOverrides?: {
    /** Accessible text for the hollow star icon to add the iModel to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iModel from favorites */
    removeFromFavorites?: string;
  };
  /** Access token for fetching the thumbnail */
  accessToken?: AccessTokenProvider;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides;
  /** Function to refetch iModels */
  refetchIModels?: () => void;
  /** Indicates whether the tile should take the full width of its container */
  fullWidth?: boolean;
  /** Hides the favorite icon when true */
  hideFavoriteIcon?: boolean;
  /** Indicates whether the iModel is marked as a favorite (standalone mode). */
  isFavorite?: boolean;
  /** Function to add the iModel to favorites (standalone mode). */
  addToFavorites?(iModelId: string): Promise<void>;
  /** Function to remove the iModel from favorites (standalone mode). */
  removeFromFavorites?(iModelId: string): Promise<void>;
  // ── State ───────────────────────────────────────────────────────────────────
  /** Marks the card as selected */
  isSelected?: boolean;
  /** Shows a loading indicator in the card header */
  isLoading?: boolean;
  /** Applies disabled styling and aria-disabled */
  isDisabled?: boolean;
  /** Status indicator shown in the card header */
  status?: "positive" | "warning" | "negative" | undefined;
  // ── Thumbnail area ──────────────────────────────────────────────────────────
  /** Custom thumbnail content — replaces the auto-fetched thumbnail */
  thumbnail?: React.ReactNode;
  /** Icon shown in the top-left of the thumbnail */
  leftIcon?: React.ReactNode;
  /** Badge shown at the bottom of the thumbnail */
  badge?: React.ReactNode;
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;
  // ── Content ─────────────────────────────────────────────────────────────────
  /** Override the displayed title (defaults to iModel.displayName) */
  title?: string;
  /** Additional metadata rendered below the description */
  metadata?: React.ReactNode;
  /** Pre-built menu items rendered in the more-options menu */
  moreOptions?: React.ReactNode;
  /** Action buttons rendered in the card footer */
  buttons?: React.ReactNode;
  // ── Sub-component customization ─────────────────────────────────────────────
  slotProps?: BaseCardSlotProps;
}

/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 */
export const IModelTileV2 = ({
  iModel,
  iModelOptions,
  accessToken,
  onThumbnailClick,
  apiOverrides,
  stringsOverrides,
  refetchIModels,
  fullWidth,
  hideFavoriteIcon,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  isSelected,
  isLoading,
  isDisabled,
  status,
  thumbnail,
  leftIcon,
  badge,
  getBadge,
  title,
  metadata,
  moreOptions,
  buttons,
  slotProps,
  className,
  ...rest
}: IModelTileV2Props) => {
  const [moreOptionsAnchor, setMoreOptionsAnchor] =
    React.useState<HTMLElement | null>(null);

  const favoritesContext = React.useContext(IModelFavoritesContext);
  const strings = _mergeStrings(
    {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () =>
      buildMenuItems(
        iModelOptions,
        iModel,
        () => setMoreOptionsAnchor(null),
        refetchIModels
      ),
    [iModelOptions, iModel, refetchIModels]
  );

  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? { ...(apiOverrides ?? {}), data: iModel.thumbnail }
      : undefined;

  const hasMoreOptions = !!(moreOptions ?? moreOptionsBuilt?.length);

  const favoriteState =
    isFavorite !== undefined
      ? {
          isFavorite,
          add: addToFavorites ? () => addToFavorites(iModel.id) : undefined,
          remove: removeFromFavorites
            ? () => removeFromFavorites(iModel.id)
            : undefined,
        }
      : favoritesContext
      ? {
          isFavorite: favoritesContext.favorites.has(iModel.id),
          add: () => favoritesContext.add(iModel.id),
          remove: () => favoritesContext.remove(iModel.id),
        }
      : undefined;

  const favoriteIcon =
    !hideFavoriteIcon && favoriteState?.add && favoriteState?.remove ? (
      <TileFavoriteIcon
        isFavorite={favoriteState.isFavorite}
        onAddToFavorites={favoriteState.add}
        onRemoveFromFavorites={favoriteState.remove}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className={styles.iModelTileFavoriteIcon}
      />
    ) : undefined;

  const thumbnailTopRight = favoriteIcon;

  const headerRight = hasMoreOptions ? (
    <>
      <IconButton
        size="small"
        aria-label="More options"
        data-testid={`iModel-tile-${iModel.id}-more-options`}
        onClick={(e) => setMoreOptionsAnchor(e.currentTarget)}
        sx={{ flexShrink: 0 }}
      >
        <Icon href={svgMore} size="regular" />
      </IconButton>
      <Menu
        anchorEl={moreOptionsAnchor}
        open={Boolean(moreOptionsAnchor)}
        onClose={() => setMoreOptionsAnchor(null)}
      >
        {moreOptions ?? moreOptionsBuilt}
      </Menu>
    </>
  ) : undefined;

  const cardInfo = metadata ? (
    <Typography
      variant="caption"
      color="text.secondary"
      component="div"
      data-testid={`iModel-tile-${iModel.id}-metadata`}
      sx={{ mt: 0.75 }}
    >
      {metadata}
    </Typography>
  ) : undefined;

  return (
    <BaseCard
      aria-disabled={isDisabled ?? undefined}
      className={classNames(
        styles.iModelTile,
        { [styles.fullWidth]: fullWidth },
        className
      )}
      thumbnail={
        thumbnail ?? (
          <IModelThumbnailV2
            iModelId={iModel.id}
            accessToken={accessToken}
            apiOverrides={thumbnailApiOverride}
          />
        )
      }
      thumbnailTopLeft={leftIcon}
      thumbnailTopRight={thumbnailTopRight}
      thumbnailBottomRight={getBadge?.(iModel) ?? badge}
      title={title ?? iModel.displayName ?? ""}
      onTitleClick={
        onThumbnailClick ? () => onThumbnailClick(iModel) : undefined
      }
      headerRight={headerRight}
      statusIcon={
        <TitleStatusIcon
          status={status}
          isLoading={isLoading}
          isSelected={isSelected}
        />
      }
      description={iModel.description ?? ""}
      cardInfo={cardInfo}
      actions={buttons}
      slotProps={slotProps}
      {...rest}
    ></BaseCard>
  );
};
