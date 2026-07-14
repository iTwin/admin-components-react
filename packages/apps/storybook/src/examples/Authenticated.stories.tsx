/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { accessTokenArgTypes } from "../utils/storyHelp";
import { Authentiated } from "./Authenticated";

export default {
  title: "Example/Authenticated",
  component: Authentiated,
  argTypes: accessTokenArgTypes,
} as Meta;

export const Primary: StoryObj<typeof Authentiated> = {};
