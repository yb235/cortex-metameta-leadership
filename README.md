# Cortex — Metameta

Complete static hackathon app. No build step, backend, or API keys required.

## Run locally

Unzip, enter the cortex-metameta folder, and run:

    python3 -m http.server 8000

Open http://localhost:8000/ in your browser.

## Pages

- `/` — operations intake and timestamped activity log
- `/pricing` and `/plans` — Starter plan, $99/month
- `/share` — internal team overview, personalized sample link, copyable introduction
- `/signup` — signup form and Account created confirmation

The full source (HTML, CSS, JavaScript) is in index.html. The route folders contain
copies for static hosts that do not provide a single-page-app fallback. After
editing index.html, copy it to pricing/index.html, plans/index.html, signup/index.html, and share/index.html before publishing.

## Public deployment

https://cortex-ops-desk.openagent-la-3602.chatgpt.site

Deploy this folder to any static host. No environment variables are needed.

## Demo behavior

- Intake uses deterministic keyword rules.
- Submitted text (with pattern-based masking), category, next action, and event
  time are recorded in browser localStorage. The latest six entries are shown.
- Signup saves a demo account profile in browser localStorage. Passwords are not
  stored. No email is sent and no payment is collected.
- KPI and demand forecast panels contain illustrative sample values.
- This is a local-browser demo, not production authentication or a tamper-proof
  compliance system. Pattern-based masking is not exhaustive.
- Font styling may use Google Fonts; system font fallbacks work without it.

## Revision

2026-10-09, source 616ff8806ec691a3a1804b5f86696f1448d8d5a8.
Includes submitted-item log fix, visible Metameta branding on mobile and desktop,
Starter pricing, and self-serve demo signup.

Checks: JavaScript syntax; execution of /pricing, /plans, /signup and /signup/;
signup confirmation, saved profile, and no password persistence. These were
programmatic checks, not a browser visual review.

Internal-sharing update: /share supports audience and workflow choices, a copyable link and introduction, and no-signup sample demos via /?demo=order, support, or invoice. Budget, owner, and timeline are not assumed. Programmatic checks cover personalized links, copy callbacks, and processing/logging all three samples.
