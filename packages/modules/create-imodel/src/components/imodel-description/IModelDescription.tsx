/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledTextarea } from "@itwin/itwinui-react";
import React from "react";

import { IModelContext } from "../context/imodel-context";

export type IModelDescriptionProps = {
  /** iModel description property. */
  descriptionString?: string;
  /** Error message when description is too long. */
  descriptionTooLong?: string;
  /** Message to be displayed below input field */
  message?: string;
  /** Maximum length */
  maxLength?: number;
};

export function IModelDescription(props: IModelDescriptionProps) {
  const MAX_LENGTH = props.maxLength || 255;

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const context = React.useContext(IModelContext);
  return (
    <LabeledTextarea
      label={props?.descriptionString ?? "Description"}
      name="description"
      value={context?.iModel?.description}
      onChange={context?.onChange}
      rows={4}
      message={
        isPropertyInvalid(context?.iModel?.description as string)
          ? props?.descriptionTooLong
          : props?.message
      }
      status={
        isPropertyInvalid(context?.iModel?.description as string)
          ? "negative"
          : undefined
      }
      autoComplete="off"
    />
  );
}
