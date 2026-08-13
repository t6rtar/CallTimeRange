# CallTimeRange

Show the start and end time on completed Discord call messages.

CallTimeRange extends Discord's call timestamp with the stored end time, turning a single start time into a compact range.

![A completed Discord call showing its start and end time](docs/assets/call-time-range.png)

## Features

- Shows the start and end time after a call ends.
- Updates the call message without a channel reload.
- Uses Discord's stored timestamps instead of tracking calls in the background.
- Hides ranges for calls shorter than one minute by default.
- Can show exact start and end seconds, including for short calls.
- Uses your Discord locale and time format.

CallTimeRange displays hours and minutes by default. Enable **Show exact seconds** to display second-level start and end times and include calls shorter than one minute.

## Install

You need a [Vencord source installation](https://docs.vencord.dev/installing/) before installing custom plugins.

From the root of your Vencord source folder:

```sh
git clone https://github.com/t6rtar/CallTimeRange.git src/userplugins/callTimeRange
pnpm build
```

Install or select the custom build for your Discord client. Quit the client from its tray or taskbar icon, reopen it, then enable **CallTimeRange** under **Settings > Vencord > Plugins**.

See [docs/installation.md](docs/installation.md) for update, removal, and troubleshooting steps.

## Setting

- **Show exact seconds:** Display seconds on both endpoints and include calls shorter than one minute. Disabled by default.

## Compatibility

Discord and Vencord updates can break the plugin. Use the current source when testing a problem.

## Development

The plugin uses [index.ts](index.ts) and [style.css](style.css). Test changes from a Vencord source checkout with:

```sh
pnpm testTsc
pnpm build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change.

## License

CallTimeRange is licensed under [GPL-3.0-or-later](LICENSE).
