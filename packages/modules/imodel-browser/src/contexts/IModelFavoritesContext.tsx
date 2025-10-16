/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useIModelFavorites } from "../containers/iModelGrid/useIIModelFavorites";

export interface IModelFavoritesContextValue {
  favorites: Set<string>;
  add: (iModelId: string) => Promise<void>;
  remove: (iModelId: string) => Promise<void>;
  /** @internal implementation detail for legacy flows */
  _shouldRefetch: boolean;
  /** @internal implementation detail for legacy flows */
  _resetShouldRefetch: () => void;
}

export const IModelFavoritesContext = React.createContext<
  IModelFavoritesContextValue | undefined
>(undefined);

export interface IModelFavoritesProviderProps {
  iTwinId: string;
  accessToken?: string | (() => Promise<string>);
  serverEnvironmentPrefix?: string;
  children: React.ReactNode;
}

export const IModelFavoritesProvider = ({
  iTwinId,
  accessToken,
  serverEnvironmentPrefix,
  children,
}: IModelFavoritesProviderProps) => {
  const {
    iModelFavorites,
    addIModelToFavorites,
    removeIModelFromFavorites,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
  } = useIModelFavorites(
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
      _shouldRefetch: shouldRefetchFavorites,
      _resetShouldRefetch: resetShouldRefetchFavorites,
    }),
    [
      iModelFavorites,
      addIModelToFavorites,
      removeIModelFromFavorites,
      shouldRefetchFavorites,
      resetShouldRefetchFavorites,
    ]
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
