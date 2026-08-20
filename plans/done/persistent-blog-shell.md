# Persistent blog shell

## Goal

Keep the blog jumbotron and searchable post list mounted while App Router switches between `/blog` and `/blog/[slug]`. Show articles in an independent reader that does not disturb the list's custom scroll or navigation controls.

## Scope and constraints

- Preserve static export and trailing-slash routes.
- The server blog layout loads post summaries and jumbotron data.
- The client route shell owns the persistent blog index and reader state.
- Article cards and Back To List use canonical links.
- Disable and detach `PageContainer` input handlers while reading.
- Remove only blog-specific restoration coordination.
- Do not change unrelated metadata, viewport, image, tag, or content behavior.

## Work plan

1. Replace the restoration test with behavior tests for canonical links and the persistent shell.
2. Add the server layout and client shell, then make the blog index a metadata-only leaf.
3. Add the independent reader scroll region and blog index isolation.
4. Add `PageContainer.enabled`, including listener cleanup when disabled.
5. Replace card click routing with links across every affected card caller.
6. Run targeted tests, full Jest, the production build, and inspect exported blog HTML.

## Focused correction

A browser repro found the global PIXI canvas still mounted while reading, but the fixed reader's computed white background covered the viewport. The retained blog index also remained visually painted under the reader.

- [x] Rename the shell's `background` concept to `blogIndex`.
- [x] Keep the retained blog index mounted and layout-stable, but conceal it with `visibility: hidden` while `aria-hidden="true"`.
- [x] Make the reader transparent so PIXI remains visible outside the article's opaque content.
- [x] Update the Jest seam for retained node identity, semantic hiding, and `blogIndex` terminology.
- [x] Run targeted Jest, full Jest, the production build, and `git diff --check`.

## Validation

- Targeted Jest after each red/green slice.
- Full Jest near completion.
- `npm run build`.
- Inspect `out/blog/index.html` for the canonical post URI in its RSC payload and one real `out/blog/<slug>/index.html` for article text. Verify rendered canonical hrefs in Jest.

## Progress

- [x] Inspected the existing blog routes, card callers, restoration hooks, and global `PageContainer` handlers.
- [x] Replaced mechanism tests with behavior tests and completed each red/green slice.
- [x] Added the server layout, persistent client shell, independent reader, canonical cards, focus restoration, and handler cleanup.
- [x] Added regression coverage for custom-Link coordination, sibling stacking, and in-flight scroll cancellation.
- [x] Passed targeted Jest, warning-clean full Jest, the production build, export inspection, and a real-browser smoke test.
- [x] Completed and validated the focused reader transparency correction.

## Surprises and discoveries

- The existing global `PersistedLayout` withholds route DOM until its client scroll-layer ref resolves. Static exports therefore carry the blog list in the RSC payload rather than rendered anchors. Changing that cross-site hydration gate stays out of scope. Jest covers the canonical `<a href>` contract.
- Removing `PageContainer` listeners did not stop a GSAP `scrollIntoView` tween that had already started. That tween continued changing the retained `scrollDiv` behind the reader. The enabled-to-disabled transition now kills tweens targeting that scroll layer.
- JSDOM can verify the reader and blog index are sibling layers with their local CSS classes. It cannot resolve the browser's computed stacking order or PIXI visibility, so the focused visual correction still needs real-browser verification. The earlier smoke test observed blog index `z-index: 0`, reader `z-index: 1`, AppBar `z-index: 1100`, with the reader owning the top hit-test point.

## Decisions

- Test through rendered links, the public navigation event seam, shell rerenders, reader semantics, retained DOM/state, and observable input behavior.
- Keep the global `PersistedLayout` hydration behavior unchanged.
- Isolate the entire blog index in a local `z-index: 0` stacking context and put the sibling reader at `z-index: 1`.
- Cancel active scroll-layer tweens instead of restoring a saved scroll snapshot.

## Outcomes

- `/blog` and `/blog/[slug]` share one mounted blog index.
- Internal cards remain canonical anchors and emit `BEFORE_NAVIGATION`; external cards remain real new-tab anchors.
- Reader navigation no longer depends on blog scroll/state restoration or click-driven routing.
- The browser retained both search query `Pi` and exact list `scrollTop` `133.5` through article navigation and Back, including an in-flight ArrowDown scroll attempt.
- The updated Jest seam failed before implementation because `blog-index` did not exist, then passed after the rename and semantic-state correction.
- Targeted Jest passes 6 tests, full Jest passes all 14 tests, and Next statically exports 24 blog slug routes.
- The production CSS contains the `aria-hidden` visibility rule and transparent reader background. `git diff --check` passes.
