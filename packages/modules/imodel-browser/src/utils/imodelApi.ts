/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Utility functions for iModel related API operations.
 *--------------------------------------------------------------------------------------------*/
import { _getAPIServer } from "./_apiOverrides";

export type AccessTokenProvider = string | (() => Promise<string>) | undefined;

export async function addIModelToRecents(options: {
  iModelId: string;
  accessToken?: AccessTokenProvider;
  serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void> {
  const { iModelId, accessToken, serverEnvironmentPrefix } = options;
  try {
    if (!accessToken) {
      return;
    }

    const token =
      typeof accessToken === "function" ? await accessToken() : accessToken;

    const url = `${_getAPIServer(
      serverEnvironmentPrefix
    )}/imodels/recents/${encodeURIComponent(iModelId)}`;

    // fire-and-forget POST to record recents; swallow errors so UI isn't disrupted
    void fetch(url, {
      method: "POST",
      headers: {
        authorization: token as string,
        Accept: "application/vnd.bentley.itwin-platform.v2+json",
      },
    });
  } catch (e) {
    // keep parity with previous behavior where errors were swallowed
    // Log for diagnostics
    // eslint-disable-next-line no-console
    console.error("Failed to add iModel to recents", e);
  }
}

export async function removeIModelFromRecents(options: {
  iModelId: string;
  accessToken?: AccessTokenProvider;
  serverEnvironmentPrefix?: "dev" | "qa" | "";
}): Promise<void> {
  const { iModelId, accessToken, serverEnvironmentPrefix } = options;
  try {
    if (!accessToken) {
      return;
    }

    const token =
      typeof accessToken === "function" ? await accessToken() : accessToken;

    const url = `${_getAPIServer(
      serverEnvironmentPrefix
    )}/imodels/recents/${encodeURIComponent(iModelId)}`;

    void fetch(url, {
      method: "DELETE",
      headers: {
        authorization: token as string,
        Accept: "application/vnd.bentley.itwin-platform.v2+json",
      },
    });
  } catch (e) {
    // keep parity with previous behavior where errors were swallowed
    // Log for diagnostics
    // eslint-disable-next-line no-console
    console.error("Failed to remove iModel from recents", e);
  }
}
