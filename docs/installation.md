# Installation and updates

CallTimeRange runs as a Vencord userplugin and requires a Vencord source build.

## Install

Follow Vencord's [source installation guide](https://docs.vencord.dev/installing/). Open a terminal in the Vencord source folder and run:

```sh
git clone https://github.com/t6rtar/CallTimeRange.git src/userplugins/callTimeRange
pnpm build
```

Apply the build to your client, quit the client from its tray or taskbar icon, and reopen it. Enable **CallTimeRange** under **Settings > Vencord > Plugins**.

## Update

From the Vencord source folder:

```sh
git -C src/userplugins/callTimeRange pull --ff-only
pnpm install --frozen-lockfile
pnpm build
```

Quit and reopen the client after the build finishes.

## Remove

Disable **CallTimeRange**, delete `src/userplugins/callTimeRange`, rebuild Vencord, then quit and reopen the client.

## Troubleshooting

### The plugin does not appear

- Confirm `src/userplugins/callTimeRange/index.ts` exists.
- Rebuild the Vencord checkout loaded by your client.
- Quit the client from its tray or taskbar icon before reopening it.
- Check the build output for an error.

### A completed call shows no end time

Confirm Discord marks the call as ended. If the call ended while the channel was open, wait for the call message to update. Include your client version and Vencord commit in a bug report.

### The range looks short or long

The default range shows hour and minute values, so its endpoints can look rounded. Enable **Show exact seconds** in the plugin settings to display second-level start and end times.

### Short calls show no range

This is the default behavior. Enable **Show exact seconds** in the plugin settings to display second-level ranges for calls shorter than one minute.
