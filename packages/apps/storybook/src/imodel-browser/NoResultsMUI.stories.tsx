/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  NoResults as ExternalComponent,
  type NoResultsProps as NoResultsMUIProps,
} from "@itwin/imodel-browser-react/mui";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React from "react";

export const NoResults = (props: NoResultsMUIProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "imodel-browser/NoResultsMUI",
  component: NoResults,
  excludeStories: ["NoResults"],
} as Meta;

export const Primary: StoryObj<typeof NoResults> = {
  args: {
    text: "No iModels available",
  },
};

export const SearchResults: StoryObj<typeof NoResults> = {
  args: {
    text: "No search results",
    subtext: "Try adjusting your search criteria.",
    isSearchResult: true,
  },
};

export const WithSubtext: StoryObj<typeof NoResults> = {
  args: {
    text: "No iModels available",
    subtext: "Please check back later.",
  },
};
