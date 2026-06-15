/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable react-hooks/rules-of-hooks */
import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import {
  addons,
  types,
  useAddonState,
  useParameter,
} from "storybook/manager-api";
import { IconButton, WithTooltip } from "storybook/internal/components";
import { AlertIcon, KeyIcon, LockIcon } from "@storybook/icons";
import React, { useRef, useState } from "react";

const ACCESS_TOKEN_EVENT = "auth/toolbar/set-access-token";

addons.register("auth/toolbar", () => {
  addons.add("auth-toolbar-addon/toolbar", {
    title: "OIDC Authentication toolbar",
    type: types.TOOL,
    match: ({ viewMode }) => !!viewMode?.match(/^(story|docs)$/),
    render: () => {
      const channel = addons.getChannel();
      const redirectURI = `${window.location.origin}${window.location.pathname}signin-oidc.html`;
      const [state, setState] = useAddonState("auth/toolbar", {
        loading: false,
        email: "",
        accessToken: "",
      });
      const authClientConfig = useParameter("authClientConfig", {});
      const client = useRef(null);

      const [buildMissing, setBuildMissing] = useState(false);
      const [clientIdMissing, setClientIdMissing] = useState(false);

      const authenticate = async () => {
        if (state.loading || buildMissing || clientIdMissing) {
          return;
        }

        setState({ loading: true });
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
            client.current.onUserStateChanged.addListener((accessToken) => {
              if (!accessToken) {
                setState({ loading: false, email: "", accessToken: "" });
                channel.emit(ACCESS_TOKEN_EVENT, "");
                return;
              }
              let tokenString = accessToken.toTokenString();
              let email = "";
              try {
                email = JSON.parse(
                  atob(tokenString.split(" ")[1]?.split(".")[1])
                ).email;
              } catch {
                email = "Email parsing failed";
              }
              setState({ loading: false, email, accessToken: tokenString });
              channel.emit(ACCESS_TOKEN_EVENT, tokenString);
            });
          }
          const context = new ClientRequestContext();
          if (!state.accessToken) {
            await client.current.signInPopup(context);
          } else {
            await client.current.signOutPopup(context).catch(() => {
              // Intentionally a noop, user closing the window is not an issue.
            });
          }
        } catch {
          setState({ loading: false });
        }
      };

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
                      : state.accessToken
                        ? `Authenticated: ${state.email}, click to sign off`
                        : `Authenticate`}
              </div>
            );
          }}
        >
          <IconButton
            active={!!state.accessToken}
            title={state.accessToken ? "Sign out" : "Sign in with OAuth"}
            onClick={() => authenticate()}
          >
            {buildMissing || clientIdMissing ? (
              <AlertIcon style={{ color: "#FF4400" }} />
            ) : state.loading ? (
              <div style={{ width: 16, position: "relative" }}>
                <span>...</span>
              </div>
            ) : state.accessToken ? (
              <LockIcon />
            ) : (
              <KeyIcon />
            )}
          </IconButton>
        </WithTooltip>
      );
    },
  });
});
