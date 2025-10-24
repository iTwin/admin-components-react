/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useState } from "react";

import { AccessTokenProvider } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

const HOOK_ABORT_ERROR =
  "The fetch request was aborted by the cleanup function.";

/**
 * Custom hook to manage iTwin favorites.
 * @param {AccessTokenProvider} accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param {ApiOverrides<ITwinFull[]>} [apiOverrides] - Optional API overrides.
 * @returns {object} - An object containing:
 * - {Set<string>} iTwinFavorites - A set of iTwin IDs that are marked as favorites.
 * - {function} addITwinToFavorites - A function to add an iTwin to favorites.
 * - {function} removeITwinFromFavorites - A function to remove an iTwin from favorites.
 * - {boolean} shouldRefetchFavorites - A boolean indicating whether to refetch favorites when switching to the favorites tab.
 * - {function} resetShouldRefetchFavorites - A function to reset shouldRefetchFavorites back to false.
 */
export const useITwinFavorites = (
  accessToken: AccessTokenProvider | undefined,
  serverEnvironmentPrefix?: "dev" | "qa" | ""
): {
  iTwinFavorites: Set<string>;
  addITwinToFavorites: (iTwinId: string) => Promise<void>;
  removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
  shouldRefetchFavorites: boolean;
  resetShouldRefetchFavorites: () => void;
} => {
  const [iTwinFavorites, setITwinFavorites] = useState(new Set<string>());
  const [shouldRefetchFavorites, setShouldRefetchFavorites] = useState(false);

  /**
   * Adds an iTwin to the favorites.
   * @param {string} iTwinId - The ID of the iTwin to add to favorites.
   * @returns {Promise<void>}
   */
  const addITwinToFavorites = useCallback(
    async (iTwinId: string): Promise<void> => {
      if (!accessToken || !iTwinId || iTwinId === "") {
        return;
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/itwins/favorites/${iTwinId}`;
      try {
        const result = await fetch(url, {
          method: "POST",
          headers: {
            authorization:
              typeof accessToken === "function"
                ? await accessToken()
                : accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v1+json",
          },
        });

        if (!result || (result.status !== 200 && result.status !== 204)) {
          throw new Error(`Failed to add iTwin ${iTwinId} to favorites`);
        }

        setITwinFavorites((prev) => new Set([...prev, iTwinId]));
        setShouldRefetchFavorites(true);
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, serverEnvironmentPrefix]
  );

  /**
   * Removes an iTwin from the favorites.
   * @param {string} iTwinId - The ID of the iTwin to remove from favorites.
   * @returns {Promise<void>}
   */
  const removeITwinFromFavorites = useCallback(
    async (iTwinId: string): Promise<void> => {
      if (!accessToken || !iTwinId || iTwinId === "") {
        return;
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/itwins/favorites/${iTwinId}`;
      try {
        const result = await fetch(url, {
          method: "DELETE",
          headers: {
            authorization:
              typeof accessToken === "function"
                ? await accessToken()
                : accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v1+json",
          },
        });

        if (!result || (result.status !== 200 && result.status !== 204)) {
          throw new Error(`Failed to remove iTwin ${iTwinId} to favorites`);
        }

        setITwinFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(iTwinId);
          return newFavorites;
        });
        setShouldRefetchFavorites(true);
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, serverEnvironmentPrefix]
  );

  /**
   * Fetches iTwin favorites from the API.
   * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
   * @returns {Promise<ITwinFavorites[]>} - A promise that resolves to an array of iTwin favorites.
   * @throws {Error} - Throws an error if the fetch request fails.
   */
  const getITwinFavorites = useCallback(
    async (abortSignal?: AbortSignal): Promise<ITwinFavorites[]> => {
      if (!accessToken) {
        return [];
      }
      const url = `${_getAPIServer(
        serverEnvironmentPrefix
      )}/itwins/favorites?subClass=Project`;
      const result = await fetch(url, {
        headers: {
          "Cache-Control": shouldRefetchFavorites ? "no-cache" : "",
          authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
        signal: abortSignal,
      });
      if (abortSignal?.aborted) {
        throw new Error(HOOK_ABORT_ERROR);
      }
      if (!result) {
        throw new Error(
          `Failed to fetch iTwin favorites from ${url}.\nNo response.`
        );
      }
      if (result.status !== 200) {
        throw new Error(
          `Failed to fetch iTwin favorites from ${url}.\nStatus: ${result.status}`
        );
      }
      const response: ITwinFavoritesResponse = await result.json();
      return response.iTwins;
    },
    [accessToken, serverEnvironmentPrefix, shouldRefetchFavorites]
  );

  const resetShouldRefetchFavorites = useCallback(() => {
    setShouldRefetchFavorites(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    /**
     * Fetches iTwin favorites and updates the state.
     * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
     */
    const fetchITwinFavorites = async (abortSignal?: AbortSignal) => {
      try {
        const favorites = await getITwinFavorites(abortSignal);
        setITwinFavorites(new Set(favorites.map((favorite) => favorite.id)));
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
    void fetchITwinFavorites(controller.signal);

    return () => {
      controller.abort();
    };
  }, [getITwinFavorites]);

  return {
    iTwinFavorites,
    addITwinToFavorites,
    removeITwinFromFavorites,
    shouldRefetchFavorites,
    resetShouldRefetchFavorites,
  };
};

/** Response from https://developer.bentley.com/apis/iTwins/operations/get-my-favorite-itwins/ */
interface ITwinFavoritesResponse {
  iTwins: ITwinFavorites[];
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
interface ITwinFavorites {
  id: string;
  class: string;
  subClass: string;
  type: string;
  // eslint-disable-next-line id-blacklist
  number: string;
  displayName: string;
}
