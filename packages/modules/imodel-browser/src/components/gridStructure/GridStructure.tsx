/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./GridStructure.scss";

import classNames from "classnames";
import React from "react";

/** Browser container structure */
export const GridStructure = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={classNames("iac-grid-structure", props.className)}
    />
  );
};
