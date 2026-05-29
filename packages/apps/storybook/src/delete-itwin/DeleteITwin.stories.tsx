/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { DeleteITwin, DeleteITwinProps } from "@itwin/delete-itwin-react";
import { Button } from "@itwin/itwinui-react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React, { useState } from "react";
import { accessTokenArgTypes } from "../utils/storyHelp";

export default {
  title: "delete-twin/DeleteITwin",
  component: DeleteITwin,
  excludeStories: ["DeleteITwin"],
  argTypes: accessTokenArgTypes,
} as Meta;

const PrimaryRender = (args: DeleteITwinProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Delete an iTwin</Button>
      {showDialog && (
        <DeleteITwin
          {...args}
          onClose={() => {
            args.onClose?.();
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
};

export const Primary: StoryObj<typeof DeleteITwin> = {
  render: (args) => <PrimaryRender {...args} />,
  args: {
    iTwin: {
      id: "5469e5fc-7edc-4769-a69b-311cf707f6e1",
      displayName: "Example iTwin",
    },
    apiOverrides: { serverEnvironmentPrefix: "dev" },
  },
};
