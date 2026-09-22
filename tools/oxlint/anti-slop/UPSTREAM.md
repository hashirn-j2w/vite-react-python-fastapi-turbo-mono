# anti-slop provenance

Vendored Oxlint plugin. This repository owns these rules; review upstream changes with
the `install-anti-slop` skill's update procedure instead of replacing the directory.

## Source

| Field              | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| Repository         | https://github.com/dmmulroy/anti-slop                                              |
| Skill              | `skills/install-anti-slop` (installed via `skills-lock.json`)                      |
| Skill content hash | `d92d8dbdf1bd96e11ee33945dca76306179a7c415e7339769084b2c211c6897c` (`computedHash`) |
| Upstream commit    | **Unknown**: `skills-lock.json` records a content hash, not a commit               |
| Installed          | 2026-09-22 with `node .agents/skills/install-anti-slop/scripts/install.mjs`        |
| Pristine snapshot  | `.agents/skills/install-anti-slop/assets/anti-slop` (while that skill version is installed) |

At install time this directory was byte-identical to the skill's bundled
`assets/anti-slop` (verified with `diff -r`). Nested provenance for the vendored
ESLint Stylistic code is in `vendor/eslint-stylistic/UPSTREAM.md` and `LICENSE`.

## Installed plugins

- `index.ts`: generic `anti-slop` plugin, registered in `.oxlintrc.json` `jsPlugins`
  with every rule at `error`, plus the native companion `oxc/no-accumulating-spread`.
- `effect/index.ts`: copied but **not registered**; the repo has no direct `effect`
  dependency.

## Local deviations

None in the plugin source.

Repository configuration added with it:

- `@oxlint/plugins` pinned to `1.85.0`, matching the installed `oxlint`.
- Agent tooling directories and `tools/oxlint/anti-slop/**` ignored by both oxlint
  (`.oxlintrc.json`) and oxfmt (`.oxfmtrc.json`).
- Root `package.json` set to `"type": "module"` so Node loads the `.ts` plugin as ESM
  without the `MODULE_TYPELESS_PACKAGE_JSON` warning.
