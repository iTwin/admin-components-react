import React from "react";
import { CellProps } from "react-table";
import { ITwinCellColumn, ITwinCellOverrides, ITwinFull } from "../../types";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { ITwinGridStrings } from "./ITwinGrid";
export interface useITwinTableConfigProps {
    iTwinActions: ContextMenuBuilderItem<ITwinFull>[] | undefined;
    onThumbnailClick: ((iTwin: ITwinFull) => void) | undefined;
    strings: ITwinGridStrings;
    iTwinFavorites: Set<string>;
    addITwinToFavorites: (iTwinId: string) => Promise<void>;
    removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
    refetchITwins: () => void;
    cellOverrides?: ITwinCellOverrides;
}
export declare const useITwinTableConfig: ({ iTwinActions, onThumbnailClick, strings, iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites, refetchITwins, cellOverrides, }: useITwinTableConfigProps) => {
    onRowClick: (_: React.MouseEvent, row: any) => void;
    columns: {
        Header: string;
        columns: ({
            id: ITwinCellColumn;
            Header: string;
            accessor: string;
            disableSortBy: boolean;
            width: number;
            Cell: (props: CellProps<ITwinFull>) => React.JSX.Element;
            maxWidth?: undefined;
        } | {
            id: ITwinCellColumn;
            Header: string;
            accessor: string;
            maxWidth: number;
            Cell: (props: CellProps<ITwinFull>) => React.JSX.Element;
            disableSortBy?: undefined;
            width?: undefined;
        } | {
            id: ITwinCellColumn;
            Header: string;
            accessor: string;
            Cell: (props: CellProps<ITwinFull>) => React.ReactNode;
            disableSortBy?: undefined;
            width?: undefined;
            maxWidth?: undefined;
        } | {
            id: ITwinCellColumn;
            disableSortBy: boolean;
            maxWidth: number;
            Cell: (props: CellProps<ITwinFull>) => React.JSX.Element | null;
            Header?: undefined;
            accessor?: undefined;
            width?: undefined;
        })[];
    }[];
};
