/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import {
  MOCKED_IMODEL_ID,
  MockedChangeset,
  MockedChangesetList,
  MockedVersion,
  MockedVersionList,
} from "../../mocks";
import {
  defaultStrings,
  ManageVersions,
  ManageVersionsProps,
} from "./ManageVersions";

const renderComponent = (initialProps?: Partial<ManageVersionsProps>) => {
  const props: ManageVersionsProps = {
    accessToken: "test_token",
    imodelId: MOCKED_IMODEL_ID,
    ...initialProps,
  };
  return render(<ManageVersions {...props} />);
};

describe("ManageVersions", () => {
  const mockGetVersions = jest.spyOn(NamedVersionClient.prototype, "get");
  const mockCreateVersion = jest.spyOn(NamedVersionClient.prototype, "create");
  const mockUpdateVersion = jest.spyOn(NamedVersionClient.prototype, "update");
  const mockGetChangesets = jest.spyOn(ChangesetClient.prototype, "get");

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVersions.mockResolvedValue(MockedVersionList());
    mockGetChangesets.mockResolvedValue(MockedChangesetList());
  });

  it("should show versions table with data", async () => {
    const { container } = renderComponent();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );
    const versionRows = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row"
    );
    expect(versionRows.length).toBe(3);

    versionRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(4);
      expect(cells[0].textContent).toContain(MockedVersion(index).name);
      expect(cells[1].textContent).toContain(MockedVersion(index).description);
      expect(cells[2].textContent).toContain(
        new Date(MockedVersion(index).createdDateTime).toLocaleString()
      );
    });
    expect(mockGetVersions).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      top: 100,
      skip: undefined,
    });
  });

  it("should show changesets table with data", async () => {
    const { container } = renderComponent();

    screen.getByText(defaultStrings.changes).click();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );
    const changesetRows = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row"
    );
    expect(changesetRows.length).toBe(3);

    changesetRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-tables-cell");
      expect(cells.length).toBe(4);
      expect(cells[0].textContent).toContain(MockedChangeset(index).index);
      expect(cells[1].textContent).toContain(
        MockedChangeset(index).description
      );
      expect(cells[2].textContent).toContain(
        new Date(MockedChangeset(index).pushDateTime).toLocaleString()
      );
    });
    expect(mockGetChangesets).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      top: 100,
      skip: undefined,
    });
  });

  it("should query data only once when switching tabs", async () => {
    const { container } = renderComponent();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    screen.getByText(defaultStrings.changes).click();
    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    expect(mockGetVersions).toHaveBeenCalledTimes(1);
    expect(mockGetChangesets).toHaveBeenCalledTimes(1);
  });

  it("should show error message in versions table when failed to fetch versions", async () => {
    mockGetVersions.mockRejectedValue("error");
    renderComponent();

    await screen.findByText(defaultStrings.messageFailedGetNamedVersions);
  });

  it("should show error message in changes table when failed to fetch changesets", async () => {
    mockGetChangesets.mockRejectedValue("error");
    renderComponent();

    screen.getByText(defaultStrings.changes).click();
    await screen.findByText(defaultStrings.messageFailedGetChanges);
  });

  it("should create new version", async () => {
    const latestVersion = {
      ...MockedVersion(2),
      createdDateTime: "9999-01-01",
    };
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(1),
      latestVersion,
      MockedVersion(3),
    ]);
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(4, { name: "test name", description: "test description" }),
      ...MockedVersionList(),
    ]);
    mockGetChangesets.mockResolvedValueOnce([
      MockedChangeset(1),
      MockedChangeset(2, {
        _links: { namedVersion: { href: "https://test.url" } },
      }),
      MockedChangeset(3),
    ]);
    mockGetChangesets.mockResolvedValueOnce([
      MockedChangeset(1, {
        _links: { namedVersion: { href: "https://test.url" } },
      }),
      MockedChangeset(2, {
        _links: { namedVersion: { href: "https://test.url" } },
      }),
      MockedChangeset(3),
    ]);

    mockCreateVersion.mockResolvedValue(MockedVersion());
    const { container } = renderComponent();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    screen.getByText(defaultStrings.changes).click();
    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    const createVersionButton = container.querySelector(
      ".iac-create-version-icon"
    ) as HTMLElement;
    expect(createVersionButton).toBeTruthy();
    createVersionButton.click();

    const additionalInfos = document.querySelectorAll(".iac-additional-info");
    expect(additionalInfos.length).toBe(2);
    const latestVersionInfo = additionalInfos[1].querySelectorAll("span");
    expect(latestVersionInfo.length).toBe(2);
    expect(latestVersionInfo[0].textContent).toEqual(latestVersion.name);
    expect(latestVersionInfo[1].textContent).toEqual(
      new Date(latestVersion.createdDateTime).toLocaleString()
    );

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });

    screen.getByText("Create").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    const versionCells = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row:first-child .iui-tables-cell"
    );
    expect(versionCells.length).toBe(4);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockCreateVersion).toHaveBeenCalled();

    screen.getByText(defaultStrings.changes).click();
    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    expect(mockGetChangesets).toHaveBeenCalledTimes(2);
  });

  it("should update version", async () => {
    mockGetVersions.mockResolvedValueOnce(MockedVersionList());
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(3, { name: "test name", description: "test description" }),
      ...MockedVersionList(2),
    ]);
    mockUpdateVersion.mockResolvedValue(MockedVersion());
    const { container } = renderComponent();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );

    const updateVersionButton = container.querySelector(
      ".iac-update-version-icon"
    ) as HTMLElement;
    expect(updateVersionButton).toBeTruthy();
    updateVersionButton.click();

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });

    screen.getByText("Update").click();
    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    const versionCells = container.querySelectorAll(
      ".iui-tables-body .iui-tables-row:first-child .iui-tables-cell"
    );
    expect(versionCells.length).toBe(4);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockUpdateVersion).toHaveBeenCalled();
  });
});
