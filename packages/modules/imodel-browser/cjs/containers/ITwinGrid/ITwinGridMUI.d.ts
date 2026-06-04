import "./ITwinGrid.scss";
import React from "react";
import { type ITwinTableOverridesMUI, type ITwinFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { type ITwinTileMUIProps } from "./ITwinTileMUI";
import type { ITwinGridProps, ITwinGridStrings } from "./ITwinGrid";
/** @alpha */
export type IndividualITwinStateHookMUI = (iTwin: ITwinFull, iTwinTileProps: ITwinTileMUIProps & {
    gridProps: ITwinGridMUIProps;
}) => Partial<ITwinTileMUIProps>;
/** @alpha */
export { ITwinGridStrings };
/** @alpha */
export interface ITwinGridMUIProps extends Omit<ITwinGridProps, "onThumbnailClick" | "iTwinActions" | "tileOverrides" | "useIndividualState" | "cellOverrides" | "tableOverrides"> {
    /** Select handler for the iTwin tile. */
    onSelect?(iTwin: ITwinFull): void;
    /** Open handler for the iTwin tile. */
    onOpen?(iTwin: ITwinFull): void;
    /** List of actions to build for each iTwin context menu. */
    iTwinActions?: ContextMenuBuilderItemMUI<ITwinFull>[];
    /** Function (can be a react hook) that returns state for an iTwin, returned values will be applied as props to the iTwinTile, overrides ITwinGrid provided values */
    useIndividualState?: IndividualITwinStateHookMUI;
    /** Static props to apply over each tile, mainly used for tileProps, overrides ITwinGrid provided values */
    tileOverrides?: Partial<ITwinTileMUIProps>;
    /** Overrides for table column definitions and visibility in cells viewMode */
    tableOverrides?: ITwinTableOverridesMUI;
}
/**
 * Component that will allow displaying a grid of iTwins, given a requestType
 * @alpha
 */
export declare const ITwinGridMUI: ({ accessToken, apiOverrides, filterOptions, orderbyOptions, onSelect, onOpen, iTwinActions, requestType, iTwinSubClass, stringsOverrides, tileOverrides, useIndividualState, postProcessCallback, viewMode, tableOverrides, className, }: ITwinGridMUIProps) => React.JSX.Element;
