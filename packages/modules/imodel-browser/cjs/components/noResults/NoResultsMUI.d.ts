import React from "react";
/** @alpha */
export interface NoResultsMUIProps {
    /** Displayed text */
    text: string;
    subtext?: string;
    isSearchResult?: boolean;
}
/**
 * Pre-formatted empty result page (MUI version)
 * @alpha
 */
export declare const NoResultsMUI: ({ text, subtext, isSearchResult, }: NoResultsMUIProps) => React.JSX.Element;
