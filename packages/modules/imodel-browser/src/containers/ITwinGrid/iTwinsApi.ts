/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LoadedPage } from "../../hooks/infiniteQueryReducer";
import { AccessTokenProvider, ITwinDataQuery, ITwinFull } from "../../types";
import { _getAPIServer } from "../../utils/_apiOverrides";

export const ITWINS_PAGE_SIZE = 100;

/** Favorites and recents come whole and are filtered in the browser. */
export const isClientSideFiltered = (
  requestType: ITwinDataQuery["requestType"]
) => requestType === "favorites" || requestType === "recents";

/** Everything that identifies a request, so two equal values generate the same query. */
export interface ITwinQueryParams extends ITwinDataQuery {
  /** Undefined without a credential, the token itself for a string, "provider" for a function. */
  credentialKey: string | undefined;
  serverEnvironmentPrefix?: "" | "dev" | "qa";
  providedData?: ITwinFull[];
}

export const buildITwinsPageUrl = ({
  query,
  page,
}: {
  query: ITwinQueryParams;
  page: number;
}) => {
  const { requestType, filterText, iTwinSubClass, orderby } = query;
  const clientSideFiltered = isClientSideFiltered(requestType);
  const endpoint = clientSideFiltered ? requestType : "";
  const subClass = `?subClass=${iTwinSubClass === "All" ? "" : iTwinSubClass}`;
  const paging = `&$skip=${page * ITWINS_PAGE_SIZE}&$top=${ITWINS_PAGE_SIZE}`;
  // Hand-built rather than URLSearchParams, which would encode the $ and turn spaces into +.
  const search =
    clientSideFiltered || !filterText
      ? ""
      : `&$search=${encodeURIComponent(filterText.trim())}`;
  const ordering =
    clientSideFiltered || !orderby
      ? ""
      : `&$orderby=${encodeURIComponent(orderby.trim())}`;
  const server = _getAPIServer(query.serverEnvironmentPrefix);
  return `${server}/itwins/${endpoint}${subClass}${paging}${search}${ordering}`;
};

export interface FetchITwinsPageOptions {
  query: ITwinQueryParams;
  page: number;
  accessToken: AccessTokenProvider;
  bypassCache: boolean;
  signal: AbortSignal;
}

const platformHeaders = async ({
  accessToken,
  bypassCache,
}: {
  accessToken: AccessTokenProvider;
  bypassCache: boolean;
}): Promise<Record<string, string>> => ({
  Authorization:
    typeof accessToken === "function" ? await accessToken() : accessToken,
  Accept: "application/vnd.bentley.itwin-platform.v1+json",
  Prefer: "return=representation",
  "x-total-count": "true",
  ...(bypassCache ? { "Cache-Control": "no-cache" } : {}),
});

/** Rejects with the text a non-OK response carried, so callers see the API's own message. */
export const fetchITwinsPage = async ({
  query,
  page,
  accessToken,
  bypassCache,
  signal,
}: FetchITwinsPageOptions): Promise<LoadedPage<ITwinFull>> => {
  const response = await fetch(buildITwinsPageUrl({ query, page }), {
    signal,
    headers: await platformHeaders({ accessToken, bypassCache }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const { iTwins }: { iTwins: ITwinFull[] } = await response.json();
  const totalCountHeader = response.headers.get("x-total-count");
  return {
    items: iTwins,
    hasMore: iTwins.length === ITWINS_PAGE_SIZE,
    totalCount:
      totalCountHeader !== null ? Number(totalCountHeader) : undefined,
  };
};
