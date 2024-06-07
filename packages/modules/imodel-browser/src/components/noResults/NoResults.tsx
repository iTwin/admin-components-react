/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./NoResults.scss";

import { SvgImodelHollow, SvgSearch } from "@itwin/itwinui-icons-react";
import { Text } from "@itwin/itwinui-react";
import React from "react";

export interface NoResultsProps {
  /** Displayed text */
  text: string;
  subtext?: string;
  isSearchResult?: boolean;
}

/** Pre-formatted empty result page */
export const NoResults = ({
  text,
  subtext,
  isSearchResult = false,
}: NoResultsProps) => {
  const renderNoresultsComponent = () => {
    return (
      <Text variant="leading" isMuted={true} className={"iac-no-results"}>
        <SvgImodelHollow />
        <span>{text}</span>
      </Text>
    );
  };

  const renderNoSearchResultsComponent = () => {
    return (
      <div className="iac-no-search-results-container">
        <div className="iac-no-search-results">
          <SvgSearch />
          <Text variant="leading">{text}</Text>
          {subtext && <Text>{subtext}</Text>}
        </div>
      </div>
    );
  };

  return isSearchResult
    ? renderNoSearchResultsComponent()
    : renderNoresultsComponent();
};
