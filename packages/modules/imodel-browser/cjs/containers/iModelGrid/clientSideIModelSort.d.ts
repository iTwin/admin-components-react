import type { IModelFull, IModelSortOptions, ViewType } from "../../types";
export interface ClientSideIModelSortOptions {
    viewMode: ViewType | undefined;
    requestType: "favorites" | "recents" | "" | undefined;
    sort: IModelSortOptions;
}
/**
 * Client-side sort applied to the MUI iModel grid for tile view when the
 * request type is "recents" or "favorites" — the server does not honor sort
 * options for those request types, so we sort on the client.
 */
export declare const clientSideIModelSort: (iModels: IModelFull[], { viewMode, requestType, sort }: ClientSideIModelSortOptions) => IModelFull[];
