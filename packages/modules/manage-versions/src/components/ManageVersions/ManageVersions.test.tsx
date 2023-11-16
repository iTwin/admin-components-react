/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  fireEvent,
  queryByText,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import React from "react";

import { ChangesetClient } from "../../clients/changesetClient";
import { NamedVersionClient } from "../../clients/namedVersionClient";
import {
  MOCKED_IMODEL_ID,
  MockedChangeset,
  MockedChangesetList,
  MockedUsers,
  MockedVersion,
  MockedVersionList,
} from "../../mocks";
import {
  defaultStrings,
  ManageVersions,
  ManageVersionsProps,
  ManageVersionsTabs,
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
  const mockGetUsers = jest.spyOn(ChangesetClient.prototype, "getUsers");

  const waitForSelectorToExist = async (selector: string) =>
    waitFor(() => expect(document.querySelector(selector)).not.toBeNull());

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVersions.mockResolvedValue(MockedVersionList());
    mockGetChangesets.mockResolvedValue(MockedChangesetList());
    mockGetUsers.mockResolvedValue(MockedUsers());
  });

  it("should show versions table with data", async () => {
    const { container } = renderComponent();

    await waitForElementToBeRemoved(() =>
      container.querySelector(".iui-progress-indicator-radial")
    );
    const versionRows = container.querySelectorAll(
      ".iui-table-body .iui-table-row"
    );
    expect(versionRows.length).toBe(3);

    versionRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-table-cell");
      expect(cells.length).toBe(5);
      expect(cells[0].textContent).toContain(MockedVersion(index).name);
      expect(cells[1].textContent).toContain(MockedVersion(index).description);

      expect(cells[2].textContent).toContain(MockedVersion(index).createdBy);
      expect(cells[3].textContent).toContain(
        new Date(MockedVersion(index).createdDateTime).toLocaleString()
      );
      within(cells[4] as HTMLElement).getByTitle(
        defaultStrings.updateNamedVersion
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
      ".iui-table-body .iui-table-row"
    );
    expect(changesetRows.length).toBe(3);

    changesetRows.forEach((row, index) => {
      const cells = row.querySelectorAll(".iui-table-cell");
      expect(cells.length).toBe(6);
      expect(cells[0].textContent).toContain(MockedChangeset(index + 1).index);
      expect(cells[1].textContent).toContain(
        MockedChangeset(index + 1).description
      );
      expect(cells[2].textContent).toContain(
        MockedChangeset(index + 1).createdBy
      );
      expect(cells[3].textContent).toContain(
        MockedChangeset(index + 1).synchronizationInfo.changedFiles.join(", ")
      );
      expect(cells[4].textContent).toContain(
        new Date(MockedChangeset(index + 1).pushDateTime).toLocaleString()
      );
      const actionButtons = (cells[5] as HTMLElement).querySelectorAll(
        '[type="button"]'
      );
      expect(actionButtons.length).toBe(2);
      within(cells[5] as HTMLElement).getByTitle(
        defaultStrings.createNamedVersion
      );
      within(cells[5] as HTMLElement).getByTitle("Information Panel");
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

    expect(mockGetVersions).toHaveBeenCalledTimes(1);
    //query data twice as now showing included changesets in named version table
    expect(mockGetChangesets).toHaveBeenCalledTimes(2);
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
      createdDateTime: "2019-09-08T18:30:00.000Z",
    };
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

    const createVersionButtons = screen.getAllByTitle(
      defaultStrings.createNamedVersion
    );
    expect(createVersionButtons.length).toBe(3);
    createVersionButtons[0].click();

    await waitForSelectorToExist(".iac-additional-info");
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
      ".iui-table-body .iui-table-row:first-child .iui-table-cell"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockCreateVersion).toHaveBeenCalled();

    screen.getByText(defaultStrings.changes).click();

    expect(mockGetChangesets).toHaveBeenCalledTimes(3);
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

    const updateVersionButtons = screen.getAllByTitle(
      defaultStrings.updateNamedVersion
    );
    expect(updateVersionButtons.length).toBe(3);
    updateVersionButtons[0].click();

    await waitForSelectorToExist("input");
    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });

    screen.getByText("Update").click();

    const versionCells = container.querySelectorAll(
      ".iui-table-body .iui-table-row:first-child .iui-table-cell"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual(MockedVersion(0).name);
    expect(versionCells[1].textContent).toEqual(MockedVersion(0).description);
    expect(versionCells[2].textContent).toEqual(MockedVersion(0).createdBy);
    expect(versionCells[3].textContent).toEqual(
      new Date(MockedVersion(0).createdDateTime).toLocaleString()
    );
    within(versionCells[4] as HTMLElement).getByTitle(
      defaultStrings.updateNamedVersion
    );
    expect(mockGetVersions).toHaveBeenCalledTimes(1);
    expect(mockUpdateVersion).toHaveBeenCalled();
  });
});

it("should render with changesets tab opened", async () => {
  const { container } = renderComponent({
    currentTab: ManageVersionsTabs.Changes,
  });

  await waitForElementToBeRemoved(() =>
    container.querySelector(".iui-progress-indicator-radial")
  );
  const changesetRows = container.querySelectorAll(
    ".iui-table-body .iui-table-row"
  );
  expect(changesetRows.length).toBe(3);

  changesetRows.forEach((row, index) => {
    const cells = row.querySelectorAll(".iui-table-cell");
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toContain(MockedChangeset(index + 1).index);
    expect(cells[1].textContent).toContain(
      MockedChangeset(index + 1).description
    );
    expect(cells[2].textContent).toContain(
      MockedChangeset(index + 1).createdBy
    );
    expect(cells[3].textContent).toContain(
      MockedChangeset(index + 1).synchronizationInfo.changedFiles.join(", ")
    );
    expect(cells[4].textContent).toContain(
      new Date(MockedChangeset(index + 1).pushDateTime).toLocaleString()
    );
    const actionButtons = (cells[5] as HTMLElement).querySelectorAll(
      '[type="button"]'
    );
    expect(actionButtons.length).toBe(2);
    within(cells[5] as HTMLElement).getByTitle(
      defaultStrings.createNamedVersion
    );
    within(cells[5] as HTMLElement).getByTitle("Information Panel");
  });
});

it("should trigger onTabChange", async () => {
  const onTabChange = jest.fn();
  const { container } = renderComponent({ onTabChange });

  screen.getByText(defaultStrings.changes).click();
  await waitForElementToBeRemoved(() =>
    container.querySelector(".iui-progress-indicator-radial")
  );
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Changes);

  screen.getByText(defaultStrings.namedVersions).click();
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Versions);
});
