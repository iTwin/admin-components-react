/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";
import { Icon } from "@stratakit/mui";
import React from "react";

export interface ThumbnailIconButtonProps
  extends Pick<
    React.ComponentProps<typeof IconButton>,
    | "onClick"
    | "disabled"
    | "label"
    | "className"
    | "tabIndex"
    | "aria-haspopup"
    | "aria-expanded"
    | "aria-pressed"
    | "aria-label"
  > {
  /**
   * URL of the icon SVG (typically an import from `@stratakit/icons`).
   */
  icon: string;
  muted?: boolean;
  sx?: SxProps<Theme>;
}

// our attempt at making icons that can be overlayed with some contrast on top of thumbnails
const activeBgColor = "var(--stratakit-color-bg-positive-muted)";
const mutedBgColor = "var(--stratakit-color-bg-neutral-muted)";

/**
 * Icon button intended for overlaying on top of a thumbnail image
 * (e.g. favorites, more-options menu).
 * @alpha
 */
export function ThumbnailIconButton(props: ThumbnailIconButtonProps) {
  const { sx, icon, muted, onClick, ...rest } = props;
  const bgcolor = muted ? mutedBgColor : activeBgColor;

  return (
    <IconButton
      {...rest}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      size="small"
      sx={[
        {
          bgcolor,
          "&:hover": {
            bgcolor: activeBgColor,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Icon href={icon} />
    </IconButton>
  );
}
ThumbnailIconButton.displayName = "ThumbnailIconButton";
