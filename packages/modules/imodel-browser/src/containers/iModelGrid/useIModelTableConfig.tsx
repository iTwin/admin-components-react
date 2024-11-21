/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgMore } from "@itwin/itwinui-icons-react";
import { DropdownMenu } from "@itwin/itwinui-react";
import React from "react";
import { useMemo } from "react";
import { CellProps } from "react-table";

import { IModelFull } from "../../types";
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
}

export const useIModelTableConfig = ({
  iModelActions,
  onThumbnailClick,
  strings,
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
              <div
                data-tip={props.row.original.name}
                className="iac-iModelCell"
              >
                <span>{props.value}</span>
              </div>
            ),
          },
          {
            id: "description",
            Header: strings.tableColumnDescription,
            accessor: "description",
            disableSortBy: true,
          },
          {
            id: "createdDateTime",
            Header: strings.tableColumnLastModified,
            accessor: "createdDateTime",
            maxWidth: 350,
            Cell: (props: CellProps<IModelFull>) => {
              const date = props.data[props.row.index].createdDateTime;
              return date ? new Date(date).toDateString() : "";
            },
          },
          {
            id: "options",
            style: { width: "50px" },
            disableSortBy: true,
            maxWidth: 50,
            Cell: (props: CellProps<IModelFull>) => {
              const moreOptions = (close: () => void) => {
                const options = _buildManagedContextMenuOptions(
                  iModelActions,
                  props.row.original,
                  close
                );
                return options !== undefined ? options : [];
              };

              return (
                <DropdownMenu menuItems={moreOptions}>
                  <div
                    className="iac-options-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SvgMore />
                  </div>
                </DropdownMenu>
              );
            },
          },
        ],
      },
    ],
    [
      iModelActions,
      strings.tableColumnDescription,
      strings.tableColumnLastModified,
      strings.tableColumnName,
    ]
  );

  return {
    onRowClick,
    columns,
  };
};
