/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  NoResults as ExternalComponent,
  type NoResultsProps as NoResultsMUIProps,
} from "@itwin/imodel-browser-react/mui";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export const NoResults = (props: NoResultsMUIProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/NoResultsMUI",
  component: NoResults,
  excludeStories: ["NoResults"],
} as Meta;

const Template: Story<NoResultsMUIProps> = (args) => <NoResults {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: "No iModels available",
};

export const SearchResults = Template.bind({});
SearchResults.args = {
  text: "No search results",
  subtext: "Try adjusting your search criteria.",
  isSearchResult: true,
};

export const WithSubtext = Template.bind({});
WithSubtext.args = {
  text: "No iModels available",
  subtext: "Please check back later.",
};
