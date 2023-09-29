/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable react-hooks/rules-of-hooks */
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import {
  addons,
  useAddonState,
  useParameter,
  types,
  useGlobals,
} from "@storybook/manager-api";

import { IconButton, Icons, Loader, WithTooltip } from "@storybook/components";
import React, { useRef, useState } from "react";

addons.register("auth/toolbar", () => {
  addons.add("auth-toolbar-addon/toolbar", {
    title: "OIDC Authentication toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!viewMode?.match(/^(story|docs)$/),
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const redirectURI = `${window.location.origin}${window.location.pathname}signin-oidc.html`;
      const [state, setState] = useAddonState("auth/toolbar", {
        loading: false,
        email: "",
      });
      const authClientConfig = useParameter<{
        clientId: string;
        scope: string;
      }>("authClientConfig", {});
      const client = useRef<BrowserAuthorizationClient | null>(null);

      const [buildMissing, setBuildMissing] = useState(false);
      const [clientIdMissing, setClientIdMissing] = useState(false);

      const authenticate = async () => {
        console.log("auth");
        if (state.loading || buildMissing || clientIdMissing) {
          return;
        }

        setState({ loading: true, email: state.email });
        try {
          if (!authClientConfig.clientId) {
            setClientIdMissing(true);
            return;
          }
          const response = await fetch(redirectURI);
          if (!response.ok && response.status === 404) {
            setBuildMissing(true);
            return;
          }
          if (!client.current) {
            client.current = new BrowserAuthorizationClient({
              ...authClientConfig,
              redirectUri: redirectURI,
              postSignoutRedirectUri: redirectURI,
              responseType: "code",
            });

            client.current.onAccessTokenChanged.addListener((accessToken) => {
              console.log("ON CHANGE");
              console.log(accessToken);
              if (!accessToken) {
                console.log("no access token");
                updateGlobals({ ["accessToken"]: "" });
                setState({ ...state, loading: false });
                return;
              }

              let email = "";
              try {
                email = JSON.parse(
                  atob(accessToken.split(" ")[1]?.split(".")[1])
                ).email;
              } catch (e) {
                email = "Email parsing failed";
              }
              console.log("SHOULD BE SETTING ACCE");
              updateGlobals({ accessToken: accessToken });

              console.log(globals);
              setState({ loading: false, email });
            });
          }

          if (!globals.accessToken) {
            console.log("before signin pop");
            try {
              await client.current.signInPopup();
              console.log("after signin pop");
            } catch (error) {
            } finally {
              // setState({ loading: false });
            }
          } else {
            await client.current.signOutPopup().catch(() => {
              // Intentionally a noop, user closing the window is not an issue.
            });
          }
        } catch (e) {
          console.log("ERROR");
          console.log(e);
          setState({ ...state, loading: false });
        }
      };
      console.log(globals);
      return (
        <WithTooltip
          placement="bottom"
          trigger="hover"
          closeOnClick
          tooltip={({ onHide }) => {
            return (
              <div
                style={{ padding: "5px 10px" }}
                onClick={() => {
                  onHide();
                  void authenticate();
                }}
              >
                {clientIdMissing
                  ? `No client Id configured: clientId must be provided in 'authClientConfig' parameter in preview.js`
                  : buildMissing
                  ? `${redirectURI} not found: "storybook-auth-addon" is likely not built, run "rush build"`
                  : state.loading
                  ? "Authenticating..."
                  : globals.accessToken
                  ? `Authenticated: ${state.email}, click to sign off`
                  : `Authenticate`}
              </div>
            );
          }}
        >
          <IconButton
            active={globals.accessToken}
            onClick={() => authenticate()}
          >
            {buildMissing || clientIdMissing ? (
              <Icons icon={"alert"} style={{ color: "#FF4400" }} />
            ) : state.loading ? (
              <div style={{ width: 16, position: "relative" }}>
                <Loader
                  size={16}
                  style={{
                    borderLeftColor: "currentColor",
                    borderBottomColor: "currentColor",
                    borderRightColor: "currentColor",
                    borderTopColor: "rgba(0,0,0,0)",
                  }}
                />
              </div>
            ) : (
              <Icons icon={globals.accessToken ? "lock" : "key"} />
            )}
          </IconButton>
        </WithTooltip>
      );
    },
  });
});
