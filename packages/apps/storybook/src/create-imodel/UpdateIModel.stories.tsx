/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  UpdateIModel as ExternalComponent,
  UpdateIModelProps,
} from "@itwin/create-imodel";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const UpdateIModel = (props: UpdateIModelProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "create-imodel/UpdateIModel",
  component: UpdateIModel,
  excludeStories: ["UpdateIModel"],
  argTypes: accessTokenArgTypes,
} as Meta;

export const Update: Story<UpdateIModelProps> = withAccessTokenOverride(
  (args) => {
    return (
      <>
        <UpdateIModel {...args} />
      </>
    );
  }
);

Update.args = {
  apiOverrides: { serverEnvironmentPrefix: "dev" },
  imodelId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
  initialIModel: {
    name: "iModel name",
    description: "iModel description",
  },
};
