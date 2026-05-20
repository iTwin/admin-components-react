/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import classNames from "classnames";
import React from "react";
import {
  BaseCard,
  type BaseCardProps,
} from "../../components/baseCard/BaseCard";
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
import { IModelTileProps } from "./IModelTile";

export interface IModelTileMUIProps
  extends Omit<
      IModelTileProps,
      "onThumbnailClick" | "iModelOptions" | "tileProps" | "fullWidth"
    >,
    Omit<
      BaseCardProps,
      | "statusIcon"
      | "contextMenuItems"
      | "onSelect"
      | "onOpen"
      | "title"
      | "description"
      | "thumbnailBottomRight"
      | "thumbnailTopRight"
      | "onDoubleClick"
      | "contextMenuContent"
    > {
  /** If not provided, iModel display name will be used */
  title?: string;
  /** If not provided, iModel description will be used */
  description?: string;
  /** iModel to display */
  iModel: IModelFull;
  /** List of options to build for the context menu */
  contextMenuItems?: ContextMenuBuilderItemMUI<IModelFull>[];
  /** Function to call when the card is selected. */
  onSelect?(iModel: IModelFull): void;
  /** Function to call when the card is opened. */
  onOpen?(iModel: IModelFull): void;
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
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;

  /** Badge for the given iModel - getBadge will take precedence over this prop */
  badge?: React.ReactNode;
}

/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 */
export const IModelTileMUI = ({
  iModel,
  contextMenuItems,
  accessToken,
  apiOverrides,
  stringsOverrides,
  refetchIModels,
  hideFavoriteIcon,
  selected,
  loading,
  disabled,
  status,
  thumbnail,
  thumbnailTopLeft,
  thumbnailBottomLeft,
  getBadge,
  badge,
  title,
  description,
  additionalDescription,
  actions,
  onSelect,
  onOpen,
  slotProps,
  className,
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

  const contextMenuContent = React.useMemo(
    () =>
      buildContextMenuItemsMUI(
        contextMenuItems,
        iModel,
        undefined,
        refetchIModels
      ),
    [contextMenuItems, iModel, refetchIModels]
  );

  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? { ...(apiOverrides ?? {}), data: iModel.thumbnail }
      : undefined;

  const favoriteIcon =
    !hideFavoriteIcon && favoritesContext ? (
      <TileFavoriteIconMUI
        isFavorite={favoritesContext.favorites.has(iModel.id)}
        onAddToFavorites={() => favoritesContext.add(iModel.id)}
        onRemoveFromFavorites={() => favoritesContext.remove(iModel.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
        className={styles.iModelTileFavoriteIcon}
        disabled={disabled}
      />
    ) : undefined;

  if (badge && getBadge) {
    console.warn(
      "Both badge and getBadge props were provided to IModelTileMUI. The getBadge function will take precedence over the badge prop."
    );
  }

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
      thumbnailTopRight={favoriteIcon}
      thumbnailBottomLeft={thumbnailBottomLeft}
      thumbnailBottomRight={getBadge?.(iModel) ?? badge}
      title={title ?? iModel.displayName ?? ""}
      onSelect={onSelect ? () => onSelect(iModel) : undefined}
      onOpen={onOpen ? () => onOpen(iModel) : undefined}
      contextMenuContent={contextMenuContent}
      status={status}
      statusIcon={<StatusIcon status={status} selected={selected} />}
      description={description ?? iModel.description ?? ""}
      additionalDescription={additionalDescription}
      actions={actions}
      slotProps={slotProps}
      selected={selected}
      {...rest}
    />
  );
};
