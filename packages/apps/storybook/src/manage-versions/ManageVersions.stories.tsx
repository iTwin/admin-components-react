/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ManageVersions as ExternalComponent,
  ManageVersionsProps,
} from "@itwin/manage-versions-react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const ManageVersions = (props: ManageVersionsProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "manage-versions/ManageVersions component",
  component: ManageVersions,
  excludeStories: ["ManageVersions"],
  argTypes: {
    ...accessTokenArgTypes,
    log: { defaultValue: action("Error logged. "), control: { disable: true } },
    onViewClick: {
      defaultValue: action("View Named Version clicked"),
      control: { disable: true },
    },
  },
} as Meta;

const Template: Story<ManageVersionsProps> = withAccessTokenOverride((args) => (
  <ManageVersions {...args} />
));

export const Primary = Template.bind({});
Primary.args = {
  apiOverrides: {
    serverEnvironmentPrefix: "qa",
  },
};
