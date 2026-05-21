/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgMore from "@stratakit/icons/more-vertical.svg";
import { Icon } from "@stratakit/mui";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import React from "react";

import { useIModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import {
  IModelCellColumn,
  type IModelTableOverridesMUI,
  type IModelFull,
} from "../../types";
import MoreMenu from "../../components/MoreMenu";
import {
  buildContextMenuItemsMUI,
  ContextMenuBuilderItemMUI,
} from "../../utils/_buildMenuOptions";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";

export interface IModelTableMUIStrings {
  tableColumnName: string;
  tableColumnDescription: string;
  tableColumnLastModified: string;
  tableColumnFavorites: string;
  tableLoadingData: string;
  noIModelSearch: string;
  addToFavorites: string;
  removeFromFavorites: string;
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

// TODO: investigate infinite scroll as an alternative to built-in pagination
// MUI X DataGrid Pro supports onRowsScrollEnd, but the free version does not.

/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
export const IModelTableMUI = ({
  iModels,
  iModelActions,
  onOpen,
  strings,
  refetchIModels,
  tableOverrides: { columnOverrides = {}, hideColumns = [] } = {},
  isLoading,
  fetchMore,
}: IModelTableMUIProps) => {
  const favoritesContext = useIModelFavoritesContext();

  const columns = React.useMemo<GridColDef<IModelFull>[]>(() => {
    const cols: (GridColDef<IModelFull> | false)[] = [
      !hideColumns.includes(IModelCellColumn.Favorite) && {
        field: "id",
        headerName: strings.tableColumnFavorites,
        sortable: false,
        width: 70,
        disableColumnMenu: true,
        renderCell: (params) => {
          const isFavorite = favoritesContext?.favorites.has(params.value);
          return (
            <TileFavoriteIconMUI
              isFavorite={!!isFavorite}
              addLabel={strings.addToFavorites}
              removeLabel={strings.removeFromFavorites}
              onAddToFavorites={() => favoritesContext?.add?.(params.value)}
              onRemoveFromFavorites={() =>
                favoritesContext?.remove?.(params.value)
              }
              sx={{ bgcolor: "transparent" }}
            />
          );
        },
        ...columnOverrides[IModelCellColumn.Favorite],
      },
      !hideColumns.includes(IModelCellColumn.Name) && {
        field: "name",
        headerName: strings.tableColumnName,
        flex: 1,
        minWidth: 200,
        disableColumnMenu: true,
        ...columnOverrides[IModelCellColumn.Name],
      },
      !hideColumns.includes(IModelCellColumn.Description) && {
        field: "description",
        headerName: strings.tableColumnDescription,
        flex: 1,
        minWidth: 200,
        sortable: false,
        disableColumnMenu: true,
        ...columnOverrides[IModelCellColumn.Description],
      },
      !hideColumns.includes(IModelCellColumn.LastModified) &&
        !hideColumns.includes(IModelCellColumn.CreatedDateTime) && {
          field: "lastChangesetPushDateTime",
          headerName: strings.tableColumnLastModified,
          width: 200,
          valueGetter: (value: string | null | undefined, row: IModelFull) =>
            row.lastChangesetPushDateTime ?? row.createdDateTime ?? "",
          valueFormatter: (value: string) => {
            if (!value) return "";
            return new Date(value).toLocaleDateString();
          },
          disableColumnMenu: true,
          ...columnOverrides[IModelCellColumn.LastModified],
        },
      !hideColumns.includes(IModelCellColumn.Options) && {
        field: "actions",
        headerName: "",
        sortable: false,
        width: 50,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!iModelActions || iModelActions.length === 0) return null;
          const moreOptions = (close: () => void) => {
            const options = buildContextMenuItemsMUI(
              iModelActions,
              params.row,
              close,
              refetchIModels
            );
            return options ?? [];
          };
          return (
            <MoreMenu
              menuItems={moreOptions}
              data-testid={`iModel-row-${params.row.id}-more-options`}
              prompt={<Icon href={svgMore} />}
            />
          );
        },
        ...columnOverrides[IModelCellColumn.Options],
      },
    ];

    return cols.filter(Boolean) as GridColDef<IModelFull>[];
  }, [
    strings,
    favoritesContext,
    columnOverrides,
    hideColumns,
    iModelActions,
    refetchIModels,
  ]);

  const handleRowClick = React.useCallback(
    (params: GridRowParams<IModelFull>) => {
      onOpen?.(params.row);
    },
    [onOpen]
  );

  return (
    <DataGrid<IModelFull>
      rows={iModels}
      columns={columns}
      loading={isLoading}
      onRowClick={onOpen ? handleRowClick : undefined}
      disableRowSelectionOnClick
      disableMultipleRowSelection
      disableColumnSelector
      disableColumnFilter
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      pageSizeOptions={[25, 50, 100]}
      localeText={{
        noRowsLabel: strings.noIModelSearch,
        noResultsOverlayLabel: strings.noIModelSearch,
      }}
      sx={{
        // prevent individual cells from showing focus outlines
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-cell:focus-within": {
          outline: "none",
        },
        ...(onOpen && {
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }),
      }}
    />
  );
};
