/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { Authentiated, AuthenticatedProps } from "./Authenticated";

export default {
  title: "Example/Authenticated",
  component: Authentiated,
  argTypes: {
    accessToken: {
      defaultValue:
        "In this storybook, this is provided by clicking on the key in the toolbar",
    },
  },
} as Meta;

const Template: Story<AuthenticatedProps> = (args, context) => (
  <Authentiated {...args} accessToken={context.globals.accessToken} />
);

export const Primary = Template.bind({});
Primary.args = {};
