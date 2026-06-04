/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import CardMedia from "@mui/material/CardMedia";
import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";

export interface SvgThumbnailProps {
  /** SVG image source URL (typically an import from @stratakit/icons). */
  src: string;
  /** Additional sx overrides merged onto the default styles. */
  sx?: SxProps<Theme>;
}

/**
 * Theme-aware SVG icon thumbnail for use inside BaseCard.
 *
 * Unlike photo thumbnails which fill the container with `objectFit: cover`,
 * this component renders the SVG at a contained size and adjusts its
 * brightness for light/dark mode via a CSS filter.
 *
 * @alpha
 */
export const SvgThumbnail = React.forwardRef<
  HTMLImageElement,
  SvgThumbnailProps
>(({ src, sx: sxOverride }, ref) => {
  return (
    <CardMedia
      component="img"
      src={src}
      ref={ref}
      sx={[
        (theme) => ({
          objectFit: "contain",
          width: "40%",
          height: "40%",
          filter: "invert(80%)",
          ...theme.applyStyles("dark", {
            filter: "invert(30%)",
          }),
        }),
        ...(Array.isArray(sxOverride)
          ? sxOverride
          : sxOverride
          ? [sxOverride]
          : []),
      ]}
    />
  );
});

SvgThumbnail.displayName = "SvgThumbnail";
