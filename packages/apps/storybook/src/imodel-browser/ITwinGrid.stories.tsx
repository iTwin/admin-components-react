/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DataStatus,
  IndividualITwinStateHook,
  ITwinFull,
  ITwinGrid as ExternalComponent,
  ITwinGridProps,
} from "@itwin/imodel-browser-react";
import { SvgHeart } from "@itwin/itwinui-icons-react";
import {
  Button,
  Code,
  DropdownButton,
  IconButton,
  MenuItem,
  MenuItemSkeleton,
  Text,
  Tile,
} from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { PropsWithChildren } from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

type TileProps = React.ComponentPropsWithoutRef<typeof Tile>;

export const ITwinGrid = (props: ITwinGridProps) => (
  <ExternalComponent {...props} />
);

const accessToken = accessTokenArgTypes.accessToken;
export default {
  title: "imodel-browser/ITwinGrid",
  component: ITwinGrid,
  argTypes: {
    accessToken,
  },
  excludeStories: ["ITwinGrid"],
} as Meta;

const Template: Story<ITwinGridProps> = withAccessTokenOverride((args) => (
  <ITwinGrid {...args} />
));
export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};

export const OverrideCellData = Template.bind({});
OverrideCellData.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  viewMode: "cells",
  cellOverrides: {
    ITwinNumber: (props) => (
      <strong>
        <IconButton
          size="small"
          styleType="borderless"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Icon Clicked");
          }}
        >
          <SvgHeart />
        </IconButton>{" "}
        {props.value}
      </strong>
    ),
    ITwinName: (props) => <i style={{ color: "red" }}>{props.value}</i>,
  },
};

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Provided iTwin",
        number: "No Network Calls",
      },
      {
        id: "2",
        displayName: "Useful iTwin",
        number:
          "Use if the data comes from a different API or needs to be tweaked",
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  iTwinActions: [
    {
      children: "displayName contains 'R'",
      visible: (iTwin) => iTwin.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iTwin) => alert("Contains R" + iTwin?.displayName),
    },
    {
      children: "Add iTwinNumber",
      visible: (iTwin) => !iTwin.number,
      key: "addD",
      onClick: (iTwin) => alert("Add iTwinNumber to " + iTwin?.displayName),
    },
    {
      children: "Edit iTwinNumber",
      visible: (iTwin) => !!iTwin.number,
      key: "editD",
      onClick: (iTwin) => alert("Edit iTwinNumber: " + iTwin?.number),
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
const buildMenuItems =
  (
    close: () => void,
    setVersion: React.Dispatch<React.SetStateAction<IModelMinimal | undefined>>
  ) =>
  (v: IModelMinimal) =>
    (
      <span
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {v.id === "loading" ? (
          <MenuItemSkeleton />
        ) : (
          <MenuItem
            key={v.id}
            onClick={() => {
              close();
              v.id !== "loading" && setVersion(v);
            }}
          >
            {v.displayName}
          </MenuItem>
        )}
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
const useIndividualState: IndividualITwinStateHook = (iTwin, props) => {
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
      }api.bentley.com/imodels/?iTwinId=${iTwin.id}&$top=10`
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
            Authorization: (props.gridProps.accessToken as string) ?? "",
            Prefer: "return=minimal",
          },
        });
        if (response.ok) {
          const data: IModelsFetchData = await response.json();
          setIModels(data.iModels);
          setLinks([
            data._links.prev?.href !== data._links.self.href
              ? data._links.prev?.href
              : undefined,
            data._links.next?.href !== data._links.self.href
              ? data._links.next?.href
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
      iTwin.id,
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

export const WithPostProcessCallback: Story<ITwinGridProps> =
  withAccessTokenOverride((args) => {
    const addStartTile = React.useCallback(
      (iTwins: ITwinFull[], status: DataStatus | undefined) => {
        if (status !== DataStatus.Complete) {
          return iTwins;
        }
        iTwins.unshift({
          id: "newProject",
          displayName: "New Project",
          number: "Click on this tile to create a new ITwin",
        });
        return iTwins;
      },
      []
    );
    return (
      <div>
        <Text variant="title">Description</Text>
        <Text as="p" variant="body">
          Property <Code>postProcessCallback</Code> allows modification of the
          data that is sent to the grid, here, we add a new tile at the start of
          the list for a 'New Project'.
        </Text>
        <ITwinGrid {...args} postProcessCallback={addStartTile} />
      </div>
    );
  });
WithPostProcessCallback.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};

export const FetchAllSubclasses = Template.bind({});
FetchAllSubclasses.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  iTwinSubClass: "All",
};
