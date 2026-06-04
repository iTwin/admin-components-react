import { AccessTokenProvider } from "../types";
/** Response from https://developer.bentley.com/apis/imodels-v2/operations/get-my-favorite-imodels/ */
export interface IModelFavoritesResponse {
    iModels: IModelFavorites[];
    _links: {
        self: {
            href: string;
        };
        prev?: {
            href: string;
        };
        next?: {
            href: string;
        };
    };
}
export interface IModelFavorites {
    id: string;
    displayName: string;
    dataCenterLocation: string;
}
export declare function addIModelToRecents(options: {
    iModelId: string;
    accessToken?: AccessTokenProvider;
    serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void>;
export declare function removeIModelFromRecents(options: {
    iModelId: string;
    accessToken?: AccessTokenProvider;
    serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void>;
export declare function getIModelFavorites(options: {
    iTwinId: string;
    accessToken: AccessTokenProvider;
    serverEnvironmentPrefix?: "dev" | "qa" | "";
    abortSignal?: AbortSignal;
}): Promise<IModelFavorites[]>;
export declare function addIModelToFavorites(options: {
    iModelId: string;
    accessToken: AccessTokenProvider;
    serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void>;
export declare function removeIModelFromFavorites(options: {
    iModelId: string;
    accessToken: AccessTokenProvider;
    serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void>;
