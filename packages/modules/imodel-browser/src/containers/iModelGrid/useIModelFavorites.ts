/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useState } from "react";

import { AccessTokenProvider } from "../../types";
import * as iModelApi from "../../utils/iModelApi";

/**
 * Custom hook to manage iModel favorites.
 * @param iTwinId - The ID of the iTwin for which to fetch favorites.
 * @param accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param serverEnvironmentPrefix - Optional server environment prefix.
 * @returns An object containing:
 * - {Set<string>} iModelFavorites - A set of iModel IDs that are marked as favorites.
 * - {function} addIModelToFavorites - A function to add an iModel to favorites.
 * - {function} removeIModelFromFavorites - A function to remove an iModel from favorites.
 */
export const useIModelFavorites = (
  iTwinId: string | undefined,
  accessToken: AccessTokenProvider | undefined,
  serverEnvironmentPrefix?: "dev" | "qa" | ""
): {
  iModelFavorites: Set<string>;
  addIModelToFavorites: (iModelId: string) => Promise<void>;
  removeIModelFromFavorites: (iModelId: string) => Promise<void>;
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
      try {
        await iModelApi.addIModelToFavorites({
          iModelId,
          accessToken,
          serverEnvironmentPrefix,
        });

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
      try {
        await iModelApi.removeIModelFromFavorites({
          iModelId,
          accessToken,
          serverEnvironmentPrefix,
        });

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

  useEffect(() => {
    const controller = new AbortController();
    /**
     * Fetches iTwin favorites and updates the state.
     * @param {AbortSignal} [abortSignal] - Optional abort signal to cancel the fetch request.
     */
    const fetchIModelFavorites = async (abortSignal?: AbortSignal) => {
      try {
        if (!iTwinId || !accessToken) {
          setIModelFavorites(new Set());
          return;
        }

        const favorites = await iModelApi.getIModelFavorites({
          iTwinId,
          accessToken,
          serverEnvironmentPrefix,
          abortSignal,
        });
        setIModelFavorites(new Set(favorites.map((favorite) => favorite.id)));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error(error);
      }
    };
    void fetchIModelFavorites(controller.signal);

    return () => {
      controller.abort();
    };
  }, [iTwinId, accessToken, serverEnvironmentPrefix]);

  return {
    iModelFavorites,
    addIModelToFavorites,
    removeIModelFromFavorites,
  };
};
