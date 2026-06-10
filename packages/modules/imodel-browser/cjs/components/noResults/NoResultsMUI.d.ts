import React from "react";
/** @alpha */
export interface NoResultsMUIProps {
    /** Displayed text */
    text: string;
    subtext?: string;
    isSearchResult?: boolean;
}
/**
 * No results page for use on iTwinGrid and iModelGrid.
 * @alpha
 */
export declare const NoResultsMUI: ({ text, subtext, isSearchResult, }: NoResultsMUIProps) => React.JSX.Element;
