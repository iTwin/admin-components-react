/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ButtonBar,
  CreateIModel,
  CreateIModelProps,
  IModelDescription,
  IModelName,
  UploadImage,
} from "@itwin/create-imodel-react";
import { LabeledInput, LabeledSelect } from "@itwin/itwinui-react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React from "react";
import { iTwinAndAccessTokenArgTypes } from "../utils/storyHelp";

export default {
  title: "create-imodel/CreateIModel",
  component: CreateIModel,
  excludeStories: ["CreateIModel"],
  argTypes: iTwinAndAccessTokenArgTypes,
  args: {
    apiOverrides: { serverEnvironmentPrefix: "dev" },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "90vh" }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Create: StoryObj<typeof CreateIModel> = {};

export const WithExtentMap: StoryObj<typeof CreateIModel> = {
  render: (args) => (
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
  ),
};

export const Customized: StoryObj<typeof CreateIModel> = {
  render: (args) => (
    <CreateIModel {...args}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <IModelName />
        <LabeledInput
          label={"Sub title"}
          name="test"
          value={""}
          onChange={() => undefined}
          autoComplete="off"
          className="iac-model-wrapper-element"
        />
        <LabeledSelect
          label="Select version"
          options={[
            { value: 1, label: "Item #1" },
            { value: 2, label: "Item #2", disabled: true },
            { value: 3, label: "Item #3" },
          ]}
          onChange={() => undefined}
          className="iac-model-wrapper-element"
        />
        <IModelDescription />
        <UploadImage />
        <ButtonBar />
      </div>
    </CreateIModel>
  ),
};
