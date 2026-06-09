/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DataGrid,
  GRID_DEFAULT_LOCALE_TEXT,
  GridColDef,
} from "@mui/x-data-grid";
import svgMore from "@stratakit/icons/more-vertical.svg";
import { Icon } from "@stratakit/mui";
import React from "react";

import { type BaseCardActionItem } from "../../components/baseCard/BaseCard";
import MoreMenuMUI from "../../components/MoreMenuMUI";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";
import {
  type ITwinTableOverridesMUI,
  ITwinCellColumn,
  ITwinFull,
} from "../../types";
import {
  ContextMenuBuilderItemMUI,
  resolveContextMenuItemsMUI,
} from "../../utils/_buildMenuOptions";

// strings from data grid that we need to override in addition to our custom strings
type MuiDataGridStrings = Pick<
  typeof GRID_DEFAULT_LOCALE_TEXT,
  | "noRowsLabel"
  | "noResultsOverlayLabel"
  | "footerRowSelected"
  | "footerTotalVisibleRows"
  | "paginationRowsPerPage"
>;

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
  moreActions?: ContextMenuBuilderItemMUI<ITwinFull>[];
  /** Factory that returns per-row actions. The first action drives row click. */
  actions?: (iTwin: ITwinFull) => BaseCardActionItem[];
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

// TODO: investigate infinite scroll as an alternative to built-in pagination
// MUI X DataGrid Pro supports onRowsScrollEnd, but the free version does not.

/**
 * Table view for iTwins using MUI X DataGrid (Community edition).
 */
export const ITwinTableMUI = ({
  iTwins,
  moreActions,
  actions,
  strings,
  iTwinFavorites,
  addITwinToFavorites,
  removeITwinFromFavorites,
  refetchITwins,
  tableOverrides: { columnOverrides = {}, hideColumns = [] } = {},
  isLoading,
  fetchMore,
}: ITwinTableMUIProps) => {
  const columns = React.useMemo<GridColDef<ITwinFull>[]>(() => {
    const cols: (GridColDef<ITwinFull> | false)[] = [
      !hideColumns.includes(ITwinCellColumn.Favorite) && {
        field: "id",
        headerName: strings.tableColumnFavorites,
        sortable: false,
        width: 70,
        disableColumnMenu: true,
        renderCell: (params) => {
          const isFavorite = iTwinFavorites.has(params.value);
          return (
            <TileFavoriteIconMUI
              isFavorite={isFavorite}
              addLabel={strings.addToFavorites}
              removeLabel={strings.removeFromFavorites}
              onAddToFavorites={() => addITwinToFavorites(params.value)}
              onRemoveFromFavorites={() =>
                removeITwinFromFavorites(params.value)
              }
              transparent
            />
          );
        },
        ...columnOverrides[ITwinCellColumn.Favorite],
      },
      !hideColumns.includes(ITwinCellColumn.Number) && {
        field: "number",
        headerName: strings.tableColumnName,
        flex: 1,
        minWidth: 200,
        disableColumnMenu: true,
        ...columnOverrides[ITwinCellColumn.Number],
      },
      !hideColumns.includes(ITwinCellColumn.Name) && {
        field: "displayName",
        headerName: strings.tableColumnDescription,
        flex: 1,
        minWidth: 200,
        disableColumnMenu: true,
        ...columnOverrides[ITwinCellColumn.Name],
      },
      !hideColumns.includes(ITwinCellColumn.LastModified) && {
        field: "lastModifiedDateTime",
        headerName: strings.tableColumnLastModified,
        width: 200,
        disableColumnMenu: true,
        valueFormatter: (value: string) => {
          if (!value) {
            return "";
          }
          return new Date(value).toLocaleDateString();
        },
        ...columnOverrides[ITwinCellColumn.LastModified],
      },
      !hideColumns.includes(ITwinCellColumn.Options) && {
        field: "actions",
        headerName: "",
        sortable: false,
        width: 65,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!moreActions || moreActions.length === 0) {
            return null;
          }
          const items = resolveContextMenuItemsMUI(
            moreActions,
            params.row,
            refetchITwins
          );
          return (
            <MoreMenuMUI
              items={items}
              data-testid={`iTwin-row-${params.row.id}-more-options`}
              prompt={<Icon href={svgMore} />}
              label={strings.moreOptions}
            />
          );
        },
        ...columnOverrides[ITwinCellColumn.Options],
      },
    ];

    return cols.filter(Boolean) as GridColDef<ITwinFull>[];
  }, [
    strings,
    iTwinFavorites,
    addITwinToFavorites,
    removeITwinFromFavorites,
    columnOverrides,
    hideColumns,
    moreActions,
    refetchITwins,
  ]);

  return (
    <DataGrid<ITwinFull>
      rows={iTwins}
      columns={columns}
      loading={isLoading}
      onRowClick={
        actions ? (params) => actions(params.row)[0]?.onClick?.() : undefined
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      disableColumnSelector
      disableColumnFilter
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      pageSizeOptions={[25, 50, 100]}
      localeText={{
        noRowsLabel: strings.noRowsLabel,
        noResultsOverlayLabel: strings.noResultsOverlayLabel,
        footerRowSelected: strings.footerRowSelected,
        footerTotalVisibleRows: strings.footerTotalVisibleRows,
        paginationRowsPerPage: strings.paginationRowsPerPage,
      }}
      sx={{
        // prevent individual cells from showing focus outlines
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },

        "& .MuiDataGrid-cell:focus-within": {
          outline: "none",
        },
        // reveal unfavorited icon on row hover or keyboard focus
        "& .MuiDataGrid-row:hover .favoriteIcon, & .MuiDataGrid-row:focus-within .favoriteIcon":
          {
            opacity: 1,
          },
        ...(actions && {
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }),
      }}
    />
  );
};
