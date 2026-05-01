/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgMore from "@stratakit/icons/more-vertical.svg";
import svgNew from "@stratakit/icons/new.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";

import { TileFavoriteIcon } from "../../components/tileFavoriteIcon/TileFavoriteIcon";
import { useIModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { AccessTokenProvider, ApiOverrides, IModelFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { IModelThumbnailV2 } from "../iModelThumbnail/IModelThumbnailV2";
import styles from "./IModelTile.module.scss";

function NameStatusIcon({
  status,
  isNew,
  isLoading,
  isSelected,
}: {
  status?: "positive" | "warning" | "negative";
  isNew?: boolean;
  isLoading?: boolean;
  isSelected?: boolean;
}) {
  if (isLoading) {
    return (
      <CircularProgress size={16} sx={{ mr: 0.5, flexShrink: 0 }} />
    );
  }
  if (isSelected) {
    return <Icon svg={svgCheckmark} sx={{ mr: 0.5, fontSize: 16, flexShrink: 0 }} />;
  }
  if (status === "positive") {
    return (
      <Icon
        svg={svgStatusSuccess}
        sx={{ mr: 0.5, fontSize: 16, flexShrink: 0, color: "success.main" }}
      />
    );
  }
  if (status === "warning") {
    return (
      <Icon
        svg={svgStatusWarning}
        sx={{ mr: 0.5, fontSize: 16, flexShrink: 0, color: "warning.main" }}
      />
    );
  }
  if (status === "negative") {
    return (
      <Icon
        svg={svgStatusError}
        sx={{ mr: 0.5, fontSize: 16, flexShrink: 0, color: "error.main" }}
      />
    );
  }
  if (isNew) {
    return <Icon svg={svgNew} sx={{ mr: 0.5, fontSize: 16, flexShrink: 0 }} />;
  }
  return null;
}

function buildMenuItems<T>(
  options: ContextMenuBuilderItem<T>[] | undefined,
  value: T,
  closeMenu: () => void,
  refetchData?: () => void
): React.ReactNode[] | undefined {
  return options
    ?.filter(({ visible }) =>
      typeof visible === "function" ? visible(value) : (visible ?? true)
    )
    .map(({ key, visible, onClick, disabled, children }) => (
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
  // ── State ───────────────────────────────────────────────────────────────────
  /** Marks the card as new */
  isNew?: boolean;
  /** Marks the card as selected */
  isSelected?: boolean;
  /** Shows a loading indicator in the card header */
  isLoading?: boolean;
  /** Applies disabled styling and aria-disabled */
  isDisabled?: boolean;
  /** Status indicator shown in the card header */
  status?: "positive" | "warning" | "negative";
  // ── Thumbnail area ──────────────────────────────────────────────────────────
  /** Custom thumbnail content — replaces the auto-fetched thumbnail */
  thumbnail?: React.ReactNode;
  /** Icon shown in the top-left of the thumbnail */
  leftIcon?: React.ReactNode;
  /** Icon shown in the top-right of the thumbnail (alongside the favorite icon) */
  rightIcon?: React.ReactNode;
  /** Badge shown at the bottom of the thumbnail */
  badge?: React.ReactNode;
  /** Function that returns a badge node for the given iModel */
  getBadge?: (iModel: IModelFull) => React.ReactNode;
  // ── Content ─────────────────────────────────────────────────────────────────
  /** Override the displayed name (defaults to iModel.displayName) */
  name?: string;
  /** Additional metadata rendered below the description */
  metadata?: React.ReactNode;
  /** Pre-built menu items rendered in the more-options menu */
  moreOptions?: React.ReactNode;
  /** Action buttons rendered in the card footer */
  buttons?: React.ReactNode;
  // ── Sub-component customization ─────────────────────────────────────────────
  slotProps?: {
    header?: Partial<React.ComponentPropsWithoutRef<typeof CardHeader>>;
    content?: Partial<React.ComponentPropsWithoutRef<typeof CardContent>>;
    actions?: Partial<React.ComponentPropsWithoutRef<typeof CardActions>>;
  };
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
  isNew,
  isSelected,
  isLoading,
  isDisabled,
  status,
  thumbnail,
  leftIcon,
  rightIcon,
  badge,
  getBadge,
  name,
  metadata,
  moreOptions,
  buttons,
  slotProps,
  className,
  ...rest
}: IModelTileV2Props) => {
  const [moreOptionsAnchor, setMoreOptionsAnchor] =
    React.useState<HTMLElement | null>(null);

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
      buildMenuItems(iModelOptions, iModel, () =>
        setMoreOptionsAnchor(null), refetchIModels),
    [iModelOptions, iModel, refetchIModels]
  );

  const thumbnailApiOverride =
    apiOverrides || iModel.thumbnail
      ? { ...(apiOverrides ?? {}), data: iModel.thumbnail }
      : undefined;

  const hasMoreOptions = !!(moreOptions || moreOptionsBuilt?.length);

  const titleNode = (
    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
      <NameStatusIcon
        status={status}
        isNew={isNew}
        isLoading={isLoading}
        isSelected={isSelected}
      />
      {onThumbnailClick ? (
        <CardActionArea
          nativeButton={false}
          onClick={() => onThumbnailClick(iModel)}
          aria-disabled={isDisabled || undefined}
          data-testid={`iModel-tile-${iModel.id}-name-label`}
          sx={{
            font: "inherit",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name ?? iModel.displayName}
        </CardActionArea>
      ) : (
        <Box
          component="span"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {name ?? iModel.displayName}
        </Box>
      )}
    </Box>
  );

  return (
    <Card
      variant="outlined"
      aria-disabled={isDisabled || undefined}
      className={classNames(styles.iModelTile, { [styles.fullWidth]: fullWidth }, className)}
      {...rest}
    >
      {/* Thumbnail area */}
      <Box sx={{ position: "relative", height: 140 }}>
        {leftIcon && (
          <Box
            sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
          >
            {leftIcon}
          </Box>
        )}
        <Box
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, display: "flex", gap: 0.5 }}
        >
          {rightIcon}
          {!hideFavoriteIcon && favoritesContext && (
            <TileFavoriteIcon
              isFavorite={favoritesContext.favorites.has(iModel.id)}
              onAddToFavorites={() => favoritesContext.add(iModel.id)}
              onRemoveFromFavorites={() =>
                favoritesContext.remove(iModel.id)
              }
              addLabel={strings.addToFavorites}
              removeLabel={strings.removeFromFavorites}
              className={classNames(styles.iModelTileFavoriteIcon, {
                [styles.hidden]: !favoritesContext.favorites.has(iModel.id),
              })}
            />
          )}
        </Box>
        {thumbnail ? (
          <Box sx={{ height: "100%", width: "100%" }}>{thumbnail}</Box>
        ) : (
          <IModelThumbnailV2
            iModelId={iModel.id}
            accessToken={accessToken}
            apiOverrides={thumbnailApiOverride}
          />
        )}
        {(getBadge || badge) && (
          <Box sx={{ position: "absolute", bottom: 8, right: 8, zIndex: 1 }}>
            {getBadge?.(iModel) ?? badge}
          </Box>
        )}
      </Box>

      {/* Card header — name with status icon */}
      <CardHeader
        title={titleNode}
        titleTypographyProps={{ variant: "subtitle1" }}
        {...slotProps?.header}
      />

      {/* Card content — description, more options, metadata */}
      <CardContent
        data-testid={`iModel-tile-${iModel.id}-action`}
        sx={{ pt: 0 }}
        {...slotProps?.content}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flex: 1, minWidth: 0 }}
          >
            {iModel.description ?? ""}
          </Typography>
          {hasMoreOptions && (
            <>
              <IconButton
                size="small"
                aria-label="More options"
                data-testid={`iModel-tile-${iModel.id}-more-options`}
                onClick={(e) => setMoreOptionsAnchor(e.currentTarget)}
                sx={{ flexShrink: 0, mt: -0.5 }}
              >
                <Icon svg={svgMore} />
              </IconButton>
              <Menu
                anchorEl={moreOptionsAnchor}
                open={Boolean(moreOptionsAnchor)}
                onClose={() => setMoreOptionsAnchor(null)}
              >
                {moreOptions ?? moreOptionsBuilt}
              </Menu>
            </>
          )}
        </Box>
        {metadata && (
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            data-testid={`iModel-tile-${iModel.id}-metadata`}
            sx={{ mt: 1 }}
          >
            {metadata}
          </Typography>
        )}
      </CardContent>

      {/* Footer buttons */}
      {buttons && (
        <CardActions {...slotProps?.actions}>{buttons}</CardActions>
      )}
    </Card>
  );
};
