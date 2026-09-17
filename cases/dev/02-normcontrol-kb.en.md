# "Between the Lines of the Blueprint" — knowledge base for a drawing checker

*(Russian: «Между строк чертежа»)*

## Summary

A public knowledge base on ESKD (Russian drawing standards): cards of typical drawing errors, summaries of
GOST standards, checklists by document type — linked with backlinks and published as a static site with
search and a link graph. Built for the daily work of a drawing checker (the author's spouse). The base now
holds 24 error cards in 7 categories, 46 standard summaries and 29 document types; the site is live and
updates on a normal push.

## Problem

A drawing checker reviews dozens of drawings and documents every day: each error requires finding the relevant
GOST, checking related errors and comparing with examples. Without a single base this takes hours, and the same
remarks repeat from document to document. An extra constraint: edits had to be made from a locked-down work PC
with no Git and no way to install anything.

## Solution

1. A single Markdown base (an Obsidian vault): folders by section, each folder with its own index note.
2. Static site publishing: Quartz 4 + GitHub Pages, built and deployed from GitHub Actions.
3. Backlinks "error ↔ GOST ↔ document" plus an automated audit of links: 29 of 29 documents reference errors,
   46 of 46 standards reference the errors about them.
4. A single error-card schema: category, GOST, document, "how it looks / how it should look", examples, GOST
   clause, related errors.
5. Link graph (D3 + Pixi): nodes coloured by category, sized by the number of links, labels on large nodes,
   soft clustering by section.
6. AI pipeline for adding notes: one field on the site → an issue is created from a template → a workflow
   (repository owner only) sends the text to DeepSeek → a note is generated → the site is rebuilt and
   published. The API key lives only in Actions secrets, logs pass through scrub(), and the answer size is
   capped by max_tokens.
7. A web editor for the base (Sveltia CMS) plus "Edit on GitHub" buttons, so notes can be edited from the
   locked-down work PC.
8. The "Engineering Diary" theme: custom palette and SCSS, light and dark modes, a back-to-top button,
   responsive layout, and a custom astral background with particles.
9. An easter egg: a hidden page with a mini-game (see case 03), excluded from search, the graph, sitemap and
   RSS and marked noindex.
10. Pre-publish checks: tsc --noEmit, prettier --check, a script audit of links and metadata, a unit test for
    search, and functional tests on stubs (the machine has no browser at all).

## Metrics

| Metric | Value |
|---|---|
| Time spent | not documented |
| Cost (API) | not documented (the pipeline runs on a paid DeepSeek API; the spend was not tracked) |
| Commits | 53 (48 by the author) |
| Files changed | 346 unique |
| Lines of code and content | +54,463 / −6,307 |
| Tools built | 2 AI pipeline scripts + an issue form + the /add-note page + custom Quartz components (particles, sounds, note button, hidden pages) |
| Tests and automated checks | 4 (tsc, prettier, link audit, search unit test) plus local functional tests on stubs |
| Users | 1 (the drawing checker) |
| Live URL | https://frinog1-a11y.github.io/normcontrol-kb/ |

## Skills demonstrated

- Building a knowledge base: note schema, templates, metadata, backlinks.
- Quartz 4 static site generator: customising theme, layout, components and styles.
- Surgical changes to someone else's core: every edit is marked as a patch, so upstream updates do not break
  the project.
- CI/CD on GitHub Actions: build, deploy to Pages, and a separate job "from issue to note".
- AI pipeline: integrating an LLM into CI, supporting several providers by key prefix, sanitising logs,
  capping answer size and cost.
- TypeScript and data visualisation (D3, Pixi) with graph configuration.
- Verifiability: an automated audit of links and relations instead of manual proofreading.
- Working without a graphics environment: tests on document/Canvas/AudioContext stubs.
- Documentation for handover: HANDOFF.md with state, known pitfalls and open questions.

## Stack

Quartz 4.5.2 (TypeScript, SCSS), Node.js 22+, D3 + Pixi, Obsidian/Markdown, GitHub Actions + GitHub Pages,
Sveltia CMS, DeepSeek API (optionally OpenRouter/Groq/Ollama), Prettier. The Quartz core was barely touched —
all changes are marked patches.

## Limitations

- The "issue → note" pipeline is deliberately restricted: it only fires for issues created by the owner.
- The machine has no browser, so visual checks are replaced by a build and scripted tests; the author reviews
  the live pages manually from a phone or a work PC.
- Inline scripts inside Markdown are rejected by the builder, so the game logic lives in a static JS file.
- 27 documents still lack a backlink from error cards.
- The examples section (scans of "bad/good") is empty.
- The task board (GitHub Projects v2) has to be configured by hand: no gh CLI and no required token scope.
- Deployment is not instant: 2–8 minutes; the browser caches the search index, so a hard refresh is needed.
- The author's real name is not disclosed in the project — the README keeps a placeholder.

## Artifacts

- Site: https://frinog1-a11y.github.io/normcontrol-kb/
- Repository: https://github.com/frinog1-a11y/normcontrol-kb (local copy: C:\Normcontrol-KB)
- HANDOFF.md — project state, commands, verified pitfalls, open questions.
- The /add-note page — the "one field → published site" scenario for a non-technical user.
- No screenshots yet (to be provided by the author).

## Next steps

- Fill the examples section with bad/good scans after removing personal data.
- Close the 27 documents that have no backlink.
- Add screenshots to the project README.
- Make the task board publicly viewable.
- Capture screenshots of the home page, an error card, the graph and /add-note for the portfolio.
