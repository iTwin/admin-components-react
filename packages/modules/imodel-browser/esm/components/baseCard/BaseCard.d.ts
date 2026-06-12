import { CardProps } from "@mui/material/Card";
import React, { type ReactNode } from "react";
import { type ResolvedCardActionItem } from "../../utils/_buildMenuOptions";
import { type MoreMenuItem } from "../MoreMenuMUI";
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
     * The first action is treated as the primary action: the card title area
     * becomes a clickable {@link CardActionArea} wired to it, mirroring the
     * table's row-click behavior.
     *
     * When more than one action is provided, all actions are additionally
     * rendered as buttons in a {@link CardActions} row below the card content.
     */
    actions?: ResolvedCardActionItem[];
    /**
     * Items rendered in the three-dot context menu in the card header area.
     * When provided, a three-dot icon button appears in the {@link CardHeader} `action` slot
     * and these items are rendered as menu items. The menu is also accessible via right-click on the card header.
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
/**
 * Base card component built on MUI Card.
 *
 * Base card is very customizable. As such, it isn't recommended to use BaseCard directly since
 * design discipline will go out the window.  Prefer to build specific card components for your use case on top of BaseCard.
 *
 * @alpha
 */
export declare const BaseCard: React.ForwardRefExoticComponent<Omit<BaseCardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
