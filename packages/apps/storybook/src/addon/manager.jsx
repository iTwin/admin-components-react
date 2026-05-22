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
  useGlobals,
} from "storybook/manager-api";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";
import { SvgItwin } from "@itwin/itwinui-icons-react";
import React from "react";

addons.register("project/toolbar", () => {
  addons.add("project-toolbar-addon/toolbar", {
    title: "Project Selection toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!viewMode?.match(/^(story|docs)$/),
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const { iTwinId: withITwinId } = useArgTypes();

      const [state, setState] = useAddonState("project/toolbar", {
        mustLoad: true,
        projects: [],
      });

      const fetchProjects = React.useCallback(async () => {
        if (!state.mustLoad || !globals.accessToken) {
          if (!globals.accessToken) {
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
              headers: { Authorization: globals.accessToken },
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
      }, [state.mustLoad, globals.accessToken, setState]);

      const buildLinks = React.useCallback(
        (onHide) =>
          state.projects.map((project) => ({
            key: project.id || project.displayName || "Loading State",
            id: project.id,
            title: project.displayName,
            onClick: () => {
              updateGlobals({
                iTwinId: globals.iTwinId === project.id ? "" : project.id,
              });
              onHide();
            },
            active: globals.iTwinId === project.id,
          })),
        [state.projects, globals.iTwinId, updateGlobals]
      );

      return withITwinId && globals.accessToken ? (
        <WithTooltip
          placement="bottom"
          trigger="click"
          closeOnOutsideClick
          onVisibleChange={(visible) => {
            if (visible) fetchProjects();
          }}
          tooltip={({ onHide }) => {
            return <TooltipLinkList links={buildLinks(onHide)} />;
          }}
        >
          <IconButton
            active={!!globals.iTwinId}
            title={`Favorite projects${
              globals.iTwinId ? " (click to unselect)" : ""
            }`}
          >
            <SvgItwin />
          </IconButton>
        </WithTooltip>
      ) : null;
    },
  });
});
