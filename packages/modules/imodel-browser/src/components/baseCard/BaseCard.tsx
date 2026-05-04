/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import React, { type ReactNode } from "react";

import styles from "./BaseCard.module.scss";

interface BaseCardSlotStyleProps {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface BaseCardSlotProps {
  thumbnail?: BaseCardSlotStyleProps;
  divider?: BaseCardSlotStyleProps;
  content?: BaseCardSlotStyleProps;
  header?: BaseCardSlotStyleProps;
  info?: BaseCardSlotStyleProps;
  actions?: BaseCardSlotStyleProps;
  titleAction?: BaseCardSlotStyleProps;
}

export interface BaseCardContextMenuItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

export interface BaseCardProps
  extends Omit<CardProps, "children" | "title" | "onClick"> {
  // ── Thumbnail area ──────────────────────────────────────────────────────────
  /**
   * Main thumbnail content (icon, image, skeleton, custom layout, etc.).
   * When a string URL is provided, BaseCard renders an image with default cover styling.
   * Leave undefined to render an empty reserved thumbnail area.
   */
  thumbnail?: ReactNode;
  /**
   * Overlay slot in the top-left of the thumbnail (e.g. TypeIndicator icon).
   */
  thumbnailTopLeft?: ReactNode;
  /**
   * Overlay slot in the top-right of the thumbnail
   * (e.g. favorite button, quick-action icon).
   */
  thumbnailTopRight?: ReactNode;
  /**
   * Overlay slot in the bottom-right of the thumbnail (e.g. status badge, chip).
   */
  thumbnailBottomRight?: ReactNode;

  // ── Header ──────────────────────────────────────────────────────────────────
  /** Primary title of the card. */
  title: string;

  /**
   * Optional slot to the right of the title in the header row
   * (e.g. status chip, icon button, AvatarGroup).
   */
  headerRight?: ReactNode;

  /**
   * Optional icon rendered to the left of the entire content area.
   */
  statusIcon?: ReactNode;
  /** Short description rendered below the title. */
  description?: string;
  /**
   * Secondary fineprint content rendered below the description.
   * Accepts either a string (rendered with default subtitle styling) or custom React content.
   */
  fineprint?: ReactNode;

  // ── Footer ───────────────────────────────────────────────────────────────────
  /**
   * Action buttons rendered in the card footer (`CardActions`).
   */
  actions?: ReactNode;

  /**
   * Optional right-click context menu content rendered by BaseCard.
   * When provided, the menu opens at cursor position on right-click.
   */
  contextMenuContent?: ReactNode;
  /**
   * Optional context menu item descriptors rendered by BaseCard.
   * Prefer this over `contextMenuContent` when calling across package boundaries.
   */
  contextMenuItems?: BaseCardContextMenuItem[];

  /** Indicates whether the card is in a selected state. Applies outline styling. */
  selected?: boolean;
  /** Optional click handler for the card title. */
  onTitleClick?: NonNullable<
    React.ComponentProps<typeof CardActionArea>["onClick"]
  >;
  /** Optional callback fired on right-click of the card. */
  onContextMenu?: CardProps["onContextMenu"];
  /** Optional callback fired on double-click of the card. */
  onDoubleClick?: CardProps["onDoubleClick"];
  /** Props for internal wrapper slots following MUI slotProps conventions. */
  slotProps?: BaseCardSlotProps;
}

/**
 * Base card component built on MUI Card, following the Bentley Systems navigation card design.
 * Provides a consistent layout with a thumbnail area, header, and content area.
 * Consume this via domain-specific wrappers (IModelTile, ITwinTile, etc.).
 */
export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      thumbnail,
      thumbnailTopLeft,
      thumbnailTopRight,
      thumbnailBottomRight,
      title,
      onTitleClick,
      headerRight,
      statusIcon,
      description,
      fineprint,
      actions,
      contextMenuContent,
      contextMenuItems,
      selected,
      onContextMenu,
      onDoubleClick,
      slotProps,
      className,
      sx,
      ...rest
    },
    ref
  ) => {
    const fineprintNode =
      typeof fineprint === "string" ? (
        <Typography variant="subtitle2" color="text.disabled" component="p">
          {fineprint}
        </Typography>
      ) : (
        fineprint
      );

    const thumbnailNode =
      typeof thumbnail === "string" ? (
        <img src={thumbnail} alt="" />
      ) : (
        thumbnail
      );

    const [contextMenuPosition, setContextMenuPosition] = React.useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);

    const closeContextMenu = React.useCallback(() => {
      setContextMenuPosition(null);
    }, []);

    const handleContextMenu = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(event);

        if (
          !(contextMenuItems?.length || contextMenuContent) ||
          event.defaultPrevented
        ) {
          return;
        }

        event.preventDefault();
        setContextMenuPosition({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      },
      [contextMenuContent, contextMenuItems, onContextMenu]
    );

    return (
      <>
        <Card
          ref={ref}
          variant="outlined"
          className={classNames(
            styles.baseCard,
            { [styles.selected]: selected },
            className
          )}
          sx={[
            {
              cursor: onDoubleClick ? "pointer" : "default",
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
          onContextMenu={
            onContextMenu || contextMenuContent || contextMenuItems?.length
              ? handleContextMenu
              : undefined
          }
          onDoubleClick={onDoubleClick}
          {...rest}
        >
          {/* ── Thumbnail area ── */}
          <Box
            className={classNames(
              styles.thumbnailArea,
              slotProps?.thumbnail?.className
            )}
            sx={{
              ...(slotProps?.thumbnail?.sx ?? {}),
            }}
          >
            {thumbnailTopLeft && (
              <Box className={styles.thumbnailTopLeft}>{thumbnailTopLeft}</Box>
            )}
            {thumbnailTopRight && (
              <Box className={styles.thumbnailTopRight}>
                {thumbnailTopRight}
              </Box>
            )}
            {thumbnailNode}
            {thumbnailBottomRight && (
              <Box className={styles.thumbnailBottomRight}>
                {thumbnailBottomRight}
              </Box>
            )}
          </Box>

          <Divider
            className={slotProps?.divider?.className}
            sx={{ ...(slotProps?.divider?.sx ?? {}) }}
          />

          {/* ── Content area ── */}
          <Stack
            direction="row"
            spacing={1}
            className={slotProps?.content?.className}
            sx={{
              p: 2,
              pt: 1.5,
              alignItems: "flex-start",
              ...(slotProps?.content?.sx ?? {}),
            }}
          >
            {statusIcon && (
              <Box
                className={styles.statusIcon}
                sx={{ flexShrink: 0, pt: 0.25 }}
              >
                {statusIcon}
              </Box>
            )}

            <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
              {/* Header row: title + optional right slot */}
              <Stack
                direction="row"
                className={slotProps?.header?.className}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  ...(slotProps?.header?.sx ?? {}),
                }}
              >
                {onTitleClick ? (
                  <CardActionArea
                    onClick={onTitleClick}
                    className={slotProps?.titleAction?.className}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: "left",
                      borderRadius: 1,
                      ...(slotProps?.titleAction?.sx ?? {}),
                    }}
                  >
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {title}
                    </Typography>
                  </CardActionArea>
                ) : (
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {headerRight && <Box sx={{ flexShrink: 0 }}>{headerRight}</Box>}
              </Stack>

              {/* Info: description + fineprint */}
              <Stack
                spacing={0.25}
                className={slotProps?.info?.className}
                sx={{ ...(slotProps?.info?.sx ?? {}) }}
              >
                {description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="p"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {description}
                  </Typography>
                )}
                {fineprintNode}
              </Stack>
            </Stack>
          </Stack>

          {/* ── Footer actions ── */}
          {actions && (
            <CardActions
              className={slotProps?.actions?.className}
              sx={{ pt: 0, ...(slotProps?.actions?.sx ?? {}) }}
            >
              {actions}
            </CardActions>
          )}
        </Card>
        {(contextMenuItems?.length || contextMenuContent) && (
          <Menu
            open={contextMenuPosition !== null}
            onClose={closeContextMenu}
            onClick={closeContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenuPosition !== null
                ? {
                    top: contextMenuPosition.mouseY,
                    left: contextMenuPosition.mouseX,
                  }
                : undefined
            }
          >
            {contextMenuItems?.length
              ? contextMenuItems.map(({ key, label, disabled, onClick }) => (
                  <MenuItem
                    key={key}
                    disabled={disabled}
                    onClick={(event) => {
                      onClick?.(event);
                    }}
                  >
                    {label}
                  </MenuItem>
                ))
              : contextMenuContent}
          </Menu>
        )}
      </>
    );
  }
);

BaseCard.displayName = "BaseCard";
