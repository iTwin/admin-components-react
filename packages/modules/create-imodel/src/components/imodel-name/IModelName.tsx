/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledInput } from "@itwin/itwinui-react";
import React from "react";

import { BaseiModelContext } from "../base-imodel/BaseIModel";

export type IModelNameProps = {
  /** iModel name property. */
  nameString?: string;
  /** Error message when name is too long. */
  nameTooLong?: string;
  /** iModel name. */
  name?: string;
  onPropChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function IModelName(props: IModelNameProps) {
  const MAX_LENGTH = 255;

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const context = React.useContext(BaseiModelContext);

  const nameString = props.nameString
    ? props.nameString
    : context?.props?.stringsOverrides?.nameString;

  const nameTooLong = props.nameTooLong
    ? props.nameTooLong
    : context?.props?.stringsOverrides?.nameTooLong;

  const name = props.name ? props.name : context?.imodel?.name;

  const onPropChange = props.onPropChange
    ? props.onPropChange
    : context?.onPropChange;

  return (
    <LabeledInput
      label={nameString ?? "Name"}
      name="name"
      setFocus
      required
      value={name}
      onChange={onPropChange}
      message={isPropertyInvalid(name as string) ? nameTooLong : undefined}
      status={isPropertyInvalid(name as string) ? "negative" : undefined}
      autoComplete="off"
    />
  );
}
