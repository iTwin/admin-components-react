import React from "react";
import { AccessTokenProvider } from "../types";
export interface IModelFavoritesContextValue {
    favorites: Set<string>;
    add: (iModelId: string) => Promise<void>;
    remove: (iModelId: string) => Promise<void>;
}
export declare const IModelFavoritesContext: React.Context<IModelFavoritesContextValue | undefined>;
export interface IModelFavoritesProviderProps {
    iTwinId: string | undefined;
    accessToken?: AccessTokenProvider;
    serverEnvironmentPrefix?: string;
    children: React.ReactNode;
    disabled?: boolean;
}
export declare const IModelFavoritesProvider: ({ iTwinId, accessToken, serverEnvironmentPrefix, children, disabled, }: IModelFavoritesProviderProps) => React.JSX.Element;
export declare const useIModelFavoritesContext: () => IModelFavoritesContextValue | undefined;
