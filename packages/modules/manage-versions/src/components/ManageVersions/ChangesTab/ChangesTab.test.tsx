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

import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MockedChangeset,
  MockedChangesetList,
} from "../../../mocks";
import { defaultStrings } from "../ManageVersions";
import { RequestStatus } from "../types";
import ChangesTab, { ChangesTabProps } from "./ChangesTab";

const renderComponent = (initialProps?: Partial<ChangesTabProps>) => {
  const props: ChangesTabProps = {
    changesets: MockedChangesetList(),
    status: RequestStatus.Finished,
    loadMoreChanges: jest.fn(),
    latestVersion: undefined,
    onVersionCreated: jest.fn(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <ChangesTab {...props} />
    </ConfigProvider>
  );
};

describe("ChangesTab", () => {
  it("should show data in versions table", () => {
    const { container } = renderComponent();
    const rows = container.querySelectorAll(
      "*[class$='table-body'] div[role='row']"
    );
    expect(rows.length).toBe(3);

    rows.forEach((row, index) => {
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
      within(cells[5] as HTMLElement).getByText(
        defaultStrings.createNamedVersion
      );
      within(cells[5] as HTMLElement).getByText("Information Panel");
    });
  });

  it("should show empty data message", () => {
    renderComponent({ changesets: [] });
    screen.getByText(defaultStrings.messageNoChanges);
  });

  it("should show error message that failed to fetch changesets", () => {
    renderComponent({ changesets: [], status: RequestStatus.Failed });
    screen.getByText(defaultStrings.messageFailedGetChanges);
  });

  it("should show spinner when data is loading", async () => {
    const { container } = renderComponent({
      changesets: [],
      status: RequestStatus.InProgress,
    });
    await waitFor(() =>
      expect(
        container.querySelector("[class*='progress-indicator']")
      ).toBeTruthy()
    );
  });

  it("should not show create version icon when changeset already has a version", async () => {
    const { container } = renderComponent({
      changesets: [
        MockedChangeset(1, {
          _links: { namedVersion: { href: "https://test.url" } },
        }),
      ],
    });
    const rows = container.querySelectorAll(
      "*[class$='table-body'] div[role='row']"
    );
    expect(rows.length).toBe(1);

    const createVersionIcon = container.querySelector(
      ".iac-create-version-icon-hidden"
    );
    expect(createVersionIcon).not.toBeNull();
  });

  it("should show information panel icon for each changeset row", async () => {
    const { container } = renderComponent({
      changesets: MockedChangesetList(),
    });
    const rows = screen.getAllByRole("row").slice(1); //remove header row
    const infoIcons = screen.queryAllByText("Information Panel");
    //should open information panel
    expect(infoIcons.length).toBe(rows.length);
    await act(() => fireEvent.click(infoIcons[0]));
    const panel = container.querySelector(".iac-info-panel");
    expect(panel).toBeTruthy();
  });
});
