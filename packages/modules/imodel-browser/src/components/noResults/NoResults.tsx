/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./NoResults.scss";

import { SvgImodelHollow } from "@itwin/itwinui-icons-react";
import { Leading } from "@itwin/itwinui-react";
import classnames from "classnames";
import React from "react";

export interface NoResultsProps {
  /** Displayed text */
  text: string;
}

/** Pre-formatted empty result page */
export const NoResults = ({ text }: NoResultsProps) => {
  return (
    <Leading isMuted={true} className={classnames("iac-no-results")}>
      <SvgImodelHollow />
      <span>{text}</span>
    </Leading>
  );
};
