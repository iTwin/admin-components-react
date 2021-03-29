/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import React from "react";

export interface ProjectAwareComponentProps {
  /** Project to know about */
  projectId: string | undefined;
}
export const ProjectAwareComponent = (props: ProjectAwareComponentProps) => {
  return (
    <div
      style={{
        whiteSpace: "pre-line",
        wordBreak: "break-all",
        width: "100%",
        color: "rgb(var(--buic-foreground-body-rgb))",
      }}
    >
      Selected Id: {props.projectId ?? "No project selected"}
    </div>
  );
};
