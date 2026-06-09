/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card, { CardProps } from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import svgMoreVertical from "@stratakit/icons/more-vertical.svg";
import { Icon } from "@stratakit/mui";
import React, { type ReactNode } from "react";

import { spreadSx } from "../../utils/spreadSx";
import MoreMenuMUI, {
  type MoreMenuHandle,
  type MoreMenuItem,
} from "../MoreMenuMUI";
import { BaseCardLoading } from "./BaseCardLoading";
import { BaseCardThumbnailArea } from "./BaseCardThumbnailArea";
import { StatusIcon } from "./StatusIcon";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SvgThumbnail } from "./SvgThumbnail";

/** @deprecated Use `MoreMenuItem` from `../MoreMenu` instead. */
export type BaseCardMoreActionItem = MoreMenuItem;

export interface BaseCardActionItem {
  key: string;
  label: string;
  onClick?: () => void;
  /** When false, the action is excluded. Defaults to true. */
  visible?: boolean;
  disabled?: boolean;
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
   * Optional icon rendered to the left of the entire content area.
   */
  statusIconHref?: string;
  /** Short description rendered below the title. */
  description?: string;
  /**
   * Secondary fineprint content rendered below the description.
   */
  subheader?: string;

  /**
   * Alt text for the thumbnail image when `thumbnail` is a string URL.
   * Defaults to empty string (decorative). Provide a meaningful value
   * when the image conveys information not available in the title.
   */
  thumbnailAlt?: string;

  /**
   * Primary card actions.
   *
   * When a single action is provided, the card title becomes a clickable
   * {@link CardActionArea} wired to that action.
   *
   * When multiple actions are provided, they are rendered as buttons in a
   * {@link CardActions} row below the card content.
   */
  actions?: BaseCardActionItem[];

  /**
   * Items rendered in the three-dot context menu in the card header.
   * When provided, a three-dot icon button appears in the header action slot
   * and these items are rendered as menu items.
   */
  moreActions?: MoreMenuItem[];

  /** Indicates whether the card is in a loading state. */
  loading?: boolean;
  /** Indicates whether the card is disabled. */
  disabled?: boolean;
  /** Status indicator used for styling (divider color, etc.) */
  status?: "positive" | "warning" | "negative" | undefined;

  stringsOverrides?: {
    moreOptions?: string;
  };
}

const baseCardSx = {
  overflow: "hidden",
  minWidth: "18rem",
  minHeight: "15rem",
  display: "flex",
  flexDirection: "column",
};

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

      statusIconHref,
      description,
      subheader,
      thumbnailAlt,
      actions,
      moreActions,
      loading,
      disabled: cardDisabled,
      status,

      stringsOverrides,
      className,
      sx,
      ...rest
    },
    ref
  ) => {
    const titleId = React.useId();

    const thumbnailNode =
      typeof thumbnail === "string" ? (
        <CardMedia
          image={thumbnail}
          role="img"
          aria-label={thumbnailAlt ?? ""}
          sx={{ height: "100%", backgroundSize: "cover" }}
        />
      ) : (
        thumbnail
      );

    const moreMenuRef = React.useRef<MoreMenuHandle>(null);
    const handleContextMenu = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!moreActions?.length) {
          return;
        }

        event.preventDefault();
        moreMenuRef.current?.openAtPosition({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      },
      [moreActions]
    );

    const hasContextMenu = !!moreActions?.length;

    const visibleActions = actions?.filter(({ visible }) => visible ?? true);
    const singleAction =
      visibleActions?.length === 1 ? visibleActions[0] : undefined;
    const multipleActions =
      visibleActions && visibleActions.length > 1 ? visibleActions : undefined;

    if (loading) {
      return (
        <BaseCardLoading
          className={className}
          sx={{ ...baseCardSx, ...spreadSx(sx) }}
        />
      );
    }

    return (
      <>
        <Card
          ref={ref}
          variant="outlined"
          {...rest}
          className={className}
          aria-labelledby={titleId}
          // `inert` is not yet in React 18's DOM typings; spread it in until React 19 types land.
          {...(cardDisabled ? ({ inert: "" } as Record<string, unknown>) : {})}
          onContextMenu={
            !cardDisabled && hasContextMenu ? handleContextMenu : undefined
          }
          sx={[
            {
              ...baseCardSx,
              cursor: cardDisabled ? "not-allowed" : "default",
            },
            ...spreadSx(sx),
          ]}
        >
          {/* ── Thumbnail area ── */}

          <BaseCardThumbnailArea>
            {thumbnailTopLeft && (
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
                {thumbnailTopLeft}
              </Box>
            )}
            {thumbnailTopRight && (
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
          </BaseCardThumbnailArea>

          <Divider
            role="presentation"
            sx={{
              borderColor:
                status === "positive"
                  ? "var(--stratakit-color-border-positive-base)"
                  : status === "warning"
                  ? "var(--stratakit-color-border-attention-base)"
                  : status === "negative"
                  ? "var(--stratakit-color-border-critical-base)"
                  : undefined,
            }}
          />

          <CardHeader
            avatar={
              statusIconHref ? (
                <StatusIcon href={statusIconHref} status={status} />
              ) : undefined
            }
            title={
              singleAction ? (
                <CardActionArea
                  onClick={
                    !cardDisabled && !singleAction.disabled
                      ? singleAction.onClick
                      : undefined
                  }
                  disabled={cardDisabled ? true : singleAction.disabled}
                >
                  {title}
                </CardActionArea>
              ) : (
                title
              )
            }
            action={
              hasContextMenu && !cardDisabled ? (
                <MoreMenuMUI
                  ref={moreMenuRef}
                  items={moreActions!}
                  label={stringsOverrides?.moreOptions ?? "More options"}
                  prompt={<Icon href={svgMoreVertical} />}
                  data-testid="show-context-menu-button"
                />
              ) : undefined
            }
            subheader={subheader}
            sx={[{ alignItems: "flex-start" }]}
            slotProps={{
              title: {
                component: "h2",
                id: titleId,
                sx: [
                  {
                    flex: 1,
                    minWidth: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  },
                ],
              },
              subheader: {
                component: "h3",
              },
            }}
          />

          {description ? (
            <CardContent data-testid="card-description">
              <Typography variant="body2" color="textSecondary">
                {description}
              </Typography>
            </CardContent>
          ) : (
            <CardContent sx={{ pt: 0 }} />
          )}

          {multipleActions && (
            <CardActions>
              {multipleActions.map(({ key, label, onClick, disabled }) => (
                <Button
                  key={key}
                  onClick={onClick}
                  disabled={cardDisabled ? true : disabled}
                >
                  {label}
                </Button>
              ))}
            </CardActions>
          )}
        </Card>
      </>
    );
  }
);

BaseCard.displayName = "BaseCard";
