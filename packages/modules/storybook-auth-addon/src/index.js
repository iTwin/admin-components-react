import { BrowserAuthorizationCallbackHandler } from "@bentley/frontend-authorization-client";

BrowserAuthorizationCallbackHandler.handleSigninCallback(window.location.toString()).catch(console.log);
