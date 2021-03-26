/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";
import { Authentiated, AuthenticatedProps } from "./Authenticated";

export default {
  title: "Example/Authenticated",
  component: Authentiated,
  argTypes: accessTokenArgTypes,
} as Meta;

const Template: Story<AuthenticatedProps> = withAccessTokenOverride((args) => {
  return <Authentiated {...args} />;
});

export const Primary = Template.bind({});
Primary.args = {};
