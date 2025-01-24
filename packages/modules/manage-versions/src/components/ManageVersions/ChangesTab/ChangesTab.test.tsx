/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";
import "./ChangesTab.scss";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
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
      "div[role='rowgroup'] > div[role='row']"
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

  it("should show spinner when data is loading", () => {
    renderComponent({
      changesets: [],
      status: RequestStatus.InProgress,
    });
    expect(screen.findByTestId("progress-radial")).toBeTruthy();
  });

  it.skip("should not show create version icon when changeset already has a version", async () => {
    // TODO: This test is skipped because it asserts an implementation detail (class set from external lib), the visibility property check would be better suited for a real browser / e2e
    const { container } = renderComponent({
      changesets: [
        MockedChangeset(1, {
          _links: { namedVersion: { href: "https://test.url" } },
        }),
      ],
    });
    const rows = container.querySelectorAll(
      "div[role='rowgroup'] > div[role='row']"
    );
    expect(rows.length).toBe(1);

    const createVersionIcon = await screen.findByText(
      defaultStrings.createNamedVersion
    );
    const classAttribute = (createVersionIcon as HTMLElement).getAttribute(
      "class"
    );
    expect(classAttribute).toContain("iac-create-version-icon-hidden");
  });

  it("should show information panel icon for each changeset row", async () => {
    const { container } = renderComponent({
      changesets: MockedChangesetList(),
    });
    const rowgroup = screen.getAllByRole("rowgroup")[0];
    const infoIcons = within(rowgroup).queryAllByText("Information Panel");
    const rows = within(rowgroup).queryAllByRole("row");

    expect(infoIcons.length).toBe(rows.length);
    //should open information panel
    await act(() => fireEvent.click(infoIcons[0]));
    const panel = container.querySelector(".iac-info-panel");
    expect(panel).toBeTruthy();
  });
});
