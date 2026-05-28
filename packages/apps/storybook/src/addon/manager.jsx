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
  IconButton,
  TooltipLinkList,
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

      React.useEffect(() => {
        const handler = (token) => {
          setState((prev) => ({ ...prev, accessToken: token, mustLoad: true }));
        };
        channel.on(ACCESS_TOKEN_EVENT, handler);
        return () => channel.off(ACCESS_TOKEN_EVENT, handler);
      }, [channel, setState]);

      const fetchProjects = React.useCallback(async () => {
        if (!state.mustLoad || !state.accessToken) {
          if (!state.accessToken) {
            setState({
              ...state,
              mustLoad: true,
              projects: [{ displayName: "Authentication required" }],
            });
          }
          return;
        }

        try {
          setState({
            ...state,
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
              headers: { Authorization: state.accessToken },
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
            setState({ ...state, projects: projects });
          }
        } catch (e) {
          console.error("Error", e);
        }
      }, [state.mustLoad, state.accessToken, setState]);

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

      return withITwinId && state.accessToken ? (
        <WithTooltip
          placement="bottom"
          trigger="click"
          closeOnOutsideClick
          onVisibleChange={async (visible) => {
            if (visible) await fetchProjects();
          }}
          tooltip={({ onHide }) => {
            return <TooltipLinkList links={buildLinks(onHide)} />;
          }}
        >
          <IconButton
            active={!!selectedId}
            title={`Favorite projects${
              selectedId ? " (click to unselect)" : ""
            }`}
          >
            <SvgItwin />
          </IconButton>
        </WithTooltip>
      ) : null;
    },
  });
});
