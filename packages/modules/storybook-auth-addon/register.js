/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import addons, { types } from "@storybook/addons";
import { useAddonState, useGlobals, useParameter } from "@storybook/api";
import { IconButton, Icons, Loader } from "@storybook/components";
import React, { useEffect, useState } from "react";

addons.register("auth/toolbar", () => {
  addons.add("auth-toolbar-addon/toolbar", {
    title: "OIDC Authentication toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const redirectURI = `${window.location.origin}${window.location.pathname}signin-oidc.html`;
      const [state, setState] = useAddonState("auth/toolbar", {
        loading: false,
        email: "",
      });
      const authClientConfig = useParameter("authClientConfig", {});
      const client = React.useRef(null);

      const [buildMissing, setBuildMissing] = useState(false);

      const authenticate = async () => {
        if (state.loading || buildMissing) {
          return;
        }
        const response = await fetch(redirectURI);
        if (!response.ok && response.status === 404) {
          setBuildMissing(true);
          return;
        }

        setState({ loading: true });
        let email = "";
        let tokenString = "";
        try {
          if (!client.current) {
            client.current = new BrowserAuthorizationClient({
              ...authClientConfig,
              redirectUri: redirectURI,
              postSignoutRedirectUri: redirectURI,
              responseType: "code",
            });
          }
          const context = new ClientRequestContext();
          if (!globals.accessToken) {
            await client.current.signInPopup(context);
            tokenString = (
              await client.current.getAccessToken(context)
            ).toTokenString();
            email = JSON.parse(atob(tokenString.split(" ")[1]?.split(".")[1]))
              .email;
          } else {
            await client.current.signOutPopup(context).catch(() => {});
          }
        } finally {
          updateGlobals({ accessToken: tokenString });
          setState({ loading: false, email });
        }
      };

      return (
        <IconButton
          active={globals.accessToken}
          title={
            buildMissing
              ? `"storybook-auth-addon" is likely not built, run "rush build"`
              : state.loading
              ? "Authenticating..."
              : globals.accessToken
              ? `Authenticated: ${state.email}, click to sign off`
              : `Authenticate`
          }
          onClick={() => authenticate()}
        >
          {buildMissing ? (
            <Icons icon={"alert"} style={{ color: "#FF4400" }} />
          ) : state.loading ? (
            <div style={{ width: 16, position: "relative" }}>
              <Loader
                size={16}
                style={{
                  borderLeftColor: "currentColor",
                  borderBottomColor: "currentColor",
                  borderRightColor: "currentColor",
                }}
              />
            </div>
          ) : (
            <Icons icon={globals.accessToken ? "lock" : "key"} />
          )}
        </IconButton>
      );
    },
  });
});
