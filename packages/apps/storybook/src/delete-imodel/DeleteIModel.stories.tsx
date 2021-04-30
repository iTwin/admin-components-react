/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DeleteIModel as ExternalComponent,
  DeleteIModelProps,
} from "@itwin/delete-imodel";
import { Button } from "@itwin/itwinui-react";
import { useState } from "@storybook/addons";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
  accessTokenArgTypes,
  withAccessTokenOverride,
} from "../utils/storyHelp";

export const DeleteIModel = (props: DeleteIModelProps) => (
  <ExternalComponent {...props} />
);

export default {
  title: "delete-imodel/DeleteIModel",
  component: DeleteIModel,
  excludeStories: ["DeleteIModel"],
  argTypes: accessTokenArgTypes,
} as Meta;

export const Primary: Story<DeleteIModelProps> = withAccessTokenOverride(
  (args) => {
    const [showDialog, setShowDialog] = useState(false);

    return (
      <>
        <Button onClick={() => setShowDialog(true)}>Delete an iModel</Button>
        {showDialog && (
          <DeleteIModel
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
  imodel: {
    id: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
    name: "Random guid iModel",
  },
  apiOverrides: { serverEnvironmentPrefix: "dev" },
};
