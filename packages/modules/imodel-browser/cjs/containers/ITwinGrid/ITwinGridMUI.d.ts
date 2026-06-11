import React from "react";
import { type ITwinTableOverridesMUI } from "../../mui/types";
import { type ITwinFull } from "../../types";
import { type CardActionsItemMUI, MoreActionsMenuItemMUI } from "../../utils/_buildMenuOptions";
import type { ITwinGridProps, ITwinGridStrings } from "./ITwinGrid";
import { type ITwinTableMUIStrings } from "./ITwinTableMUI";
import { type ITwinTilePropsMUI } from "./ITwinTileMUI";
/** @alpha */
export type IndividualITwinStateHookMUI = (iTwin: ITwinFull, iTwinTileProps: ITwinTilePropsMUI & {
    gridProps: ITwinGridPropsMUI;
}) => Partial<ITwinTilePropsMUI>;
/** @alpha */
export interface ITwinGridStringsMUI extends ITwinGridStrings, ITwinTableMUIStrings {
}
/** @alpha */
export interface ITwinGridPropsMUI extends Omit<ITwinGridProps, "onThumbnailClick" | "iTwinActions" | "tileOverrides" | "useIndividualState" | "cellOverrides" | "tableOverrides" | "stringsOverrides" | "status" | "onOpen"> {
    /**
     * Factory that returns actions for a given iTwin.
     *
     * - **Single action** — the tile title becomes a clickable link; a table row click fires the action.
     * - **Multiple actions** — rendered as buttons in the tile footer; the first action still drives table row click.
     *
     * @example
     * ```tsx
     * actions={[
     *   { key: "open", label: (iTwin) => iTwin.displayName, onClick: (iTwin) => navigate(`/itwins/${iTwin.id}`) },
     * ]}
     * ```
     */
    actions?: CardActionsItemMUI<ITwinFull>[];
    /** List of actions to build for each iTwin context menu. */
    moreActions?: MoreActionsMenuItemMUI<ITwinFull>[];
    /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
    useIndividualState?: IndividualITwinStateHookMUI;
    /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
    tileOverrides?: Partial<ITwinTilePropsMUI>;
    /** Overrides for table column definitions and visibility in cells viewMode */
    tableOverrides?: ITwinTableOverridesMUI;
    /** Localized string overrides - falls back to default English strings if not provided */
    stringsOverrides?: Partial<ITwinGridStringsMUI>;
}
/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 * @alpha
 */
export declare const ITwinGridMUI: ({ accessToken, apiOverrides, filterOptions, orderbyOptions, actions, moreActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, tableOverrides, className, }: ITwinGridPropsMUI) => React.JSX.Element;
