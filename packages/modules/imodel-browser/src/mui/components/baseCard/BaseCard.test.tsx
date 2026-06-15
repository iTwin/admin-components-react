/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "@testing-library/jest-dom";

import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import svgPin from "@stratakit/icons/pin.svg";
import svgSave from "@stratakit/icons/save.svg";
import svgStatusWarning from "@stratakit/icons/status-warning.svg";
import { Root } from "@stratakit/mui";
import { render } from "@testing-library/react";
import React from "react";

import { BaseCard, BaseCardProps } from "./BaseCard";
import { ThumbnailIconButton } from "./ThumbnailIconButton";

const renderBaseCard = (props: Partial<BaseCardProps> = {}) =>
  render(
    <Root colorScheme="light">
      <BaseCard title="Test Card" {...props} />
    </Root>
  );

describe("BaseCard", () => {
  it("renders with only a title", () => {
    const { container } = renderBaseCard();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with all the props", () => {
    const { container } = renderBaseCard({
      description:
        "When there is more than one `action` prop they will be rendered as buttons in the footer of the card and the whole card is not clickable.",
      subheader: "This is a subheader",
      onContextMenu: jest.fn(),
      actions: [
        { key: "open", label: "Open", onClick: jest.fn() },
        { key: "share", label: "Share", onClick: jest.fn() },
        {
          key: "disabled",
          label: "Disabled",
          onClick: jest.fn(),
          disabled: true,
        },
      ],
      moreActions: [
        {
          key: "open",
          label: "Open with",
          onClick: jest.fn(),
        },
        { key: "share", label: "Share", onClick: jest.fn() },
        { key: "delete", label: "Delete", onClick: jest.fn() },
        {
          key: "disabled",
          label: "Disabled option",
          onClick: jest.fn(),
          disabled: true,
        },
      ],

      statusIconHref: svgStatusWarning,
      thumbnailTopLeft: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip size="small" label="Top Left" />
          <AvatarGroup max={3}>
            <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
            <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=2" />
            <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=3" />
          </AvatarGroup>
        </Box>
      ),

      thumbnailTopRight: (
        <>
          <ThumbnailIconButton
            aria-label="Add to favorites"
            onClick={jest.fn()}
            icon={svgPin}
          />
          <ThumbnailIconButton
            aria-label="Muted icon button"
            onClick={jest.fn()}
            icon={svgSave}
            muted
          />
        </>
      ),
      thumbnailBottomLeft: <Chip size="small" label="Bottom left" />,
      thumbnailBottomRight: <Chip size="small" label="Bottom right" />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders in loading state", () => {
    const { container } = renderBaseCard({ loading: true });
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders in disabled state", () => {
    const { container } = renderBaseCard({ disabled: true });
    expect(container.firstChild).toMatchSnapshot();
  });
});
