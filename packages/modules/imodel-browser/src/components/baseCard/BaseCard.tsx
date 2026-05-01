/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import React from "react";

import styles from "./BaseCard.module.scss";

interface BaseCardSlotStyleProps {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface BaseCardSlotProps {
  thumbnail?: BaseCardSlotStyleProps;
  media?: BaseCardSlotStyleProps;
  divider?: BaseCardSlotStyleProps;
  content?: BaseCardSlotStyleProps;
  header?: BaseCardSlotStyleProps;
  info?: BaseCardSlotStyleProps;
  actions?: BaseCardSlotStyleProps;
  nameAction?: BaseCardSlotStyleProps;
}

export interface BaseCardProps
  extends Omit<CardProps, "children" | "title" | "onClick"> {
  // ── Thumbnail area ──────────────────────────────────────────────────────────
  /**
   * Main thumbnail content override (icon, skeleton, custom layout, etc.).
   * If provided, it takes precedence over `thumbnailMediaSrc`.
   */
  thumbnail?: React.ReactNode;
  /**
   * Media source URL for thumbnail image/video.
   * Rendered through MUI `CardMedia` when `thumbnail` is not provided.
   */
  thumbnailMediaSrc?: string;
  /**
   * Alt text for `thumbnailMediaSrc` when rendered as an image.
   * Defaults to an empty string for decorative media.
   */
  thumbnailMediaAlt?: string;
  /**
   * Overlay slot in the top-left of the thumbnail (e.g. TypeIndicator icon).
   */
  thumbnailTopLeft?: React.ReactNode;
  /**
   * Overlay slot in the top-right of the thumbnail
   * (e.g. favorite button, quick-action icon).
   */
  thumbnailTopRight?: React.ReactNode;
  /**
   * Overlay slot in the bottom-right of the thumbnail (e.g. status badge, chip).
   */
  thumbnailBottomRight?: React.ReactNode;

  // ── Header ──────────────────────────────────────────────────────────────────
  /** Primary name/title of the card. */
  name: string;
  /** Optional click handler for the card title. */
  onNameClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Optional slot to the right of the name in the header row
   * (e.g. AvatarGroup, status chip, icon button).
   */
  headerRight?: React.ReactNode;

  // ── Content ─────────────────────────────────────────────────────────────────
  /**
   * Optional icon rendered to the left of the entire content area.
   * Use this for status icons, type indicators, etc.
   */
  statusIcon?: React.ReactNode;
  /** Short description rendered below the name. */
  description?: string;
  /** Secondary metadata line rendered below the description (e.g. "Edited 1/16/2024"). */
  metadata?: string;
  /**
   * Additional free-form content injected below description + metadata.
   * Use for extra info rows, tags, etc.
   */
  cardInfo?: React.ReactNode;

  // ── Footer ───────────────────────────────────────────────────────────────────
  /**
   * Action buttons rendered in the card footer (`CardActions`).
   */
  actions?: React.ReactNode;

  // ── Layout ───────────────────────────────────────────────────────────────────
  /** Makes the card take the full width of its container. */
  fullWidth?: boolean;
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
      thumbnailMediaSrc,
      thumbnailMediaAlt,
      thumbnailTopLeft,
      thumbnailTopRight,
      thumbnailBottomRight,
      name,
      onNameClick,
      headerRight,
      statusIcon,
      description,
      metadata,
      cardInfo,
      actions,
      fullWidth,
      slotProps,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        variant="outlined"
        className={classNames(
          styles.baseCard,
          { [styles.fullWidth]: fullWidth },
          className
        )}
        {...rest}
      >
        {/* ── Thumbnail area ── */}
        <Box
          className={classNames(
            styles.thumbnailArea,
            slotProps?.thumbnail?.className
          )}
          {...slotProps?.thumbnail}
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
          {thumbnail ??
            (thumbnailMediaSrc ? (
              <CardMedia
                component="img"
                src={thumbnailMediaSrc}
                alt={thumbnailMediaAlt ?? ""}
                {...slotProps?.media}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  ...(slotProps?.media?.sx ?? {}),
                }}
              />
            ) : null)}
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
            {/* Header row: name + optional right slot */}
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
              {onNameClick ? (
                <CardActionArea
                  onClick={onNameClick}
                  className={slotProps?.nameAction?.className}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    borderRadius: 1,
                    px: 0.5,
                    py: 0.25,
                    ...(slotProps?.nameAction?.sx ?? {}),
                  }}
                >
                  <Typography variant="body1" noWrap>
                    {name}
                  </Typography>
                </CardActionArea>
              ) : (
                <Typography
                  variant="body1"
                  noWrap
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  {name}
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
                  variant="subtitle1"
                  color="text.secondary"
                  component="p"
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
