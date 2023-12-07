/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useToaster } from "@itwin/itwinui-react";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";

import { NamedVersionClient } from "../../../clients/namedVersionClient";
import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MOCKED_IMODEL_ID,
  MockedChangeset,
  MockedVersion,
} from "../../../mocks";
import { ApimCodes, ApimError } from "../../../models";
import {
  CreateVersionModal,
  CreateVersionModalProps,
} from "./CreateVersionModal";

jest.mock("@itwin/itwinui-react", () => {
  const actual = jest.requireActual("@itwin/itwinui-react");

  return {
    ...actual,
    useToaster: jest.fn().mockReturnValue({
      positive: jest.fn(),
      negative: jest.fn(),
      closeAll: jest.fn(),
    }),
  };
});

const renderComponent = (initialProps?: Partial<CreateVersionModalProps>) => {
  const props = {
    onClose: jest.fn(),
    onCreate: jest.fn(),
    changeset: MockedChangeset(),
    latestVersion: undefined,
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <CreateVersionModal {...props} />
    </ConfigProvider>
  );
};

describe("CreateVersionModal", () => {
  const toaster = useToaster();
  const mockCreateVersion = jest.spyOn(NamedVersionClient.prototype, "create");
  const mockPositiveToast = jest.spyOn(toaster, "positive");
  const mockNegativeToast = jest.spyOn(toaster, "negative");
  const mockCloseAllToast = jest.spyOn(toaster, "closeAll");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show additional info", () => {
    renderComponent({ latestVersion: MockedVersion() });

    const additionalInfos = document.querySelectorAll(".iac-additional-info");
    expect(additionalInfos.length).toBe(2);

    const changesetInfo = additionalInfos[0].querySelectorAll("span");
    expect(changesetInfo.length).toBe(2);
    expect(changesetInfo[0].textContent).toEqual(`#${MockedChangeset().index}`);
    expect(changesetInfo[1].textContent).toEqual(
      new Date(MockedChangeset().pushDateTime).toLocaleString()
    );

    const latestVersionInfo = additionalInfos[1].querySelectorAll("span");
    expect(latestVersionInfo.length).toBe(2);
    expect(latestVersionInfo[0].textContent).toEqual(MockedVersion().name);
    expect(latestVersionInfo[1].textContent).toEqual(
      new Date(MockedVersion().createdDateTime).toLocaleString()
    );
  });

  it("should make a request with input data", async () => {
    mockCreateVersion.mockResolvedValue(MockedVersion());
    const onCreate = jest.fn();
    renderComponent({ onCreate });

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();

    const descriptionInput = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    expect(descriptionInput).toBeTruthy();

    fireEvent.change(nameInput, { target: { value: "test name" } });
    fireEvent.change(descriptionInput, {
      target: { value: "test description" },
    });

    screen.getByText("Create").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    expect(mockCreateVersion).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      name: "test name",
      description: "test description",
      changeSetId: MockedChangeset().id,
    });
    expect(onCreate).toHaveBeenCalled();
    expect(mockCloseAllToast).toHaveBeenCalled();
    expect(mockPositiveToast).toHaveBeenCalledWith(
      'Named Version "test name" was successfully created.',
      { hasCloseButton: true }
    );
  });

  it.each([
    [
      "InsufficientPermissions",
      "You do not have the required permissions to create a Named Version.",
    ],
    ["NamedVersionExists", "Named Version with the same name already exists."],
    ["otherError", "Could not create a Named Version. Please try again later."],
  ])("should show error message when got error %s", async (code, message) => {
    mockCreateVersion.mockRejectedValue(
      new ApimError({
        code: code as ApimCodes,
        message: "error",
      })
    );
    renderComponent();

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });

    screen.getByText("Create").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    expect(mockCreateVersion).toHaveBeenCalled();
    expect(mockCloseAllToast).toHaveBeenCalled();
    expect(mockNegativeToast).toHaveBeenCalledWith(message, {
      hasCloseButton: true,
    });
  });
});
