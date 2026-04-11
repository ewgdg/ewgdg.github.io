---
templateKey: BlogPost
title: Pi is a Gift
date: 2026-03-17T00:00:00.000Z
lastModified: 2026-04-11T20:36:13.263Z
featuredPost: false
description: In short, a quota bug I hated turned out to be the best thing that happened to my agent setup.
tags:
  - AI
  - agent
  - productivity
  - tools
---

In mid-March my OpenAI Codex quota ran out unexpectedly. Not because I was doing anything unusually heavy — there was a [bug](https://github.com/openai/codex/issues/14593) burning tokens abnormally, and I got caught in it. My first reaction was frustration. I was mid-flow on things and suddenly my main tool was gone.

While waiting for the quota to reset, I decided to hook up some open-weight models with an open-source harness. Reasonable plan.

## Trying the Obvious Options

I started with the top entries from the terminal-bench leaderboard. I just didn't like them. The benchmarks also set hard time walls for test cases, which does not match how I actually work — sometimes an agent needs more time to reason, and an arbitrary cutoff is not useful feedback.

I also looked at opencode, probably the most popular open-source harness right now. But there were too many red flags: a [cache invalidation bug](https://github.com/anomalyco/opencode/issues/5224) open for months, a persistent [low cache hit rate report](https://github.com/anomalyco/opencode/issues/14065), and no direct support for provider-hosted web search. Web search is the most important agentic tool to me, so that was a dealbreaker.

## The Accidental Discovery

I was reading about a [chrome CDP skill](https://github.com/pasky/chrome-cdp-skill) when its readme casually mentioned an agent harness named Pi. I had never heard of it. I looked it up.

The design philosophy interested me immediately, but I couldn't really tell how capable it was. Then I found [Armin Ronacher's blog post about Pi](https://lucumr.pocoo.org/2026/1/31/pi/), and realized it is the harness behind openclaw — which I already knew was impressive. That changed my read on it completely. Pi is minimalist by design, but that's exactly where the control comes from.

I started using Pi and what struck me immediately was how slowly the context grew. The minimalism is not just aesthetic — no bloated system prompt, no tool sprawl, the context stays focused on what is actually relevant. That directly improves accuracy. I liked it a lot.

## The Blessing in Disguise

赛翁失马，焉知非福 — the old man lost his horse, but how could anyone know it wasn't a blessing? A misfortune that later turns out to be a good thing.

Without the Codex bug I would never have gone looking. I would have kept defaulting to what I already had. The bug was annoying, and it also showed me something I wouldn't have found otherwise. I'm actually grateful for it, which is a weird thing to feel about a billing anomaly.

Lesson learned: sometimes the thing that breaks your routine is the only way you would have found a better one.
