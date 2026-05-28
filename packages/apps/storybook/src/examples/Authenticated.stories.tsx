/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Meta, StoryFn } from "@storybook/react-webpack5";
import React from "react";

import { accessTokenArgTypes } from "../utils/storyHelp";
import { Authentiated, AuthenticatedProps } from "./Authenticated";

export default {
  title: "Example/Authenticated",
  component: Authentiated,
  argTypes: accessTokenArgTypes,
} as Meta;

const Template: StoryFn<AuthenticatedProps> = (args) => {
  return <Authentiated {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
