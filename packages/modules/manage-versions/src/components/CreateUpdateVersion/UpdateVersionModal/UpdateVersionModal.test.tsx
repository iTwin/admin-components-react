/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useToaster } from "@itwin/itwinui-react";
import {
  Toaster,
  ToastProvider,
} from "@itwin/itwinui-react/cjs/core/Toast/Toaster";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitForElementToBeRemoved,
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
import {
  UpdateVersionModal,
  UpdateVersionModalProps,
} from "./UpdateVersionModal";

function toasterContraption() {
  const { result } = renderHook(() => useToaster(), {
    wrapper: ({ children }) => (
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    ),
  });
  return () => result.current;
}

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
  const toaster = toasterContraption();
  const mockUpdateVersion = jest.spyOn(NamedVersionClient.prototype, "update");
  const mockPositiveToast = jest.spyOn(toaster(), "positive");
  const mockNegativeToast = jest.spyOn(toaster(), "negative");
  const mockCloseAllToast = jest.spyOn(toaster(), "closeAll");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a request with input data", async () => {
    mockUpdateVersion.mockResolvedValue(MockedVersion());
    const onUpdate = jest.fn();
    renderComponent({ onUpdate });

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();

    const descriptionInput = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    expect(descriptionInput).toBeTruthy();

    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );
    await act(() =>
      fireEvent.change(descriptionInput, {
        target: { value: "test description" },
      })
    );

    screen.getByText("Update").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    expect(mockUpdateVersion).toHaveBeenCalledWith(
      MOCKED_IMODEL_ID,
      MockedVersion().id,
      {
        name: "test name",
        description: "test description",
      }
    );
    expect(onUpdate).toHaveBeenCalled();
    expect(mockCloseAllToast).toHaveBeenCalled();
    expect(mockPositiveToast).toHaveBeenCalledWith(
      'Named Version "test name" was successfully updated.',
      { hasCloseButton: true }
    );
  });

  it.each([
    [
      "InsufficientPermissions",
      "You do not have the required permissions to update a Named Version.",
    ],
    ["NamedVersionExists", "Named Version with the same name already exists."],
    ["otherError", "Could not update a Named Version. Please try again later."],
  ])("should show error message when got error %s", async (code, message) => {
    mockUpdateVersion.mockRejectedValue(
      new ApimError({
        code: code as ApimCodes,
        message: "error",
      })
    );
    renderComponent();

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );

    screen.getByText("Update").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    expect(mockUpdateVersion).toHaveBeenCalled();
    expect(mockCloseAllToast).toHaveBeenCalled();
    expect(mockNegativeToast).toHaveBeenCalledWith(message, {
      hasCloseButton: true,
    });
  });
});
