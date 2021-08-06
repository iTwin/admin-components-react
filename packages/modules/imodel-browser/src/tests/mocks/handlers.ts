/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { rest } from "msw";

export const handlers = [
  rest.get("https://api.bentley.com/imodels/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        iModels:
          req.url.searchParams.get("$orderBy") === "name desc"
            ? [
                {
                  id: "fakeId",
                  displayName: "nameDescOrdered",
                },
              ]
            : [
                {
                  id: "fakeId",
                  displayName: "fakeName",
                },
              ],
      })
    );
  }),
  rest.get("https://api.bentley.com/projects/", (req, res, ctx) => {
    if (req.url.searchParams.get("$search") === "searched") {
    }
    return res(
      ctx.status(200),
      ctx.json({
        projects:
          req.url.searchParams.get("$search") === "searched"
            ? [
                {
                  id: "mySearched1",
                  displayName: "mySearchedName1",
                },
              ]
            : [
                {
                  id: "my1",
                  displayName: "myName1",
                },
              ],
      })
    );
  }),
  rest.get("https://api.bentley.com/projects/favorites", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        projects: [
          {
            id: "favorite1",
            displayName: "favoriteName1",
          },
        ],
      })
    );
  }),
  rest.get("https://api.bentley.com/projects/recents", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        projects: [
          {
            id: "recent1",
            displayName: "recentName1",
          },
        ],
      })
    );
  }),
];
