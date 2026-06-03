import React from "react";
import { AccessTokenProvider, ApiOverrides } from "../../types";
export interface IModelThumbnailProps {
    className?: string;
    /** Id of the iModel to fetch thumbnail for */
    iModelId: string;
    /** Triggered on the image click, controls pointer */
    onClick?(iModelId: string): void;
    accessToken?: AccessTokenProvider;
    /** Object that configures different overrides for the API
     * @property data thumbnail URL
     * @property serverEnvironmentPrefix Either qa or dev
     */
    apiOverrides?: ApiOverrides<string>;
}
/** Clickable iModel thumbnail, fetched from the servers */
export declare const IModelThumbnail: ({ iModelId, accessToken, apiOverrides, className, }: IModelThumbnailProps) => React.JSX.Element;
