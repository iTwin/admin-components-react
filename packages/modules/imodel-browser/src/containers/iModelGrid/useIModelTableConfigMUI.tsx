/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import svgMore from "@stratakit/icons/more-vertical.svg"; // TODO: more-horizontal is missing
import { Icon } from "@stratakit/mui";
import IconButton from "@mui/material/IconButton";

import React from "react";
import { useMemo } from "react";
import { CellProps } from "react-table";

import { useIModelFavoritesContext } from "../../contexts/IModelFavoritesContext";
import { IModelCellColumn, IModelCellOverrides, IModelFull } from "../../types";
import MoreMenu from "../../components/MoreMenu";
import {
  buildContextMenuItemsMUI,
  ContextMenuBuilderItem,
  ContextMenuBuilderItemMUI,
} from "../../utils/_buildMenuOptions";
import Menu from "@mui/material/Menu";
import { TileFavoriteIconMUI } from "../../components/tileFavoriteIcon/TileFavoriteIconMUI";

export interface IModelTableStrings {
  /** Displayed for table name header. */
  tableColumnName: string;
  /** Displayed for table description header. */
  tableColumnDescription: string;
  /** Displayed for table last modified date header. */
  tableColumnLastModified: string;
  /** Displayed for table favorites header. */
  tableColumnFavorites: string;
  /** Text for adding an iModel to favorites. */
  addToFavorites: string;
  /** Text for removing an iModel from favorites. */
  removeFromFavorites: string;
}
export interface useIModelTableConfigProps {
  iModelActions: ContextMenuBuilderItemMUI<IModelFull>[] | undefined;
  onOpen: ((iModel: IModelFull) => void) | undefined;
  strings: IModelTableStrings;
  refetchIModels: () => void;
  cellOverrides?: IModelCellOverrides;
}

export const useIModelTableConfigMUI = ({
  iModelActions,
  onOpen,
  strings,
  refetchIModels,
  cellOverrides = {},
}: useIModelTableConfigProps) => {
  const favoritesContext = useIModelFavoritesContext();
  const onRowClick = (_: React.MouseEvent, row: any) => {
    const iModel = row.original as IModelFull;
    if (!iModel) {
      return;
    }
    onOpen?.(iModel);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Table",
        columns: [
          {
            id: IModelCellColumn.Favorite,
            Header: strings.tableColumnFavorites,
            accessor: "id",
            disableSortBy: true,
            width: 70,
            Cell: (props: CellProps<IModelFull>) => {
              const isFavorite = favoritesContext?.favorites.has(props.value);
              return (
                <TileFavoriteIconMUI
                  isFavorite={!!isFavorite}
                  addLabel={strings.addToFavorites}
                  removeLabel={strings.removeFromFavorites}
                  onAddToFavorites={() => favoritesContext?.add?.(props.value)}
                  onRemoveFromFavorites={() =>
                    favoritesContext?.remove?.(props.value)
                  }
                  sx={{ bgcolor: "transparent" }}
                />
              );
            },
          },
          {
            id: IModelCellColumn.Name,
            Header: strings.tableColumnName,
            accessor: "name",
            maxWidth: 350,
            Cell: (props: CellProps<IModelFull>) => (
              <div data-tip={props.row.original.name}>
                {cellOverrides.name ? (
                  cellOverrides.name(props)
                ) : (
                  <span>{props.value}</span>
                )}
              </div>
            ),
          },
          {
            id: IModelCellColumn.Description,
            Header: strings.tableColumnDescription,
            accessor: "description",
            disableSortBy: true,
            Cell: (props: CellProps<IModelFull>) => (
              <div data-tip={props.row.original.description}>
                {cellOverrides.description ? (
                  cellOverrides.description(props)
                ) : (
                  <span>{props.value}</span>
                )}
              </div>
            ),
          },
          {
            id: IModelCellColumn.LastModified,
            Header: strings.tableColumnLastModified,
            accessor: (row: IModelFull) =>
              row.lastChangesetPushDateTime ?? row.createdDateTime ?? "",
            maxWidth: 350,
            Cell: (props: CellProps<IModelFull>) => {
              const date =
                props.data[props.row.index].lastChangesetPushDateTime ??
                props.data[props.row.index].createdDateTime;
              const lastModifiedOverride =
                cellOverrides.lastModified ?? cellOverrides.createdDateTime;
              return lastModifiedOverride
                ? lastModifiedOverride(props)
                : date
                ? new Date(date).toDateString()
                : "";
            },
          },
          {
            id: IModelCellColumn.Options,
            disableSortBy: true,
            maxWidth: 65,
            Cell: (props: CellProps<IModelFull>) => {
              if (!iModelActions || iModelActions.length === 0) return;
              const moreOptions = (close: () => void) => {
                const options = buildContextMenuItemsMUI(
                  iModelActions,
                  props.row.original,
                  close,
                  refetchIModels
                );
                return options !== undefined ? options : [];
              };

              return (
                <MoreMenu
                  menuItems={moreOptions}
                  data-testid={`iModel-row-${props.row.original.id}-more-options`}
                  prompt={<Icon href={svgMore} />}
                />
              );
            },
          },
        ].filter(
          ({ id }) =>
            !cellOverrides.hideColumns?.includes(id) &&
            // Support deprecated CreatedDateTime alias for the LastModified column
            !(
              id === IModelCellColumn.LastModified &&
              cellOverrides.hideColumns?.includes(
                IModelCellColumn.CreatedDateTime
              )
            )
        ),
      },
    ],
    [
      strings.tableColumnFavorites,
      strings.tableColumnName,
      strings.tableColumnDescription,
      strings.tableColumnLastModified,
      strings.addToFavorites,
      strings.removeFromFavorites,
      favoritesContext,
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
