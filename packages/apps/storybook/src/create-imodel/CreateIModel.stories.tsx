/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  CreateIModel as ExternalComponent,
  CreateIModelProps,
} from "@itwin/create-imodel";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const CreateIModel = (props: CreateIModelProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "create-imodel/CreateIModel",
  component: CreateIModel,
  excludeStories: ["CreateIModel"],
  argTypes: accessTokenArgTypes,
} as Meta;

const root = document.getElementById("root") as HTMLElement;
root.style.height = "90vh";

export const Create: Story<CreateIModelProps> = withAccessTokenOverride(
  (args) => {
    return (
      <>
        <CreateIModel {...args} />
      </>
    );
  }
);

Create.args = {
  apiOverrides: { serverEnvironmentPrefix: "dev" },
  projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
};
