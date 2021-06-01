/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./VersionModal.scss";

import {
  Button,
  LabeledInput,
  LabeledTextarea,
  Modal,
  ModalButtonBar,
  ProgressRadial,
} from "@itwin/itwinui-react";
import React from "react";

import { useConfig } from "../../common/configContext";
import { NamedVersion } from "../../models";

export type VersionModalProps = {
  initialVersion?: NamedVersion;
  isLoading: boolean;
  title: string;
  actionName: string;
  onClose: () => void;
  onActionClick: (name: string, description: string) => void;
  children?: React.ReactNode;
};

const MAX_LENGTH = 255;

export const VersionModal = (props: VersionModalProps) => {
  const {
    initialVersion,
    isLoading,
    title,
    actionName,
    onClose,
    onActionClick,
    children,
  } = props;

  const { stringsOverrides } = useConfig();

  const [version, setVersion] = React.useState({
    name: initialVersion?.name ?? "",
    description: initialVersion?.description ?? "",
  });

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = event.target.name;
    const value = event.target.value;
    setVersion((prevState) => ({
      ...prevState,
      [key]: value ?? "",
    }));
  };

  const hasChanges = () => {
    return (
      version.name !== initialVersion?.name ||
      version.description !== initialVersion?.description
    );
  };

  const isLengthValid = (value: string) => {
    return value.length <= MAX_LENGTH;
  };

  return (
    <>
      <Modal
        title={title}
        isOpen
        onClose={onClose}
        className=".iac-version-modal"
      >
        <LabeledInput
          name="name"
          label={stringsOverrides.name}
          onChange={onChange}
          value={version.name}
          status={isLengthValid(version.name) ? undefined : "negative"}
          message={
            isLengthValid(version.name)
              ? undefined
              : `The value exceeds allowed ${MAX_LENGTH} characters.`
          }
          required
          setFocus
        />
        <LabeledTextarea
          name="description"
          label={stringsOverrides.description}
          onChange={onChange}
          value={version.description}
          status={isLengthValid(version.description) ? undefined : "negative"}
          message={
            isLengthValid(version.description)
              ? undefined
              : `The value exceeds allowed ${MAX_LENGTH} characters.`
          }
          rows={3}
        />
        {children}
        <ModalButtonBar>
          <Button
            styleType="high-visibility"
            onClick={() => onActionClick(version.name, version.description)}
            disabled={
              !version.name ||
              !hasChanges() ||
              !isLengthValid(version.name) ||
              !isLengthValid(version.description)
            }
          >
            {actionName}
          </Button>
          <Button onClick={onClose}>{stringsOverrides.cancel}</Button>
        </ModalButtonBar>
        {isLoading && (
          <div className="iui-progress-indicator-overlay">
            <ProgressRadial indeterminate />
          </div>
        )}
      </Modal>
      {/* Prevents modal from being closed when clicked outside. */}
      {isLoading && <div className="iac-version-modal-overlay"></div>}
    </>
  );
};
