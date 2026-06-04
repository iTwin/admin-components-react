import React from "react";
import { AccessTokenProvider, ApiOverrides } from "../../types";
/** @alpha */
export interface IModelThumbnailMUIProps {
    className?: string;
    /** Id of the iModel to fetch thumbnail for */
    iModelId: string;
    accessToken?: AccessTokenProvider;
    /** Object that configures different overrides for the API
     * @property data thumbnail URL
     * @property serverEnvironmentPrefix Either qa or dev
     */
    apiOverrides?: ApiOverrides<string>;
}
/**
 * Clickable iModel thumbnail, fetched from the servers — MUI (Stratakit/MUI migration target)
 * @alpha
 */
export declare const IModelThumbnailMUI: ({ iModelId, accessToken, apiOverrides, className, }: IModelThumbnailMUIProps) => React.JSX.Element;
