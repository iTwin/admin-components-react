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
        iModels: [
          {
            id: "fakeId",
            displayName: "fakeName",
          },
        ],
      })
    );
  }),
  rest.get("https://api.bentley.com/projects/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        projects: [
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
