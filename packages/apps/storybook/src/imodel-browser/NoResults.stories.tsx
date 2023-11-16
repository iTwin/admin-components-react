/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  NoResults as ExternalComponent,
  NoResultsProps,
} from "@itwin/imodel-browser-react";
import { ThemeProvider } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const NoResults = (props: NoResultsProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/NoResults",
  component: NoResults,
  excludeStories: ["NoResults"],
} as Meta;

const Template: Story<NoResultsProps> = (args) => (
  <ThemeProvider>
    <NoResults {...args} />
  </ThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {};
