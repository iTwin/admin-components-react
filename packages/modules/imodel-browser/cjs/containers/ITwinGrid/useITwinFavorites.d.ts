import { AccessTokenProvider } from "../../types";
/**
 * Custom hook to manage iTwin favorites.
 * @param accessToken - Access token that requires the `itwin-platform` scope. Provide a function that returns the token to prevent the token from expiring.
 * @param serverEnvironmentPrefix Optional server environment prefix to target different environments. Can be "dev", "qa", or "" (empty string for production)
 * @returns {object} An object containing:
 * - {Set<string>} iTwinFavorites - A set of iTwin IDs that are marked as favorites.
 * - {function} addITwinToFavorites - A function to add an iTwin to favorites.
 * - {function} removeITwinFromFavorites - A function to remove an iTwin from favorites.
 * - {boolean} shouldRefetchFavorites - A boolean indicating whether to refetch favorites when switching to the favorites tab.
 * - {function} resetShouldRefetchFavorites - A function to reset shouldRefetchFavorites back to false.
 */
export declare const useITwinFavorites: (accessToken: AccessTokenProvider | undefined, serverEnvironmentPrefix?: "dev" | "qa" | "") => {
    iTwinFavorites: Set<string>;
    addITwinToFavorites: (iTwinId: string) => Promise<void>;
    removeITwinFromFavorites: (iTwinId: string) => Promise<void>;
    shouldRefetchFavorites: boolean;
    resetShouldRefetchFavorites: () => void;
};
