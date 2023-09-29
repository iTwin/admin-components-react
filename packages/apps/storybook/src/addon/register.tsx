/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable react-hooks/rules-of-hooks */
import { addons, types } from "@storybook/addons";
import { useAddonState, useArgTypes, useGlobals } from "@storybook/api";
import {
  IconButton,
  Icons,
  Loader,
  TooltipLinkList,
  WithTooltip,
} from "@storybook/components";
import React from "react";

type AddonStateProps = {
  mustLoad: boolean;
  projects: { displayName: React.ReactNode; id?: string }[];
};

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

      const [state, setState] = useAddonState<AddonStateProps>(
        "project/toolbar",
        {
          mustLoad: true,
          projects: [],
        }
      );

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
                    <div
                      style={{ width: 16, height: 16, position: "relative" }}
                    >
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
                    <span>Fetching favorites</span>
                  </div>
                ),
              },
            ],
            mustLoad: state.mustLoad,
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
            setState({ ...state, projects: projects });
          }
        } catch (e) {
          console.error("Error", e);
        }
      }, [state.mustLoad, globals.accessToken, setState]);

      const buildLinks = React.useCallback(
        (onHide) =>
          state.projects?.map((project) => ({
            key:
              project.id || project.displayName?.toString() || "Loading State",
            id: project.id || "",
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
          placement="top"
          withArrows
          trigger="click"
          closeOnOutsideClick
          tooltip={({ onHide }) => {
            return <TooltipLinkList links={buildLinks(onHide)} />;
          }}
        >
          <IconButton
            active={globals.iTwinId}
            title={`Favorite projects${
              globals.iTwinId ? " (click to unselect)" : ""
            }`}
            onMouseEnter={() => fetchProjects()}
            onClick={() => updateGlobals({ iTwinId: "" })}
          >
            <Icons icon={"book"} />
          </IconButton>
        </WithTooltip>
      ) : null;
    },
  });
});
