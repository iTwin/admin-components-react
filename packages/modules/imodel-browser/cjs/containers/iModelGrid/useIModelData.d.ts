import { AccessTokenProvider, ApiOverrides, DataMode, DataStatus, IModelFull, IModelSortOptions, ViewType } from "../../types";
export interface IModelDataHookOptions {
    /** Type of iModels to request - "favorites" for user's favorite iModels, "recents" for recently accessed iModels, or empty string for all iModels */
    requestType?: "favorites" | "recents" | "";
    iTwinId?: string | undefined;
    accessToken?: AccessTokenProvider;
    sortOptions?: IModelSortOptions;
    apiOverrides?: ApiOverrides<IModelFull[]>;
    searchText?: string | undefined;
    maxCount?: number;
    pageSize?: number;
    /** @deprecated in 2.1 It is no longer used as it has no effect on the data fetching. */
    viewMode?: ViewType;
    /** Controls whether data is fetched and managed internally or externally.*/
    dataMode?: DataMode;
    onLoadMore?: () => void | Promise<void>;
    onRefetch?: () => void | Promise<void>;
}
export declare const DEFAULT_PAGE_SIZE = 100;
export declare const useIModelData: ({ requestType, iTwinId, accessToken, sortOptions, apiOverrides, searchText, pageSize, maxCount, dataMode, onLoadMore, onRefetch, }: IModelDataHookOptions) => {
    iModels: IModelFull[];
    status: DataStatus | undefined;
    fetchMore: (() => void) | undefined;
    refetchIModels: () => void;
};
