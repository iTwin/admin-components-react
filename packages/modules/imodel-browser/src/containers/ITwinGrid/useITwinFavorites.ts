/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useState } from "react";

import { ApiOverrides, ITwinFull } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

const HOOK_ABORT_ERROR =
  "The fetch request was aborted by the cleanup function.";

/**
 * Custom hook to manage iTwin favorites.
 * @param {string | (() => Promise<string>) | undefined} accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param {ApiOverrides<ITwinFull[]>} [apiOverrides] - Optional API overrides.
 * @returns {object} - An object containing:
 * - {Set<string>} iTwinFavorites - A set of iTwin IDs that are marked as favorites.
 * - {function} addITwinToFavorites - A function to add an iTwin to favorites.
 * - {function} removeITwinFromFavorites - A function to remove an iTwin from favorites.
 */
export const useITwinFavorites = (
  accessToken: string | (() => Promise<string>) | undefined,
  apiOverrides?: ApiOverrides<ITwinFull[]>
): {
  iTwinFavorites: Set<string>;
  addITwinToFavorites: (iTwinId: string) => Promise<void>;
  removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
} => {
  const [iTwinFavorites, setITwinFavorites] = useState(new Set<string>());

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
      const url = `${_getAPIServer(apiOverrides)}/itwins/favorites/${iTwinId}`;
      await fetch(url, {
        method: "POST",
        headers: {
          authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
      });

      setITwinFavorites((prev) => new Set([...prev, iTwinId]));
    },
    [accessToken, apiOverrides]
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
      const url = `${_getAPIServer(apiOverrides)}/itwins/favorites/${iTwinId}`;
      await fetch(url, {
        method: "DELETE",
        headers: {
          authorization:
            typeof accessToken === "function"
              ? await accessToken()
              : accessToken,
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
      });

      setITwinFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(iTwinId);
        return newFavorites;
      });
    },
    [accessToken, apiOverrides]
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
        apiOverrides
      )}/itwins/favorites?subClass=Project`;
      const result = await fetch(url, {
        headers: {
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
    [accessToken, apiOverrides]
  );

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

  return { iTwinFavorites, addITwinToFavorites, removeITwinFromFavorites };
};

/** Response from https://developer.bentley.com/apis/iTwins/operations/get-my-favorite-itwins/ */
interface ITwinFavoritesResponse {
  iTwins: ITwinFavorites[];
  _links: {
    self: {
      href: string;
    };
    prev: {
      href: string;
    };
    next: {
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