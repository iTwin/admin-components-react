/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";
import { Icon } from "@stratakit/mui";
import React from "react";

const spreadSx = (sx: SxProps<Theme> | undefined) =>
  Array.isArray(sx) ? sx : sx ? [sx] : [];

export interface ThumbnailIconButtonProps
  extends Pick<
    React.ComponentProps<typeof IconButton>,
    "onClick" | "disabled" | "aria-label" | "className"
  > {
  /**
   * URL of the icon SVG (typically an import from `@stratakit/icons`).
   */
  icon: string;
  muted?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Icon button intended for overlaying on top of a thumbnail image
 * (e.g. favorites, more-options menu).
 * @alpha
 */
export function ThumbnailIconButton(props: ThumbnailIconButtonProps) {
  const { sx, icon, muted, onClick, ...rest } = props;
  return (
    <IconButton
      {...rest}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      size="small"
      sx={[
        (theme) => ({
          bgcolor: muted ? theme.palette.grey[300] : theme.palette.grey[400],
          "&:hover": {
            bgcolor: theme.palette.grey[500],
          },
          "&:focus-visible": {
            bgcolor: theme.palette.grey[500],
          },
          "&& .🥝Icon": {
            "--🥝Icon-color": muted
              ? theme.palette.grey[50]
              : theme.palette.common.white,
          },
        }),
        ...spreadSx(sx),
      ]}
    >
      <Icon href={icon} size="regular" />
    </IconButton>
  );
}
ThumbnailIconButton.displayName = "ThumbnailIconButton";
