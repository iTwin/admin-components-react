/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledInput } from "@itwin/itwinui-react";
import React from "react";

import { IModelContext } from "../context/imodel-context";

export type IModelNameProps = {
  /** iModel name property. */
  nameString?: string;
  /** Error message when name is too long. */
  nameTooLong?: string;
  /** Message to be displayed below input field */
  message?: string;
  /** Maximum length */
  maxLength?: number;
};

export function IModelName(props: IModelNameProps) {
  const MAX_LENGTH = props.maxLength || 255;

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const context = React.useContext(IModelContext);
  return (
    <LabeledInput
      label={props?.nameString ?? "Name"}
      name="name"
      setFocus
      required
      value={context?.iModel?.name}
      onChange={context?.onChange}
      message={
        isPropertyInvalid(context?.iModel?.name as string)
          ? props?.nameTooLong
          : props?.message
      }
      status={
        isPropertyInvalid(context?.iModel?.name as string)
          ? "negative"
          : undefined
      }
      autoComplete="off"
    />
  );
}
