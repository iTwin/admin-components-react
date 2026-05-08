/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
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
import { IModelThumbnailMUI } from "../iModelThumbnail/IModelThumbnailMUI";
import styles from "./IModelTile.module.scss";
import { StatusIcon } from "./StatusIcon";

export interface IModelTileMUIProps
  extends Omit<
    BaseCardProps,
    | "headerRight"
    | "statusIcon"
    | "contextMenuItems"
    | "onDoubleClick"
    | "title"
    | "description"
  > {
  /** If not provided, iModel display name will be used */
  title?: string;
  /** If not provided, iModel description will be used */
  description?: string;
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
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;
}

/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 */
export const IModelTileMUI = ({
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
  thumbnailTopLeft,
  thumbnailTopRight,
  thumbnailBottomLeft,
  thumbnailBottomRight,
  getBadge,
  title,
  description,
  actions,
  contextMenuContent,
  onTitleClick,
  slotProps,
  className,
  onContextMenu: onCardContextMenu,
  ...rest
}: IModelTileMUIProps) => {
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

  const hasMoreOptions = !!(contextMenuContent ?? moreOptionsBuilt?.length);

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

  const thumbnailTopRightContent =
    thumbnailTopRight || favoriteIcon ? (
      <>
        {thumbnailTopRight}
        {favoriteIcon}
      </>
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
          <IModelThumbnailMUI
            iModelId={iModel.id}
            accessToken={accessToken}
            apiOverrides={thumbnailApiOverride}
          />
        )
      }
      thumbnailTopLeft={thumbnailTopLeft}
      thumbnailTopRight={thumbnailTopRightContent}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailBottomRight={getBadge?.(iModel) ?? thumbnailBottomRight}
      title={title ?? iModel.displayName ?? ""}
      onTitleClick={
        onTitleClick ??
        (onThumbnailClick ? () => onThumbnailClick(iModel) : undefined)
      }
      onContextMenu={onCardContextMenu}
      contextMenuContent={
        hasMoreOptions ? contextMenuContent ?? moreOptionsBuilt : undefined
      }
      statusIcon={<StatusIcon status={status} selected={selected} />}
      description={description ?? iModel.description ?? ""}
      fineprint={fineprint}
      actions={actions}
      slotProps={slotProps}
      selected={selected}
      {...rest}
    />
  );
};
