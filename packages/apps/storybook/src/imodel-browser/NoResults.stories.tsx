/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  NoResults as ExternalComponent,
  NoResultsProps,
} from "@itwin/imodel-browser-react";
import type { Meta, StoryFn } from "@storybook/react-webpack5";
import React from "react";

export const NoResults = (props: NoResultsProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/NoResults",
  component: NoResults,
  excludeStories: ["NoResults"],
} as Meta;

const Template: StoryFn<NoResultsProps> = (args) => <NoResults {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
