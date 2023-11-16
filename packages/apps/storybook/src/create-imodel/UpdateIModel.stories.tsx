/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  UpdateIModel as ExternalComponent,
  UpdateIModelProps,
} from "@itwin/create-imodel-react";
import { ThemeProvider } from "@itwin/itwinui-react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

function base64ToArrayBuffer(base64: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export const UpdateIModel = (props: UpdateIModelProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "create-imodel/UpdateIModel",
  component: UpdateIModel,
  excludeStories: ["UpdateIModel"],
  argTypes: accessTokenArgTypes,
} as Meta;

const root = document.getElementById("root") as HTMLElement;
root.style.height = "90vh";

export const Update: Story<UpdateIModelProps> = withAccessTokenOverride(
  (args) => {
    return (
      <ThemeProvider>
        <UpdateIModel {...args} />
      </ThemeProvider>
    );
  }
);

Update.args = {
  apiOverrides: { serverEnvironmentPrefix: "dev" },
  imodelId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
  initialIModel: {
    name: "iModel name",
    description: "iModel description",
    thumbnail: base64ToArrayBuffer(
      "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"
    ),
    extent: {
      southWest: { latitude: 1, longitude: 2 },
      northEast: { latitude: 3, longitude: 4 },
    },
  },
};
