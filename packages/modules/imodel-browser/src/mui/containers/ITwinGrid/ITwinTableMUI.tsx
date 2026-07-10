/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DataGrid,
  GRID_DEFAULT_LOCALE_TEXT,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";
import svgMore from "@stratakit/icons/more-vertical.svg";
import { Icon } from "@stratakit/mui";
import React from "react";

import { ITwinCellColumn, ITwinFull } from "../../../types";
import {
  type MoreActionsMenuItemMUI,
  type ResolvedCardActionItem,
  getPrimaryCardAction,
  resolveMoreActionsMenuItemsMUI,
} from "../../../utils/_buildMenuOptions";
import { formatDate } from "../../../utils/formatDate";
import MoreMenuMUI from "../../components/MoreMenuMUI";
import { FavoriteIconMUI } from "../../components/tileFavoriteIcon/FavoriteIconMUI";
import { type ITwinTableOverridesMUI } from "../../types";

const EMPTY_COLUMN_OVERRIDES: NonNullable<
  ITwinTableOverridesMUI["columnOverrides"]
> = {};
const EMPTY_HIDE_COLUMNS: NonNullable<ITwinTableOverridesMUI["hideColumns"]> =
  [];

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
  /**
   * When true, the sort state is persisted to `localStorage` so it is restored
   * on subsequent mounts.
   */
  preserveSortState?: boolean;
  /**
   * `localStorage` key used to persist the sort state when `preserveSortState`
   * is true.
   * @default "itwin-table-sort-model"
   */
  sortStateStorageKey?: string;
}

const DEFAULT_SORT_STATE_STORAGE_KEY = "itwin-table-sort-model";

const readPersistedSortModel = (storageKey: string): GridSortModel => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GridSortModel) : [];
  } catch {
    return [];
  }
};

const writePersistedSortModel = (
  storageKey: string,
  sortModel: GridSortModel
) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(sortModel));
  } catch {
    console.warn(
      `Failed to persist sort model to localStorage under key "${storageKey}".`
    );
  }
};

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
  tableOverrides: {
    columnOverrides = EMPTY_COLUMN_OVERRIDES,
    hideColumns = EMPTY_HIDE_COLUMNS,
  } = {},
  isLoading,
  fetchMore,
  preserveSortState,
  sortStateStorageKey = DEFAULT_SORT_STATE_STORAGE_KEY,
}: ITwinTableMUIProps) => {
  // Eagerly load all available data so the table has the full dataset
  // for client-side pagination and sorting.
  React.useEffect(() => {
    if (fetchMore) {
      fetchMore();
    }
  }, [fetchMore]);

  // Internal sort state, seeded from localStorage when persistence is enabled.
  const [internalSortModel, setInternalSortModel] =
    React.useState<GridSortModel>(() =>
      preserveSortState ? readPersistedSortModel(sortStateStorageKey) : []
    );

  const handleSortModelChange = React.useCallback(
    (newSortModel: GridSortModel) => {
      setInternalSortModel(newSortModel);
      writePersistedSortModel(sortStateStorageKey, newSortModel);
    },
    [sortStateStorageKey]
  );
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
            <FavoriteIconMUI
              isFavorite={isFavorite}
              addLabel={strings.addToFavorites}
              removeLabel={strings.removeFromFavorites}
              onAddToFavorites={() => addITwinToFavorites(params.value)}
              onRemoveFromFavorites={() =>
                removeITwinFromFavorites(params.value)
              }
              transparent
              tabIndex={params.tabIndex}
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
        valueFormatter: (value: string) => formatDate(value),
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
          const items = resolveMoreActionsMenuItemsMUI(
            moreActions,
            params.row,
            refetchITwins
          );
          return (
            <MoreMenuMUI
              items={items}
              prompt={<Icon href={svgMore} />}
              label={strings.moreOptions}
              tabIndex={params.tabIndex}
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
      sortModel={preserveSortState ? internalSortModel : undefined}
      onSortModelChange={preserveSortState ? handleSortModelChange : undefined}
      onRowClick={
        actions
          ? (params) => {
              const action = getPrimaryCardAction(actions(params.row));
              if (action && !action.disabled) {
                action.onClick?.();
              }
            }
          : undefined
      }
      onCellKeyDown={
        actions
          ? (params, event) => {
              if (
                (event.key === "Enter" || event.key === " ") &&
                params.field !== "id" &&
                params.field !== "actions"
              ) {
                const action = getPrimaryCardAction(actions(params.row));
                if (action && !action.disabled) {
                  event.preventDefault();
                  action.onClick?.();
                }
              }
            }
          : undefined
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
        "& .MuiDataGrid-cell:focus:not(:focus-visible)": {
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
        "& .MuiDataGrid-row.row-disabled": {
          cursor: "default",
          color: "var(--stratakit-color-text-neutral-disabled)",
        },
      }}
      getRowClassName={
        actions
          ? (params) =>
              getPrimaryCardAction(actions(params.row))?.disabled
                ? "row-disabled"
                : ""
          : undefined
      }
    />
  );
};
