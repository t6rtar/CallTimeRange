import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(path.join(process.cwd(), "package.json"));
const ts = require("typescript");
const testDir = path.dirname(fileURLToPath(import.meta.url));
const helperPath = path.join(testDir, "..", "timeFormatting.ts");

function loadFormattingModule() {
    assert.ok(existsSync(helperPath), "timeFormatting.ts must provide the call time formatter");

    const source = readFileSync(helperPath, "utf8");
    const output = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022
        }
    }).outputText;
    const module = { exports: {} };

    Function("exports", "module", output)(module.exports, module);
    return module.exports;
}

function normalizeSpaces(value) {
    return value.replace(/\u202f/g, " ");
}

test("keeps minute-only call times when seconds are disabled", () => {
    const { formatCallTime } = loadFormattingModule();
    const date = new Date(2026, 7, 4, 21, 1, 14);

    assert.equal(normalizeSpaces(formatCallTime(date, false, "en-US")), "9:01 PM");
});

test("includes exact seconds when seconds are enabled", () => {
    const { formatCallTime } = loadFormattingModule();
    const date = new Date(2026, 7, 4, 21, 1, 14);

    assert.equal(normalizeSpaces(formatCallTime(date, true, "en-US")), "9:01:14 PM");
});

test("hides calls under one minute when seconds are disabled", () => {
    const { shouldShowCallRange } = loadFormattingModule();

    assert.equal(shouldShowCallRange(59_999, false), false);
});

test("shows calls under one minute when seconds are enabled", () => {
    const { shouldShowCallRange } = loadFormattingModule();

    assert.equal(shouldShowCallRange(59_999, true), true);
});

test("shows calls of at least one minute without seconds", () => {
    const { shouldShowCallRange } = loadFormattingModule();

    assert.equal(shouldShowCallRange(60_000, false), true);
});

test("uses Discord's start timestamp and adds a minute-only end time by default", () => {
    const { formatCallRange } = loadFormattingModule();
    const startedAt = new Date(2026, 7, 4, 21, 1, 14);
    const endedAt = new Date(2026, 7, 4, 22, 26, 37);

    assert.deepEqual(formatCallRange(startedAt, endedAt, false, "en-US"), {
        hidesNativeTimestamp: false,
        text: " – 10:26 PM"
    });
});

test("shows exact start and end seconds when seconds are enabled", () => {
    const { formatCallRange } = loadFormattingModule();
    const startedAt = new Date(2026, 7, 4, 21, 1, 14);
    const endedAt = new Date(2026, 7, 4, 22, 26, 37);

    assert.deepEqual(formatCallRange(startedAt, endedAt, true, "en-US"), {
        hidesNativeTimestamp: true,
        text: "9:01:14 PM – 10:26:37 PM"
    });
});
