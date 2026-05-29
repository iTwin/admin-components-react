/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable react-hooks/rules-of-hooks */
import {
  addons,
  types,
  useAddonState,
  useArgTypes,
} from "storybook/manager-api";
import {
  ActionList,
  ToggleButton,
  WithTooltip,
} from "storybook/internal/components";
import { SvgItwin } from "@itwin/itwinui-icons-react";
import React from "react";

const ITWIN_ID_EVENT = "project/toolbar/set-itwin-id";
const ACCESS_TOKEN_EVENT = "auth/toolbar/set-access-token";

addons.register("project/toolbar", () => {
  addons.add("project-toolbar-addon/toolbar", {
    title: "Project Selection toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!viewMode?.match(/^(story|docs)$/),
    render: () => {
      const { iTwinId: withITwinId } = useArgTypes();
      const channel = addons.getChannel();

      const [state, setState] = useAddonState("project/toolbar", {
        mustLoad: true,
        projects: [],
        accessToken: "",
      });
      const [selectedId, setSelectedId] = useAddonState(
        "project/toolbar/selected",
        ""
      );
      const [accessToken, setAccessToken] = useAddonState(
        "project/toolbar/accessToken",
        ""
      );

      React.useEffect(() => {
        const handler = (token) => {
          setAccessToken(token);
          setState({ mustLoad: true, projects: [] });
        };
        channel.on(ACCESS_TOKEN_EVENT, handler);
        return () => channel.off(ACCESS_TOKEN_EVENT, handler);
      }, [channel, setState, setAccessToken]);

      const fetchProjects = React.useCallback(async () => {
        if (!state.mustLoad || !accessToken) {
          if (!accessToken) {
            setState({
              mustLoad: true,
              projects: [{ displayName: "Authentication required" }],
            });
          }
          return;
        }

        try {
          setState({
            projects: [
              {
                displayName: (
                  <div style={{ display: "flex", gap: 4 }}>
                    <span>Fetching favorites...</span>
                  </div>
                ),
              },
            ],
          });
          const response = await fetch(
            "https://qa-api.bentley.com/itwins/favorites?subClass=Project",
            {
              headers: { Authorization: accessToken },
            }
          );
          if (response.ok) {
            const result = await response.text();
            const projects = JSON.parse(
              result.substring(0, result.indexOf("],")) + "]}"
            ).iTwins;

            if (projects.length === 0) {
              projects.push({
                displayName:
                  "'Favorite' a project in CONNECT (QA) to show it here, refresh this page to see the results",
              });
            }
            setState({ projects: projects });
          }
        } catch (e) {
          console.error("Error", e);
        }
      }, [state.mustLoad, accessToken, setState]);

      const buildLinks = React.useCallback(
        (onHide) =>
          state.projects.map((project) => ({
            key: project.id || project.displayName || "Loading State",
            id: project.id,
            title: project.displayName,
            onClick: () => {
              const newId = selectedId === project.id ? "" : project.id;
              setSelectedId(newId);
              channel.emit(ITWIN_ID_EVENT, newId);
              onHide();
            },
            active: selectedId === project.id,
          })),
        [state.projects, selectedId, setSelectedId, channel]
      );

      return withITwinId && accessToken ? (
        <WithTooltip
          placement="bottom"
          trigger="click"
          closeOnOutsideClick
          onVisibleChange={async (visible) => {
            if (visible) await fetchProjects();
          }}
          tooltip={({ onHide }) => {
            const links = buildLinks(onHide);
            return (
              <ActionList>
                {links.map((link) => (
                  <ActionList.Item
                    key={link.key}
                    active={link.active}
                    as="button"
                    onClick={link.onClick}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {link.title}
                  </ActionList.Item>
                ))}
              </ActionList>
            );
          }}
        >
          <ToggleButton
            pressed={!!selectedId}
            ariaLabel={`Favorite projects${
              selectedId ? " (click to unselect)" : ""
            }`}
          >
            <SvgItwin />
          </ToggleButton>
        </WithTooltip>
      ) : null;
    },
  });
});
