import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import addons, { types } from "@storybook/addons";
import { useAddonState, useGlobals, useParameter } from "@storybook/api";
import { IconButton, Icons, Loader } from "@storybook/components";
import React from "react";

addons.register("auth/toolbar", () => {
  addons.add("auth-toolbar-addon/toolbar", {
    title: "OIDC Authentication toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => {
      const [globals, updateGlobals] = useGlobals();

      const [state, setState] = useAddonState("auth/toolbar", {
        loading: false,
        email: "",
      });
      const authClientConfig = useParameter("authClientConfig", {});
      const client = React.useRef(null);

      const authenticate = async () => {
        if (state.loading) {
          return;
        }
        setState({ loading: true });
        let email = "";
        let tokenString = "";
        try {
          if (!client.current) {
            client.current = new BrowserAuthorizationClient({
              ...authClientConfig,
              redirectUri: `${window.location.origin}${window.location.pathname}signin-oidc.html`,
              postSignoutRedirectUri: `${window.location.origin}${window.location.pathname}signin-oidc.html`,
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
            state.loading
              ? "Authenticating..."
              : globals.accessToken
              ? `Authenticated: ${state.email}, click to sign off`
              : `Authenticate`
          }
          onClick={() => authenticate()}
        >
          {state.loading ? (
            <div style={{ width: 16, position: "relative" }}>
              <Loader size={16} />
            </div>
          ) : (
            <Icons icon={globals.accessToken ? "lock" : "key"} />
          )}
        </IconButton>
      );
    },
  });
});
