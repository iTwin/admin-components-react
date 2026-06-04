import * as React from "react";
type Props = {
    menuItems: ((close: () => void) => React.JSX.Element[]) | React.JSX.Element[] | React.JSX.Element;
    prompt: React.ReactNode;
    "data-testid"?: string;
};
export default function MoreMenu({ menuItems, prompt, "data-testid": dataTestId, }: Props): React.JSX.Element | null;
export {};
