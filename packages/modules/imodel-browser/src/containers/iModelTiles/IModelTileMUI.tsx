/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgImodel from "@stratakit/icons/imodel.svg";
import React from "react";

import {
  type BaseCardMoreActionItem,
  type BaseCardProps,
  BaseCard,
} from "../../components/baseCard/BaseCard";
import { FavoriteIconMUI } from "../../components/tileFavoriteIcon/FavoriteIconMUI";
import { IModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { MoreActionsMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { IModelThumbnailMUI } from "../iModelThumbnail/IModelThumbnailMUI";
import { IModelTileProps } from "./IModelTile";

/** @alpha */
export interface IModelTileMUIProps
  extends Omit<
      IModelTileProps,
      "onThumbnailClick" | "iModelOptions" | "tileProps" | "fullWidth"
    >,
    Omit<
      BaseCardProps,
      | "statusIcon"
      | "onSelect"
      | "onOpen"
      | "title"
      | "description"
      | "thumbnailBottomRight"
      | "thumbnailTopRight"
      | "moreActions"
    > {
  /** If not provided, iModel display name will be used */
  title?: string;
  /** If not provided, iModel description will be used */
  description?: string;
  /** iModel to display */
  iModel: IModelFull;
  /** Items for the three-dot context menu */
  moreActions?: MoreActionsMenuBuilderItemMUI<IModelFull>[];
  /** Strings displayed by the component */
  stringsOverrides?: {
    /** Accessible text for the hollow star icon to add the iModel to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iModel from favorites */
    removeFromFavorites?: string;

    moreOptions?: string;
  };
  /** Access token for fetching the thumbnail */
  accessToken?: AccessTokenProvider;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides;
  /** Function to refetch iModels */
  refetchIModels?: () => void;
  /** Hides the favorite icon when true */
  hideFavoriteIcon?: boolean;
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;

  /** Badge for the given iModel - getBadge will take precedence over this prop */
  badge?: React.ReactNode;
}

/**
 * Representation of an IModel — V2 (Stratakit/MUI)
 * @alpha
 */
export const IModelTileMUI = ({
  iModel,
  moreActions: moreActionItems,
  accessToken,
  apiOverrides,
  stringsOverrides,
  refetchIModels,
  hideFavoriteIcon,
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
  subheader,
  actions,

  className,
  ...rest
}: IModelTileMUIProps) => {
  const favoritesContext = React.useContext(IModelFavoritesContext);
  const strings = _mergeStrings(
    {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      moreOptions: "More options",
    },
    stringsOverrides
  );

  const moreActions: BaseCardMoreActionItem[] | undefined = React.useMemo(
    () =>
      moreActionItems
        ?.filter(({ visible }) =>
          typeof visible === "function" ? visible(iModel) : visible ?? true
        )
        .map(({ key, label, icon, onClick, disabled }) => ({
          key,
          label: typeof label === "function" ? label(iModel) : label,
          icon,
          onClick: onClick ? () => onClick(iModel, refetchIModels) : undefined,
          disabled:
            typeof disabled === "function" ? disabled(iModel) : disabled,
        })),
    [moreActionItems, iModel, refetchIModels]
  );

  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? { ...(apiOverrides ?? {}), data: iModel.thumbnail }
      : undefined;

  const isFavorite = favoritesContext?.favorites.has(iModel.id) ?? false;
  const favoriteIcon =
    !hideFavoriteIcon && favoritesContext ? (
      <FavoriteIconMUI
        isFavorite={isFavorite}
        onAddToFavorites={() => favoritesContext.add(iModel.id)}
        onRemoveFromFavorites={() => favoritesContext.remove(iModel.id)}
        addLabel={strings.addToFavorites}
        removeLabel={strings.removeFromFavorites}
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
      className={className}
      sx={{
        "&:hover .favoriteIcon, &:focus-within .favoriteIcon": {
          opacity: 1,
        },
      }}
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
      actions={actions}
      moreActions={moreActions}
      status={status}
      statusIconHref={svgImodel}
      description={description ?? iModel.description ?? ""}
      subheader={subheader}
      stringsOverrides={stringsOverrides}
      data-testid={`imodel-tile-${iModel.id}`}
      {...rest}
    />
  );
};
