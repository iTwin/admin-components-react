import "./ITwinGrid.scss";
import React from "react";
import { type ITwinTableOverridesMUI, type ITwinFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { type ITwinTilePropsMUI } from "./ITwinTileMUI";
import type { ITwinGridProps, ITwinGridStrings } from "./ITwinGrid";
/** @alpha */
export type IndividualITwinStateHookMUI = (iTwin: ITwinFull, iTwinTileProps: ITwinTilePropsMUI & {
    gridProps: ITwinGridPropsMUI;
}) => Partial<ITwinTilePropsMUI>;
/** @alpha */
export interface ITwinGridStringsMUI extends ITwinGridStrings {
    moreOptions: string;
}
/** @alpha */
export interface ITwinGridPropsMUI extends Omit<ITwinGridProps, "onThumbnailClick" | "iTwinActions" | "tileOverrides" | "useIndividualState" | "cellOverrides" | "tableOverrides" | "stringsOverrides"> {
    /** Select handler for the iTwin tile. */
    onSelect?(iTwin: ITwinFull): void;
    /** Open handler for the iTwin tile. */
    onOpen?(iTwin: ITwinFull): void;
    /** List of actions to build for each iTwin context menu. */
    iTwinActions?: ContextMenuBuilderItemMUI<ITwinFull>[];
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
export declare const ITwinGridMUI: ({ accessToken, apiOverrides, filterOptions, orderbyOptions, onSelect, onOpen, iTwinActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, tableOverrides, className, }: ITwinGridPropsMUI) => React.JSX.Element;
