/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ManageVersions as ExternalComponent,
  ManageVersionsProps,
} from "@itwin/manage-versions-react";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React from "react";
import { accessTokenArgTypes } from "../utils/storyHelp";

export const ManageVersions = (props: ManageVersionsProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "manage-versions/ManageVersions component",
  component: ManageVersions,
  excludeStories: ["ManageVersions"],
  argTypes: {
    ...accessTokenArgTypes,
    log: { control: { disable: true } },
    onViewClick: { control: { disable: true } },
  },
  args: {
    log: action("Error logged."),
    onViewClick: action("View Named Version clicked"),
  },
} as Meta;

export const Primary: StoryObj<typeof ManageVersions> = {
  args: {
    apiOverrides: {
      serverEnvironmentPrefix: "qa",
    },
  },
};
