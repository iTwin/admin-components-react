/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./IModelGrid.scss";

import {
  SvgClose,
  SvgList,
  SvgSearch,
  SvgThumbnails,
} from "@itwin/itwinui-icons-react";
import {
  ButtonGroup,
  IconButton,
  LabeledInput,
  Table,
  Tooltip,
} from "@itwin/itwinui-react";
import React, { useState } from "react";
import { InView } from "react-intersection-observer";

import { GridStructure } from "../../components/gridStructure/GridStructure";
import { NoResults } from "../../components/noResults/NoResults";
import {
  ApiOverrides,
  DataStatus,
  IModelFull,
  IModelSortOptions,
  IModelViewType,
} from "../../types";
import { _mergeStrings } from "../../utils/_apiOverrides";
import { ContextMenuBuilderItem } from "../../utils/_buildMenuOptions";
import { debounce } from "../../utils/_debounce";
import { IModelGhostTile } from "../iModelTiles/IModelGhostTile";
import { IModelTile, IModelTileProps } from "../iModelTiles/IModelTile";
import { useIModelData } from "./useIModelData";
import { useIModelTableConfig } from "./useIModelTableConfig";
export interface IModelGridProps {
  /**
   * Access token that requires the `imodels:read` scope. */
  accessToken?: string | undefined;
  /** Project Id to list the iModels from (mutually exclusive to assetId) */
  projectId?: string | undefined;
  /** Thumbnail click handler. */
  onThumbnailClick?(iModel: IModelFull): void;
  /** Configure IModel sorting behavior.
   */
  sortOptions?: IModelSortOptions;
  /** List of actions to build for each imodel context menu. */
  iModelActions?: ContextMenuBuilderItem<IModelFull>[];
  /** Function (can be a react hook) that returns state for an iModel, returned values will be applied as props to the IModelTile, overrides IModelGrid provided values */
  useIndividualState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
  /** Static props to apply over each tile, mainly used for tileProps, overrides IModelGrid provided values */
  tileOverrides?: Partial<IModelTileProps>;
  /** Strings displayed by the browser */
  stringsOverrides?: {
    /** Displayed for table name header. */
    tableColumnName?: string;
    /** Displayed for table description header. */
    tableColumnDescription?: string;
    /** Displayed for table lastModified header. */
    tableColumnLastModified?: string;
    /** Displayed on table while loading data. */
    tableLoadingData?: string;
    /** Displayed after successful fetch search, but no iModel is returned. */
    noIModelSearch?: string;
    /** Displayed after successful fetch, but no iModels are returned. */
    noIModels?: string;
    /** Displayed when the component is mounted and there is no project or asset Id. */
    noContext?: string;
    /** Displayed when the component is mounted but the accessToken is empty. */
    noAuthentication?: string;
    /** Generic message displayed if an error occurs while fetching. */
    error?: string;
  };
  /** Object that configures different overrides for the API.
   * @property `data`: Array of iModels used in the grid.
   * @property `serverEnvironmentPrefix`: Either qa or dev.
   */
  apiOverrides?: ApiOverrides<IModelFull[]>;
  /**
   * Allow final transformation of the iModel array before display
   * This function MUST be memoized.
   */
  postProcessCallback?: (
    iModels: IModelFull[],
    fetchStatus: DataStatus | undefined,
    searchText: string | undefined
  ) => IModelFull[];
  /**Component to show when there is no iModel */
  emptyStateComponent?: React.ReactNode;
  /**  Create IModel Button component */
  createIModelButton?: React.ReactNode;
  /** flag to show search toolbar component along with view */
  showSearchToolbar?: boolean;
  /**iModel view mode */
  viewMode?: IModelViewType;
}

/**
 * Component that will allow displaying a grid of iModels, given a contextId
 */
export const IModelGrid = ({
  accessToken,
  apiOverrides,
  iModelActions,
  onThumbnailClick,
  projectId,
  sortOptions = { sortType: "name", descending: false },
  stringsOverrides,
  tileOverrides,
  useIndividualState,
  postProcessCallback,
  emptyStateComponent,
  createIModelButton,
  showSearchToolbar,
  viewMode,
}: IModelGridProps) => {
  const [searchText, setSearchText] = useState("");
  const [textValue, setTextValue] = useState("");

  const [view, setView] = useState<IModelViewType>(viewMode ?? "tileView");
  const searchRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const strings = _mergeStrings(
    {
      tableColumnName: "Name",
      tableColumnDescription: "Description",
      tableColumnLastModified: "Last Modified",
      tableLoadingData: "Loading...",
      noIModelSearch: "There is no such iModel in this project.",
      noIModels: "There are no iModels in this project.",
      noContext: "No context provided",
      noAuthentication: "No access token provided",
      error: "An error occured",
    },
    stringsOverrides
  );
  const {
    iModels: fetchediModels,
    status: fetchStatus,
    fetchMore,
  } = useIModelData({
    accessToken,
    apiOverrides,
    projectId,
    sortOptions,
    searchText,
  });

  const { columns, onRowClick } = useIModelTableConfig({
    iModelActions,
    onThumbnailClick,
    strings,
  });

  const handleChange = (value: string) => setTextValue(value);

  const iModels = React.useMemo(
    () =>
      postProcessCallback?.([...fetchediModels], fetchStatus, searchText) ??
      fetchediModels,
    [postProcessCallback, fetchediModels, fetchStatus, searchText]
  );

  const noResultsText = {
    [DataStatus.Fetching]: "",
    [DataStatus.Complete]: strings.noIModels,
    [DataStatus.FetchFailed]: strings.error,
    [DataStatus.TokenRequired]: strings.noAuthentication,
    [DataStatus.ContextRequired]: strings.noContext,
  }[fetchStatus ?? DataStatus.Fetching];

  const tileApiOverrides = apiOverrides
    ? { serverEnvironmentPrefix: apiOverrides.serverEnvironmentPrefix }
    : undefined;

  const renderIModelGridStructure = () => {
    return (
      <>
        {showSearchToolbar && (
          <div className="iac-search-toolbar">
            {!!createIModelButton && <div>{createIModelButton}</div>}
            <div className="iac-search-toolbar-input">
              <LabeledInput
                label={""}
                placeholder="Search..."
                type="text"
                id="searchText"
                name="searchText"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e.target.value);
                  debounce(setSearchText(e.target.value), 500);
                }}
                value={textValue}
                iconDisplayStyle="inline"
                svgIcon={
                  searchText?.trim() ? (
                    <div
                      ref={closeRef}
                      onClick={() => {
                        setTextValue("");
                        setSearchText("");
                      }}
                    >
                      <SvgClose />
                    </div>
                  ) : (
                    <div ref={searchRef}>
                      <SvgSearch />
                    </div>
                  )
                }
              />
              <Tooltip reference={searchRef} content="Search" />
              <ButtonGroup className="iac-view-toolbar">
                <IconButton
                  onClick={() => setView("tileView")}
                  isActive={view === "tileView"}
                >
                  <SvgThumbnails />
                </IconButton>
                <IconButton
                  onClick={() => setView("listView")}
                  isActive={view === "listView"}
                >
                  <SvgList />
                </IconButton>
              </ButtonGroup>
            </div>
          </div>
        )}
        {view === "tileView" ? (
          <GridStructure>
            {fetchStatus === DataStatus.Fetching ? (
              <>
                <IModelGhostTile />
                <IModelGhostTile />
                <IModelGhostTile />
              </>
            ) : (
              <>
                {searchText && iModels.length === 0 ? (
                  <div>{strings.noIModelSearch}</div>
                ) : (
                  iModels?.map((iModel) => (
                    <IModelHookedTile
                      key={iModel.id}
                      iModel={iModel}
                      iModelOptions={iModelActions}
                      accessToken={accessToken}
                      onThumbnailClick={onThumbnailClick}
                      apiOverrides={tileApiOverrides}
                      useTileState={useIndividualState}
                      {...tileOverrides}
                    />
                  ))
                )}
                {fetchMore ? (
                  <>
                    <InView onChange={fetchMore}>
                      <IModelGhostTile />
                    </InView>
                    <IModelGhostTile />
                    <IModelGhostTile />
                  </>
                ) : null}
              </>
            )}
          </GridStructure>
        ) : (
          <Table<{ [P in keyof IModelFull]: IModelFull[P] }>
            columns={columns}
            data={iModels}
            onRowClick={onRowClick}
            emptyTableContent={
              fetchStatus === DataStatus.Fetching
                ? strings.tableLoadingData
                : strings.noIModelSearch
            }
            isSortable
            className="iac-list-structure"
          />
        )}
      </>
    );
  };

  const renderComponent = () => {
    if (
      !searchText &&
      iModels.length === 0 &&
      noResultsText === strings.noIModels &&
      emptyStateComponent
    ) {
      return <>{emptyStateComponent}</>;
    }
    if (!searchText && iModels.length === 0 && noResultsText) {
      return <NoResults text={noResultsText} />;
    }
    return renderIModelGridStructure();
  };
  return renderComponent();
};

type IModelHookedTileProps = IModelTileProps & {
  useTileState?: (
    iModel: IModelFull,
    iModelTileProps: IModelTileProps
  ) => Partial<IModelTileProps>;
};
const noOp = () => ({} as Partial<IModelTileProps>);
const IModelHookedTile = (props: IModelHookedTileProps) => {
  const { useTileState = noOp, ...iModelTileProps } = props;

  const hookIdentity = React.useRef(useTileState);

  if (hookIdentity.current !== useTileState) {
    throw new Error(
      "Even when used in a prop, useTilePropsForIModel identity must remain stable as it is used as a hook."
    );
  }

  const tileState = useTileState(props.iModel, iModelTileProps);
  return <IModelTile {...iModelTileProps} {...tileState} />;
};
