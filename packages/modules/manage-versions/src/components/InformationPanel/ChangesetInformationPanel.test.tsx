/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render, screen } from "@testing-library/react";
import React from "react";

import { ConfigProvider } from "../../common/configContext";
import { MOCKED_CONFIG_PROPS, MockedChangeset } from "../../mocks";
import { localeDateWithTimeFormat } from "../../models/utils";
import { defaultStrings } from "../ManageVersions/ManageVersions";
import {
  ChangesetInfoPanelProps,
  ChangesetInformationPanel,
} from "./ChangesetInformationPanel";

const mockedCreatedDateTime = localeDateWithTimeFormat(
  new Date(MockedChangeset().pushDateTime)
);

const renderComponent = (initialProps?: Partial<ChangesetInfoPanelProps>) => {
  const props: ChangesetInfoPanelProps = {
    changeset: MockedChangeset(),
    onClose: jest.fn(),
    stringOverrides: defaultStrings.informationPanelStringOverrides,
    ...initialProps,
  };
  return render(
    <ConfigProvider {...MOCKED_CONFIG_PROPS}>
      <ChangesetInformationPanel {...props} />
    </ConfigProvider>
  );
};

describe("ChangesetInformationPanel test", () => {
  it("should show required details in information-panel", () => {
    const { container } = renderComponent();
    const expectedValues = [
      { property: "Created By: ", value: MockedChangeset().createdBy },
      { property: "Date Created: ", value: mockedCreatedDateTime },
      { property: "Application: ", value: MockedChangeset().application.name },
      {
        property: "Changed Files: ",
        value: MockedChangeset().synchronizationInfo.changedFiles.join(","),
      },
    ];

    const changeset_desc = container.querySelector(
      ".iac-info-panel-container"
    ) as Element;

    const info_panel_details = container.querySelectorAll(
      ".iac-info-panel-details"
    );
    expect(info_panel_details.length).toBe(4);
    info_panel_details.forEach((detailsElement, index) => {
      const info_panel_property = detailsElement.querySelector(
        ".iac-info-panel-property"
      ) as Element;
      const info_panel_property_value = detailsElement.querySelector(
        ".iac-info-panel-data-value"
      ) as Element;
      expect(info_panel_property.textContent).toBe(
        expectedValues[index].property
      );
      expect(info_panel_property_value.textContent).toBe(
        expectedValues[index].value
      );
    });

    expect(changeset_desc.textContent).toBe(MockedChangeset().description);
  });

  it("should have close icon in the panel header", () => {
    renderComponent();
    const closeButton = screen.getByLabelText("Close");
    expect(closeButton).toBeTruthy();
  });
});
