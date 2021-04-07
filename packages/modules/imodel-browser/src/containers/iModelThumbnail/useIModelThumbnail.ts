/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";

import { ApiOverrides } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

const cache: {
  [iModelId: string]: string;
} = {};

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
  accessToken?: string,
  apiOverrides?: ApiOverrides<string>
) => {
  const [thumbnail, setThumbnail] = useState(cache[iModelId]);
  useEffect(() => {
    if (apiOverrides?.data) {
      setThumbnail(apiOverrides.data);
      return;
    }
    if (!thumbnail && accessToken && iModelId) {
      const options = {
        headers: {
          Authorization: accessToken,
          Prefer: "return=representation",
        },
      };
      fetch(
        `${_getAPIServer(apiOverrides)}/imodels/${iModelId}/thumbnail`,
        options
      )
        .then((response) => {
          if (response.ok) {
            return response
              .arrayBuffer()
              .then(convertArrayBufferToUrlBase64PNG);
          } else {
            return response.text().then((errorText) => {
              throw new Error(errorText);
            });
          }
        })
        .then((thumbnail: string) => {
          setThumbnail(thumbnail);
          cache[iModelId] = thumbnail;
        })
        .catch((e) =>
          console.error("Thumbnail download error", "Thumbnail Fetch", {
            iModelId,
            e,
          })
        );
    }
    return () => {
      // possibility: put a x minutes expiration on previous download when we dismount?
    };
  }, [accessToken, iModelId, thumbnail, apiOverrides?.data, apiOverrides]);
  return thumbnail;
};
