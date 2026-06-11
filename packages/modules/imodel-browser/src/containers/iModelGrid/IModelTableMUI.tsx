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

import MoreMenuMUI from "../../components/MoreMenuMUI";
import { FavoriteIconMUI } from "../../components/tileFavoriteIcon/FavoriteIconMUI";
import { useIModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { type IModelTableOverridesMUI } from "../../mui/types";
import { type IModelFull, IModelCellColumn } from "../../types";
import {
  type MoreActionsMenuItemMUI,
  type ResolvedCardActionItem,
  resolveMoreActionsMenuItemsMUI,
} from "../../utils/_buildMenuOptions";

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
}

// TODO: investigate infinite scroll as an alternative to built-in pagination
// MUI X DataGrid Pro supports onRowsScrollEnd, but the free version does not.

/**
 * Table view for iModels using MUI X DataGrid (Community edition).
 */
export const IModelTableMUI = ({
  iModels,
  moreActions,
  actions,
  strings,
  refetchIModels,
  tableOverrides: { columnOverrides = {}, hideColumns = [] } = {},
  isLoading,
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
          valueFormatter: (value: string) => {
            if (!value) {
              return "";
            }
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
      loading={isLoading}
      onRowClick={
        actions
          ? (params) => {
              const action = actions(params.row)[0];
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
                const action = actions(params.row)[0];
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
          "& .MuiDataGrid-row.row-disabled": {
            cursor: "default",
            color: "var(--stratakit-color-text-neutral-disabled)",
          },
        }),
      }}
      getRowClassName={
        actions
          ? (params) => (actions(params.row)[0]?.disabled ? "row-disabled" : "")
          : undefined
      }
    />
  );
};
