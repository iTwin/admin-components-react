import { AccessTokenProvider } from "../../types";
/**
 * Custom hook to manage iModel favorites.
 * @param iTwinId - The ID of the iTwin for which to fetch favorites.
 * @param accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param serverEnvironmentPrefix - Optional server environment prefix.
 * @param disabled - Optional flag to disable fetching of the favorites in the hook.
 * @returns An object containing:
 * - {Set<string>} iModelFavorites - A set of iModel IDs that are marked as favorites.
 * - {function} addIModelToFavorites - A function to add an iModel to favorites.
 * - {function} removeIModelFromFavorites - A function to remove an iModel from favorites.
 */
export declare const useIModelFavorites: (iTwinId: string | undefined, accessToken: AccessTokenProvider | undefined, serverEnvironmentPrefix?: "dev" | "qa" | "", disabled?: boolean) => {
    iModelFavorites: Set<string>;
    addIModelToFavorites: (iModelId: string) => Promise<void>;
    removeIModelFromFavorites: (iModelId: string) => Promise<void>;
};
