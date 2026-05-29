/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelThumbnail } from "@itwin/imodel-browser-react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

export default {
  title: "Example/Modules component",
  component: IModelThumbnail,
  excludeStories: ["IModelThumbnail"],
} satisfies Meta<typeof IModelThumbnail>;

export const Primary: StoryObj<typeof IModelThumbnail> = {
  args: {
    apiOverrides: {
      data: "https://picsum.photos/200/300",
    },
    className: "forced-thumbnail-height",
  },
};
