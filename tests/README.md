# UI checks

These tests belong only to the GitHub checkout. Do not transfer this directory,
package.json or package-lock.json with UI changes to Sites or OneDrive.
They do not deploy or modify the live Site.

Use Node.js 22 or newer:

```sh
npm ci
npx playwright install chromium
npm test
```

For Linux CI runners, install browser system dependencies with
`npx playwright install --with-deps chromium`.

Run separately with `npm run test:source` and `npm run test:browser`.
The browser suite starts and stops its own HTTP server on port 8173;
that port must be free. Each test uses fresh browser storage. Failure traces
are saved under `tests/.results/`, which is ignored by Git.

| Case | Coverage |
| --- | --- |
| CI-01 | Syntax of runtime/tool JavaScript |
| CI-02 | Local HTML/CSS resource references and inline script syntax |
| CI-03 | All three embedded iframe documents match their HTML sources, ignoring CRLF/LF differences |
| CI-04 | Root opens Dashboard with content and navigation |
| CI-05 | Profile, Tasks, My Tickets, Approval, Access Configuration and Business Workflows render, including ticket iframe content |
| CI-06 | Contact edit iframe opens; cancel confirmation closes it and restores Profile interaction |
| CI-07 | Create Task cancel/stay preserves input; discard closes without changing persisted data |
| CI-08 | Approval opens the selected ticket ID in the drawer; Close restores the list |

Browser checks fail on application exceptions and failed internal requests.
External font/avatar failures are not gates. The static reference check covers
HTML src/href/poster and CSS url(), not arbitrary JavaScript-generated URLs.
The six-page browser smoke check covers representative runtime loading.

This suite covers Chromium desktop over HTTP. It does not validate file://,
visual appearance, every business rule, or the live deployment.
GitHub Actions configuration is a separate next step; these commands are ready
to use as its source-checks and browser-smoke jobs.
