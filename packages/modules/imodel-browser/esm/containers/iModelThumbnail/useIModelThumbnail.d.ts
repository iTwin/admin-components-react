import { AccessTokenProvider, ApiOverrides } from "../../types";
/** Use cached thumbnail or upload thumbnail from server */
export declare const useIModelThumbnail: (iModelId: string, accessToken?: AccessTokenProvider, apiOverrides?: ApiOverrides<string>) => string | undefined;
