/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";

import defaultIModelThumbnail from "../../images/default-thumbnail.png";
import { ApiOverrides } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

/** Convert buffer response to URL format: data:image/png;base64 */
function convertArrayBufferToUrlBase64PNG(buffer: ArrayBuffer) {
  const byteArray = new Uint8Array(buffer);
  if (!byteArray || byteArray.length === 0) {
    throw new Error("Expected an image to be returned from the query");
  }

  const base64Data = btoa(
    byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  );
  return `data:image/png;base64,${base64Data}`;
}

/** Use cached thumbnail or upload thumbnail from server */
export const useIModelThumbnail = (
  iModelId: string,
  accessToken?: string | (() => Promise<string>) | undefined,
  apiOverrides?: ApiOverrides<string>
) => {
  const [thumbnail, setThumbnail] = useState<string>();
  useEffect(() => {
    if (apiOverrides?.data) {
      setThumbnail(apiOverrides.data);
      return;
    }
    const abortController = new AbortController();
    if (!thumbnail && accessToken && iModelId) {
      const makeFetchRequest = async () => {
        const options: RequestInit = {
          signal: abortController.signal,
          headers: {
            Authorization:
              typeof accessToken === "function"
                ? await accessToken()
                : accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v2+json",
            Prefer: "return=representation",
          },
        };

        const response = await fetch(
          `${_getAPIServer(
            apiOverrides?.serverEnvironmentPrefix
          )}/imodels/${iModelId}/thumbnail`,
          options
        );
        const thumbnail: string = response.ok
          ? await response.arrayBuffer().then(convertArrayBufferToUrlBase64PNG)
          : response.status === 404
          ? defaultIModelThumbnail
          : await response.text().then((errorText) => {
              throw new Error(errorText);
            });
        setThumbnail(thumbnail);
      };

      makeFetchRequest().catch((e) => {
        if (e.name === "AbortError") {
          // Aborting because unmounting is not an error, swallow.
          return;
        }
        console.error("Thumbnail download error", "Thumbnail Fetch", {
          iModelId,
          e,
        });
      });
    }
    return () => {
      abortController.abort();
    };
  }, [
    accessToken,
    iModelId,
    thumbnail,
    apiOverrides?.data,
    apiOverrides?.serverEnvironmentPrefix,
  ]);
  return thumbnail;
};
