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

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Provided ITwin",
        number: "No Network Calls",
      },
      {
        id: "2",
        displayName: "Useful ITwin",
        number:
          "Use if the data comes from a different API or needs to be tweaked",
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
  itwinActions: [
    {
      children: "displayName contains 'R'",
      visible: (itwin) => itwin.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (itwin) => alert("Contains R" + itwin.displayName),
    },
    {
      children: "Add itwinNumber",
      visible: (itwin) => !itwin.number,
      key: "addD",
      onClick: (itwin) => alert("Add itwinNumber to " + itwin.displayName),
    },
    {
      children: "Edit itwinNumber",
      visible: (itwin) => !!itwin.number,
      key: "editD",
      onClick: (itwin) => alert("Edit itwinNumber: " + itwin.number),
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
const useIndividualState: IndividualITwinStateHook = (itwin, props) => {
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
      }api.bentley.com/imodels/?projectId=${itwin.id}&$top=10`
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
      itwin.id,
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
      (itwins: ITwinFull[], status: DataStatus | undefined) => {
        if (status !== DataStatus.Complete) {
          return itwins;
        }
        itwins.unshift({
          id: "newProject",
          displayName: "New Project",
          number: "Click on this tile to create a new ITwin",
        });
        return itwins;
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
        <ITwinGrid {...args} postProcessCallback={addStartTile} />
      </div>
    );
  });
WithPostProcessCallback.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa" },
};
