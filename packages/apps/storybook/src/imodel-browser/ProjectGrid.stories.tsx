/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DataStatus,
  IndividualProjectStateHook,
  ProjectFull,
  ProjectGrid as ExternalComponent,
  ProjectGridProps,
} from "@itwin/imodel-browser-react";
import {
  Body,
  Button,
  Code,
  DropdownButton,
  MenuItem,
  TileProps,
  Title,
} from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { PropsWithChildren } from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const ProjectGrid = (props: ProjectGridProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/ProjectGrid",
  component: ProjectGrid,
  argTypes: accessTokenArgTypes,
  excludeStories: ["ProjectGrid"],
} as Meta;

const Template: Story<ProjectGridProps> = withAccessTokenOverride((args) => (
  <ProjectGrid {...args} />
));
export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Provided Project",
        projectNumber: "No Network Calls",
      },
      {
        id: "2",
        displayName: "Useful project",
        projectNumber:
          "Use if the data comes from a different API or needs to be tweaked",
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  projectActions: [
    {
      children: "displayName contains 'R'",
      visible: (project) => project.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (project) => alert("Contains R" + project.displayName),
    },
    {
      children: "Add projectNumber",
      visible: (project) => !project.projectNumber,
      key: "addD",
      onClick: (project) =>
        alert("Add projectNumber to " + project.displayName),
    },
    {
      children: "Edit projectNumber",
      visible: (project) => !!project.projectNumber,
      key: "editD",
      onClick: (project) =>
        alert("Edit projectNumber: " + project.projectNumber),
    },
  ],
};

export const SimpleTilePropsOverrides = Template.bind({});
SimpleTilePropsOverrides.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  tileOverrides: { tileProps: { style: { width: "100%" }, variant: "folder" } },
};

interface IModelMinimal {
  id: string;
  displayName: string;
}
interface IModelsFetchData {
  iModels: IModelMinimal[];
  _links: {
    prev: { href: string };
    next: { href: string };
    self: { href: string };
  };
}

/** Function used in useIndividualState */
const buildMenuItems = (
  close: () => void,
  setVersion: React.Dispatch<React.SetStateAction<IModelMinimal | undefined>>
) => (v: IModelMinimal) => (
  <span
    onClick={(event) => {
      event.stopPropagation();
    }}
  >
    <MenuItem
      key={v.id}
      onClick={() => {
        close();
        v.id !== "loading" && setVersion(v);
      }}
      className={v.id === "loading" ? "iui-skeleton" : undefined}
    >
      {v.displayName}
    </MenuItem>
  </span>
);

const Pager = (props: PropsWithChildren<{ onClick: () => void }>) => (
  <span onClick={props.onClick}>
    <Code
      style={{
        width: "calc(100% - 8px)",
        cursor: "pointer",
        textAlign: "center",
      }}
      key="next10"
    >
      {props.children}
    </Code>
  </span>
);

/** Hook used in StatefulPropsOverrides.args, the function itself must be a stable reference as it is a hook. */
const useIndividualState: IndividualProjectStateHook = (project, props) => {
  const [selection, setSelection] = React.useState<IModelMinimal | undefined>();
  const [links, setLinks] = React.useState<
    [string | undefined, string | undefined]
  >([undefined, undefined]);
  const [imodels, setIModels] = React.useState<IModelMinimal[] | undefined>();
  // We delay network call until the user wants to query the data, this could be in an effect
  // but would automatically trigger for EVERY project, causing potentially huge network traffic at startup.
  const fetchIModelList = React.useCallback(
    async (
      url = `https://${
        props.gridProps.apiOverrides?.serverEnvironmentPrefix
          ? `${props.gridProps.apiOverrides?.serverEnvironmentPrefix}-`
          : ""
      }api.bentley.com/imodels/?projectId=${project.id}&$top=10`
    ) => {
      try {
        // Show the skeleton, plus prevent further calls to this function.
        setIModels([
          {
            id: "loading",
            displayName: "",
          },
        ]);
        setLinks([undefined, undefined]);
        // Start the fetch
        const response = await fetch(url, {
          headers: {
            Authorization: props.gridProps.accessToken ?? "",
            Prefer: "return=minimal",
          },
        });
        if (response.ok) {
          const data: IModelsFetchData = await response.json();
          setIModels(data.iModels);
          setLinks([
            data._links.prev.href !== data._links.self.href
              ? data._links.prev.href
              : undefined,
            data._links.next.href !== data._links.self.href
              ? data._links.next.href
              : undefined,
          ]);
          if (data.iModels.length === 0) {
            setSelection({ displayName: "No iModels created", id: "none" });
          }
        }
      } catch (error) {
        // If an error occurs, clear the versions so they will be fetched again.
        setIModels(undefined);
        console.error(error);
      }
    },
    [
      project.id,
      props.gridProps.accessToken,
      props.gridProps.apiOverrides?.serverEnvironmentPrefix,
    ]
  );
  // Create a memo of the tileProps we want to override, depending on the state.
  const tileProps = React.useMemo<Partial<TileProps>>(
    () => ({
      buttons:
        selection && selection.id !== "none"
          ? [
              <Button key="Create">Create IModel</Button>,
              <Button key="Open">Open IModel</Button>,
            ]
          : [<Button key="Create">Create IModel</Button>],
      metadata: (
        <span
          onClick={() => {
            imodels === undefined && fetchIModelList();
          }}
        >
          <DropdownButton
            menuItems={(close) => {
              const items =
                imodels?.map(buildMenuItems(close, setSelection)) ?? [];
              if (items.length === 10 && links[1]) {
                items.push(
                  <Pager onClick={() => fetchIModelList(links[1])} key="next10">
                    Next 10
                  </Pager>
                );
              }
              if (links[0]) {
                items.unshift(
                  <Pager onClick={() => fetchIModelList(links[0])} key="prev10">
                    Previous 10
                  </Pager>
                );
              }
              return items;
            }}
          >
            <span>{selection?.displayName ?? "Select iModel..."}</span>
          </DropdownButton>
        </span>
      ),
    }),
    [selection, imodels, fetchIModelList, links]
  );
  return {
    tileProps: { ...props.tileProps, ...tileProps },
  };
};

export const StatefulPropsOverrides = Template.bind({});
StatefulPropsOverrides.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  useIndividualState,
};

export const WithPostProcessCallback: Story<ProjectGridProps> = withAccessTokenOverride(
  (args) => {
    const addStartTile = React.useCallback(
      (projects: ProjectFull[], status: DataStatus) => {
        if (status !== DataStatus.Complete) {
          return projects;
        }
        projects.unshift({
          id: "newProject",
          displayName: "New Project",
          projectNumber: "Click on this tile to create a new Project",
        });
        return projects;
      },
      []
    );
    return (
      <div>
        <Title>Description</Title>
        <Body>
          Property <Code>postProcessCallback</Code> allows modification of the
          data that is sent to the grid, here, we add a new tile at the start of
          the list for a 'New Project'.
        </Body>
        <ProjectGrid {...args} postProcessCallback={addStartTile} />
      </div>
    );
  }
);
WithPostProcessCallback.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};
