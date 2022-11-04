/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  CreateIModel as ExternalComponent,
  CreateIModelProps,
  IModelDescription,
  IModelName,
  UploadImage,
} from "@itwin/create-imodel-react";
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
  args: {
    apiOverrides: { serverEnvironmentPrefix: "dev" },
    projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
  },
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

export const WithExtentMap: Story<CreateIModelProps> = withAccessTokenOverride(
  (args) => {
    return (
      <CreateIModel
        {...args}
        extentComponent={
          <iframe
            title="iModel Extent Map"
            src="https://www.google.com/maps/embed"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={false}
          ></iframe>
        }
      />
    );
  }
);

export const CreateIModelComponents: Story<CreateIModelProps> =
  withAccessTokenOverride((args) => {
    return (
      <>
        <CreateIModel {...args}>
          <div style={{ marginBottom: "10px" }}>
            <IModelDescription />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <IModelName />
          </div>
          <div>
            <UploadImage />
          </div>
        </CreateIModel>
      </>
    );
  });
