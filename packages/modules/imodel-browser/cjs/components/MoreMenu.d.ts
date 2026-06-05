import * as React from "react";
type Props = {
    menuItems: ((close: () => void) => React.JSX.Element[]) | React.JSX.Element[] | React.JSX.Element;
    prompt: React.ReactNode;
    "data-testid"?: string;
    label: string;
};
/**
 * More menu component for MUI
 *
 * @alpha
 */
export default function MoreMenu({ menuItems, prompt, label, "data-testid": dataTestId, }: Props): React.JSX.Element | null;
export {};
