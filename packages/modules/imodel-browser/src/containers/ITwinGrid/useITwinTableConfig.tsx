/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SvgMore, SvgStar, SvgStarHollow } from "@itwin/itwinui-icons-react";
import { DropdownMenu, IconButton } from "@itwin/itwinui-react";
import React from "react";
import { useMemo } from "react";
import { CellProps } from "react-table";

import { ITwinCellColumn, ITwinCellOverrides, ITwinFull } from "../../types";
import {
  _buildManagedContextMenuOptions,
  ContextMenuBuilderItem,
} from "../../utils/_buildMenuOptions";
import { ITwinGridStrings } from "./ITwinGrid";

export interface useITwinTableConfigProps {
  iTwinActions: ContextMenuBuilderItem<ITwinFull>[] | undefined;
  onThumbnailClick: ((iTwin: ITwinFull) => void) | undefined;
  strings: ITwinGridStrings;
  iTwinFavorites: Set<string>;
  addITwinToFavorites: (iTwinId: string) => Promise<void>;
  removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
  refetchITwins: () => void;
  cellOverrides?: ITwinCellOverrides;
}

export const useITwinTableConfig = ({
  iTwinActions,
  onThumbnailClick,
  strings,
  iTwinFavorites,
  addITwinToFavorites,
  removeITwinFromFavorites,
  refetchITwins,
  cellOverrides = {},
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
            id: ITwinCellColumn.Favorite,
            Header: strings.tableColumnFavorites,
            accessor: "id",
            width: 70,
            Cell: (props: CellProps<ITwinFull>) => {
              const isFavorite = iTwinFavorites.has(props.value);
              return (
                <IconButton
                  styleType="borderless"
                  aria-label={
                    isFavorite
                      ? strings.addToFavorites
                      : strings.removeFromFavorites
                  }
                  onClick={async (e) => {
                    e.stopPropagation();
                    isFavorite
                      ? await removeITwinFromFavorites(props.value)
                      : await addITwinToFavorites(props.value);
                  }}
                >
                  {isFavorite ? <SvgStar /> : <SvgStarHollow />}
                </IconButton>
              );
            },
          },
          {
            id: ITwinCellColumn.Number,
            Header: strings.tableColumnName,
            accessor: "number",
            maxWidth: 350,
            Cell: (props: CellProps<ITwinFull>) => (
              <div
                data-tip={props.row.original.number}
                className="iac-iTwinCell"
              >
                {cellOverrides.ITwinNumber ? (
                  cellOverrides.ITwinNumber(props)
                ) : (
                  <span>{props.value}</span>
                )}
              </div>
            ),
          },
          {
            id: ITwinCellColumn.Name,
            Header: strings.tableColumnDescription,
            accessor: "displayName",
            maxWidth: 350,
            Cell: (props: CellProps<ITwinFull>) => (
              <div
                data-tip={props.row.original.displayName}
                className="iac-iTwinCell"
              >
                {cellOverrides.ITwinName ? (
                  cellOverrides.ITwinName(props)
                ) : (
                  <span>{props.value}</span>
                )}
              </div>
            ),
          },
          {
            id: ITwinCellColumn.LastModified,
            Header: strings.tableColumnLastModified,
            accessor: "createdDateTime",
            maxWidth: 350,
            Cell: (props: CellProps<ITwinFull>) => {
              const date = props.data[props.row.index].createdDateTime;
              return cellOverrides.LastModified
                ? cellOverrides.LastModified(props)
                : date
                ? new Date(date).toDateString()
                : "";
            },
          },
          {
            id: ITwinCellColumn.Options,
            disableSortBy: true,
            maxWidth: 65,
            Cell: (props: CellProps<ITwinFull>) => {
              const moreOptions = (close: () => void) => {
                const options = _buildManagedContextMenuOptions(
                  iTwinActions,
                  props.row.original,
                  close,
                  refetchITwins
                );
                return options !== undefined ? options : [];
              };

              return iTwinActions && iTwinActions.length > 0 ? (
                <DropdownMenu menuItems={moreOptions}>
                  <IconButton
                    data-testid={`iTwin-row-${props.row.original.id}-more-options`}
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
        ].filter((column) => !cellOverrides.hideColumns?.includes(column.id)),
      },
    ],
    [
      strings.tableColumnFavorites,
      strings.tableColumnName,
      strings.tableColumnDescription,
      strings.tableColumnLastModified,
      strings.addToFavorites,
      strings.removeFromFavorites,
      iTwinFavorites,
      removeITwinFromFavorites,
      addITwinToFavorites,
      cellOverrides,
      iTwinActions,
      refetchITwins,
    ]
  );

  return {
    onRowClick,
    columns,
  };
};
