/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./NoResults.scss";

import { SvgImodelHollow } from "@itwin/itwinui-icons-react";
import { Text } from "@itwin/itwinui-react";
import React from "react";

export interface NoResultsProps {
  /** Displayed text */
  text: string;
}

/** Pre-formatted empty result page */
export const NoResults = ({ text }: NoResultsProps) => {
  return (
    <Text variant="leading" isMuted={true} className={"iac-no-results"}>
      <SvgImodelHollow />
      <span>{text}</span>
    </Text>
  );
};
