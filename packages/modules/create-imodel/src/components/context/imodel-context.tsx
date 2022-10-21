/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { createContext, useState } from "react";

import { iModelExtent } from "../../types";

type iModelProps = {
  name: string;
  description: string;
  thumbnail?: { src?: ArrayBuffer; type: string };
  extent?: iModelExtent | null;
};

type ContextProps = {
  iModel: iModelProps;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (src: ArrayBuffer, type: string) => void;
  setImodel: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      thumbnail?:
        | {
            src?: ArrayBuffer | undefined;
            type: string;
          }
        | undefined;
      extent?: iModelExtent | null | undefined;
    }>
  >;
  isThumbnailChanged: boolean;
};

type userContextProviderPorps = {
  children: React.ReactNode;
};

export const IModelContext = createContext<ContextProps>({} as ContextProps);

export const IModelContextProvider = ({
  children,
}: userContextProviderPorps) => {
  const [iModel, setImodel] = useState<{
    name: string;
    description: string;
    thumbnail?: { src?: ArrayBuffer; type: string };
    extent?: iModelExtent | null;
  }>({
    name: "",
    description: "",
    thumbnail: { src: undefined, type: "image/png" },
    extent: null,
  });

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist();
    setImodel((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value ?? "",
    }));
  };

  const [isThumbnailChanged, setIsThumbnailChanged] =
    React.useState<boolean>(false);

  const onImageChange = (src: ArrayBuffer, type: string) => {
    setIsThumbnailChanged(true);
    setImodel((prevState) => ({
      ...prevState,
      thumbnail: { src, type },
    }));
  };

  return (
    <IModelContext.Provider
      value={{ iModel, setImodel, onChange, onImageChange, isThumbnailChanged }}
    >
      {children}
    </IModelContext.Provider>
  );
};
