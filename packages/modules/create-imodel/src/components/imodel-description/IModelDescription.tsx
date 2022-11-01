/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledTextarea } from "@itwin/itwinui-react";
import React from "react";

import { isPropertyInvalid } from "../../utils";
import { IModelContext } from "../context/imodel-context";

export type IModelDescriptionProps = {
  /** Message to be displayed below input field */
  message?: string;
};

export function IModelDescription(props: IModelDescriptionProps) {
  const MAX_LENGTH = 255;
  const context = React.useContext(IModelContext);
  return (
    <LabeledTextarea
      label={context?.descriptionString ?? "Description"}
      name="description"
      value={context.imodel.description}
      onChange={context?.onPropChange}
      rows={4}
      message={
        isPropertyInvalid(context.imodel.description as string, MAX_LENGTH)
          ? context?.descriptionTooLong
          : props?.message
      }
      status={
        isPropertyInvalid(context.imodel.description as string, MAX_LENGTH)
          ? "negative"
          : undefined
      }
      autoComplete="off"
    />
  );
}
