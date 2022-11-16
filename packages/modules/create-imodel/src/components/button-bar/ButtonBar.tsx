/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ButtonBar.scss";

import { Button } from "@itwin/itwinui-react";
import React from "react";

import {
  InnerIModelContext,
  useIModelContext,
} from "../context/imodel-context";

export type ButtonBarProps = {
  /** Button wrapper class */
  className?: string;
  /** Children to have custom ButtonBar content */
  children?: React.ReactNode;
};

export function ButtonBar({ className, children }: ButtonBarProps) {
  const { confirmButtonText, cancelButtonText } =
    React.useContext(InnerIModelContext);
  const { isPrimaryButtonDisabled, confirmAction, cancelAction } =
    useIModelContext();
  return (
    <div className={`iac-button-bar ${className}`}>
      {children ?? (
        <>
          <Button
            styleType="cta"
            disabled={isPrimaryButtonDisabled}
            onClick={confirmAction}
          >
            {confirmButtonText}
          </Button>
          <Button onClick={cancelAction}>{cancelButtonText}</Button>
        </>
      )}
    </div>
  );
}
