/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useState } from "react";

import { _getAPIServer } from "../../utils/_apiOverrides";

const HOOK_ABORT_ERROR =
  "The fetch request was aborted by the cleanup function.";

/**
 * Custom hook to manage iModel favorites.
 * @param {string | (() => Promise<string>) | undefined} accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param {ApiOverrides<IModelFull[]>} [apiOverrides] - Optional API overrides.
 * @returns {object} - An object containing:
 * - {Set<string>} iModelFavorites - A set of iModel IDs that are marked as favorites.
 * - {function} addIModelToFavorites - A function to add an iModel to favorites.
 * - {function} removeIModelFromFavorites - A function to remove an iModel from favorites.
 */
export const useIModelFavorites = (
  iTwinId: string,
  accessToken: string | (() => Promise<string>) | undefined,
  serverEnvironmentPrefix?: "dev" | "qa" | ""
): {
  iModelFavorites: Set<string>;
  addIModelToFavorites: (iTwinId: string) => Promise<void>;
  removeIModelFromFavorites: (iTwinId: string) => Promise<void>;
} => {
  const [iModelFavorites, setIModelFavorites] = useState(new Set<string>());

  /**
   * Adds an iModel to the favorites.
   * @param {string} iModelId - The ID of the iModel to add to favorites.
   * @returns {Promise<void>}
   */
  const addIModelToFavorites = useCallback(
    async (iModelId: string): Promise<void> => {
      if (!accessToken || !iModelId || iModelId === "") {
        return;
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/imodels/favorites/${iModelId}`;
      try {
        const result = await fetch(url, {
          method: "PUT",
          headers: {
            authorization:
              typeof accessToken === "function"
                ? await accessToken()
                : accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
          },
        });

        if (!result || (result.status !== 200 && result.status !== 204)) {
          throw new Error(`Failed to add iModel ${iModelId} to favorites`);
        }

        setIModelFavorites((prev) => new Set([...prev, iModelId]));
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, serverEnvironmentPrefix]
  );

  /**
   * Removes an iModel from the favorites.
   * @param {string} iModelId - The ID of the iModel to remove from favorites.
   * @returns {Promise<void>}
   */
  const removeIModelFromFavorites = useCallback(
    async (iModelId: string): Promise<void> => {
      if (!accessToken || !iModelId || iModelId === "") {
        return;
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/imodels/favorites/${iModelId}`;
      try {
        const result = await fetch(url, {
          method: "DELETE",
          headers: {
            authorization:
              typeof accessToken === "function"
                ? await accessToken()
                : accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
          },
        });

        if (!result || (result.status !== 200 && result.status !== 204)) {
          throw new Error(`Failed to remove iModel ${iModelId} to favorites`);
        }

        setIModelFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(iModelId);
          return newFavorites;
        });
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, serverEnvironmentPrefix]
  );

  /**
   * Fetches iTwin favorites from the API.
   * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
   * @returns {Promise<IModelFavorites[]>} - A promise that resolves to an array of iTwin favorites.
   * @throws {Error} - Throws an error if the fetch request fails.
   */
  const getIModelFavorites = useCallback(
    async (abortSignal?: AbortSignal): Promise<IModelFavorites[]> => {
      if (!accessToken || !iTwinId) {
        return [];
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/imodels/favorites?iTwinId=${iTwinId}`;
      const result = await fetch(url, {
        headers: {
          authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Accept: "application/vnd.bentley.itwin-platform.v2+json",
        },
        signal: abortSignal,
      });
      if (abortSignal?.aborted) {
        throw new Error(HOOK_ABORT_ERROR);
      }
      if (!result) {
        throw new Error(
          `Failed to fetch iModels favorites from ${url}.\nNo response.`
        );
      }
      if (result.status !== 200) {
        throw new Error(
          `Failed to fetch iModels favorites from ${url}.\nStatus: ${result.status}`
        );
      }
      const response: IModelFavoritesResponse = await result.json();
      return response.iModels;
    },
    [accessToken, iTwinId, serverEnvironmentPrefix]
  );

  useEffect(() => {
    const controller = new AbortController();
    /**
     * Fetches iTwin favorites and updates the state.
     * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
     */
    const fetchIModelFavorites = async (abortSignal?: AbortSignal) => {
      try {
        const favorites = await getIModelFavorites(abortSignal);
        setIModelFavorites(new Set(favorites.map((favorite) => favorite.id)));
      } catch (error) {
        if (
          error === HOOK_ABORT_ERROR ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }
        console.error(error);
      }
    };
    void fetchIModelFavorites(controller.signal);

    return () => {
      controller.abort();
    };
  }, [getIModelFavorites]);

  return {
    iModelFavorites,
    addIModelToFavorites,
    removeIModelFromFavorites,
  };
};

/** Response from https://developer.bentley.com/apis/imodels-v2/operations/get-my-favorite-imodels/ */
interface IModelFavoritesResponse {
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
interface IModelFavorites {
  id: string;
  displayName: string;
  dataCenterLocation: string;
}
