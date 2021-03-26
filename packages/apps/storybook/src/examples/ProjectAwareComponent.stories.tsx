/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { withProjectIdOverride } from "../utils/storyHelp";
import {
  ProjectAwareComponent,
  ProjectAwareComponentProps,
} from "./ProjectAwareComponent";

export default {
  title: "Example/Project Aware",
  component: ProjectAwareComponent,
} as Meta;

const Template: Story<ProjectAwareComponentProps> = withProjectIdOverride(
  (args) => {
    return <ProjectAwareComponent {...args} />;
  }
);

export const Primary = Template.bind({});
Primary.args = {};
