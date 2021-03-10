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
    render: ({ active }) => {
      const [globals, updateGlobals] = useGlobals();
      const [state, setState] = useAddonState("auth/toolbar", {
        loading: false,
        email: "",
      });
      const authClientConfig = useParameter("authClientConfig", {});
      const client = React.useRef(null);

      const authenticate = async () => {
        setState({ loading: true });
        let email = state.email;
        let tokenString = "";
        try {
          if (!client.current) {
            client.current = new BrowserAuthorizationClient({
              ...authClientConfig,
              redirectUri: `${window.location.origin}${window.location.pathname}signin-oidc.html`,
              responseType: "code",
            });
          }
          const context = new ClientRequestContext();
          await client.current.signInPopup(context);
          tokenString = (
            await client.current.getAccessToken(context)
          ).toTokenString();
          email = (await client.current.getAccessToken(context)).getUserInfo()
            .email?.id;
        } finally {
          updateGlobals({ accessToken: tokenString });
          setState({ loading: false, email });
        }
      };

      return (
        <IconButton
          active={active}
          title={
            state.loading
              ? "Authenticating..."
              : globals.accessToken
              ? `Authenticated: ${state.email}`
              : `Authenticate`
          }
        >
          {state.loading ? (
            <div style={{ width: 16, position: "relative" }}>
              <Loader size={16} />
            </div>
          ) : (
            <Icons
              icon={globals.accessToken ? "lock" : "key"}
              onClick={() => authenticate()}
            />
          )}
        </IconButton>
      );
    },
  });
});
