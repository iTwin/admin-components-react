/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { createContext, useState } from "react";

import { iModelExtent } from "../../types";

export type iModelProps = {
  name: string;
  description: string;
  thumbnail?: { src?: ArrayBuffer; type: string };
  extent?: iModelExtent | null;
};

type ContextProps = {
  imodel: iModelProps;
  onPropChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (src: ArrayBuffer, type: string) => void;
  nameString?: string;
  nameTooLong?: string;
  descriptionString?: string;
  descriptionTooLong?: string;
};

export const IModelContext = createContext<ContextProps>({} as ContextProps);
