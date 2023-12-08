/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  fireEvent,
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
      const cells = row.querySelectorAll("div[role='cell']");
      expect(cells.length).toBe(5);
      const mockedVersion = MockedVersion(versionRows.length - 1 - index);
      expect(cells[0].textContent).toContain(mockedVersion.name);
      expect(cells[1].textContent).toContain(mockedVersion.description);

      expect(cells[2].textContent).toContain(mockedVersion.createdBy);
      expect(cells[3].textContent).toContain(mockedVersion.createdDateTime);
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
      "div[role='rowgroup'] > div[role='row']"
    );
    expect(changesetRows.length).toBe(3);

    changesetRows.forEach((row, index) => {
      const cells = row.querySelectorAll("div[role='cell']");
      expect(cells.length).toBe(6);
      expect(cells[0].textContent).toContain(MockedChangeset(index).index);
      expect(cells[1].textContent).toContain(
        MockedChangeset(index).description
      );
      expect(cells[2].textContent).toContain(MockedChangeset(index).createdBy);
      expect(cells[3].textContent).toContain(
        MockedChangeset(index).synchronizationInfo.changedFiles.join(", ")
      );
      expect(cells[4].textContent).toContain(
        MockedChangeset(index).pushDateTime
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
      "div[role='rowgroup'] > div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockCreateVersion).toHaveBeenCalled();

    screen.getByText(defaultStrings.changes).click();

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

    const updateVersionButtons = screen.getAllByTitle(
      defaultStrings.updateNamedVersion
    );
    expect(updateVersionButtons.length).toBe(3);
    updateVersionButtons[0].click();

    await waitForSelectorToExist("input");
    const nameInput = document.querySelector("input") as HTMLInputElement;
    const descriptionInput = document.querySelector(
      "textarea[name='description']"
    ) as HTMLTextAreaElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });
    fireEvent.change(descriptionInput, {
      target: { value: "test description" },
    });
    screen.getByText("Update").click();

    await waitForElementToBeRemoved(() =>
      document.querySelector(".iui-progress-indicator-overlay")
    );

    expect(mockUpdateVersion).toHaveBeenCalledWith(
      MOCKED_IMODEL_ID,
      MockedVersion(2).id,
      {
        name: "test name",
        description: "test description",
      }
    );
    const versionCells = container.querySelectorAll(
      "div[role='rowgroup'] > div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");
    expect(versionCells[2].textContent).toEqual(MockedVersion(0).createdBy);
    expect(versionCells[3].textContent).toEqual(
      MockedVersion(0).createdDateTime
    );
    within(versionCells[4] as HTMLElement).getByTitle(
      defaultStrings.updateNamedVersion
    );
    expect(mockGetVersions).toHaveBeenCalledTimes(2);
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
    "div[role='rowgroup'] > div[role='row']"
  );
  expect(changesetRows.length).toBe(3);

  changesetRows.forEach((row, index) => {
    const cells = row.querySelectorAll("div[role='cell']");
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toContain(MockedChangeset(index).index);
    expect(cells[1].textContent).toContain(MockedChangeset(index).description);
    expect(cells[2].textContent).toContain(MockedChangeset(index).createdBy);
    expect(cells[3].textContent).toContain(
      MockedChangeset(index).synchronizationInfo.changedFiles.join(", ")
    );
    expect(cells[4].textContent).toContain(MockedChangeset(index).pushDateTime);
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
