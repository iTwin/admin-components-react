/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { createContext, useContext, useState } from "react";

import { iModelExtent } from "../../types";

export type iModelProps = {
  name: string;
  description: string;
  thumbnail?: { src?: ArrayBuffer; type: string };
  extent?: iModelExtent | null;
};

type InnerIModelContextProps = {
  nameString: string;
  nameTooLong: string;
  descriptionString: string;
  descriptionTooLong: string;
  confirmButtonText: string;
  cancelButtonText: string;
};

export const InnerIModelContext = createContext<InnerIModelContextProps>(
  {} as InnerIModelContextProps
);

type IModelContextProps = {
  imodel: iModelProps;
  onPropChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (src: ArrayBuffer, type: string) => void;
  /** Confirm action callback function */
  confirmAction: () => void;
  /** Cancel action callback function */
  cancelAction?: () => void;
  /** Is confirm button disabled */
  isPrimaryButtonDisabled: boolean;
};

export const IModelContext = createContext<IModelContextProps>(
  {} as IModelContextProps
);

export const useIModelContext = () => {
  const context = useContext(IModelContext);
  if (!context) {
    throw "IModelContext must be used inside CreateIModel or UpdateImodel components";
  }
  return context;
};
