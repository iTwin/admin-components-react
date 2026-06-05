import { CardProps } from "@mui/material/Card";
import type { SxProps, Theme } from "@mui/material/styles";
import React, { type ReactNode } from "react";
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
export interface BaseCardProps extends Omit<CardProps, "children" | "title" | "onClick" | "onSelect"> {
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
    /** Primary title of the card. */
    title: string;
    /**
     * Optional slot to the right of the title in the header row
     * (e.g. status chip, icon button, AvatarGroup).
     */
    headerRight?: ReactNode;
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
    stringsOverrides?: {
        moreOptions?: string;
    };
}
/**
 * Base card component built on MUI Card.
 *
 * Base card is very customizable. As such, it isn't recommended to use BaseCard directly since
 * design discipline will go out the window.  Prefer to build specific card components for your use case on top of BaseCard.
 *
 * @alpha
 */
export declare const BaseCard: React.ForwardRefExoticComponent<Omit<BaseCardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export {};
