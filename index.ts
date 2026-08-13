/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { MessageStore } from "@webpack/common";

import managedStyle from "./style.css?managed";
import { formatCallRange, shouldShowCallRange } from "./timeFormatting";

const MESSAGE_ID_RE = /^chat-messages-(\d+)-(\d+)$/;
const RANGE_CLASS = "vc-call-time-range";
const HIDDEN_NATIVE_TIMESTAMP_CLASS = "vc-call-time-range-native-hidden";

let observer: MutationObserver | undefined;

const settings = definePluginSettings({
    showSeconds: {
        type: OptionType.BOOLEAN,
        description: "Show exact seconds and include calls shorter than one minute",
        default: false,
        onChange: refreshAllMessages
    }
});

function addTimeRange(element: HTMLElement) {
    const existingRange = element.querySelector<HTMLElement>(`.${RANGE_CLASS}`);

    const match = element.id.match(MESSAGE_ID_RE);
    if (!match) return;

    const [, channelId, messageId] = match;
    const message = MessageStore.getMessage(channelId, messageId);
    const endedAt = message?.call?.endedTimestamp;
    if (!endedAt) return;

    const startedAt = message.timestamp;
    const nativeTimestamp = element.querySelector("time");
    if (!startedAt || !nativeTimestamp?.parentElement) return;

    if (!shouldShowCallRange(Number(endedAt) - Number(startedAt), settings.store.showSeconds)) {
        existingRange?.remove();
        nativeTimestamp.classList.remove(HIDDEN_NATIVE_TIMESTAMP_CLASS);
        return;
    }

    const formattedRange = formatCallRange(startedAt, endedAt, settings.store.showSeconds);
    nativeTimestamp.classList.toggle(HIDDEN_NATIVE_TIMESTAMP_CLASS, formattedRange.hidesNativeTimestamp);

    const range = existingRange ?? document.createElement("span");
    range.className = RANGE_CLASS;
    range.textContent = formattedRange.text;
    range.title = `Call ran from ${formatCallRange(startedAt, endedAt, true).text}`;

    if (!existingRange) nativeTimestamp.insertAdjacentElement("afterend", range);
}

function refreshAllMessages() {
    document.querySelectorAll<HTMLElement>('[id^="chat-messages-"]').forEach(addTimeRange);
}

function processNode(node: Node) {
    if (!(node instanceof HTMLElement)) return;

    const parentMessage = node.closest<HTMLElement>('[id^="chat-messages-"]');
    if (parentMessage) addTimeRange(parentMessage);
    if (node.id.startsWith("chat-messages-")) addTimeRange(node);
    node.querySelectorAll<HTMLElement>('[id^="chat-messages-"]').forEach(addTimeRange);
}

function refreshMessage(channelId: string, messageId: string) {
    requestAnimationFrame(() => {
        const element = document.getElementById(`chat-messages-${channelId}-${messageId}`);
        if (element) addTimeRange(element);
    });
}

export default definePlugin({
    name: "CallTimeRange",
    description: "Shows the start and end time on completed call messages",
    tags: ["Voice", "Utility"],
    authors: [{ name: "t6rtar", id: 738215409559404562n }],
    managedStyle,
    settings,

    flux: {
        MESSAGE_UPDATE({ message }: { message: { channel_id?: string; channelId?: string; id: string; }; }) {
            const channelId = message.channel_id ?? message.channelId;
            if (channelId && message.id) refreshMessage(channelId, message.id);
        }
    },

    start() {
        refreshAllMessages();

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(processNode);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    },

    stop() {
        observer?.disconnect();
        observer = undefined;
        document.querySelectorAll(`.${RANGE_CLASS}`).forEach(element => element.remove());
        document.querySelectorAll(`.${HIDDEN_NATIVE_TIMESTAMP_CLASS}`).forEach(element => {
            element.classList.remove(HIDDEN_NATIVE_TIMESTAMP_CLASS);
        });
    }
});
