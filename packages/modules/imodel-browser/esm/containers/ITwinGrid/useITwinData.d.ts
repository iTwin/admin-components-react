import { AccessTokenProvider, ApiOverrides, DataStatus, ITwinFilterOptions, ITwinFull, ITwinSubClass } from "../../types";
export interface ProjectDataHookOptions {
    requestType?: "favorites" | "recents" | "";
    iTwinSubClass?: ITwinSubClass;
    accessToken?: AccessTokenProvider;
    apiOverrides?: ApiOverrides<ITwinFull[]>;
    filterOptions?: ITwinFilterOptions;
    orderbyOptions?: string;
    shouldRefetchFavorites?: boolean;
    resetShouldRefetchFavorites?: () => void;
}
export declare const useITwinData: ({ requestType, iTwinSubClass, accessToken, apiOverrides, filterOptions, orderbyOptions, shouldRefetchFavorites, resetShouldRefetchFavorites, }: ProjectDataHookOptions) => {
    iTwins: ITwinFull[];
    status: DataStatus | undefined;
    fetchMore: (() => void) | undefined;
    refetchITwins: () => void;
};
