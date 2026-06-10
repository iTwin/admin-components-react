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
 * iModel thumbnail, fetched from the servers
 *
 * Currently the API will return a placeholder PNG thumbnail when the user has not chosen a custom thumbnail.
 * Unfortunately that means we can not show a nicely-formatted SVG thumbnail for those iModels.
 *
 * @alpha
 */
export declare const IModelThumbnailMUI: ({ iModelId, accessToken, apiOverrides, className, }: IModelThumbnailMUIProps) => React.JSX.Element;
