# Card drag gesture

## Goal

Make card links and page dragging mutually exclusive. A click opens the card's canonical link. Once pointer movement crosses the drag threshold, `PageContainer` owns the gesture until release and the link does not activate.

## Intention

Treat a pointer that starts on an interactive element as pending rather than immediately scrolling. Promote it to page dragging only after meaningful vertical movement, then keep the pointer stream under `PageContainer` control.

## Scope and constraints

- Disable native HTML dragging on MediaCard card actions, MediaCard Learn More links, and ImageCard actions.
- Cover internal custom-Link anchors and external anchors.
- Base pointer thresholds on `event.pointerType`, not device-wide touch detection.
- Preserve non-interactive page dragging and canonical link/new-tab behavior.
- Clean up gesture ownership on pointer up, pointer cancellation, listener cleanup, and disabled-container transitions.
- Do not change reader animation cancellation or retained reader/list behavior.
- Do not commit.

## Public test seams

- Rendered card anchors expose their canonical `href` and `draggable=false` DOM property.
- Rendered links emit their normal navigation/click behavior after sub-threshold mouse movement on a touch-capable device.
- The public scroll layer's `scrollTop` changes across continued pointer moves after threshold crossing, and the later DOM click does not navigate.
- Pointer cancellation prevents accidental activation and permits a later fresh click.
- A pending pointer that leaves the scroll layer cannot block a later drag, while a captured drag continues across ordinary pointer leave.
- Compatibility-click suppression matches pointer identity when exposed, ignores detail-zero activation, expires, and does not affect unrelated controls.
- Pointer movement started outside an interactive element still changes the public scroll layer.

## Work plan

1. Add card-anchor regression coverage, capture the failing result, and disable native dragging.
2. Add sub-threshold interactive gesture coverage, capture the failing result, and introduce pending ownership keyed by pointer type.
3. Add continued-drag and click-suppression coverage, capture the failing result, and promote pending gestures to captured page drags.
4. Add pointer-cancellation and non-interactive coverage, then complete cleanup behavior.
5. Add a pending-pointer leave path and explicit unexpected-capture-loss handling.
6. Bind click suppression to a completed pointer ID and target, ignore keyboard activation, and expire the token.
7. Run targeted Jest after each slice, full Jest near completion, `npm run build`, and `git diff --check`.
8. Move this plan to `plans/done/` after validation.

## Validation

- `npx jest __tests__/card-drag-gesture.test.jsx --runInBand`
- `npm test -- --runInBand`
- `npm run build`
- `git diff --check`

## Progress

- [x] Confirmed clean baseline at `ddd44ab`.
- [x] Card anchors reject native dragging.
- [x] Interactive gestures stay pending below threshold.
- [x] Page dragging continues after threshold and suppresses link activation.
- [x] Pointer up, pointer cancellation, disabled-container cleanup, and non-interactive dragging behave correctly.
- [x] Pending pointer leave and unexpected capture loss reset ownership without ending a captured drag on ordinary leave.
- [x] Click suppression matches the completed pointer, ignores detail-zero activation, expires, and clears on fresh gestures and cleanup.
- [x] Gesture and blog regression tests pass together: 18 of 18 tests.
- [x] Full Jest, production build, and final diff validation pass after review fixes.

## Surprises and discoveries

- The baseline failed all five initial gesture tests. Native card anchors reported `draggable=true`; a one-pixel mouse move on a touch-capable device changed `scrollTop`; drag promotion never captured the pointer; and cancellation did not suppress the later click.
- The recovered partial implementation already passed those five tests. It still retained pointer capture after pointer up, pointer cancellation, and disabling `PageContainer`. A sixth cleanup slice exposed this before completion.
- JSDOM can verify DOM anchor contracts, navigation events, scroll changes, click suppression, and pointer-capture calls. It cannot reproduce native drag ghosts, a real new tab, or browser-specific click synthesis after pointer capture.
- Review found that an uncaptured pending pointer had no leave termination and that click suppression had no lifetime or pointer identity. Both defects reproduced in focused tests before their fixes.

## Decisions

- Tests observe rendered anchors, public navigation events, `scrollTop`, and the scroll layer's pointer-capture ownership. They do not inspect internal gesture-state variables.
- Interactive pointers begin pending. Non-interactive pointers begin dragging. Movement beyond the pointer-type threshold promotes a pending gesture to dragging and captures that pointer.
- A scroll-layer capture-phase click listener consumes only the immediate pointer click matching a completed promoted gesture's target and pointer ID when the browser exposes that ID. Detail-zero keyboard and programmatic activation bypasses suppression.
- Pointer ownership is released on pointer up, pointer cancellation, listener cleanup, and enabled-to-disabled transitions.

## Outcomes and retrospective

- Baseline command: `npx jest __tests__/card-drag-gesture.test.jsx --runInBand` failed 5 of 5 tests against `ddd44ab` in an isolated temporary checkout.
- Recovery checkpoint: the same targeted command passed the five existing partial-work tests.
- Cleanup slice: targeted Jest failed 3 assertions because captured pointers were not released on pointer up, pointer cancellation, or disabling the container. It passed all 6 tests after the release cleanup was added.
- Existing blog behavior remains green: 6 of 6 tests in `__tests__/blog-scroll-restoration.test.jsx`.
- Initial full Jest passed 20 of 20 tests. The initial `npm run build` compiled and statically generated all 33 pages, and `git diff --check` passed.
- Review red/green checkpoints: pending-leave recovery failed with `scrollTop` 0 instead of 5, then passed; unexpected capture-loss recovery failed with `scrollTop` 10 instead of 15, then passed; a stale token blocked detail-zero activation, pointer ID 8 was incorrectly consumed after pointer ID 7 dragged, and a canceled drag token never expired. Each focused test passed after its corresponding fix.
- Review-targeted gesture Jest passes 12 of 12 tests. Gesture plus blog regression Jest passes 18 of 18 tests.
- Final full Jest passes 26 of 26 tests. `npm run build` compiles and statically generates all 33 pages. `git diff --check` passes.
- No real-browser smoke test was run. Native drag suppression, real new-tab activation, and Safari/Chromium pointer capture and click ordering remain browser-only checks.
