/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgMore } from "@itwin/itwinui-icons-react";
import { DropdownMenu, IconButton } from "@itwin/itwinui-react";
import React from "react";
import { useMemo } from "react";
import { CellProps } from "react-table";

import { ITwinFull } from "../../types";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";

export interface useITwinTableConfigProps {
  iTwinActions: ContextMenuBuilderItem<ITwinFull>[] | undefined;
  onThumbnailClick: ((iTwin: ITwinFull) => void) | undefined;
  strings: {
    tableColumnName: string;
    tableColumnDescription: string;
    tableColumnLastModified: string;
    noITwins: string;
    noAuthentication: string;
    error: string;
  };
}

export const useITwinTableConfig = ({
  iTwinActions,
  onThumbnailClick,
  strings,
}: useITwinTableConfigProps) => {
  const onRowClick = (_: React.MouseEvent, row: any) => {
    const iTwin = row.original as ITwinFull;
    if (!iTwin) {
      return;
    }
    onThumbnailClick?.(iTwin);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Table",
        columns: [
          {
            id: "ITwinNumber",
            Header: strings.tableColumnName,
            accessor: "number",
            maxWidth: 350,
            Cell: (props: CellProps<ITwinFull>) => (
              <div
                data-tip={props.row.original.number}
                className="iac-iTwinCell"
              >
                <span>{props.value}</span>
              </div>
            ),
          },
          {
            id: "ITwinName",
            Header: strings.tableColumnDescription,
            accessor: "displayName",
          },
          {
            id: "LastModified",
            Header: strings.tableColumnLastModified,
            accessor: "createdDateTime",
            maxWidth: 350,
            Cell: (props: CellProps<ITwinFull>) => {
              const date = props.data[props.row.index].createdDateTime;
              return date ? new Date(date).toDateString() : "";
            },
          },
          {
            id: "options",
            disableSortBy: true,
            maxWidth: 65,
            Cell: (props: CellProps<ITwinFull>) => {
              const moreOptions = (close: () => void) => {
                const options = _buildManagedContextMenuOptions(
                  iTwinActions,
                  props.row.original,
                  close
                );
                return options !== undefined ? options : [];
              };

              return iTwinActions && iTwinActions.length > 0 ? (
                <DropdownMenu menuItems={moreOptions}>
                  <IconButton
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
      iTwinActions,
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
