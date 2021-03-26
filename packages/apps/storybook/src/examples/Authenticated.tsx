/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import React from "react";

export interface AuthenticatedProps {
  /**
   * Bearer token with "email" scope
   */
  accessToken: string | undefined;
  /** Unauthenticated messsage */
  unauthenticatedText: string | undefined;
}
export const Authentiated = (props: AuthenticatedProps) => {
  let text = props.unauthenticatedText ?? "Unauthenticated";
  const token = props.accessToken;
  if (token) {
    try {
      const email = JSON.parse(atob(token.split(" ")[1].split(".")[1])).email;
      text = `Authenticated with ${email}`;
    } catch {
      text = "Could not parse token to extract email";
    }
  }

  return (
    <div
      style={{
        whiteSpace: "pre-line",
        wordBreak: "break-all",
        width: "100%",
        color: "rgb(var(--buic-foreground-body-rgb))",
      }}
    >
      {text}
    </div>
  );
};
