/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

/**
 * browser locale
 */
export function getLocale(): string[] {
  return [...navigator.languages];
}

export const localeDateWithTimeFormat = (date: Date) => {
  return date.toLocaleDateString(getLocale(), dateTimeFormatOptions);
};
