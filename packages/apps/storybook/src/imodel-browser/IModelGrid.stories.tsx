/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModelGrid, IModelGridProps } from "@itwin/imodel-browser";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
  withProjectIdOverride,
} from "../utils/storyHelp";

export default {
  title: "imodel-browser/IModelGrid",
  component: IModelGrid,
  argTypes: accessTokenArgTypes,
} as Meta;

const Template: Story<IModelGridProps> = withProjectIdOverride(
  withAccessTokenOverride((args) => <IModelGrid {...args} />)
);

export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
};

export const OverrideApiData = Template.bind({});
OverrideApiData.args = {
  apiOverrides: {
    data: [
      {
        id: "1",
        displayName: "Provided iModel",
        description: "No Network Calls",
        thumbnail:
          "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/activity.svg",
      },
      {
        id: "2",
        displayName: "Useful iModel",
        description:
          "Use if the data comes from a different API or needs to be tweaked",
        thumbnail:
          "https://unpkg.com/@bentley/icons-generic@1.0.34/icons/developer.svg",
      },
    ],
  },
};

export const IndividualContextMenu = Template.bind({});
IndividualContextMenu.args = {
  apiOverrides: { serverEnvironmentPrefix: "qa-" },
  iModelOptions: [
    {
      children: "displayName contains 'R'",
      visible: (iModel) => iModel.displayName?.includes("R") ?? false,
      key: "withR",
      onClick: (iModel) => alert("Contains R" + iModel.displayName),
    },
    {
      children: "Add description",
      visible: (iModel) => !iModel.description,
      key: "addD",
      onClick: (iModel) => alert("Add description" + iModel.displayName),
    },
    {
      children: "Edit description",
      visible: (iModel) => !!iModel.description,
      key: "editD",
      onClick: (iModel) => alert("Edit description" + iModel.displayName),
    },
  ],
};
