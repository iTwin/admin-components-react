import React from "react";
import { type IModelFull, type IModelTableOverridesMUI } from "../../types";
import { type ActionsBuilderItemMUI, MoreActionsMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
import { type IModelTileMUIProps } from "../iModelTiles/IModelTileMUI";
import type { IModelGridProps } from "./IModelGrid";
import { type IModelTableMUIStrings } from "./IModelTableMUI";
/** @alpha */
export interface IModelGridMUIProps extends Omit<IModelGridProps, "onThumbnailClick" | "iModelActions" | "useIndividualState" | "tileOverrides" | "cellOverrides" | "tableOverrides" | "status" | "removeFromRecentsIcon" | "onOpen"> {
    /**
     * Factory that returns actions for a given iModel.
     *
     * - **Single action** — the tile title becomes a clickable link; a table row click fires the action.
     * - **Multiple actions** — rendered as buttons in the tile footer; the first action still drives table row click.
     *
     * The grid automatically wraps the first action with recents tracking
     * unless `disableAddToRecents` is true.
     *
     * @example
     * ```tsx
     * actions={[
     *   { key: "open", label: (iModel) => iModel.displayName, onClick: (iModel) => navigate(`/imodels/${iModel.id}`) },
     * ]}
     * ```
     */
    actions?: ActionsBuilderItemMUI<IModelFull>[];
    /** List of actions to build for each imodel context menu. */
    moreActions?: MoreActionsMenuBuilderItemMUI<IModelFull>[];
    /** Custom icon for the "Remove from recents" context menu action. Only applies when requestType is "recents". Should be a Stratakit SVG href. */
    removeFromRecentsIcon?: string;
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
