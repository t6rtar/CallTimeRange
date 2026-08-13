# Release checklist

1. Update Vencord and install dependencies.
2. Run `pnpm testTsc` and `pnpm build` from the Vencord source folder.
3. Test a completed call with exact seconds off and on, including a call shorter than one minute.
4. Update `CHANGELOG.md` with the version and date.
5. Commit the release changes.
6. Create and push an annotated version tag.
7. Create a GitHub release from the tag.

## Release notes for 1.0.1

```md
## CallTimeRange 1.0.1

- Show start and end times on completed Discord call messages
- Update the range when a call ends while the channel remains open
- Leave calls under one minute unchanged by default
- Optionally show exact seconds and include short calls
- Use Discord's stored call timestamps and your local time format

See the README for installation and update instructions.
```
