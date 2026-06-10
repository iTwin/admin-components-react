import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
export interface SvgThumbnailProps {
    /** SVG image source URL (typically an import from @stratakit/icons). */
    src: string;
    /** Additional sx overrides merged onto the default styles. */
    sx?: SxProps<Theme>;
}
/**
 * SVG icon thumbnail for use in the BaseCard thumbnail area.
 *
 * @alpha
 */
export declare const SvgThumbnail: React.ForwardRefExoticComponent<SvgThumbnailProps & React.RefAttributes<HTMLImageElement>>;
