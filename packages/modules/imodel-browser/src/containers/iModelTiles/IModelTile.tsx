/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Tile } from "@itwin/itwinui-react";
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
  } = tileProps ?? {};

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
    <Tile.Wrapper
      key={iModel?.id}
      isNew={isNew}
      isSelected={isSelected}
      isLoading={isLoading}
      status={status}
      isDisabled={isDisabled}
      {...rest}
    >
      <Tile.Name>
        <Tile.NameIcon />
        <Tile.NameLabel>
          <Tile.Action
            onClick={(e) => onClick?.(e) ?? onThumbnailClick?.(iModel)}
            aria-disabled={isDisabled}
          >
            {name ?? iModel?.displayName}
          </Tile.Action>
        </Tile.NameLabel>
      </Tile.Name>
      <Tile.ThumbnailArea>
        {leftIcon && <Tile.TypeIndicator>{leftIcon}</Tile.TypeIndicator>}
        {rightIcon && <Tile.QuickAction>{rightIcon}</Tile.QuickAction>}
        {thumbnail ? (
          <Tile.ThumbnailPicture>{thumbnail}</Tile.ThumbnailPicture>
        ) : (
          <IModelThumbnail
            iModelId={iModel?.id}
            accessToken={accessToken}
            apiOverrides={thumbnailApiOverride}
          />
        )}
        {badge && <Tile.BadgeContainer>{badge}</Tile.BadgeContainer>}
      </Tile.ThumbnailArea>
      <Tile.ContentArea>
        <Tile.Description>{iModel?.description ?? ""}</Tile.Description>
        {(moreOptions || moreOptionsBuilt) && (
          <Tile.MoreOptions>{moreOptions ?? moreOptionsBuilt}</Tile.MoreOptions>
        )}
      </Tile.ContentArea>
      {buttons && <Tile.Buttons>{buttons}</Tile.Buttons>}
    </Tile.Wrapper>
  );
};
