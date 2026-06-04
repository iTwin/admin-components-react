import React from "react";
import { CellProps } from "react-table";
import { IModelCellColumn, IModelCellOverrides, IModelFull } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
export interface IModelTableStrings {
    /** Displayed for table name header. */
    tableColumnName: string;
    /** Displayed for table description header. */
    tableColumnDescription: string;
    /** Displayed for table last modified date header. */
    tableColumnLastModified: string;
    /** Displayed for table favorites header. */
    tableColumnFavorites: string;
    /** Text for adding an iModel to favorites. */
    addToFavorites: string;
    /** Text for removing an iModel from favorites. */
    removeFromFavorites: string;
}
export interface useIModelTableConfigProps {
    iModelActions: ContextMenuBuilderItem<IModelFull>[] | undefined;
    onThumbnailClick: ((iModel: IModelFull) => void) | undefined;
    strings: IModelTableStrings;
    refetchIModels: () => void;
    cellOverrides?: IModelCellOverrides;
}
export declare const useIModelTableConfig: ({ iModelActions, onThumbnailClick, strings, refetchIModels, cellOverrides, }: useIModelTableConfigProps) => {
    onRowClick: (_: React.MouseEvent, row: any) => void;
    columns: {
        Header: string;
        columns: ({
            id: IModelCellColumn;
            Header: string;
            accessor: string;
            disableSortBy: boolean;
            width: number;
            Cell: (props: CellProps<IModelFull>) => React.JSX.Element;
            maxWidth?: undefined;
        } | {
            id: IModelCellColumn;
            Header: string;
            accessor: string;
            maxWidth: number;
            Cell: (props: CellProps<IModelFull>) => React.JSX.Element;
            disableSortBy?: undefined;
            width?: undefined;
        } | {
            id: IModelCellColumn;
            Header: string;
            accessor: string;
            disableSortBy: boolean;
            Cell: (props: CellProps<IModelFull>) => React.JSX.Element;
            width?: undefined;
            maxWidth?: undefined;
        } | {
            id: IModelCellColumn;
            Header: string;
            accessor: (row: IModelFull) => string;
            maxWidth: number;
            Cell: (props: CellProps<IModelFull>) => React.ReactNode;
            disableSortBy?: undefined;
            width?: undefined;
        } | {
            id: IModelCellColumn;
            disableSortBy: boolean;
            maxWidth: number;
            Cell: (props: CellProps<IModelFull>) => React.JSX.Element | null;
            Header?: undefined;
            accessor?: undefined;
            width?: undefined;
        })[];
    }[];
};
