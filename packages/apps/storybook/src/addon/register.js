/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import addons, { types } from "@storybook/addons";
import { useAddonState, useArgTypes, useGlobals } from "@storybook/api";
import { IconButton, Icons, TooltipLinkList, WithTooltip } from "@storybook/components";
import React from "react";

addons.register("project/toolbar", () => {
  addons.add("project-toolbar-addon/toolbar", {
    title: "Project Selection toolbar",
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const { projectId: withProjectId } = useArgTypes();

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
          setState({ projects: [{}] });
          const response = await fetch(
            "https://qa-api.bentley.com/projects/favorites",
            {
              headers: { Authorization: globals.accessToken },
            }
          );
          if (response.ok) {
            const result = await response.text();
            const projects = JSON.parse(
              result.substring(0, result.indexOf("],")) + "]}"
            ).projects;

            if (projects.length === 0) {
              projects.push({
                displayName:
                  "'Favorite' a project in CONNECT (QA) to show it here, refresh this page to see the results",
              });
            }
            setState({ projects });
          }
        } catch (e) {
          console.error("Error", e);
        }
      }, [state.mustLoad, globals.accessToken]);

      const buildLinks = React.useCallback(
        (onHide) =>
          state.projects.map((project) => ({
            key: project.id || project.displayName || "Loading State",
            id: project.id,
            title: project.displayName,
            onClick: () => {
              updateGlobals({
                projectId: globals.projectId === project.id ? "" : project.id,
              });
              onHide();
            },
            active: globals.projectId === project.id,
          })),
        [state.projects, globals.projectId]
      );

      return withProjectId && globals.accessToken ? (
        <WithTooltip
          placement="top"
          trigger="hover"
          closeOnClick
          tooltip={({ onHide }) => {
            return <TooltipLinkList links={buildLinks(onHide)} />;
          }}
        >
          <IconButton
            active={globals.projectId}
            title={`Favorite projects${
              globals.projectId ? " (click to unselect)" : ""
            }`}
            onMouseEnter={() => fetchProjects()}
            onClick={() => updateGlobals({ projectId: "" })}
          >
            <Icons icon={"book"} />
          </IconButton>
        </WithTooltip>
      ) : null;
    },
  });
});
