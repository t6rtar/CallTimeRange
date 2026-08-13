/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function formatCallTime(date: Date | number, showSeconds: boolean, locale?: string) {
    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit"
    };

    if (showSeconds) options.second = "2-digit";

    return new Intl.DateTimeFormat(locale, options).format(date);
}

export function shouldShowCallRange(durationMs: number, showSeconds: boolean) {
    return showSeconds || durationMs >= 60_000;
}

export function formatCallRange(startedAt: Date | number, endedAt: Date | number, showSeconds: boolean, locale?: string) {
    const endTime = formatCallTime(endedAt, showSeconds, locale);

    if (!showSeconds) {
        return {
            hidesNativeTimestamp: false,
            text: ` – ${endTime}`
        };
    }

    return {
        hidesNativeTimestamp: true,
        text: `${formatCallTime(startedAt, true, locale)} – ${endTime}`
    };
}
