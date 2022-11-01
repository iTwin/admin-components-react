/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledInput } from "@itwin/itwinui-react";
import React from "react";

import { isPropertyInvalid } from "../../utils";
import { IModelContext } from "../context/imodel-context";

export type IModelNameProps = {
  /** Message to be displayed below input field */
  message?: string;
};

export function IModelName(props: IModelNameProps) {
  const MAX_LENGTH = 255;
  const context = React.useContext(IModelContext);
  return (
    <LabeledInput
      label={context?.nameString ?? "Name"}
      name="name"
      setFocus
      required
      value={context?.imodel?.name}
      onChange={context?.onPropChange}
      message={
        isPropertyInvalid(context.imodel.name as string, MAX_LENGTH)
          ? context?.nameTooLong
          : props?.message
      }
      status={
        isPropertyInvalid(context.imodel.name as string, MAX_LENGTH)
          ? "negative"
          : undefined
      }
      autoComplete="off"
    />
  );
}
