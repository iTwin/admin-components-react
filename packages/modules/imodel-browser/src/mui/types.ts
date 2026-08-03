/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { GridColDef, GridSortModel } from "@mui/x-data-grid";

import {
  type IModelFull,
  type ITwinFull,
  IModelCellColumn,
  ITwinCellColumn,
} from "../types";

/** A DataGrid sort item whose `field` is limited to a known set of column names. */
export type TypedGridSortItem<Field extends string> = GridSortModel[number] & {
  field: Field;
};

/** A DataGrid sort model whose items are limited to a known set of column names. */
export type TypedGridSortModel<Field extends string> =
  TypedGridSortItem<Field>[];

/** Sortable column field names for the MUI iModel table. `createdDateTime` is sortable even though it is not displayed as a column. */
export type IModelTableSortField =
  | "name"
  | "lastChangesetPushDateTime"
  | "createdDateTime";

/** Sort model for the MUI iModel table, limited to its sortable field names. */
export type IModelTableSortModel = TypedGridSortModel<IModelTableSortField>;

/** Sortable column field names for the MUI iTwin table. */
export type ITwinTableSortField =
  | "number"
  | "displayName"
  | "lastModifiedDateTime";

/** Sort model for the MUI iTwin table, limited to its sortable field names. */
export type ITwinTableSortModel = TypedGridSortModel<ITwinTableSortField>;

export type IModelTableOverridesMUI = {
  /** Per-column overrides merged onto the default column definitions. */
  columnOverrides?: Partial<
    Record<IModelCellColumn, Partial<GridColDef<IModelFull>>>
  >;
  /** Columns to hide from the table. */
  hideColumns?: IModelCellColumn[];
};

export type ITwinTableOverridesMUI = {
  /** Per-column overrides merged onto the default column definitions. */
  columnOverrides?: Partial<
    Record<ITwinCellColumn, Partial<GridColDef<ITwinFull>>>
  >;
  /** Columns to hide from the table. */
  hideColumns?: ITwinCellColumn[];
};
