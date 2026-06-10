import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
export interface ThumbnailIconButtonProps extends Pick<React.ComponentProps<typeof IconButton>, "onClick" | "disabled" | "className" | "tabIndex" | "aria-haspopup" | "aria-expanded" | "aria-pressed" | "aria-label" | "onMouseEnter" | "onMouseLeave"> {
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
export declare function ThumbnailIconButton(props: ThumbnailIconButtonProps): React.JSX.Element;
export declare namespace ThumbnailIconButton {
    var displayName: string;
}
