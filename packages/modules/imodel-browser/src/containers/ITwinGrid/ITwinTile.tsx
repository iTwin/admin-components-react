/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgStar, SvgStarHollow } from "@itwin/itwinui-icons-react";
import { Badge, IconButton, ThemeProvider, Tile } from "@itwin/itwinui-react";
import React from "react";

import ITwinIcon from "../../images/itwin.svg";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";

export type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;

export interface ITwinTileProps {
  /** iTwin to display */
  iTwin: ITwinFull;
  /** List of options to build for the iTwin context menu */
  iTwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function to call on thumbnail click */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
    /** Accessible text for the hollow star icon to add the iTwin to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iTwin from favorites */
    removeFromFavorites?: string;
    /** Accessible text for the thumbnail icon to navigate to the iTwin */
    navigateToITwin?: string;
  };
  /** Tile props that will be applied after normal use. (Will override ITwinTile if used) */
  tileProps?: Partial<TileProps>;
  /**  Indicates whether the iTwin is marked as a favorite */
  isFavorite?: boolean;
  /**  Function to add the iTwin to favorites  */
  addToFavorites?(iTwinId: string): Promise<void>;
  /**  Function to remove the iTwin from favorites  */
  removeFromFavorites?(iTwinId: string): Promise<void>;
  /** Function to refetch iTwins */
  refetchITwins?: () => void;
}

/**
 * Representation of an iTwin
 */
export const ITwinTile = ({
  iTwin,
  iTwinOptions,
  onThumbnailClick,
  tileProps,
  stringsOverrides,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  refetchITwins,
}: ITwinTileProps) => {
  const {
    name,
    description,
    status,
    isNew,
    isLoading,
    isSelected,
    thumbnail,
    badge,
    leftIcon,
    rightIcon,
    buttons,
    metadata,
    moreOptions,
    children,
    isDisabled,
    onClick,
    ...rest
  } = tileProps ?? {};

  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      navigateToITwin: "Navigate to iTwin",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () =>
      _buildManagedContextMenuOptions(
        iTwinOptions,
        iTwin,
        undefined,
        refetchITwins
      ),
    [iTwinOptions, iTwin, refetchITwins]
  );
  return (
    <ThemeProvider theme="inherit">
      <Tile.Wrapper
        key={iTwin?.id}
        isNew={isNew}
        isSelected={isSelected}
        isLoading={isLoading}
        status={status}
        isDisabled={isDisabled}
        {...rest}
      >
        <Tile.Action
          onClick={(e) => onClick?.(e) ?? onThumbnailClick?.(iTwin)}
          aria-label={
            onThumbnailClick ? `${strings.navigateToITwin} ${iTwin?.id}` : ""
          }
          aria-disabled={isDisabled}
        >
          <Tile.ThumbnailArea>
            <Tile.BadgeContainer>
              {badge ??
                (iTwin?.status &&
                  iTwin.status.toLocaleLowerCase() !== "active" && (
                    <Badge
                      backgroundColor={
                        iTwin.status.toLocaleLowerCase() === "inactive"
                          ? "oak"
                          : "steelblue"
                      }
                    >
                      {iTwin.status.toLocaleLowerCase() === "inactive"
                        ? strings.inactiveBadge
                        : strings.trialBadge}
                    </Badge>
                  ))}
            </Tile.BadgeContainer>
            <Tile.ThumbnailPicture
              style={{ cursor: onThumbnailClick ? "pointer" : "auto" }}
            >
              {thumbnail ?? <ITwinIcon />}
            </Tile.ThumbnailPicture>
            {leftIcon && <Tile.TypeIndicator>{leftIcon}</Tile.TypeIndicator>}
            {rightIcon && <Tile.QuickAction>{rightIcon}</Tile.QuickAction>}
          </Tile.ThumbnailArea>
        </Tile.Action>
        <Tile.Name>
          {(status || isNew || isLoading || isSelected) && <Tile.NameIcon />}
          <Tile.NameLabel>{name ?? iTwin?.displayName}</Tile.NameLabel>
        </Tile.Name>
        <Tile.ContentArea>
          <Tile.Description>
            {description ?? iTwin?.number ?? ""}
          </Tile.Description>
          {metadata && <Tile.Metadata>{metadata}</Tile.Metadata>}
          {children}
        </Tile.ContentArea>
        {(moreOptions || moreOptionsBuilt) && (
          <Tile.MoreOptions>{moreOptions ?? moreOptionsBuilt}</Tile.MoreOptions>
        )}
        <Tile.Buttons>
          {buttons ?? (
            <IconButton
              aria-label={
                isFavorite
                  ? strings.removeFromFavorites
                  : strings.addToFavorites
              }
              onClick={async () => {
                isFavorite
                  ? await removeFromFavorites?.(iTwin?.id)
                  : await addToFavorites?.(iTwin?.id);
              }}
              styleType="borderless"
            >
              {isFavorite ? <SvgStar /> : <SvgStarHollow />}
            </IconButton>
          )}
        </Tile.Buttons>
      </Tile.Wrapper>
    </ThemeProvider>
  );
};
