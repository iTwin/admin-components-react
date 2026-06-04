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
import React, { type ReactNode } from "react";
import svgMoreVertical from "@stratakit/icons/more-vertical.svg";
import { BaseCardLoading } from "./BaseCardLoading";
import { ThumbnailIconButton } from "./ThumbnailIconButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SvgThumbnail } from "./SvgThumbnail";

/** Flatten an optional SxProps value into spreadable array elements. */
const spreadSx = (sx: SxProps<Theme> | undefined) =>
  Array.isArray(sx) ? sx : sx ? [sx] : [];

interface BaseCardSlotStyleProps {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface BaseCardSlotProps {
  thumbnail?: BaseCardSlotStyleProps;
  divider?: BaseCardSlotStyleProps;
  content?: BaseCardSlotStyleProps;
  header?: BaseCardSlotStyleProps;
  title?: BaseCardSlotStyleProps;
  info?: BaseCardSlotStyleProps;
  actions?: BaseCardSlotStyleProps;
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
   * Main thumbnail content.
   *
   * When a string URL is provided, BaseCard renders an image with default cover styling.
   *
   * To use a Stratakit SVG as a thumbnail, pass an {@link SvgThumbnail} to get proper styling and layout.
   *
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
 * design discipline will go out the window.  Prefer to build specific card components for your use case on top of BaseCard.
 *
 * @alpha
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
        className="BaseCard-cardActions"
        sx={[
          {
            position: "absolute",
            opacity: 0,
            transition: "opacity 0.25s ease-out",
          },
          ...spreadSx(slotProps?.actions?.sx),
        ]}
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
          className={className}
          sx={[
            {
              overflow: "hidden",
              minWidth: "18rem",
              minHeight: "15rem",
              display: "flex",
              flexDirection: "column",
              userSelect: "none",
            },
            ...spreadSx(sx),
          ]}
        />
      );
    }

    return (
      <>
        <Card
          ref={ref}
          variant="outlined"
          className={className}
          sx={[
            {
              overflow: "hidden",
              minWidth: "18rem",
              minHeight: "15rem",
              display: "flex",
              flexDirection: "column",
              userSelect: "none",
              cursor: cardDisabled ? "not-allowed" : "default",
              ...(selected && {
                outline: "2px solid",
                outlineColor: "var(--stratakit-color-border-accent-strong)",
              }),
              "&:hover .BaseCard-cardActions, &:focus-within .BaseCard-cardActions":
                {
                  opacity: 1,
                },
            },
            ...spreadSx(sx),
          ]}
          {...rest}
          onClick={!cardDisabled ? onClick : undefined}
          onContextMenu={
            !cardDisabled && hasContextMenu ? handleContextMenu : undefined
          }
          onDoubleClick={!cardDisabled ? onDoubleClick : undefined}
        >
          {/* ── Thumbnail area ── */}

          <Box
            className={slotProps?.thumbnail?.className}
            sx={[
              {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                aspectRatio: "16 / 10",
                backgroundColor: "var(--stratakit-mui-palette-action-hover)",
                overflow: "hidden",
                flexShrink: 0,
                "& > img, & > video": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                },
              },
              ...spreadSx(slotProps?.thumbnail?.sx),
            ]}
          >
            {thumbnailTopLeft && (
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
                {thumbnailTopLeft}
              </Box>
            )}
            {(thumbnailTopRight ?? hasContextMenu) && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  display: "flex",
                  gap: "4px",
                }}
              >
                {thumbnailTopRight}
                {hasContextMenu && !cardDisabled && (
                  <ThumbnailIconButton
                    aria-label="More options"
                    onClick={handleMoreButtonClick}
                    icon={svgMoreVertical}
                  />
                )}
              </Box>
            )}
            {thumbnailNode}
            {thumbnailBottomLeft && (
              <Box sx={{ position: "absolute", bottom: 8, left: 8, zIndex: 1 }}>
                {thumbnailBottomLeft}
              </Box>
            )}
            {thumbnailBottomRight && (
              <Box
                sx={{ position: "absolute", bottom: 8, right: 8, zIndex: 1 }}
              >
                {thumbnailBottomRight}
              </Box>
            )}
            {actionButtons}
          </Box>

          <Divider
            className={slotProps?.divider?.className}
            sx={[
              {
                borderColor:
                  status === "positive"
                    ? "success.main"
                    : status === "warning"
                    ? "warning.main"
                    : status === "negative"
                    ? "error.main"
                    : undefined,
              },
              ...spreadSx(slotProps?.divider?.sx),
            ]}
          />

          {/* ── Content area ── */}
          <Stack
            direction="row"
            spacing={1}
            className={slotProps?.content?.className}
            sx={[
              {
                p: 2,
                pt: 1.5,
                alignItems: "flex-start",
              },
              ...spreadSx(slotProps?.content?.sx),
            ]}
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
                sx={[
                  {
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  },
                  ...spreadSx(slotProps?.header?.sx),
                ]}
              >
                <Typography
                  variant="body1"
                  component="p"
                  className={slotProps?.title?.className}
                  sx={[
                    {
                      flex: 1,
                      minWidth: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    ...spreadSx(slotProps?.title?.sx),
                  ]}
                >
                  {title}
                </Typography>
                {headerRight && <Box sx={{ flexShrink: 0 }}>{headerRight}</Box>}
              </Stack>

              {/* Info: description + additionalDescription */}
              <Stack
                spacing={0.25}
                className={slotProps?.info?.className}
                sx={slotProps?.info?.sx}
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
