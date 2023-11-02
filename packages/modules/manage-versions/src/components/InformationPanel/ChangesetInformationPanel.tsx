/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ChangesetInformationPanel.scss";

import {
  InformationPanel,
  InformationPanelBody,
  InformationPanelHeader,
  Text,
} from "@itwin/itwinui-react";
import React from "react";

import { Changeset } from "../../models/changeset";
import { dateTimeFormatOptions, getLocale } from "../../models/utils";
import { informationPanelStringOverrides } from "../ManageVersions/types";

export interface ChangesetInfoPanelProps {
  changeset: Changeset;
  onClose: (e: React.MouseEvent<Element, MouseEvent>) => void;
  stringOverrides: informationPanelStringOverrides;
}

export const ChangesetInformationPanel = (props: ChangesetInfoPanelProps) => {
  const { changeset, onClose, stringOverrides } = props;
  const files: string[] = changeset.synchronizationInfo?.changedFiles
    ? changeset.synchronizationInfo.changedFiles
    : [stringOverrides.noValue];

  const createdDateTime = new Date(changeset.pushDateTime);
  const formattedDate = createdDateTime.toLocaleDateString(
    getLocale(),
    dateTimeFormatOptions
  );

  const renderProperty = (property: string, value: string | undefined) => {
    return (
      <div className="iac-info-panel-details">
        <span className="iac-info-panel-property">{`${property}: `}</span>
        <span className="iac-info-panel-data-value">{value}</span>
      </div>
    );
  };

  return (
    <InformationPanel className={"iac-info-panel"} resizable={false} isOpen>
      <InformationPanelHeader onClose={onClose}>
        <Text variant="subheading">
          {stringOverrides.title + changeset.index}
        </Text>
      </InformationPanelHeader>
      <InformationPanelBody>
        <div className="iac-info-panel-body">
          <Text className="iac-info-panel-container">
            {changeset.description}
          </Text>
          <div className="iac-info-panel-container">
            {renderProperty(
              stringOverrides.createdBy,
              changeset.createdBy ?? ""
            )}
            {renderProperty(stringOverrides.createdDate, formattedDate ?? "")}
            {renderProperty(
              stringOverrides.application,
              changeset.application.name ?? stringOverrides.noValue
            )}
          </div>

          <div className="iac-info-panel-container">
            <Text variant="leading">
              {stringOverrides.connectionAttributes}
            </Text>
            {renderProperty(stringOverrides.changedFiles, files.join(","))}
          </div>
        </div>
      </InformationPanelBody>
    </InformationPanel>
  );
};
