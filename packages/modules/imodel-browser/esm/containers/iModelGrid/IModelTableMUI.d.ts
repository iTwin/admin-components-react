import { GRID_DEFAULT_LOCALE_TEXT } from "@mui/x-data-grid";
import React from "react";
import { type IModelTableOverridesMUI, type IModelFull } from "../../types";
import { ContextMenuBuilderItemMUI } from "../../utils/_buildMenuOptions";
type MuiDataGridStrings = Pick<typeof GRID_DEFAULT_LOCALE_TEXT, "noRowsLabel" | "noResultsOverlayLabel" | "footerRowSelected" | "footerTotalVisibleRows" | "paginationRowsPerPage">;
export interface IModelTableMUIStrings extends MuiDataGridStrings {
    tableColumnName: string;
    tableColumnDescription: string;
    tableColumnLastModified: string;
    tableColumnFavorites: string;
    tableLoadingData: string;
    noIModelSearch: string;
    addToFavorites: string;
    removeFromFavorites: string;
    moreOptions: string;
}
export interface IModelTableMUIProps {
    iModels: IModelFull[];
    iModelActions?: ContextMenuBuilderItemMUI<IModelFull>[];
    onOpen?: (iModel: IModelFull) => void;
    strings: IModelTableMUIStrings;
    refetchIModels: () => void;
    tableOverrides?: IModelTableOverridesMUI;
    isLoading?: boolean;
    /** Called when more data should be loaded. */
    fetchMore?: (() => void) | false;
}
/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
export declare const IModelTableMUI: ({ iModels, iModelActions, onOpen, strings, refetchIModels, tableOverrides: { columnOverrides, hideColumns }, isLoading, fetchMore, }: IModelTableMUIProps) => React.JSX.Element;
export {};
