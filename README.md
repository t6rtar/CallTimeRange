# CallTimeRange

A Vencord userplugin that shows the start and end time of completed Discord calls.

Instead of displaying only the call's starting timestamp, completed calls show a compact range:

```text
7:35 PM – 8:09 PM
```

## Installation

1. Clone this repository into `src/userplugins/CallTimeRange` inside your Vencord checkout.
2. Build Vencord.
3. Enable **CallTimeRange** in Vencord's plugin settings.

The plugin uses Discord's stored call start and end timestamps, so it does not need to track calls in the background.
