/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./NoSearchResults.scss";

import { SvgSearch } from "@itwin/itwinui-icons-react";
import { Text } from "@itwin/itwinui-react";
import React from "react";

export interface NoSearchResultsProps {
  /** Displayed text */
  text: string;
  /** Displayed subtext */
  subtext?: string;
}

/** Pre-formatted empty result page */
export const NoSearchResults = ({ text, subtext }: NoSearchResultsProps) => {
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
