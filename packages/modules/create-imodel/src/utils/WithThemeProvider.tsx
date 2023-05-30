/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./WithThemeProvider.scss";

import { ThemeProvider } from "@itwin/itwinui-react";
import React, { ComponentType } from "react";

/** HOC that will wrap the component with ThemeProvider */
export const withThemeProvider =
  <P extends Record<string, unknown>>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <ThemeProvider className={"iac-themeProvider"} theme="inherit">
        <Component {...props} />
      </ThemeProvider>
    );
