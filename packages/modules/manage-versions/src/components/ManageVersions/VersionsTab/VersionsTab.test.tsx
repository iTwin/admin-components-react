/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";

import { ChangesetClient } from "../../../clients/changesetClient";
import { ConfigProvider } from "../../../common/configContext";
import {
  MOCKED_CONFIG_PROPS,
  MockedChangeset,
  MockedVersion,
  MockedVersionTableData,
} from "../../../mocks";
import { defaultStrings } from "../ManageVersions";
import { RequestStatus } from "../types";
import VersionsTab, { VersionsTabProps } from "./VersionsTab";

const renderComponent = (initialProps?: Partial<VersionsTabProps>) => {
  const props: VersionsTabProps = {
    status: RequestStatus.Finished,
    onVersionUpdated: jest.fn(),
    loadMoreVersions: jest.fn(),
    onViewClick: jest.fn(),
    tableData: MockedVersionTableData(),
    changesetClient: new ChangesetClient("token"),
    setRelatedChangesets: jest.fn(),
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <VersionsTab {...props} />
    </ConfigProvider>
  );
};

describe("VersionsTab", () => {
  it("should show data in versions table", () => {
    const onViewClick = jest.fn();
    const { container } = renderComponent({ onViewClick });
    const rows = container.querySelectorAll(
      "div[role='rowgroup'] > div[role='row']"
    );
    expect(rows.length).toBe(1);

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("div[role='cell']");
      expect(cells.length).toBe(6);
      expect(cells[0].textContent).toContain(MockedVersion().name);
      expect(cells[1].textContent).toContain(MockedVersion().description);
      expect(cells[2].textContent).toContain(MockedVersion().createdBy);
      expect(cells[3].textContent).toContain(
        new Date(MockedVersion().createdDateTime).toLocaleString()
      );
      expect(cells[4].textContent).toContain(defaultStrings.view);
      const viewSpan = screen.getByText("View");
      fireEvent.click(viewSpan);

      within(cells[5] as HTMLElement).getByTitle(
        defaultStrings.updateNamedVersion
      );
    });
    expect(onViewClick).toHaveBeenCalledTimes(1);
  });

  it("should not show view column and name should not be clickable when onViewClick is not provided", () => {
    const { container } = renderComponent({ onViewClick: undefined });
    const rows = container.querySelectorAll(
      "[role='rowgroup'] > div[role='row']"
    );
    expect(rows.length).toBe(1);
    expect(screen.queryAllByText(defaultStrings.view).length).toBe(0);
  });

  it("should show empty data message", () => {
    renderComponent({ tableData: [] });
    screen.getByText(defaultStrings.messageNoNamedVersions);
  });

  it("should show error message that failed to fetch named versions", () => {
    renderComponent({ tableData: [], status: RequestStatus.Failed });
    screen.getByText(defaultStrings.messageFailedGetNamedVersions);
  });

  it("should show spinner when data is loading", () => {
    const { container } = renderComponent({
      tableData: [],
      status: RequestStatus.InProgress,
    });
    expect(
      container.querySelector(".iui-progress-indicator-radial")
    ).toBeTruthy();
  });

  it("should show included changesets on expand", () => {
    const { container } = renderComponent({
      tableData: [
        {
          version: MockedVersion(),
          subRows: [MockedChangeset(1)],
          subRowsLoaded: true,
        },
      ],
    });
    // check on expand changeset data must be there
    const rowgroup = container.querySelector('[role="rowgroup"]') as Element;
    const rowElements = rowgroup.querySelectorAll('[role="row"]');
    const cell = container.querySelector('[role="cell"]') as Element;
    expect(rowElements.length).toBe(1);
    fireEvent.click(
      cell.querySelector(
        "div[role='row'] > div[role='cell'] > button[type='button']:first-child"
      ) as HTMLElement
    );
    const rowsOnExpand = rowgroup.querySelectorAll('[role="row"]');
    expect(rowsOnExpand.length).toBe(2);

    rowsOnExpand.forEach((row, index) => {
      const cells = row.querySelectorAll('[role="cell"]');
      expect(cells.length).toBe(6);
      if (index === 0) {
        expect(cells[0].textContent).toContain(MockedVersion().name);
        expect(cells[1].textContent).toContain(MockedVersion().description);
        expect(cells[2].textContent).toContain(MockedVersion().createdBy);
        expect(cells[3].textContent).toContain(
          new Date(MockedVersion().createdDateTime).toLocaleString()
        );
        expect(cells[4].textContent).toContain(defaultStrings.view);
        const viewSpan = screen.getByText("View");
        fireEvent.click(viewSpan);
        const updateNamedVersionButton = within(
          cells[5] as HTMLElement
        ).queryByTitle(defaultStrings.updateNamedVersion);

        expect(updateNamedVersionButton).toBeTruthy();
      } else {
        expect(cells[0].textContent).toContain(
          MockedChangeset(index).displayName
        );
        expect(cells[1].textContent).toContain(
          MockedChangeset(index).description
        );
        expect(cells[2].textContent).toContain(
          MockedChangeset(index).createdBy
        );
        expect(cells[3].textContent).toContain(
          new Date(MockedChangeset(index).pushDateTime).toLocaleString()
        );
        expect(cells[4].textContent).not.toContain(defaultStrings.view);
        const updateNamedVersionButton = within(
          cells[5] as HTMLElement
        ).queryByTitle(defaultStrings.updateNamedVersion);

        expect(updateNamedVersionButton).toBeFalsy();
      }
    });
  });
});
