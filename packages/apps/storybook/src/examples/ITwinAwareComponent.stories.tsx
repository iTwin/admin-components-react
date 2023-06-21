/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { withITwinIdOverride } from "../utils/storyHelp";
import {
  ITwinAwareComponent,
  ITwinAwareComponentProps,
} from "./ITwinAwareComponent";

export default {
  title: "Example/ITwin Aware",
  component: ITwinAwareComponent,
} as Meta;

const Template: Story<ITwinAwareComponentProps> = withITwinIdOverride(
  (args) => {
    return <ITwinAwareComponent {...args} />;
  }
);

export const Primary = Template.bind({});
Primary.args = {};
