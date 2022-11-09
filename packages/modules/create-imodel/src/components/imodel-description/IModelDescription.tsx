/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledTextarea } from "@itwin/itwinui-react";
import React from "react";

import { isPropertyInvalid, MAX_LENGTH } from "../../utils";
import { IModelContext } from "../context/imodel-context";

export function IModelDescription() {
  const { imodel, descriptionString, onPropChange, descriptionTooLong } =
    React.useContext(IModelContext);
  return (
    <LabeledTextarea
      label={descriptionString ?? "Description"}
      name="description"
      value={imodel.description}
      onChange={onPropChange}
      rows={4}
      message={
        isPropertyInvalid(imodel.description, MAX_LENGTH)
          ? descriptionTooLong
          : undefined
      }
      status={
        isPropertyInvalid(imodel.description, MAX_LENGTH)
          ? "negative"
          : undefined
      }
      autoComplete="off"
      textareaClassName="iac-imodel-input-element"
    />
  );
}
