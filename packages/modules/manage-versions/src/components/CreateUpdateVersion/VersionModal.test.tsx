/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ConfigProvider } from "../../common/configContext";
import { MOCKED_CONFIG_PROPS } from "../../mocks";
import { NamedVersion } from "../../models";
import { VersionModal, VersionModalProps } from "./VersionModal";

const renderComponent = (initialProps?: Partial<VersionModalProps>) => {
  const props = {
    isLoading: false,
    title: "Version Modal Title",
    actionName: "Action",
    onClose: jest.fn(),
    onActionClick: jest.fn(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <VersionModal {...props} />
    </ConfigProvider>
  );
};

describe("VersionModal", () => {
  it("should trigger onActionClick with input data", () => {
    const onActionClick = jest.fn();
    renderComponent({ onActionClick });

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

    screen.getByText("Action").click();

    expect(onActionClick).toHaveBeenCalledWith("test name", "test description");
  });

  it("should show error messages when inputs are too long", () => {
    renderComponent();

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();

    const descriptionInput = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    expect(descriptionInput).toBeTruthy();

    fireEvent.change(nameInput, {
      target: { value: new Array(260).join("a") },
    });
    fireEvent.change(descriptionInput, {
      target: { value: new Array(260).join("a") },
    });

    expect(
      screen.getAllByText("The value exceeds allowed 255 characters.").length
    ).toBe(2);

    const actionButton = screen
      .getByText("Action")
      .closest("button") as HTMLButtonElement;
    expect(actionButton).not.toBeUndefined();
    expect(actionButton.getAttribute("aria-disabled")).toBe("true");
  });

  it("should disable action button when name is missing", () => {
    renderComponent();

    const actionButton = screen
      .getByText("Action")
      .closest("button") as HTMLButtonElement;
    expect(actionButton).not.toBeUndefined();
    expect(actionButton.getAttribute("aria-disabled")).toBe("true");
  });

  it("should disable action button when data is the same as before", () => {
    renderComponent({
      initialVersion: {
        name: "test name",
        description: "test description",
      } as NamedVersion,
    });

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

    const actionButton = screen
      .getByText("Action")
      .closest("button") as HTMLButtonElement;
    expect(actionButton).not.toBeUndefined();
    expect(actionButton.getAttribute("aria-disabled")).toBe("true");
  });

  it("should trigger onClose", () => {
    const onClose = jest.fn();
    renderComponent({ onClose });

    screen.getByText("Cancel").click();

    expect(onClose).toHaveBeenCalled();
  });

  it("should show spinner", () => {
    renderComponent({ isLoading: true });

    const spinnerOverlay = document.querySelector(
      ".iui-progress-indicator-overlay"
    );
    expect(spinnerOverlay).toBeTruthy();
    const modalOverlay = document.querySelector(".iac-version-modal-overlay");
    expect(modalOverlay).toBeTruthy();
  });
});
