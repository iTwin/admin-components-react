/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DeleteITwin as ExternalComponent,
  DeleteITwinProps,
} from "@itwin/delete-itwin-react";
import { Button } from "@itwin/itwinui-react";
import { useState } from "@storybook/addons";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const DeleteITwin = (props: DeleteITwinProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "delete-twin/DeleteITwin",
  component: DeleteITwin,
  excludeStories: ["DeleteITwin"],
  argTypes: accessTokenArgTypes,
} as Meta;

export const Primary: Story<DeleteITwinProps> = withAccessTokenOverride(
  (args) => {
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
  }
);

Primary.args = {
  iTwin: {
    id: "5469e5fc-7edc-4769-a69b-311cf707f6e1",
    displayName: "Example iTwin",
  },
  apiOverrides: { serverEnvironmentPrefix: "dev" },
};
