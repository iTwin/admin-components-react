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
];
