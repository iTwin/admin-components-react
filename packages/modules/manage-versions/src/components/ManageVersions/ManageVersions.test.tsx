/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import {
  act,
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

jest.setTimeout(15000);

const renderComponent = (initialProps?: Partial<ManageVersionsProps>) => {
  const props: ManageVersionsProps = {
    accessToken: "test_token",
    imodelId: MOCKED_IMODEL_ID,
    ...initialProps,
  };
  return act(async () => render(<ManageVersions {...props} />));
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVersions.mockResolvedValue(MockedVersionList());
    mockGetChangesets.mockResolvedValue(MockedChangesetList());
    mockGetUsers.mockResolvedValue(MockedUsers());
  });

  it("should show versions table with data", async () => {
    await act(async () => renderComponent());

    const versionRowsWithHeader = screen.getAllByRole("row");
    const versionRows = versionRowsWithHeader.slice(1);
    expect(versionRows.length).toBe(3);
    versionRows.forEach(async (row, index) => {
      const cells = await within(row).findAllByRole("cell");
      expect(cells.length).toBe(5);
      const mockedVersion = MockedVersion(versionRows.length - 1 - index);

      await waitFor(
        () => {
          expect(cells[0].textContent).toContain(mockedVersion.name);
          expect(cells[1].textContent).toContain(mockedVersion.description);
          expect(cells[2].textContent).toContain(mockedVersion.createdBy);
          expect(cells[3].textContent).toContain(mockedVersion.createdDateTime);
        },
        { timeout: 20000 }
      );
    });
    expect(mockGetVersions).toHaveBeenCalledWith(MOCKED_IMODEL_ID, {
      top: 100,
      skip: undefined,
    });
  });

  it("should show changesets table with data", async () => {
    const { container } = await act(async () => renderComponent());

    const changesButton = await screen.findByRole("tab", {
      name: defaultStrings.changes,
    });
    await act(async () => changesButton.click());
    const changesetRows = container.querySelectorAll(
      ".iac-changes-table *[class$='table-body'] > div[role='row']"
    );
    expect(changesetRows.length).toBe(3);

    changesetRows.forEach(async (row, index) => {
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
      await within(cells[5] as HTMLElement).findByText(
        defaultStrings.createNamedVersion
      );
      await within(cells[5] as HTMLElement).findByText("Information Panel");
    });
  });

  it("should query data only once when switching tabs", async () => {
    await act(async () => renderComponent());

    const changesButton = await screen.findByRole("tab", {
      name: defaultStrings.changes,
    });
    await act(async () => changesButton.click());

    expect(mockGetVersions).toHaveBeenCalledTimes(1);
    expect(mockGetChangesets).toHaveBeenCalledTimes(1);
  });

  it("should show error message in versions table when failed to fetch versions", async () => {
    mockGetVersions.mockRejectedValue("error");
    await act(async () => renderComponent());

    await screen.findByText(defaultStrings.messageFailedGetNamedVersions);
  });

  it("should show error message in changes table when failed to fetch changesets", async () => {
    mockGetChangesets.mockRejectedValue("error");
    await act(async () => renderComponent());

    const changesButton = await screen.findByRole("tab", {
      name: defaultStrings.changes,
    });
    await act(async () => changesButton.click());
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
    const { container } = await act(async () => renderComponent());

    const changesButton = await screen.findByRole("tab", {
      name: defaultStrings.changes,
    });

    await act(async () => changesButton.click());

    const createVersionButtons = await screen.findAllByText(
      defaultStrings.createNamedVersion
    );
    expect(createVersionButtons.length).toBe(3);
    createVersionButtons[0].click();

    const additionalInfos = await screen.findAllByTestId("additional-info");
    expect(additionalInfos.length).toBe(2);
    const latestVersionInfo = additionalInfos[1].querySelectorAll("span");
    expect(latestVersionInfo.length).toBe(2);
    expect(latestVersionInfo[0].textContent).toEqual(latestVersion.name);
    expect(latestVersionInfo[1].textContent).toEqual(
      localeDateWithTimeFormat(new Date(latestVersion.createdDateTime))
    );

    const nameInput = await screen.findByLabelText("Name");
    expect(nameInput).toBeTruthy();
    await act(async () =>
      fireEvent.change(nameInput, { target: { value: "test name" } })
    );

    await act(async () => (await screen.findByText("Create")).click());

    const versionCells = container.querySelectorAll(
      "*[class$='table-body'] > div[role='row']:first-child div[role='cell']"
    );
    expect(versionCells.length).toBe(5);
    expect(versionCells[0].textContent).toEqual("test name");
    expect(versionCells[1].textContent).toEqual("test description");

    expect(mockGetVersions).toHaveBeenCalledTimes(2);
    expect(mockCreateVersion).toHaveBeenCalled();

    await act(async () => changesButton.click());

    expect(mockGetChangesets).toHaveBeenCalledTimes(2);
  });

  it("should update version", async () => {
    mockGetVersions.mockResolvedValueOnce(MockedVersionList());
    mockGetVersions.mockResolvedValueOnce([
      MockedVersion(3, { name: "test name", description: "test description" }),
      ...MockedVersionList(2),
    ]);
    mockUpdateVersion.mockResolvedValueOnce(MockedVersion());
    await act(async () => renderComponent());

    const versionRowsWithHeader = screen.getAllByRole("row");
    const versionRows = versionRowsWithHeader.slice(1);
    expect(versionRows.length).toBe(3);

    // edit the first rows info
    const firstRowCells = await within(versionRows[0]).findAllByRole("cell");
    expect(firstRowCells.length).toBe(5);
    const actionsCell = firstRowCells[4] as HTMLElement;

    expect(
      screen.queryByRole("button", { name: "Update" })
    ).not.toBeInTheDocument();

    const moreButton = await within(actionsCell as HTMLElement).findByRole(
      "button",
      { name: "More" }
    );

    await act(async () => moreButton.click());
    const updateAction = await screen.findByRole("menuitem", {
      name: defaultStrings.updateNamedVersion,
    });
    expect(updateAction).toBeInTheDocument();
    await act(async () => updateAction.click());

    const nameInput = await screen.findByLabelText("Name");
    const descriptionInput = await screen.findByRole("textbox", {
      name: "Description",
    });
    await act(async () =>
      fireEvent.change(nameInput, { target: { value: "test name new" } })
    );
    await act(async () =>
      fireEvent.change(descriptionInput, {
        target: { value: "test description new" },
      })
    );

    const updateButton = await screen.findByRole("button", { name: "Update" });
    expect(updateButton).not.toHaveAttribute("aria-disabled", "true");
    await act(async () => updateButton.click());
    expect(updateButton).not.toBeInTheDocument();

    const versionCells = within(screen.getAllByRole("row")[1]).getAllByRole(
      "cell"
    );
    await waitFor(() => {
      expect(versionCells.length).toBe(5);
      expect(moreButton).toBeInTheDocument();
      expect(mockGetVersions).toHaveBeenCalledTimes(2);
      expect(mockUpdateVersion).toHaveBeenCalledWith(
        MOCKED_IMODEL_ID,
        MockedVersion(2).id,
        {
          name: "test name new",
          description: "test description new",
        }
      );
    });
  });
});

it("should render with changesets tab opened", async () => {
  const { container } = await act(async () =>
    renderComponent({ currentTab: ManageVersionsTabs.Changes })
  );
  const changesetRows = container.querySelectorAll(
    ".iac-changes-table *[class$='table-body'] > div[role='row']"
  );
  expect(changesetRows.length).toBe(3);

  changesetRows.forEach(async (row, index) => {
    await waitFor(
      async () => await screen.findByText(MockedChangeset(index).createdBy),
      { timeout: 5000 }
    );
    const cells = within(row as HTMLElement).getAllByRole("cell");
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toContain(ManageVersionsTabs.Changes);
    expect(cells[1].textContent).toContain(MockedChangeset(index).description);
    expect(cells[2].textContent).toContain(MockedChangeset(index).createdBy);
    expect(cells[3].textContent).toContain(
      MockedChangeset(index).synchronizationInfo.changedFiles.join(", ")
    );
    expect(cells[4].textContent).toContain(MockedChangeset(index).pushDateTime);
    const actionButtons = within(cells[5] as HTMLElement).getAllByRole(
      "button"
    );
    expect(actionButtons.length).toBe(2);
    within(cells[5] as HTMLElement).getByTitle(
      defaultStrings.createNamedVersion
    );
    within(cells[5] as HTMLElement).getByText("Information Panel");
  });
});

it("should trigger onTabChange", async () => {
  const onTabChange = jest.fn();
  await act(async () => renderComponent({ onTabChange }));
  const changesButton = await screen.findByRole("tab", {
    name: defaultStrings.changes,
  });
  await act(async () => changesButton.click());
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Changes);

  screen.getByText(defaultStrings.namedVersions).click();
  expect(onTabChange).toHaveBeenCalledWith(ManageVersionsTabs.Versions);
});
