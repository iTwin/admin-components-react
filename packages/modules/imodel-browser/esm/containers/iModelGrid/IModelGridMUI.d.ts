import React from "react";
import { type IModelTableOverridesMUI } from "../../mui/types";
import { type IModelFull } from "../../types";
import { type CardActionsItemMUI, MoreActionsMenuItemMUI } from "../../utils/_buildMenuOptions";
import { type IModelTileMUIProps } from "../iModelTiles/IModelTileMUI";
import type { IModelGridProps } from "./IModelGrid";
import { type IModelTableMUIStrings } from "./IModelTableMUI";
/**
 * Localized strings for the MUI IModelGrid. Extends the table-level strings
 * with the grid-level messages used for empty, error, and authentication states.
 * @alpha
 */
export interface IModelGridStringsMUI extends IModelTableMUIStrings {
    /** Displayed after successful fetch, but no iModels are returned. */
    noIModels: string;
    /** Displayed when the component is mounted and there is no iTwin or asset Id. */
    noContext: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication: string;
    /** Generic message displayed if an error occurs while fetching. */
    error: string;
    /** Displayed after successful fetch search, but no iModel is returned, along with noIModelSearch text. */
    noIModelSearchSubtext: string;
    /** Displayed in context menu for removing iModel from recents. */
    removeFromRecents: string;
}
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
    actions?: CardActionsItemMUI<IModelFull>[];
    /** List of actions to build for each imodel context menu. */
    moreActions?: MoreActionsMenuItemMUI<IModelFull>[];
    /** Custom icon for the "Remove from recents" context menu action. Only applies when requestType is "recents". Should be a Stratakit SVG href. */
    removeFromRecentsIcon?: string;
    useIndividualState?: (iModel: IModelFull, iModelTileProps: IModelTileMUIProps) => Partial<IModelTileMUIProps>;
    /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
    tileOverrides?: Partial<IModelTileMUIProps>;
    tableOverrides?: IModelTableOverridesMUI;
    stringsOverrides?: Partial<IModelGridStringsMUI>;
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
