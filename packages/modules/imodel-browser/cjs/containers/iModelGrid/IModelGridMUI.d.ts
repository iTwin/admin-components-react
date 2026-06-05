import React from "react";
import { type IModelTableOverridesMUI, type IModelFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { type IModelTableMUIStrings } from "./IModelTableMUI";
import { type IModelTileMUIProps } from "../iModelTiles/IModelTileMUI";
import type { IModelGridProps } from "./IModelGrid";
/** @alpha */
export interface IModelGridMUIProps extends Omit<IModelGridProps, "onThumbnailClick" | "iModelActions" | "useIndividualState" | "tileOverrides" | "cellOverrides" | "tableOverrides"> {
    /** Open handler. Adds iModel to recents when clicked unless disableAddToRecents is true. */
    onOpen?: IModelTileMUIProps["onOpen"];
    onSelect?: IModelTileMUIProps["onSelect"];
    /** List of actions to build for each imodel context menu. */
    iModelActions?: ContextMenuBuilderItemMUI<IModelFull>[];
    /** Custom icon for the "Remove from recents" context menu action. Only applies when requestType is "recents". Should be a Stratakit Icon component */
    removeFromRecentsIcon?: JSX.Element;
    useIndividualState?: (iModel: IModelFull, iModelTileProps: IModelTileMUIProps) => Partial<IModelTileMUIProps>;
    /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
    tileOverrides?: Partial<IModelTileMUIProps>;
    tableOverrides?: IModelTableOverridesMUI;
    stringsOverrides?: Partial<IModelTableMUIStrings>;
}
/**
 * Component to display a grid or table of iModels within a given iTwin.
 *
 * This is the Stratakit/MUI version of the IModelGrid. It is still under active development and may have breaking changes.
 *
 * Feedback is most welcome.
 * @alpha
 */
export declare const IModelGridMUI: (props: IModelGridMUIProps) => React.JSX.Element;
