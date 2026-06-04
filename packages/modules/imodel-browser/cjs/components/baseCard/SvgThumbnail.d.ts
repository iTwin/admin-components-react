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
export declare const SvgThumbnail: React.ForwardRefExoticComponent<SvgThumbnailProps & React.RefAttributes<HTMLImageElement>>;
