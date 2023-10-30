/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./ChangesetInformationPanel.scss";

import { SvgClose } from "@itwin/itwinui-icons-react";
import {
  IconButton,
  InformationPanel,
  InformationPanelBody,
  InformationPanelHeader,
  Text,
} from "@itwin/itwinui-react";
import React, { FC } from "react";

import { Changeset } from "../../models/changeset";
import { dateTimeFormatOptions, getLocale } from "../../models/utils";

export interface ChangesetInfoPanelProps {
  changeset: Changeset;
  isOpen: boolean;
  onClose: () => void;
}

export const ChangesetInformationPanel: FC<ChangesetInfoPanelProps> = ({
  isOpen,
  changeset,
  onClose,
}) => {
  const files: string[] = changeset.synchronizationInfo?.changedFiles
    ? changeset.synchronizationInfo.changedFiles
    : ["N/A"];

  const createdDateTime = new Intl.DateTimeFormat(
    getLocale(),
    dateTimeFormatOptions
  ).format(new Date(changeset.pushDateTime));

  const renderProperty = (property: string, value: string | undefined) => {
    return (
      <div className="iac-info-panel-details">
        <span className="iac-info-panel-property">{property}</span>
        <span className="iac-info-panel-data-value">{value}</span>
      </div>
    );
  };

  const headerActions = () => {
    return (
      <IconButton
        title={"Close"}
        onClick={() => {
          onClose();
        }}
        styleType="borderless"
      >
        <SvgClose />
      </IconButton>
    );
  };

  return isOpen ? (
    <InformationPanel
      isOpen={isOpen}
      className={"iac-info-panel"}
      resizable={false}
    >
      <InformationPanelHeader
        onClose={undefined}
        actions={headerActions()}
        className={"iac-info-panel-header"}
      >
        <Text variant="subheading">{"Change  # " + changeset.index}</Text>
      </InformationPanelHeader>
      <InformationPanelBody>
        <div className="iac-info-panel-body">
          <Text className="iac-info-panel-description">
            {changeset.description}
          </Text>
          <div className="iac-info-panel-container">
            {renderProperty("Created By: ", changeset.createdBy ?? "")}
            {renderProperty("Date Created: ", createdDateTime ?? "")}
            {renderProperty(
              "Application: ",
              changeset.application.name ?? "N/A"
            )}
          </div>

          <div className="iac-info-panel-container">
            <Text className="iac-info-panel-connection">
              Connection Attributes
            </Text>
            {renderProperty("Changed Files: ", files.join(","))}
          </div>
        </div>
      </InformationPanelBody>
    </InformationPanel>
  ) : (
    <></>
  );
};
