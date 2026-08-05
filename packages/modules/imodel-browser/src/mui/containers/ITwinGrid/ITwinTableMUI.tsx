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
import {
  type ITwinSortOptionsMUI,
  type ITwinTableOverridesMUI,
  type ITwinTableSortModel,
} from "../../types";

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
   * Requested sort, e.g. `{ field: "displayName", direction: "asc" }`. When
   * `onSortOptionsChange` is provided the sort is fully controlled: store the
   * reported value and pass it back through this prop. Otherwise this is only
   * the initial sort and the table manages its own.
   */
  sortOptions?: ITwinSortOptionsMUI;
  /**
   * Called when the user changes the table sort (e.g. by clicking a column
   * header). Providing this makes the sort controlled; receive the new sort
   * in the same shape as the `sortOptions` prop and pass it back as-is.
   * Receives `undefined` when the sort is cleared.
   */
  onSortOptionsChange?: (sortOptions?: ITwinSortOptionsMUI) => void;
  /** Nonce applied to `<style>` elements. Required if your application uses a Content Security Policy (CSP) that restricts inline styles. */
  nonce?: string;
}

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
  sortOptions,
  onSortOptionsChange,
  nonce,
}: ITwinTableMUIProps) => {
  // Eagerly load all available data so the table has the full dataset
  // for client-side pagination and sorting.
  React.useEffect(() => {
    if (fetchMore) {
      fetchMore();
    }
  }, [fetchMore]);

  // Translate the `sortOptions` prop into the equivalent DataGrid sort model.
  const sortField = sortOptions?.field;
  const sortDirection = sortOptions?.direction;
  const sortModel = React.useMemo<ITwinTableSortModel>(
    () => (sortField ? [{ field: sortField, sort: sortDirection }] : []),
    [sortField, sortDirection]
  );

  // Controlled when `onSortOptionsChange` is provided: the consumer stores the
  // sort and passes it back through `sortOptions`.
  const isSortControlled = !!onSortOptionsChange;

  const handleSortModelChange = React.useCallback(
    (model: ITwinTableSortModel) => {
      const first = model[0];
      onSortOptionsChange?.(
        first
          ? { field: first.field, direction: first.sort ?? "asc" }
          : undefined
      );
    },
    [onSortOptionsChange]
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
      nonce={nonce}
      loading={isLoading}
      sortModel={isSortControlled ? sortModel : undefined}
      onSortModelChange={
        isSortControlled
          ? (model) => handleSortModelChange([...model] as ITwinTableSortModel)
          : undefined
      }
      sortingOrder={isSortControlled ? ["asc", "desc"] : ["asc", "desc", null]}
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
        sorting: { sortModel },
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
