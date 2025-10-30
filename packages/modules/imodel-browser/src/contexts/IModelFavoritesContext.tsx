/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useIModelFavorites } from "../containers/iModelGrid/useIModelFavorites";
import { AccessTokenProvider } from "../types";

export interface IModelFavoritesContextValue {
  favorites: Set<string>;
  add: (iModelId: string) => Promise<void>;
  remove: (iModelId: string) => Promise<void>;
}

export const IModelFavoritesContext = React.createContext<
  IModelFavoritesContextValue | undefined
>(undefined);

export interface IModelFavoritesProviderProps {
  iTwinId: string | undefined;
  accessToken?: AccessTokenProvider;
  serverEnvironmentPrefix?: string;
  children: React.ReactNode;
}

export const IModelFavoritesProvider = ({
  iTwinId,
  accessToken,
  serverEnvironmentPrefix,
  children,
}: IModelFavoritesProviderProps) => {
  const { iModelFavorites, addIModelToFavorites, removeIModelFromFavorites } =
    useIModelFavorites(
      iTwinId,
      accessToken,
      serverEnvironmentPrefix === "dev" || serverEnvironmentPrefix === "qa"
        ? serverEnvironmentPrefix
        : undefined
    );

  const value = React.useMemo<IModelFavoritesContextValue>(
    () => ({
      favorites: iModelFavorites,
      add: addIModelToFavorites,
      remove: removeIModelFromFavorites,
    }),
    [iModelFavorites, addIModelToFavorites, removeIModelFromFavorites]
  );

  return (
    <IModelFavoritesContext.Provider value={value}>
      {children}
    </IModelFavoritesContext.Provider>
  );
};

export const useIModelFavoritesContext = () => {
  const ctx = React.useContext(IModelFavoritesContext);
  if (!ctx) {
    console.warn(
      "useIModelFavoritesContext must be used within IModelFavoritesProvider"
    );
  }
  return ctx;
};
