/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import {
  IModelThumbnail as ExternalComponent,
  IModelThumbnailProps,
} from "@itwin/imodel-browser";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

/**
 * When using external components in storybook, the documentation will not be built automatically
 * by the react-docgen-typescript-plugin for these component.
 * A workaround for this is to declare the components locally so the docgen works.
 * The numbered steps below describe this process.
 */

// 1. Imports the external component under a different name from the module
// Eg: `import { NoResults as ExternalComponent, NoResultsProps } from "@itwin/imodel-browser";`

// 2. Export a newly created component with the original name and imported props type.
// This component must be exported so react-docgen-typescript can process it.
// Note that while the props will be properly documented, the component description is not extracted.
/** Story that demonstrate how to create a story for a component exported from a packages/modules/\*\* package. */
export const IModelThumbnail = (props: IModelThumbnailProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "Example/Modules component",
  // 3. Use the created component in the stories
  component: IModelThumbnail,
  // 4. Because we export the component in this file, we need to exclude it as a "Story"
  excludeStories: ["IModelThumbnail"],
} as Meta;

// 5. Use the created component in the story template, the props documentation will appear "normal"
const Template: Story<IModelThumbnailProps> = (args) => (
  <IModelThumbnail {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
