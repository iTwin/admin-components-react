/** Build APIM server url out of overrides
 * @private
 */
export declare const _getAPIServer: (serverEnvironmentPrefix?: "dev" | "qa" | "") => string;
/**
 * Merge 2 objects without overriding keys with undefined or null values.
 * @param defaults Complete string object
 * @param overrides Potentially incomplete string object
 * @returns
 */
export declare const _mergeStrings: <T extends Record<string, unknown>>(defaults: T, overrides: Partial<NoInfer<T>> | undefined) => T;
