/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationCallbackHandler } from "@bentley/frontend-authorization-client";

BrowserAuthorizationCallbackHandler.handleSigninCallback(
  window.location.toString()
).catch(console.log);
