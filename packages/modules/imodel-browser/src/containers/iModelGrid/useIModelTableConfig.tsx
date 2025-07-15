/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgMore } from "@itwin/itwinui-icons-react";
import { DropdownMenu, IconButton } from "@itwin/itwinui-react";
import React from "react";
import { useMemo } from "react";
import { CellProps } from "react-table";

import { IModelCellOverrides, IModelFull } from "../../types";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";

export interface useIModelTableConfigProps {
  iModelActions: ContextMenuBuilderItem<IModelFull>[] | undefined;
  onThumbnailClick: ((iModel: IModelFull) => void) | undefined;
  strings: {
    tableColumnName: string;
    tableColumnDescription: string;
    tableColumnLastModified: string;
    noIModelSearch: string;
    noIModels: string;
    noContext: string;
    noAuthentication: string;
    error: string;
  };
  refetchIModels: () => void;
  cellOverrides?: IModelCellOverrides;
}

export const useIModelTableConfig = ({
  iModelActions,
  onThumbnailClick,
  strings,
  refetchIModels,
  cellOverrides = {},
}: useIModelTableConfigProps) => {
  const onRowClick = (_: React.MouseEvent, row: any) => {
    const iModel = row.original as IModelFull;
    if (!iModel) {
      return;
    }
    onThumbnailClick?.(iModel);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Table",
        columns: [
          {
            id: "name",
            Header: strings.tableColumnName,
            accessor: "name",
            maxWidth: 350,
            Cell: (props: CellProps<IModelFull>) => (
              <div data-tip={props.row.original.name}>
                <span>
                  {cellOverrides.name ? cellOverrides.name(props) : props.value}
                </span>
              </div>
            ),
          },
          {
            id: "description",
            Header: strings.tableColumnDescription,
            accessor: "description",
            disableSortBy: true,
            Cell: (props: CellProps<IModelFull>) => (
              <div data-tip={props.row.original.description}>
                <span>
                  {cellOverrides.description
                    ? cellOverrides.description(props)
                    : props.value}
                </span>
              </div>
            ),
          },
          {
            id: "createdDateTime",
            Header: strings.tableColumnLastModified,
            accessor: "createdDateTime",
            maxWidth: 350,
            Cell: (props: CellProps<IModelFull>) => {
              const date = props.data[props.row.index].createdDateTime;
              return cellOverrides.createdDateTime
                ? cellOverrides.createdDateTime(props)
                : date
                ? new Date(date).toDateString()
                : "";
            },
          },
          {
            id: "options",
            disableSortBy: true,
            maxWidth: 65,
            Cell: (props: CellProps<IModelFull>) => {
              const moreOptions = (close: () => void) => {
                const options = _buildManagedContextMenuOptions(
                  iModelActions,
                  props.row.original,
                  close,
                  refetchIModels
                );
                return options !== undefined ? options : [];
              };

              return iModelActions && iModelActions.length > 0 ? (
                <DropdownMenu
                  menuItems={moreOptions}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <IconButton
                    data-testid={`iModel-row-${props.row.original.id}-more-options`}
                    styleType="borderless"
                    aria-label="More options"
                    className="iac-options-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SvgMore />
                  </IconButton>
                </DropdownMenu>
              ) : null;
            },
          },
        ],
      },
    ],
    [
      strings.tableColumnName,
      strings.tableColumnDescription,
      strings.tableColumnLastModified,
      cellOverrides,
      iModelActions,
      refetchIModels,
    ]
  );

  return {
    onRowClick,
    columns,
  };
};
