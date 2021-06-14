/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ProjectTile as C,
  ProjectTileProps,
} from "@itwin/imodel-browser-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const ProjectTile = (props: ProjectTileProps) => <C {...props} />;

export default {
  title: "imodel-browser/ProjectTile",
  component: ProjectTile,
  excludeStories: ["ProjectTile"],
} as Meta;

const Template: Story<ProjectTileProps> = (args) => <ProjectTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
