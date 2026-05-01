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
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import svgCheckmark from "@stratakit/icons/checkmark.svg";
import svgItwin from "@stratakit/icons/itwin.svg";
import svgMore from "@stratakit/icons/more-vertical.svg";
import svgNew from "@stratakit/icons/new.svg";
import svgStatusError from "@stratakit/icons/status-error.svg";
import svgStatusSuccess from "@stratakit/icons/status-success.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import { Icon } from "@stratakit/mui";
import classNames from "classnames";
import React from "react";

import { TileFavoriteIcon } from "../../components/tileFavoriteIcon/TileFavoriteIcon";
import { ITwinFull } from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import styles from "./ITwinTile.module.scss";

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
    return <CircularProgress size={16} sx={{ mr: 0.5, flexShrink: 0 }} />;
  }
  if (isSelected) {
    return (
      <Box component="span" sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0 }}>
        <Icon href={svgCheckmark} size="regular" />
      </Box>
    );
  }
  if (status === "positive") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "success.main" }}
      >
        <Icon href={svgStatusSuccess} size="regular" />
      </Box>
    );
  }
  if (status === "warning") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "warning.main" }}
      >
        <Icon href={svgStatusWarning} size="regular" />
      </Box>
    );
  }
  if (status === "negative") {
    return (
      <Box
        component="span"
        sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0, color: "error.main" }}
      >
        <Icon href={svgStatusError} size="regular" />
      </Box>
    );
  }
  if (isNew) {
    return (
      <Box component="span" sx={{ mr: 0.5, flexShrink: 0, lineHeight: 0 }}>
        <Icon href={svgNew} size="regular" />
      </Box>
    );
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
      typeof visible === "function" ? visible(value) : visible ?? true
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

export interface ITwinTileV2Props
  extends Omit<CardProps, "children" | "title"> {
  /** iTwin to display */
  iTwin: ITwinFull;
  /** List of options to build for the iTwin context menu */
  iTwinOptions?: ContextMenuBuilderItem<ITwinFull>[];
  /** Function to call on card click — receives the iTwin object */
  onThumbnailClick?(iTwin: ITwinFull): void;
  /** Strings displayed by the component */
  stringsOverrides?: {
    /** Badge text for trial iTwins */
    trialBadge?: string;
    /** Badge text for inactive iTwins */
    inactiveBadge?: string;
    /** Accessible text for the hollow star icon to add the iTwin to favorites */
    addToFavorites?: string;
    /** Accessible text for the full star icon to remove the iTwin from favorites */
    removeFromFavorites?: string;
  };
  /** Indicates whether the iTwin is marked as a favorite */
  isFavorite?: boolean;
  /** Function to add the iTwin to favorites */
  addToFavorites?(iTwinId: string): Promise<void>;
  /** Function to remove the iTwin from favorites */
  removeFromFavorites?(iTwinId: string): Promise<void>;
  /** Function to refetch iTwins */
  refetchITwins?: () => void;
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
  /** Custom thumbnail content — replaces the default iTwin icon */
  thumbnail?: React.ReactNode;
  /** Icon shown in the top-left of the thumbnail */
  leftIcon?: React.ReactNode;
  /** Icon shown in the top-right of the thumbnail (alongside the favorite icon) */
  rightIcon?: React.ReactNode;
  /** Badge shown at the bottom of the thumbnail (overrides auto status badge) */
  badge?: React.ReactNode;
  // ── Content ─────────────────────────────────────────────────────────────────
  /** Override the displayed name (defaults to iTwin.displayName) */
  name?: string;
  /** Override the description (defaults to iTwin.number) */
  description?: string;
  /** Additional metadata rendered below the description */
  metadata?: React.ReactNode;
  /** Pre-built menu items rendered in the more-options menu */
  moreOptions?: React.ReactNode;
  /** Action buttons rendered in the card footer */
  buttons?: React.ReactNode;
  /** Additional content rendered inside the card body */
  children?: React.ReactNode;
  // ── Sub-component customization ─────────────────────────────────────────────
  slotProps?: {
    header?: Partial<React.ComponentPropsWithoutRef<typeof CardHeader>>;
    content?: Partial<React.ComponentPropsWithoutRef<typeof CardContent>>;
    actions?: Partial<React.ComponentPropsWithoutRef<typeof CardActions>>;
  };
}

/**
 * Representation of an iTwin — V2 (Stratakit/MUI)
 */
export const ITwinTileV2 = ({
  iTwin,
  iTwinOptions,
  onThumbnailClick,
  stringsOverrides,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  refetchITwins,
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
  name,
  description,
  metadata,
  moreOptions,
  buttons,
  children,
  slotProps,
  className,
  ...rest
}: ITwinTileV2Props) => {
  const [moreOptionsAnchor, setMoreOptionsAnchor] =
    React.useState<HTMLElement | null>(null);

  const strings = _mergeStrings(
    {
      trialBadge: "Trial",
      inactiveBadge: "Inactive",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
    },
    stringsOverrides
  );

  const moreOptionsBuilt = React.useMemo(
    () =>
      buildMenuItems(
        iTwinOptions,
        iTwin,
        () => setMoreOptionsAnchor(null),
        refetchITwins
      ),
    [iTwinOptions, iTwin, refetchITwins]
  );

  const hasMoreOptions = !!(moreOptions || moreOptionsBuilt?.length);

  const statusBadge =
    badge ??
    (iTwin.status && iTwin.status.toLocaleLowerCase() !== "active" ? (
      <Chip
        size="small"
        label={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? strings.inactiveBadge
            : strings.trialBadge
        }
        color={
          iTwin.status.toLocaleLowerCase() === "inactive"
            ? "default"
            : "primary"
        }
      />
    ) : null);

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
          onClick={() => onThumbnailClick(iTwin)}
          aria-disabled={isDisabled || undefined}
          data-testid={`iTwin-tile-${iTwin.id}`}
          sx={{
            font: "inherit",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name ?? iTwin.displayName}
        </CardActionArea>
      ) : (
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name ?? iTwin.displayName}
        </Box>
      )}
    </Box>
  );

  return (
    <Card
      variant="outlined"
      aria-disabled={isDisabled || undefined}
      className={classNames(
        styles.iTwinTile,
        { [styles.fullWidth]: fullWidth },
        className
      )}
      sx={{
        width: fullWidth ? "100%" : "fit-content",
        minWidth: 288,
        ...rest.sx,
      }}
      {...rest}
    >
      {/* Thumbnail area */}
      <Box
        sx={{
          position: "relative",
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: onThumbnailClick ? "pointer" : "auto",
          bgcolor: "action.hover",
          overflow: "hidden",
        }}
        onClick={onThumbnailClick ? () => onThumbnailClick(iTwin) : undefined}
      >
        {leftIcon && (
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
            {leftIcon}
          </Box>
        )}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            display: "flex",
            gap: 0.5,
          }}
        >
          {rightIcon}
          {!hideFavoriteIcon &&
            isFavorite !== undefined &&
            addToFavorites &&
            removeFromFavorites && (
              <TileFavoriteIcon
                isFavorite={isFavorite}
                onAddToFavorites={() => addToFavorites(iTwin.id)}
                onRemoveFromFavorites={() => removeFromFavorites(iTwin.id)}
                addLabel={strings.addToFavorites}
                removeLabel={strings.removeFromFavorites}
                className={classNames(styles.iTwinTileFavoriteIcon, {
                  [styles.hidden]: !isFavorite,
                })}
              />
            )}
        </Box>
        {thumbnail ? (
          <Box sx={{ height: "100%", width: "100%" }}>{thumbnail}</Box>
        ) : (
          <Box component="span" sx={{ lineHeight: 0, color: "text.secondary" }}>
            <Icon href={svgItwin} size="large" />
          </Box>
        )}
        {statusBadge && (
          <Box sx={{ position: "absolute", bottom: 8, right: 8, zIndex: 1 }}>
            {statusBadge}
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
      <CardContent sx={{ pt: 0 }} {...slotProps?.content}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flex: 1, minWidth: 0 }}
          >
            {description ?? iTwin.number ?? ""}
          </Typography>
          {hasMoreOptions && (
            <>
              <IconButton
                size="small"
                aria-label="More options"
                data-testid={`iTwin-tile-${iTwin.id}-more-options`}
                onClick={(e) => setMoreOptionsAnchor(e.currentTarget)}
                sx={{ flexShrink: 0, mt: -0.5 }}
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
          )}
        </Box>
        {metadata && (
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            data-testid={`iTwin-tile-${iTwin.id}-metadata`}
            sx={{ mt: 1 }}
          >
            {metadata}
          </Typography>
        )}
        {children}
      </CardContent>

      {/* Footer buttons */}
      {buttons && <CardActions {...slotProps?.actions}>{buttons}</CardActions>}
    </Card>
  );
};
