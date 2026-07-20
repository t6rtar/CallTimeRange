# CallTimeRange

A Vencord userplugin that shows the start and end time of completed Discord calls.

Instead of displaying only the call's starting timestamp, completed calls show a compact range:

```text
7:35 PM – 8:09 PM
```

## Installation

You need a [Vencord source installation](https://docs.vencord.dev/installing/) to use custom plugins.

From your Vencord folder, run:

```sh
cd src/userplugins
git clone https://github.com/t6rtar/CallTimeRange.git
cd ../..
pnpm build
```

Restart Discord or Vesktop, then enable **CallTimeRange** in Vencord's plugin settings.

If you have not installed your source build yet, follow Vencord's [custom build installation steps](https://docs.vencord.dev/installing/#installing-your-custom-build).

The plugin uses Discord's stored call start and end timestamps, so it does not need to track calls in the background.

## Settings

- **Hide calls under one minute:** Do not add a time range to calls shorter than 60 seconds.
