/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledInput } from "@itwin/itwinui-react";
import React from "react";

import { isPropertyInvalid, MAX_LENGTH } from "../../utils";
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
        isPropertyInvalid(imodel.name, MAX_LENGTH) ? nameTooLong : undefined
      }
      status={
        isPropertyInvalid(imodel.name, MAX_LENGTH) ? "negative" : undefined
      }
      autoComplete="off"
      className="iui-input-elements"
    />
  );
}
