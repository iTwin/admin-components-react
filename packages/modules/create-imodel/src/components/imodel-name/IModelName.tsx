/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledInput } from "@itwin/itwinui-react";
import React from "react";

import { isPropertyInvalid, maxLength } from "../../utils";
import { IModelContext } from "../context/imodel-context";

export function IModelName() {
  const { nameString, imodel, onPropChange, nameTooLong } =
    React.useContext(IModelContext);
  return (
    <LabeledInput
      label={nameString ?? "Name"}
      name="name"
      setFocus
      required
      value={imodel?.name}
      onChange={onPropChange}
      message={
        isPropertyInvalid(imodel.name as string, maxLength)
          ? nameTooLong
          : undefined
      }
      status={
        isPropertyInvalid(imodel.name as string, maxLength)
          ? "negative"
          : undefined
      }
      autoComplete="off"
    />
  );
}
