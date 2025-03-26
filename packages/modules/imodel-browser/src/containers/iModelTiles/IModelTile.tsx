/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ThemeProvider, Tile } from "@itwin/itwinui-react";
import React from "react";

import { ApiOverrides, IModelFull } from "../../types";
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
  /** Tile props that will be applied after normal use. (Will override IModelTile if used) */
  tileProps?: Partial<TileProps>;
  /** Object that configures different overrides for the API */
  apiOverrides?: ApiOverrides;
  /** Function to refetch iModels */
  refetchIModels?: () => void;
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
  refetchIModels,
}: IModelTileProps) => {
  const {
    name,
    status,
    isNew,
    isLoading,
    isSelected,
    thumbnail,
    badge,
    leftIcon,
    rightIcon,
    buttons,
    moreOptions,
    isDisabled,
    onClick,
    ...rest
  } = tileProps as TileProps;

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
    apiOverrides || iModel?.thumbnail
      ? {
          ...(apiOverrides ?? {}),
          data: iModel?.thumbnail,
        }
      : undefined;

  return (
    <ThemeProvider theme="inherit">
      <Tile.Wrapper
        key={iModel?.id}
        isNew={isNew}
        isSelected={isSelected}
        isLoading={isLoading}
        status={status}
        isDisabled={isDisabled}
        {...rest}
      >
        <Tile.Action
          onClick={(e) => onClick?.(e) ?? onThumbnailClick?.(iModel)}
          aria-label={`Select iModel ${iModel.id}`}
          aria-disabled={isDisabled}
        >
          <Tile.ThumbnailArea>
            {thumbnail ? (
              <Tile.ThumbnailPicture>{thumbnail}</Tile.ThumbnailPicture>
            ) : (
              <IModelThumbnail
                iModelId={iModel.id}
                accessToken={accessToken}
                apiOverrides={thumbnailApiOverride}
              />
            )}
            {badge && <Tile.BadgeContainer>{badge}</Tile.BadgeContainer>}
            {leftIcon && <Tile.TypeIndicator>{leftIcon}</Tile.TypeIndicator>}
            {rightIcon && <Tile.QuickAction>{rightIcon}</Tile.QuickAction>}
          </Tile.ThumbnailArea>
        </Tile.Action>
        <Tile.Name>
          <Tile.NameLabel>{name ?? iModel?.displayName}</Tile.NameLabel>
        </Tile.Name>
        {(moreOptions || moreOptionsBuilt) && (
          <Tile.MoreOptions>{moreOptions ?? moreOptionsBuilt}</Tile.MoreOptions>
        )}
        {buttons && <Tile.Buttons>{buttons}</Tile.Buttons>}
      </Tile.Wrapper>
    </ThemeProvider>
  );
};
