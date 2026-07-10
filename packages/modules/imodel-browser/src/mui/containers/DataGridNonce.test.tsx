/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { IModelTableMUI } from "./iModelGrid/IModelTableMUI";
import { ITwinTableMUI } from "./ITwinGrid/ITwinTableMUI";

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ nonce }: { nonce?: string }) => (
    <div data-testid="data-grid" nonce={nonce} />
  ),
}));

const nonce = "test-csp-nonce";

describe("MUI table CSP nonce", () => {
  it("forwards the nonce to the iTwin DataGrid", () => {
    render(
      <ITwinTableMUI
        iTwins={[]}
        strings={{} as any}
        iTwinFavorites={new Set()}
        addITwinToFavorites={jest.fn()}
        removeITwinFromFavorites={jest.fn()}
        refetchITwins={jest.fn()}
        nonce={nonce}
      />
    );

    expect(screen.getByTestId("data-grid")).toHaveAttribute("nonce", nonce);
  });

  it("forwards the nonce to the iModel DataGrid", () => {
    render(
      <IModelTableMUI
        iModels={[]}
        strings={{} as any}
        refetchIModels={jest.fn()}
        nonce={nonce}
      />
    );

    expect(screen.getByTestId("data-grid")).toHaveAttribute("nonce", nonce);
  });
});
