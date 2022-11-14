/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ButtonBar.scss";

import { Button } from "@itwin/itwinui-react";
import React from "react";

import { IModelContext } from "../context/imodel-context";

export type ButtonBarProps = {
  /** Confirm action callback function */
  confirmAction?: (input: () => void | undefined) => void | undefined;
  /** Is confirm button disabled */
  isConfirmDisabled?: boolean;
  /** Is cancel button disabled */
  isCancelDisabled?: boolean;
  /** Button wrapper class */
  className?: string;
};

export function ButtonBar(props: ButtonBarProps) {
  const {
    confirmButtonText,
    cancelButtonText,
    confirmAction,
    cancelAction,
    isPrimaryButtonDisabled,
  } = React.useContext(IModelContext);
  const customWrapperClass = props.className;
  return (
    <div className={customWrapperClass ?? "iac-button-bar"}>
      <Button
        styleType="cta"
        disabled={isPrimaryButtonDisabled || props.isConfirmDisabled}
        onClick={() => {
          props.confirmAction
            ? props.confirmAction(confirmAction)
            : confirmAction();
        }}
      >
        {confirmButtonText}
      </Button>
      <Button disabled={props.isCancelDisabled} onClick={cancelAction}>
        {cancelButtonText}
      </Button>
    </div>
  );
}
