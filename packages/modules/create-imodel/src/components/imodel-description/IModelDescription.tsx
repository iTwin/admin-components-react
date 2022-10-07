/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LabeledTextarea } from "@itwin/itwinui-react";
import React from "react";

import { BaseiModelContext } from "../base-imodel/BaseIModel";

export type IModelDescriptionProps = {
  /** iModel description property. */
  descriptionString?: string;
  /** Error message when description is too long. */
  descriptionTooLong?: string;
  /** iModel description. */
  description?: string;
  onPropChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function IModelDescription(props: IModelDescriptionProps) {
  const MAX_LENGTH = 255;

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const context = React.useContext(BaseiModelContext);

  const descriptionString = props.descriptionString
    ? props.descriptionString
    : context?.props?.stringsOverrides?.descriptionString;

  const descriptionTooLong = props.descriptionTooLong
    ? props.descriptionTooLong
    : context?.props?.stringsOverrides?.descriptionTooLong;

  const description = props.description
    ? props.description
    : context?.imodel?.description;

  const onPropChange = props.onPropChange
    ? props.onPropChange
    : context?.onPropChange;

  return (
    <LabeledTextarea
      label={descriptionString ?? "Description"}
      name="description"
      value={description}
      onChange={onPropChange}
      rows={4}
      message={
        isPropertyInvalid(description as string)
          ? descriptionTooLong
          : undefined
      }
      status={isPropertyInvalid(description as string) ? "negative" : undefined}
      autoComplete="off"
    />
  );
}
