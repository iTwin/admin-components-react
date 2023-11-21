/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationCallbackHandler } from "@bentley/frontend-authorization-client";

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
BrowserAuthorizationCallbackHandler.handleSigninCallback(
  window.location.toString()
).catch(console.log);
