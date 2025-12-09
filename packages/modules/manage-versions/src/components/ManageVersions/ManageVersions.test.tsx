/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import {
  fireEvent,
  render,
  screen,
  waitFor,
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
import { localeDateWithTimeFormat } from "../../models/utils";
import {
  defaultStrings,
  ManageVersions,
  ManageVersionsProps,
  ManageVersionsTabs,
} from "./ManageVersions";

const TEST_CONTAINER_HEIGHT = 600;

const renderComponent = (initialProps?: Partial<ManageVersionsProps>) => {
  const props: ManageVersionsProps = {
    accessToken: "test_token",
    imodelId: MOCKED_IMODEL_ID,
    enableHideVersions: false,
    ...initialProps,
  };
  return render(
    <div style={{ height: TEST_CONTAINER_HEIGHT }}>
      <ManageVersions {...props} />
    </div>
  );
};

describe("ManageVersions", () => {
  const mockGetVersions = jest.spyOn(NamedVersionClient.prototype, "get");
  const mockCreateVersion = jest.spyOn(NamedVersionClient.prototype, "create");
  const mockUpdateVersion = jest.spyOn(NamedVersionClient.prototype, "update");
  const mockGetChangesets = jest.spyOn(ChangesetClient.prototype, "get");
  const mockGetUsers = jest.spyOn(ChangesetClient.prototype, "getUsers");
  const mockScrollTo = jest.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    value: mockScrollTo,
  });

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

    await waitFor(() =>
      expect(container.querySelector(".iac-versions-table-body")).toBeVisible()
    );
    const versionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );
    // Virtualization renders only visible rows
    expect(versionRows.length).toBeGreaterThanOrEqual(1);

    // Check that at least the first visible row has the expected structure
    const firstRow = versionRows[0];
    const cells = firstRow.querySelectorAll("div[role='cell']");
    expect(cells.length).toBe(5);

    // Check that at least one of the mocked versions is visible
    const allVersionNames = Array.from(versionRows).map((row) => {
      const nameCell = row.querySelectorAll("div[role='cell']")[0];
      return nameCell.textContent;
    });

    // At least one version name should match
    const hasMatchingVersion = [0, 1, 2].some((i) =>
      allVersionNames.some((name) => name?.includes(MockedVersion(i).name))
    );
    expect(hasMatchingVersion).toBe(true);

    // Check that More button exists in action column
    const actionsCell = cells[4] as HTMLElement;
    const button = within(actionsCell as HTMLElement).getByText("More");
    expect(button).toBeTruthy();

    expect(mockGetVersions).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      top: 100,
      skip: undefined,
    });
  });

  it("should show changesets table with data", async () => {
    const { container } = renderComponent();

    await waitFor(() => screen.getByText(defaultStrings.changes));

    await screen.getByText(defaultStrings.changes).click();

    await waitFor(() =>
      expect(container.querySelector(".iac-changes-table-body")).toBeVisible()
    );

    const changesetRows = container.querySelectorAll(
      ".iac-changes-table-body [role='row']"
    );
    // Virtualization renders only visible rows
    expect(changesetRows.length).toBeGreaterThanOrEqual(1);

    changesetRows.forEach((row, index) => {
      const cells = row.querySelectorAll("div[role='cell']");
      expect(cells.length).toBe(6);
      expect(cells[0].textContent).toContain(
        MockedChangeset(index).index.toString()
      );
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
      within(cells[5] as HTMLElement).getByText(
        defaultStrings.createNamedVersion
      );
      within(cells[5] as HTMLElement).getByText("Information Panel");
    });
    expect(mockGetChangesets).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      top: 100,
      skip: 0,
      orderBy: "index+desc",
    });
  });

  it("should query data only once when switching tabs", async () => {
    renderComponent();

    await waitFor(() => screen.getByText(defaultStrings.changes));

    await screen.getByText(defaultStrings.changes).click();

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

    await waitFor(() => screen.getByText(defaultStrings.changes));

    await screen.getByText(defaultStrings.changes).click();

    await waitFor(() => screen.getAllByText(defaultStrings.createNamedVersion));
    const createVersionButtons = screen.getAllByText(
      defaultStrings.createNamedVersion
    );
    expect(createVersionButtons.length).toBeGreaterThanOrEqual(1);
    createVersionButtons[0].click();

    await waitForSelectorToExist(".iac-additional-info");
    const additionalInfos = document.querySelectorAll(".iac-additional-info");
    expect(additionalInfos.length).toBe(2);
    const latestVersionInfo = additionalInfos[1].querySelectorAll("span");
    expect(latestVersionInfo.length).toBe(2);
    expect(latestVersionInfo[0].textContent).toEqual(latestVersion.name);
    expect(latestVersionInfo[1].textContent).toEqual(
      localeDateWithTimeFormat(new Date(latestVersion.createdDateTime))
    );

    const nameInput = document.querySelector("input") as HTMLInputElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });

    await screen.getByText("Create").click();
    await waitFor(() => container.querySelector("iac-versions-table-body"));

    const versionCells = container.querySelectorAll(
      "div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockCreateVersion).toHaveBeenCalled();

    await screen.getByText(defaultStrings.changes).click();

    expect(mockGetChangesets).toHaveBeenCalledTimes(2);
  });
  it("should update version", async () => {
    mockGetVersions.mockResolvedValueOnce(MockedVersionList());
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(3, { name: "test name", description: "test description" }),
      ...MockedVersionList(2),
    ]);
    mockUpdateVersion.mockResolvedValue(MockedVersion());
    const { container } = renderComponent({ enableHideVersions: true });

    await waitFor(() => container.querySelector(".iac-versions-table-body"));
    const versionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );
    const firstRowCells = versionRows[0].querySelectorAll("div[role='cell']");
    expect(firstRowCells.length).toBe(6);
    const actionsCell = firstRowCells[firstRowCells.length - 1] as HTMLElement;
    const button = within(actionsCell as HTMLElement).getByText(
      "More"
    ).parentElement;
    expect(button).toBeTruthy();
    fireEvent.click(button as HTMLElement);
    const updateAction = screen.getByText(defaultStrings.updateNamedVersion);
    await updateAction.click();

    await waitForSelectorToExist('input[name="name"]');
    const nameInput = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    const descriptionInput = document.querySelector(
      "textarea[name='description']"
    ) as HTMLTextAreaElement;
    expect(nameInput).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "test name" } });
    fireEvent.change(descriptionInput, {
      target: { value: "test description" },
    });
    await screen.getByText("Update").click();

    await waitFor(() => container.querySelector("iac-versions-table-body"));

    expect(mockUpdateVersion).toHaveBeenCalledWith(
      MOCKED_IMODEL_ID,
      MockedVersion(2).id,
      {
        name: "test name",
        description: "test description",
      }
    );
    const versionCells = container.querySelectorAll(
      "div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(6);
    expect(versionCells[0].textContent).toEqual("");
    expect(versionCells[1].textContent).toEqual("test name");
    expect(versionCells[2].textContent).toEqual("test description");
    await waitFor(
      () =>
        expect(versionCells[3].textContent).toEqual(MockedVersion(0).createdBy),
      { timeout: 10000 }
    );
    expect(versionCells[4].textContent).toEqual(
      MockedVersion(0).createdDateTime
    );
    const actionButton = firstRowCells[firstRowCells.length - 1] as HTMLElement;
    const updateButton = within(actionButton as HTMLElement).getByText("More");
    expect(updateButton).toBeTruthy();
    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockUpdateVersion).toHaveBeenCalled();
  });
  it("should show hidden versions when toggle is enabled", async () => {
    mockGetVersions.mockResolvedValue([
      MockedVersion(4, { state: "hidden" }),
      MockedVersion(3, { state: "hidden" }),
      MockedVersion(2),
      MockedVersion(1),
    ]);

    const { container } = renderComponent({ enableHideVersions: true });

    await waitFor(() => container.querySelector(".iac-versions-table-body"));

    const initialVersionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );
    // Virtualization renders only visible rows
    expect(initialVersionRows.length).toBeGreaterThanOrEqual(1);

    expect(screen.queryByText(MockedVersion(4).name)).not.toBeInTheDocument();
    expect(screen.queryByText(MockedVersion(3).name)).not.toBeInTheDocument();

    await waitForSelectorToExist("input");
    const toggleSwitch = document.querySelector("input") as HTMLInputElement;
    expect(toggleSwitch).toBeInTheDocument();
    fireEvent.click(toggleSwitch);

    const allVersionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );
    // Virtualization renders only visible rows - with toggle more should be visible
    expect(allVersionRows.length).toBeGreaterThanOrEqual(2);

    const hiddenIcons = container.querySelectorAll(
      "svg[data-testid='hidden-version-icon']"
    );
    expect(hiddenIcons.length).toBe(2);
    expect(screen.getByText(MockedVersion(4).name)).toBeInTheDocument();
    expect(screen.getByText(MockedVersion(3).name)).toBeInTheDocument();
  });
  it("should hide version", async () => {
    mockGetVersions.mockResolvedValueOnce(MockedVersionList());
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(3, { state: "hidden" }),
      ...MockedVersionList(2),
    ]);
    mockUpdateVersion.mockResolvedValue(MockedVersion(2, { state: "hidden" }));
    const { container } = renderComponent({ enableHideVersions: true });

    // Wait for at least one row to render with virtualization
    await waitFor(() => {
      const rows = container.querySelectorAll(
        ".iac-versions-table-body [role='row']"
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });

    const initialVersionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );

    const firstRowCells =
      initialVersionRows[0].querySelectorAll("div[role='cell']");
    expect(firstRowCells.length).toBe(6);
    const actionsCell = firstRowCells[firstRowCells.length - 1] as HTMLElement;
    const button = within(actionsCell as HTMLElement).getByText(
      "More"
    ).parentElement;
    expect(button).toBeTruthy();
    fireEvent.click(button as HTMLElement);
    const hideAction = screen.getByText(defaultStrings.hide);
    await hideAction.click();
    expect(mockUpdateVersion).toHaveBeenCalledWith(
      MOCKED_IMODEL_ID,
      MockedVersion(2).id,
      { description: "nv_description2", name: "nv_name2", state: "hidden" }
    );
    await waitFor(() => container.querySelector("iac-versions-table-body"));

    const updatedVersionRows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
    );
    expect(updatedVersionRows.length).toBeGreaterThanOrEqual(2);
    const hiddenIcons = container.querySelectorAll(
      "svg[data-testid='hidden-version-icon']"
    );
    expect(hiddenIcons.length).toBe(0);

    const versionCells = container.querySelectorAll(
      "div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(6);
    expect(versionCells[0].textContent).toEqual("");
    expect(versionCells[1].textContent).toEqual(MockedVersion(1).name);
    expect(versionCells[2].textContent).toEqual(MockedVersion(1).description);
    expect(versionCells[3].textContent).toEqual(MockedVersion(1).createdBy);
    expect(versionCells[4].textContent).toEqual(
      MockedVersion(1).createdDateTime
    );
  });
});

it("should render with changesets tab opened", async () => {
  const { container } = renderComponent({
    currentTab: ManageVersionsTabs.Changes,
  });

  await waitFor(() => container.querySelector(".iac-changes-table-body"));
  const changesetRows = container.querySelectorAll(
    ".iac-changes-table-body [role='row']"
  );
  // Virtualization renders only visible rows
  expect(changesetRows.length).toBeGreaterThanOrEqual(1);

  changesetRows.forEach(async (row, index) => {
    const cells = row.querySelectorAll("div[role='cell']");
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toContain(
      MockedChangeset(index).index.toString()
    );
    await waitFor(() =>
      expect(cells[1].textContent).toContain(MockedChangeset(index).description)
    );
    await waitFor(() =>
      expect(cells[2].textContent).toContain(MockedChangeset(index).createdBy)
    );
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
  renderComponent({ onTabChange });

  await screen.getByText(defaultStrings.changes).click();
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Changes);

  screen.getByText(defaultStrings.namedVersions).click();
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Versions);
});
