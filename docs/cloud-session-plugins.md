# Using a Claude Code plugin from a cloud session

Status: read 2026-11-16 from the official page https://code.claude.com/docs/en/plugins/install. Not tested here.

- The page's Cloud session tab says a cloud session, including the browser at claude.ai/code, has no plugin browser and does not load plugins installed on your own machine or plugins turned on by a repository's `.claude/settings.json`.
- Installing a plugin adds its skills, agents, hooks and MCP servers to Claude Code on the machine where it is installed, so the `/plugin install` route described in a README applies to a local setup (terminal, desktop app or IDE).
- The page points to managed settings for plugins an organization distributes. A repository that wants to be used from a cloud session therefore needs its skill content usable from the repository itself; whether that works for a given plugin was not checked here.

Suggested README line: "Plugin install applies to a local Claude Code setup; cloud sessions do not load locally installed plugins, so check the official page for the current rules."
