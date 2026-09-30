## Development

This project is a static Astro site: **Astro 7 + React 19 islands + Tailwind v4 + TypeScript 6**, run with **Bun**.

### Always serve through portless

Do not hand out a raw `http://localhost:<port>` URL. Start the dev server through
[portless](https://github.com/vercel-labs/portless) so it gets a stable HTTPS name:

```sh
bun run serve          # -> https://fframes-zh.localhost
```

`portless` injects `--port` and `--host 127.0.0.1` into the `dev` script, so never
hardcode a port in `astro.config.mjs`; a port that differs from the assigned one
returns 502 through the proxy.

After launching, read the real URL from `portless list` rather than assuming it, then
verify **interaction, not just HTTP 200**: a page can render 200 while its React
islands never hydrate. Click the theme toggle, a platform tab, and an example filter
to confirm. See "Known failure mode" below.

Useful commands:

| command | purpose |
| --- | --- |
| `bun run serve` | dev server at `https://fframes-zh.localhost` |
| `bun run serve:preview` | built output at the same URL |
| `portless list` | active routes and their real URLs |
| `portless doctor` | read-only proxy / DNS / CA health check |
| `portless hosts sync` | fix hostname resolution (needs Administrator) |
| `portless trust` | re-trust the local CA if the browser warns |
| `PORTLESS=0 bun run dev` | bypass portless and use Astro's own port |

On Windows, `curl https://<name>.localhost` can hang: the system resolver may map
`.localhost` to a hijacked address, while Chrome, Firefox, and Edge resolve it
natively. Verify in a browser rather than with curl.

### Known failure mode: zombie dev server

Long-lived portless wrappers on Windows can degrade after long uptime or a
sleep/resume cycle. The process stays alive and still serves the HTML shell (200),
but Astro's on-demand module transform hangs, so the proxy returns **504** for JS
modules. Symptom: the page looks complete but every button is dead.

`portless prune` will not catch it, because it only removes routes whose owner PID is
dead. Kill the whole tree instead: `Stop-Process` on the wrapper PID from
`portless list`, then find and kill the surviving `astro dev` child
(`Get-NetTCPConnection -LocalPort <port>`), then `bun run serve` again. Astro also
leaves a dev-server lockfile, so a restart with a live child fails with
"Another astro dev server is already running".

### Astro background mode

When running Astro directly instead of through portless, use background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`. Note that
`--background` detaches the child, so it must **not** be wrapped by portless; the
wrapper would lose track of the process and the route would die. That is why
`bun run serve` runs the plain `dev` script.

## Checks

```sh
bun run check   # astro check, TypeScript strictest
bun run build   # static output to dist/
```

## Deployment

Pushed to `github.com/bbylw/fframes-cn`, published by GitHub Pages at the custom
domain **`https://fframes.ndjp.net`**.

`.github/workflows/deploy.yml` builds with Bun on every push to `main`, runs
`bun run check` before `bun run build`, then uploads `dist/` through
`actions/deploy-pages`. Concurrency is `cancel-in-progress: false`, so a push is
queued rather than left half published.

Because the site sits on a custom domain it is served from the root, so `site` in
`astro.config.mjs` has no `base`. `public/CNAME` carries the domain into the build
output; changing the domain means editing that file, `astro.config.mjs`, and the
Pages settings together, or the canonical and og:image URLs will disagree.

Pages config is also part of the repo settings, not the code. To recreate it:

```sh
gh api --method POST repos/bbylw/fframes-cn/pages -f build_type=workflow
gh api --method PUT  repos/bbylw/fframes-cn/pages -f cname=fframes.ndjp.net
gh api --method PUT  repos/bbylw/fframes-cn/pages -F https_enforced=true
```

DNS is a `CNAME` to `bbylw.github.io`; it already resolves to the GitHub Pages IPs.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
