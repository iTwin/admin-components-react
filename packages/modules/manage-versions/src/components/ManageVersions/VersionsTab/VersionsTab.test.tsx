/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

const mockToaster = {
  negative: jest.fn(),
  positive: jest.fn(),
  closeAll: jest.fn(),
};

jest.mock("@itwin/itwinui-react", () => ({
  ...jest.requireActual("@itwin/itwinui-react"),
  useToaster: () => mockToaster,
}));

const renderComponent = (initialProps?: Partial<VersionsTabProps>) => {
  const props: VersionsTabProps = {
    status: RequestStatus.Finished,
    onVersionUpdated: jest.fn(),
    loadMoreVersions: jest.fn(),
    onViewClick: jest.fn(),
    tableData: MockedVersionTableData(),
    changesetClient: new ChangesetClient("token"),
    setRelatedChangesets: jest.fn(),
    handleHideVersion: jest.fn(),
    showHiddenVersions: false,
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
      ".iac-versions-table-body [role='row']"
    );
    expect(rows.length).toBe(1);

    rows.forEach(async (row) => {
      const cells = row.querySelectorAll("div[role='cell']");
      expect(cells.length).toBe(7);
      expect(cells[0].textContent).toContain("");
      expect(cells[1].textContent).toContain(MockedVersion().name);
      expect(cells[2].textContent).toContain(MockedVersion().description);
      expect(cells[3].textContent).toContain(MockedVersion().createdBy);
      expect(cells[4].textContent).toContain(MockedVersion().createdDateTime);
      expect(cells[5].textContent).toContain(defaultStrings.view);
      const viewSpan = screen.getByText("View");
      await act(() => fireEvent.click(viewSpan));
      const actionsCell = cells[cells.length - 1];
      const actionButton = within(actionsCell as HTMLElement).getByRole(
        "button",
        {
          name: "More",
        }
      );
      expect(actionButton).toBeTruthy();
      await act(() => fireEvent.click(actionButton));
      const updateAction = await screen.findByText(
        defaultStrings.updateNamedVersion
      );
      if (defaultStrings.download) {
        const downloadAction = screen.getByText(defaultStrings.download);
        expect(downloadAction).toBeTruthy();
      }
      if (defaultStrings.hide) {
        const hideAction = screen.getByText(defaultStrings.hide);
        expect(hideAction).toBeTruthy();
      }
      expect(updateAction).toBeTruthy();
    });
    expect(onViewClick).toHaveBeenCalledTimes(1);
  });

  it("should not show view column and name should not be clickable when onViewClick is not provided", () => {
    const { container } = renderComponent({ onViewClick: undefined });
    const rows = container.querySelectorAll(
      ".iac-versions-table-body [role='row']"
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

  it("should show spinner when data is loading", async () => {
    const { container } = renderComponent({
      tableData: [],
      status: RequestStatus.InProgress,
    });
    await waitFor(() =>
      expect(
        container.querySelector("[class*='progress-indicator']")
      ).toBeTruthy()
    );
  });

  it("should show included changesets on expand", async () => {
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
    const rowgroup = container.querySelector(
      "*[class$='table-body']"
    ) as Element;
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

    rowsOnExpand.forEach(async (row, index) => {
      const cells = row.querySelectorAll('[role="cell"]');
      expect(cells.length).toBe(7);
      if (index === 0) {
        expect(cells[0].textContent).toContain("");
        expect(cells[1].textContent).toContain(MockedVersion().name);
        expect(cells[2].textContent).toContain(MockedVersion().description);
        expect(cells[3].textContent).toContain(MockedVersion().createdBy);
        expect(cells[4].textContent).toContain(MockedVersion().createdDateTime);
        expect(cells[5].textContent).toContain(defaultStrings.view);

        const viewSpan = screen.getByText("View");
        await act(() => fireEvent.click(viewSpan));
        const actionsCell = cells[cells.length - 1];
        const actionButton = within(actionsCell as HTMLElement).getByRole(
          "button",
          { name: "More" }
        );
        await act(() => fireEvent.click(actionButton));
        const updateAction = await screen.findByText(
          defaultStrings.updateNamedVersion
        );
        if (updateAction) {
          expect(updateAction).toBeTruthy();
        }
      } else {
        expect(cells[1].textContent).toContain(
          MockedChangeset(index).displayName
        );
        expect(cells[2].textContent).toContain(
          MockedChangeset(index).description
        );
        expect(cells[3].textContent).toContain(
          MockedChangeset(index).createdBy
        );
        expect(cells[4].textContent).toContain(
          MockedChangeset(index).pushDateTime
        );
        expect(cells[5].textContent).not.toContain(defaultStrings.view);
        const actionsCell = cells[cells.length - 1];
        expect(actionsCell.children.length).toBe(0);
      }
    });
  });
});
