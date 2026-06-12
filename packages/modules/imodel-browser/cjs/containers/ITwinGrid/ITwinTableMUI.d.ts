import { GRID_DEFAULT_LOCALE_TEXT } from "@mui/x-data-grid";
import React from "react";
import { type ITwinTableOverridesMUI } from "../../mui/types";
import { ITwinFull } from "../../types";
import { type MoreActionsMenuItemMUI, type ResolvedCardActionItem } from "../../utils/_buildMenuOptions";
type MuiDataGridStrings = Pick<typeof GRID_DEFAULT_LOCALE_TEXT, "noRowsLabel" | "noResultsOverlayLabel" | "footerRowSelected" | "footerTotalVisibleRows" | "paginationRowsPerPage">;
export interface ITwinTableMUIStrings extends MuiDataGridStrings {
    tableColumnName: string;
    tableColumnDescription: string;
    tableColumnLastModified: string;
    tableColumnFavorites: string;
    tableLoadingData: string;
    noITwins: string;
    addToFavorites: string;
    removeFromFavorites: string;
    moreOptions: string;
}
export interface ITwinTableMUIProps {
    iTwins: ITwinFull[];
    moreActions?: MoreActionsMenuItemMUI<ITwinFull>[];
    /** Factory that returns per-row actions. The first action drives row click. */
    actions?: (iTwin: ITwinFull) => ResolvedCardActionItem[];
    strings: ITwinTableMUIStrings;
    iTwinFavorites: Set<string>;
    addITwinToFavorites: (iTwinId: string) => Promise<void>;
    removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
    refetchITwins: () => void;
    tableOverrides?: ITwinTableOverridesMUI;
    isLoading?: boolean;
    /** Called when more data should be loaded. */
    fetchMore?: (() => void) | false;
}
/**
 * Table view for iTwins using MUI X DataGrid (Community edition).
 */
export declare const ITwinTableMUI: ({ iTwins, moreActions, actions, strings, iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, refetchITwins, tableOverrides: { columnOverrides, hideColumns, }, isLoading, fetchMore, }: ITwinTableMUIProps) => React.JSX.Element;
export {};
