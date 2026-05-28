/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Card, { CardProps } from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import type { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import React, { type ReactNode } from "react";
import { Icon } from "@stratakit/mui";
import svgMoreVertical from "@stratakit/icons/more-vertical.svg";
import styles from "./BaseCard.module.scss";
import { BaseCardLoading } from "./BaseCardLoading";
import { ThumbnailIconButton } from "./ThumbnailIconButton";

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

export interface BaseCardActionItem {
  key: string;
  label: ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export interface BaseCardProps
  extends Omit<CardProps, "children" | "title" | "onClick" | "onSelect"> {
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
  /**
   * Overlay slot in the bottom-left of the thumbnail.
   */
  thumbnailBottomLeft?: ReactNode;

  // ── Header ──────────────────────────────────────────────────────────────────
  /** Primary title of the card. */
  title: string;

  /**
   * Optional slot to the right of the title in the header row
   * (e.g. status chip, icon button, AvatarGroup).
   */
  headerRight?: ReactNode;

  /**
   * Optional icon rendered to the left of the entire content area.  Pass just an `<Icon>` component.
   */
  statusIcon?: ReactNode;
  /** Short description rendered below the title. */
  description?: string;
  /**
   * Secondary fineprint content rendered below the description.
   */
  additionalDescription?: string;

  /** Additional content rendered below the description and above the footer. */
  additionalContent?: ReactNode;

  /**
   * Action buttons rendered on hover over top of the thumbnail.  By default, these are hidden and only appear on hover.
   *
   * The first button will get the "primary" color, and any subsequent buttons will be "secondary".  Consider using no more than 2 buttons, as more may cause layout issues.
   */
  actions?: BaseCardActionItem[];

  /**
   * Optional right-click context menu content rendered by BaseCard.
   * When provided, the menu opens at cursor position on right-click.
   */
  contextMenuContent?: ReactNode;

  /** Indicates whether the card is in a selected state. Applies outline styling. */
  selected?: boolean;
  /** Indicates whether the card is in a loading state. */
  loading?: boolean;
  /** Indicates whether the card is disabled. */
  disabled?: boolean;
  /** Status indicator used for styling (divider color, etc.) */
  status?: "positive" | "warning" | "negative" | undefined;
  /** Optional callback fired when the card is clicked. */
  onClick?: CardProps["onClick"];
  /** Optional callback fired on double-click of the card. */
  onDoubleClick?: CardProps["onDoubleClick"];
  /** Props for internal wrapper slots following MUI slotProps conventions. */
  slotProps?: BaseCardSlotProps;
}

/**
 * Base card component built on MUI Card.
 *
 * Base card is very customizable. As such, it isn't recommended to use BaseCard directly since
 * design discipline will go out the window.  Instead, we map some of the placements (e.g. thumbnailTopRight)
 * to specific uses (e.g. favorite button) in the domain-specific wrappers.
 */
export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      thumbnail,
      thumbnailTopLeft,
      thumbnailTopRight,
      thumbnailBottomRight,
      thumbnailBottomLeft,
      title,
      onClick,
      onDoubleClick,
      headerRight,
      statusIcon,
      description,
      additionalDescription,
      additionalContent,
      actions,
      contextMenuContent,
      selected,
      loading,
      disabled: cardDisabled,
      status,
      slotProps,
      className,
      sx,
      ...rest
    },
    ref
  ) => {
    const thumbnailNode =
      typeof thumbnail === "string" ? (
        <CardMedia component="img" src={thumbnail} alt="" />
      ) : (
        thumbnail
      );

    const [contextMenuPosition, setContextMenuPosition] = React.useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
      null
    );
    const menuOpen = contextMenuPosition !== null || menuAnchorEl !== null;

    const closeContextMenu = React.useCallback(() => {
      setContextMenuPosition(null);
      setMenuAnchorEl(null);
    }, []);

    const handleContextMenu = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!contextMenuContent) {
          return;
        }

        event.preventDefault();
        setMenuAnchorEl(null);
        setContextMenuPosition({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      },
      [contextMenuContent]
    );

    const handleMoreButtonClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setContextMenuPosition(null);
        setMenuAnchorEl(event.currentTarget);
      },
      []
    );

    const hasContextMenu = !!contextMenuContent;

    if (actions?.length === 1) {
      console.warn(
        `Having a single 'actions' item is a design antipattern. Consider using the 'onClick' prop instead of 'actions' for a single action button.`,
        actions
      );
    }

    const actionButtons = actions?.length ? (
      <CardActions
        data-testid="card-action-buttons"
        className={styles.cardActions}
        sx={slotProps?.actions?.sx}
      >
        <Grid container spacing={2}>
          {actions.map(({ key, label, onClick }, index) => (
            <Button
              key={key}
              onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);
              }}
              color={index === 0 ? "primary" : "secondary"}
              size="large"
              variant="contained"
            >
              {label}
            </Button>
          ))}
        </Grid>
      </CardActions>
    ) : null;

    if (loading) {
      return (
        <BaseCardLoading
          className={classNames(styles.baseCard, className)}
          sx={sx}
        />
      );
    }

    return (
      <>
        <Card
          ref={ref}
          variant="outlined"
          className={classNames(
            styles.baseCard,
            { [styles.selected]: selected, [styles.disabled]: cardDisabled },
            className
          )}
          sx={{
            cursor: cardDisabled ? "not-allowed" : "default",
            ...sx,
          }}
          {...rest}
          onClick={!cardDisabled ? onClick : undefined}
          onContextMenu={
            !cardDisabled && hasContextMenu ? handleContextMenu : undefined
          }
          onDoubleClick={!cardDisabled ? onDoubleClick : undefined}
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
            {(thumbnailTopRight ?? hasContextMenu) && (
              <Box className={styles.thumbnailTopRight}>
                {thumbnailTopRight}
                {hasContextMenu && !cardDisabled && (
                  <ThumbnailIconButton
                    aria-label="More options"
                    onClick={handleMoreButtonClick}
                  >
                    <Icon href={svgMoreVertical} alt="" size="regular" />
                  </ThumbnailIconButton>
                )}
              </Box>
            )}
            {thumbnailNode}
            {thumbnailBottomLeft && (
              <Box className={styles.thumbnailBottomLeft}>
                {thumbnailBottomLeft}
              </Box>
            )}
            {thumbnailBottomRight && (
              <Box className={styles.thumbnailBottomRight}>
                {thumbnailBottomRight}
              </Box>
            )}
            {actionButtons}
          </Box>

          <Divider
            className={slotProps?.divider?.className}
            sx={{
              borderColor:
                status === "positive"
                  ? "success.main"
                  : status === "warning"
                  ? "warning.main"
                  : status === "negative"
                  ? "error.main"
                  : undefined,
              ...(slotProps?.divider?.sx ?? {}),
            }}
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
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
                data-testid="status-icon"
              >
                {statusIcon}
              </Box>
            )}

            <Stack sx={{ flexDirection: "column", gap: 0.5, flex: 1 }}>
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
                {headerRight && <Box sx={{ flexShrink: 0 }}>{headerRight}</Box>}
              </Stack>

              {/* Info: description + additionalDescription */}
              <Stack
                spacing={0.25}
                className={slotProps?.info?.className}
                sx={{ ...(slotProps?.info?.sx ?? {}) }}
              >
                {description && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
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
                {additionalDescription && (
                  <Typography
                    variant="subtitle2"
                    color="secondary"
                    component="p"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {additionalDescription}
                  </Typography>
                )}
              </Stack>
              {additionalContent && (
                <Box sx={{ mt: 1 }}>{additionalContent}</Box>
              )}
            </Stack>
          </Stack>
        </Card>
        {hasContextMenu && (
          <Menu
            open={menuOpen}
            onClose={closeContextMenu}
            onClick={closeContextMenu}
            anchorReference={menuAnchorEl ? "anchorEl" : "anchorPosition"}
            anchorEl={menuAnchorEl}
            anchorPosition={
              contextMenuPosition !== null
                ? {
                    top: contextMenuPosition.mouseY,
                    left: contextMenuPosition.mouseX,
                  }
                : undefined
            }
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {contextMenuContent}
          </Menu>
        )}
      </>
    );
  }
);

BaseCard.displayName = "BaseCard";
