/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
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

  // ── Content ─────────────────────────────────────────────────────────────────
  /**
   * Optional icon rendered to the left of the entire content area.
   * Use this for status icons, type indicators, etc.
   */
  statusIcon?: ReactNode;
  /** Short description rendered below the title. */
  description?: string;
  /** Secondary metadata line rendered below the description (e.g. "Edited 1/16/2024"). */
  metadata?: string;
  /**
   * Additional free-form content injected below description + metadata.
   * Use for extra info rows, tags, etc.
   */
  cardInfo?: ReactNode;

  // ── Footer ───────────────────────────────────────────────────────────────────
  /**
   * Action buttons rendered in the card footer (`CardActions`).
   */
  actions?: ReactNode;

  // ── Layout ───────────────────────────────────────────────────────────────────
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
      metadata,
      cardInfo,
      actions,
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
    const thumbnailNode =
      typeof thumbnail === "string" ? (
        <img src={thumbnail} alt="" />
      ) : (
        thumbnail
      );

    return (
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
        onContextMenu={onContextMenu}
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
            <Box className={styles.thumbnailTopRight}>{thumbnailTopRight}</Box>
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
            <Box className={styles.statusIcon} sx={{ flexShrink: 0, pt: 0.25 }}>
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

            {/* Info: description + metadata + injected cardInfo */}
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
              {metadata && (
                <Typography
                  variant="subtitle2"
                  color="text.disabled"
                  component="p"
                >
                  {metadata}
                </Typography>
              )}
              {cardInfo}
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
    );
  }
);

BaseCard.displayName = "BaseCard";
