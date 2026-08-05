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

import { useIModelFavoritesContext } from "../../../contexts/IModelFavoritesContext";
import { type IModelFull, IModelCellColumn } from "../../../types";
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
  type IModelSortOptionsMUI,
  type IModelTableOverridesMUI,
  type IModelTableSortModel,
} from "../../types";

const EMPTY_COLUMN_OVERRIDES: NonNullable<
  IModelTableOverridesMUI["columnOverrides"]
> = {};
const EMPTY_HIDE_COLUMNS: NonNullable<IModelTableOverridesMUI["hideColumns"]> =
  [];

type MuiDataGridStrings = Pick<
  typeof GRID_DEFAULT_LOCALE_TEXT,
  | "noRowsLabel"
  | "noResultsOverlayLabel"
  | "footerRowSelected"
  | "footerTotalVisibleRows"
  | "paginationRowsPerPage"
>;

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
  moreActions?: MoreActionsMenuItemMUI<IModelFull>[];
  /** Factory that returns per-row actions. The first action drives row click. */
  actions?: (iModel: IModelFull) => ResolvedCardActionItem[];
  strings: IModelTableMUIStrings;
  refetchIModels: () => void;
  tableOverrides?: IModelTableOverridesMUI;
  isLoading?: boolean;
  /** Called when more data should be loaded. */
  fetchMore?: (() => void) | false;
  /**
   * Requested sort, e.g. `{ field: "name", direction: "asc" }`. When
   * `onSortOptionsChange` is provided the sort is fully controlled: store the
   * reported value and pass it back through this prop. Otherwise this is only
   * the initial sort and the table manages its own.
   */
  sortOptions?: IModelSortOptionsMUI;
  /**
   * Called when the user changes the table sort (e.g. by clicking a column
   * header). Providing this makes the sort controlled; receive the new sort
   * in the same shape as the `sortOptions` prop and pass it back as-is.
   * Receives `undefined` when the sort is cleared.
   */
  onSortOptionsChange?: (sortOptions?: IModelSortOptionsMUI) => void;
  /** Nonce applied to `<style>` elements. Required if your application uses a Content Security Policy (CSP) that restricts inline styles. */
  nonce?: string;
}

/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
export const IModelTableMUI = ({
  iModels,
  moreActions,
  actions,
  strings,
  refetchIModels,
  tableOverrides: {
    columnOverrides = EMPTY_COLUMN_OVERRIDES,
    hideColumns = EMPTY_HIDE_COLUMNS,
  } = {},
  isLoading,
  fetchMore,
  sortOptions,
  onSortOptionsChange,
  nonce,
}: IModelTableMUIProps) => {
  // Eagerly load all available data so the table has the full dataset
  // for client-side pagination and sorting.
  React.useEffect(() => {
    if (fetchMore) {
      fetchMore();
    }
  }, [fetchMore]);
  const favoritesContext = useIModelFavoritesContext();

  // Translate the `sortOptions` prop into the equivalent DataGrid sort model.
  const sortField = sortOptions?.field;
  const sortDirection = sortOptions?.direction;
  const sortModel = React.useMemo<IModelTableSortModel>(
    () => (sortField ? [{ field: sortField, sort: sortDirection }] : []),
    [sortField, sortDirection]
  );

  // Controlled when `onSortOptionsChange` is provided: the consumer stores the
  // sort and passes it back through `sortOptions`.
  const isSortControlled = !!onSortOptionsChange;

  const handleSortModelChange = React.useCallback(
    (model: IModelTableSortModel) => {
      const first = model[0];
      onSortOptionsChange?.(
        first
          ? { field: first.field, direction: first.sort ?? "asc" }
          : undefined
      );
    },
    [onSortOptionsChange]
  );

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
            <FavoriteIconMUI
              isFavorite={!!isFavorite}
              addLabel={strings.addToFavorites}
              removeLabel={strings.removeFromFavorites}
              onAddToFavorites={() => favoritesContext?.add?.(params.value)}
              onRemoveFromFavorites={() =>
                favoritesContext?.remove?.(params.value)
              }
              transparent
              tabIndex={params.tabIndex}
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
        valueGetter: (_value: string | undefined, row: IModelFull) =>
          row.name ?? row.displayName ?? "",
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
          valueFormatter: (value: string) => formatDate(value),
          disableColumnMenu: true,
          ...columnOverrides[IModelCellColumn.LastModified],
        },
      // Hidden column so the sort model can sort by creation date even though
      // the column is never displayed.
      {
        field: "createdDateTime",
        headerName: "",
        valueGetter: (_value: string | undefined, row: IModelFull) =>
          row.createdDateTime ?? "",
        disableColumnMenu: true,
      },
      !hideColumns.includes(IModelCellColumn.Options) && {
        field: "actions",
        headerName: "",
        sortable: false,
        width: 50,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!moreActions || moreActions.length === 0) {
            return null;
          }
          const items = resolveMoreActionsMenuItemsMUI(
            moreActions,
            params.row,
            refetchIModels
          );
          return (
            <MoreMenuMUI
              items={items}
              label={strings.moreOptions}
              prompt={<Icon href={svgMore} />}
              tabIndex={params.tabIndex}
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
    moreActions,
    refetchIModels,
  ]);

  return (
    <DataGrid<IModelFull>
      rows={iModels}
      columns={columns}
      columnVisibilityModel={{ createdDateTime: false }}
      nonce={nonce}
      loading={isLoading}
      sortModel={isSortControlled ? sortModel : undefined}
      onSortModelChange={
        isSortControlled
          ? (model) => handleSortModelChange([...model] as IModelTableSortModel)
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
          "& .MuiDataGrid-row.row-disabled": {
            cursor: "default",
            color: "var(--stratakit-color-text-neutral-disabled)",
          },
        }),
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
