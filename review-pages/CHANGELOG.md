# Review pages pattern: changelog

Newest first. Minor versions are optional to adopt. Major versions require migration.

## 1.3 · 2026-10-24 (Trove: three platforms)
- Platforms are a list: each project declares its platforms (id, title, size) and each flow names the ones it runs on. Cards, wells, the platform switch, tallies and "Recorded in" follow the list, with short names and "All" for every platform.
- Paths may carry `platforms` and use any declared id or `all`; `both` still means iOS and Android, so 1.2 paths stay valid.
- `example.html` reads its platforms from its cards instead of a fixed pair, and its step lookups take `all`.
- Adopted by: Trove (iOS, Android, and the web at phone and desktop widths).

## 1.2 · 2026-10-24 (review comments, device-test needs)
- The sidebar is a fixed-height column that scrolls on its own, with the "Flows · All" row fixed.
- Breadcrumb links are `--fg-muted` and underlined, not accent blue.
- The speed segment sits beside the transport buttons, and the status line always has its own row under them.
- Optional path fields: `board`, `scenario`, `cases`, a per-step `screen`. Caps: 200 steps, 160-character `expect`.
- Deep links to any step with a `data-ready` signal, plus `&shot=1` for phone-only screenshots.

## 1.1 · 2026-10-24 (review)
- The controls move into a player bar attached under the phone wells, with step dots. The platform switch moves to the title row.
- Parents open a list page of their children, like the board. Edge cases are sidebar children of their flow, not checkboxes.
- Child rows align with their parent's text (no extra inset).
- The current step and selected rows use neutral `--selected` with a blue number, not yellow.
- Label pills are for status only. Device sizes become muted text in the card header.
- Both wells have the same height.
- "Works when" becomes **Goal**, and the header meta says only "Last updated …".

## 1.0 · 2026-10-24
- First version: flow sidebar, phones side by side at logical sizes, step rail with test-assertion "expect" lines, autoplay with a touch indicator that holds about 1 s, the `paths/<flow>.json` expected-path format, stable URLs, and source in the app repo.
- Worked example: `example.html` (the flow board's Primer chrome, nested sidebar) with `paths/sign-in.json`, `paths/add-task.json` and `paths/complete-task.json`.
- Visual system: the chrome is the flow board's Primer tokens and components, copied as-is.
