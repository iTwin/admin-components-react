/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import classNames from "classnames";
import React from "react";

import styles from "./GridStructure.module.scss";
export const GridStructure = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} className={classNames(styles.base, props.className)} />
  );
};
