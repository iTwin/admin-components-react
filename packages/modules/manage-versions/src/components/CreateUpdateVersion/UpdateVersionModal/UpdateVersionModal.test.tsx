/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { useToaster } from "@itwin/itwinui-react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";

import { NamedVersionClient } from "../../../clients/namedVersionClient";
import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MOCKED_IMODEL_ID,
  MockedVersion,
} from "../../../mocks";
import { ApimCodes, ApimError } from "../../../models";
import { defaultStrings } from "../../ManageVersions/ManageVersions";
import {
  UpdateVersionModal,
  UpdateVersionModalProps,
} from "./UpdateVersionModal";

const mockToaster = {
  negative: jest.fn(),
  positive: jest.fn(),
  closeAll: jest.fn(),
};

jest.mock("@itwin/itwinui-react", () => ({
  ...jest.requireActual("@itwin/itwinui-react"),
  useToaster: () => mockToaster,
}));

const renderComponent = (initialProps?: Partial<UpdateVersionModalProps>) => {
  const props = {
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    version: MockedVersion(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <UpdateVersionModal {...props} />
    </ConfigProvider>
  );
};

describe("UpdateVersionModal", () => {
  const toaster = renderHook(useToaster).result.current;
  const mockUpdateVersion = jest.spyOn(NamedVersionClient.prototype, "update");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a request with input data", async () => {
    mockUpdateVersion.mockResolvedValue(MockedVersion());
    const onUpdate = jest.fn();
    renderComponent({ onUpdate });

    const nameInput = await screen.findByLabelText("Name");
    const descriptionInput = await screen.findByLabelText("Description");

    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );
    await act(() =>
      fireEvent.change(descriptionInput, {
        target: { value: "test description" },
      })
    );

    const updateButton = await screen.findByRole("button", { name: "Update" });
    act(() => updateButton.click());

    expect(mockUpdateVersion).toHaveBeenCalledWith(
      MOCKED_IMODEL_ID,
      MockedVersion().id,
      {
        name: "test name",
        description: "test description",
      }
    );
    await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    expect(toaster.closeAll).toHaveBeenCalled();
    expect(toaster.positive).toHaveBeenCalledWith(
      'Named Version "test name" was successfully updated.',
      { hasCloseButton: true }
    );
  });

  it.each([
    [
      "InsufficientPermissions",
      defaultStrings.messageInsufficientPermissionsToUpdateVersion,
    ],
    ["NamedVersionExists", defaultStrings.messageVersionNameExists],
    ["otherError", defaultStrings.messageCouldNotUpdateVersion],
  ])("should show error message when got error %s", async (code, message) => {
    mockUpdateVersion.mockRejectedValue(
      new ApimError({
        code: code as ApimCodes,
        message: "error",
      })
    );
    await act(() => renderComponent());

    const nameInput = await screen.findByLabelText("Name");
    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );

    const updateButton = await screen.findByRole("button", { name: "Update" });
    await act(async () => updateButton.click());

    expect(mockUpdateVersion).toHaveBeenCalled();
    expect(toaster.closeAll).toHaveBeenCalled();
    expect(toaster.negative).toHaveBeenCalledWith(message, {
      hasCloseButton: true,
    });
  });
});
