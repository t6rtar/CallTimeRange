/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { MessageStore } from "@webpack/common";

import managedStyle from "./style.css?managed";

const MESSAGE_ID_RE = /^chat-messages-(\d+)-(\d+)$/;
const RANGE_CLASS = "vc-call-time-range";

let observer: MutationObserver | undefined;

const settings = definePluginSettings({
    hideShortCalls: {
        type: OptionType.BOOLEAN,
        description: "Hide the time range for calls shorter than one minute",
        default: false,
        onChange: refreshAllMessages
    }
});

function formatTime(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
    }).format(date);
}

function addTimeRange(element: HTMLElement) {
    const existingRange = element.querySelector(`.${RANGE_CLASS}`);

    const match = element.id.match(MESSAGE_ID_RE);
    if (!match) return;

    const [, channelId, messageId] = match;
    const message = MessageStore.getMessage(channelId, messageId);
    const endedAt = message?.call?.endedTimestamp;
    if (!endedAt) return;

    const startedAt = message.timestamp;
    const nativeTimestamp = element.querySelector("time");
    if (!startedAt || !nativeTimestamp?.parentElement) return;

    if (settings.store.hideShortCalls && Number(endedAt) - Number(startedAt) < 60_000) {
        existingRange?.remove();
        return;
    }

    if (existingRange) return;

    const range = document.createElement("span");
    range.className = RANGE_CLASS;
    range.textContent = ` – ${formatTime(endedAt)}`;
    range.title = `Call ended at ${formatTime(endedAt)}`;
    nativeTimestamp.insertAdjacentElement("afterend", range);
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
    authors: [{ name: "t6rtar", id: 0n }],
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
    }
});
