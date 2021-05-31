/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import {
  LogFunc,
  ManageVersionsStringOverrides,
} from "../components/ManageVersions/types";

const ConfigContext = React.createContext<
  | {
      accessToken: string;
      apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
      imodelId: string;
      stringsOverrides: ManageVersionsStringOverrides;
      log?: LogFunc;
    }
  | undefined
>(undefined);

export type ConfigProviderProps = {
  accessToken: string;
  apiOverrides?: { serverEnvironmentPrefix?: "dev" | "qa" | "" };
  imodelId: string;
  stringsOverrides: ManageVersionsStringOverrides;
  log?: LogFunc;
  children: React.ReactNode;
};

export const ConfigProvider = (props: ConfigProviderProps) => {
  const { children, ...rest } = props;
  return (
    <ConfigContext.Provider value={rest}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigContext");
  }
  return context;
};
