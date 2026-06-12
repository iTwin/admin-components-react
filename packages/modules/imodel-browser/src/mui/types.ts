/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { GridColDef } from "@mui/x-data-grid";

import {
  type IModelFull,
  type ITwinFull,
  IModelCellColumn,
  ITwinCellColumn,
} from "../types";

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
