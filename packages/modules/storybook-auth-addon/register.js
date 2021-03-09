import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import addons, { types } from "@storybook/addons";
import { useAddonState, useGlobals } from "@storybook/api";
import { IconButton, Icons, Loader } from "@storybook/components";
import React from "react";

const client = new BrowserAuthorizationClient({
  clientId: "itwin-portal-storybook",
  redirectUri: `${window.location.origin}${window.location.pathname}signin-oidc.html`,
  scope: [
    "openid",
    "email",
    "connect-service-registry-2681",
    "context-registry-service",
    "data-location-registry",
    "entitlement-search-service-2576",
    "map-layer",
  ].join(" "),
  authority: "https://qa-imsoidc.bentley.com",
  responseType: "code",
});

addons.register("auth/toolbar", () => {
  addons.add("auth-toolbar-addon/toolbar", {
    title: "OIDC Authentication toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: ({ active }) => {
      const [globals, updateGlobals] = useGlobals();
      const [state, setState] = useAddonState("auth/toolbar", { loading: false, email: "" });
      const authenticate = async () => {
        setState({ loading: true });
        let email = state.email;
        let tokenString = "";
        try {
          const context = new ClientRequestContext();
          await client.signInPopup(context);
          tokenString = (await client.getAccessToken(context)).toTokenString();
          email = (await client.getAccessToken(context)).getUserInfo().email?.id;
        } finally {
          updateGlobals({ accessToken: tokenString });
          setState({ loading: false, email });
        }
      };

      return (
        <IconButton
          active={active}
          title={
            state.loading ? "Authenticating..." : globals.accessToken ? `Authenticated: ${state.email}` : `Authenticate`
          }
        >
          {state.loading ? (
            <div style={{ width: 16, position: "relative" }}>
              <Loader size={16} />
            </div>
          ) : (
            <Icons icon={globals.accessToken ? "lock" : "key"} onClick={() => authenticate()} />
          )}
        </IconButton>
      );
    },
  });
});
