/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ITwinAwareComponent } from "./ITwinAwareComponent";

export default {
  title: "Example/ITwin Aware",
  component: ITwinAwareComponent,
} as Meta;

export const Primary: StoryObj<typeof ITwinAwareComponent> = {};
