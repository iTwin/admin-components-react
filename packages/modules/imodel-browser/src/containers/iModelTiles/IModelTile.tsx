/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgStar, SvgStarHollow } from "@itwin/itwinui-icons-react";
import { IconButton, Tile } from "@itwin/itwinui-react";
import React from "react";

import { useIModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { ApiOverrides, IModelFull } from "../../types";
import { _getAPIServer, _mergeStrings } from "../../utils/_apiOverrides";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";
import { IModelThumbnail } from "../iModelThumbnail/IModelThumbnail";

type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;

export interface IModelTileProps {
  /** iModel to display */
  iModel: IModelFull;
  /** Access token to display */
  accessToken?: string | (() => Promise<string>) | undefined;
  /** List of options to build for the imodel context menu */
  iModelOptions?: ContextMenuBuilderItem<IModelFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(iModel: IModelFull): void;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Accessible text for the hollow star icon to add the iModel to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iModel from favorites */
    removeFromFavorites?: string;
  };
  /** Tile props that will be applied after normal use. (Will override IModelTile if used) */
  tileProps?: Partial<
    TileProps & { getBadge?: (iModel: IModelFull) => React.ReactNode }
  >;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides;
  /** Function to refetch iModels */
  refetchIModels?: () => void;
  /** Indicates whether the tile should take the full width of its container */
  fullWidth?: boolean;
}

/**
 * Representation of an IModel
 */
export const IModelTile = ({
  iModel,
  iModelOptions,
  accessToken,
  onThumbnailClick,
  apiOverrides,
  tileProps,
  stringsOverrides,
  refetchIModels,
  fullWidth,
}: IModelTileProps) => {
  const {
    name,
    status,
    isNew,
    isLoading,
    isSelected,
    thumbnail,
    badge,
    getBadge,
    leftIcon,
    rightIcon,
    buttons,
    moreOptions,
    isDisabled,
    onClick,
    metadata,
    ...rest
  } = tileProps ?? {};
  const favoritesContext = useIModelFavoritesContext();
  const strings = _mergeStrings(
    {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () =>
      _buildManagedContextMenuOptions(
        iModelOptions,
        iModel,
        undefined,
        refetchIModels
      ),
    [iModelOptions, iModel, refetchIModels]
  );
  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? {
          ...(apiOverrides ?? {}),
          data: iModel.thumbnail,
        }
      : undefined;

  const handleClickAndAddToRecents = React.useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      if (favoritesContext) {
        try {
          if (!accessToken) {
            return;
          }

          const url = `${_getAPIServer(
            apiOverrides?.serverEnvironmentPrefix
          )}/imodels/recents/${encodeURIComponent(iModel.id)}`;

          void fetch(url, {
            method: "POST",
            headers: {
              authorization:
                typeof accessToken === "function"
                  ? await accessToken()
                  : accessToken,
              Accept: "application/vnd.bentley.itwin-platform.v2+json",
            },
          });
        } catch (e) {
          // swallow errors to avoid disrupting the UI
          console.error("Failed to add iModel to recents", e);
        }
      }
      onClick?.(e) ?? onThumbnailClick?.(iModel);
    },
    [
      accessToken,
      apiOverrides?.serverEnvironmentPrefix,
      favoritesContext,
      iModel,
      onClick,
      onThumbnailClick,
    ]
  );

  return (
    <Tile.Wrapper
      key={iModel.id}
      isNew={isNew}
      isSelected={isSelected}
      isLoading={isLoading}
      status={status}
      isDisabled={isDisabled}
      style={fullWidth ? { width: "100%" } : undefined}
      {...rest}
    >
      <Tile.Name>
        <Tile.NameIcon />
        <Tile.NameLabel
          onClick={handleClickAndAddToRecents}
          aria-disabled={isDisabled}
          data-testid={`iModel-tile-${iModel.id}-name-label`}
        >
          {name ?? iModel.displayName}
        </Tile.NameLabel>
      </Tile.Name>
      <Tile.ThumbnailArea>
        {leftIcon && <Tile.TypeIndicator>{leftIcon}</Tile.TypeIndicator>}
        <Tile.QuickAction>
          {rightIcon}
          {favoritesContext && (
            <IconButton
              aria-label={
                favoritesContext.favorites.has(iModel.id)
                  ? strings.removeFromFavorites
                  : strings.addToFavorites
              }
              onClick={async () => {
                favoritesContext.favorites.has(iModel.id)
                  ? await favoritesContext.remove?.(iModel.id)
                  : await favoritesContext.add?.(iModel.id);
              }}
              style={{
                paddingInline: "var(--iui-button-padding-block)",
                backgroundColor:
                  "rgb(from var(--iui-color-background) r g b / 0.7)",
              }}
              styleType="borderless"
            >
              {favoritesContext.favorites.has(iModel.id) ? (
                <SvgStar />
              ) : (
                <SvgStarHollow />
              )}
            </IconButton>
          )}
        </Tile.QuickAction>
        {thumbnail ? (
          <Tile.ThumbnailPicture>{thumbnail}</Tile.ThumbnailPicture>
        ) : (
          <IModelThumbnail
            iModelId={iModel.id}
            accessToken={accessToken}
            apiOverrides={thumbnailApiOverride}
          />
        )}
        {(getBadge || badge) && (
          <Tile.BadgeContainer>
            {getBadge?.(iModel) ?? badge}
          </Tile.BadgeContainer>
        )}
      </Tile.ThumbnailArea>
      <Tile.ContentArea>
        <Tile.Action
          onClick={handleClickAndAddToRecents}
          aria-disabled={isDisabled}
          data-testid={`iModel-tile-${iModel.id}-action`}
        >
          <Tile.Description>{iModel?.description ?? ""}</Tile.Description>
        </Tile.Action>
        {(moreOptions || moreOptionsBuilt) && (
          <Tile.MoreOptions
            data-testid={`iModel-tile-${iModel.id}-more-options`}
          >
            {moreOptions ?? moreOptionsBuilt}
          </Tile.MoreOptions>
        )}
        {metadata && (
          <Tile.Metadata data-testid={`iModel-tile-${iModel.id}-metadata`}>
            {metadata}
          </Tile.Metadata>
        )}
      </Tile.ContentArea>
      {buttons && <Tile.Buttons>{buttons}</Tile.Buttons>}
    </Tile.Wrapper>
  );
};
