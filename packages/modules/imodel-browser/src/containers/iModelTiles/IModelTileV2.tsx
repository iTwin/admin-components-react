/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import CircularProgress from "@mui/material/CircularProgress";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgImodel from "@stratakit/icons/imodel.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";
import { BaseCard, BaseCardProps } from "../../components/baseCard/BaseCard";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";
import { IModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  buildContextMenuItemsMUI,
  ContextMenuBuilderItemMUI,
} from "../../utils/_buildMenuOptions";
import { IModelThumbnailV2 } from "../iModelThumbnail/IModelThumbnailV2";
import styles from "./IModelTile.module.scss";

export interface IModelTileV2Props
  extends Omit<
    BaseCardProps,
    | "headerRight"
    | "statusIcon"
    | "actions"
    | "contextMenuContent"
    | "contextMenuItems"
    | "onTitleClick"
    | "onDoubleClick"
    | "thumbnailTopLeft"
    | "thumbnailBottomRight"
  > {
  /** iModel to display */
  iModel: IModelFull;
  /** List of options to build for the context menu */
  contextMenuItems?: ContextMenuBuilderItemMUI<IModelFull>[];
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
  /** Hides the favorite icon when true */
  hideFavoriteIcon?: boolean;
  /** Indicates whether the iModel is marked as a favorite (standalone mode). */
  isFavorite?: boolean;
  /** Function to add the iModel to favorites (standalone mode). */
  addToFavorites?(iModelId: string): Promise<void>;
  /** Function to remove the iModel from favorites (standalone mode). */
  removeFromFavorites?(iModelId: string): Promise<void>;
  /** Icon shown in the top-left of the thumbnail */
  leftIcon?: React.ReactNode;
  /** Badge shown at the bottom of the thumbnail */
  badge?: React.ReactNode;
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;
  /** Pre-built menu items rendered in the more-options menu */
  moreOptions?: React.ReactNode;
  /** Action buttons rendered in the card footer */
  buttons?: React.ReactNode;
}

/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 */
export const IModelTileV2 = ({
  iModel,
  contextMenuItems,
  accessToken,
  onThumbnailClick,
  apiOverrides,
  stringsOverrides,
  refetchIModels,
  hideFavoriteIcon,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  selected,
  loading,
  disabled,
  status,
  thumbnail,
  leftIcon,
  badge,
  thumbnailBottomLeft,
  getBadge,
  title,
  moreOptions,
  buttons,
  slotProps,
  className,
  onContextMenu: onCardContextMenu,
  ...rest
}: IModelTileV2Props) => {
  const favoritesContext = React.useContext(IModelFavoritesContext);
  const strings = _mergeStrings(
    {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () => buildContextMenuItemsMUI(contextMenuItems, iModel, refetchIModels),
    [contextMenuItems, iModel, refetchIModels]
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
      <TileFavoriteIconMUI
        isFavorite={favoriteState.isFavorite}
        onAddToFavorites={favoriteState.add}
        onRemoveFromFavorites={favoriteState.remove}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className={styles.iModelTileFavoriteIcon}
        disabled={disabled}
      />
    ) : undefined;

  const fineprint = iModel.lastChangesetPushDateTime
    ? new Date(iModel.lastChangesetPushDateTime).toDateString()
    : undefined;

  return (
    <BaseCard
      aria-disabled={disabled ?? undefined}
      className={classNames(styles.iModelTile, className)}
      disabled={disabled}
      loading={loading}
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
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailBottomRight={getBadge?.(iModel) ?? badge}
      title={title ?? iModel.displayName ?? ""}
      onTitleClick={
        onThumbnailClick ? () => onThumbnailClick(iModel) : undefined
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
      description={iModel.description ?? ""}
      fineprint={fineprint}
      actions={buttons}
      slotProps={slotProps}
      selected={selected}
      {...rest}
    />
  );
};

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

  const color =
    status === "positive"
      ? "success.main"
      : status === "warning"
      ? "warning.main"
      : status === "negative"
      ? "error.main"
      : undefined;

  const icon = selected ? svgCheckmark : svgImodel;

  return <Icon href={icon} size="regular" color={color} />;
}
