/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  InputStatus,
  LabeledThemedSelect,
  LabeledThemedSelectProps,
} from "@bentley/ui-core";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

export default {
  title: "Example/ThemedControl",
  component: LabeledThemedSelect,
} as Meta;

const Template: Story<LabeledThemedSelectProps> = (args) => (
  <LabeledThemedSelect
    label="Themed select"
    message="There is no content or control on purpose, the goal is to display the theme only"
    status={InputStatus.Warning}
    options={[]}
  />
);

export const Primary = Template.bind({});
Primary.parameters = {
  controls: { disabled: true },
};
