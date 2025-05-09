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
import {
  ApimCodes,
  ApimError,
  localeDateWithTimeFormat,
} from "../../../models";
import { defaultStrings } from "../../ManageVersions/ManageVersions";
import {
  CreateVersionModal,
  CreateVersionModalProps,
} from "./CreateVersionModal";

const mockToaster = {
  positive: jest.fn(),
  negative: jest.fn(),
  closeAll: jest.fn(),
};

jest.mock("@itwin/itwinui-react", () => ({
  ...jest.requireActual("@itwin/itwinui-react"),
  useToaster: () => mockToaster,
}));

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
  const toaster = renderHook(useToaster).result.current;

  const mockCreateVersion = jest.spyOn(NamedVersionClient.prototype, "create");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show additional info", async () => {
    await act(() => renderComponent({ latestVersion: MockedVersion() }));

    const additionalInfos = document.querySelectorAll(".iac-additional-info");
    expect(additionalInfos.length).toBe(2);

    const changesetInfo = additionalInfos[0].querySelectorAll("span");
    expect(changesetInfo.length).toBe(2);
    expect(changesetInfo[0].textContent).toEqual(`#${MockedChangeset().index}`);
    expect(changesetInfo[1].textContent).toEqual(
      localeDateWithTimeFormat(new Date(MockedChangeset().pushDateTime))
    );

    const latestVersionInfo = additionalInfos[1].querySelectorAll("span");
    expect(latestVersionInfo.length).toBe(2);
    expect(latestVersionInfo[0].textContent).toEqual(MockedVersion().name);
    expect(latestVersionInfo[1].textContent).toEqual(
      localeDateWithTimeFormat(new Date(MockedVersion().createdDateTime))
    );
  });

  it("should make a request with input data", async () => {
    mockCreateVersion.mockResolvedValue(MockedVersion());
    const onCreate = jest.fn();
    const { container } = renderComponent({ onCreate });

    const nameInput = await screen.findByLabelText("Name");
    expect(nameInput).toBeTruthy();

    const descriptionInput = await screen.findByLabelText("Description");
    expect(descriptionInput).toBeTruthy();

    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );
    await act(() =>
      fireEvent.change(descriptionInput, {
        target: { value: "test description" },
      })
    );

    const createButton = await screen.findByRole("button", { name: "Create" });
    await fireEvent.click(createButton);
    await waitForElementToBeRemoved(() =>
      container.querySelector(".iac-version-modal-loader")
    );

    expect(mockCreateVersion).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      name: "test name",
      description: "test description",
      changeSetId: MockedChangeset().id,
    });
    await waitFor(() => expect(onCreate).toHaveBeenCalled());
    expect(toaster.closeAll).toHaveBeenCalled();
    expect(toaster.positive).toHaveBeenCalledWith(
      'Named Version "test name" was successfully created.',
      { hasCloseButton: true }
    );
  });

  it.each([
    [
      "InsufficientPermissions",
      defaultStrings.messageInsufficientPermissionsToCreateVersion,
    ],
    ["NamedVersionExists", defaultStrings.messageVersionNameExists],
    ["otherError", defaultStrings.messageCouldNotCreateVersion],
  ])("should show error message when got error %s", async (code, message) => {
    mockCreateVersion.mockRejectedValue(
      new ApimError({
        code: code as ApimCodes,
        message: "error",
      })
    );
    await act(() => renderComponent());

    const nameInput = await screen.findByLabelText("Name");
    expect(nameInput).toBeTruthy();
    await act(() =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );

    const createButton = await screen.findByRole("button", { name: "Create" });
    await act(async () => createButton.click());

    expect(mockCreateVersion).toHaveBeenCalled();
    expect(toaster.closeAll).toHaveBeenCalled();
    expect(toaster.negative).toHaveBeenCalledWith(message, {
      hasCloseButton: true,
    });
  });
});
