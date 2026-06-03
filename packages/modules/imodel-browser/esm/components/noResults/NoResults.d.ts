import "./NoResults.scss";
import React from "react";
export interface NoResultsProps {
    /** Displayed text */
    text: string;
    subtext?: string;
    isSearchResult?: boolean;
}
/** Pre-formatted empty result page */
export declare const NoResults: ({ text, subtext, isSearchResult, }: NoResultsProps) => React.JSX.Element;
