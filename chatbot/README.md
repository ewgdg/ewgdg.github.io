# QA Chatbot

Cloudflare Worker that answers visitor questions as Xian, using Workers AI (`@cf/google/gemma-4-26b-a4b-it`).
The site's chat box calls it at `https://qa-chatbot.xianzzz.com` (`NEXT_PUBLIC_CHATBOT_URL`).

- `faq.json`: personal FAQ, embedded in the system prompt
- `/api/content` on the site: content list, fetched per chat and cached by Cloudflare for the origin's `max-age`
- Endpoints: `GET /health`, `POST /chat` with `{ messages: [{ role: "user" | "assistant", content }] }`

## Cost

Runs on the Workers Free plan. Workers AI gives 10,000 neurons/day free; a chat costs ~30 neurons, so roughly 300 chats/day.
When the allocation runs out, `/chat` returns `response: null` and the site shows its "try again" message until the next UTC day. Nothing is billed.

To keep one client from draining the allocation, `/chat` allows 15 messages per minute per visitor IP (`CHAT_RATE_LIMITER`, enforced per Cloudflare location) and rejects requests larger than the chat box ever sends.

## Local development

```bash
npm ci
cp .dev.vars.example .dev.vars   # point SITE_BASE_URL at the local site
npx wrangler login               # Workers AI always runs remotely, even in dev
npm run dev                      # http://localhost:8082, matching the site's .env.development
```

Checks: `npm run check` (types) and `npm test`.

## Deployment

`.github/workflows/chatbot-cloudflare-worker.yml` tests every PR touching `chatbot/` and deploys on push to `main`.
It needs repository secrets `CLOUDFLARE_API_TOKEN` (the "Edit Cloudflare Workers" token template, with the `xianzzz.com` zone included so the custom domain can be attached) and `CLOUDFLARE_ACCOUNT_ID`.

The Worker owns `qa-chatbot.xianzzz.com` as a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/); Cloudflare creates its DNS record and certificate on deploy.

### One-time cutover from Cloud Run

1. Add the two GitHub secrets above.
2. In Cloudflare DNS for `xianzzz.com`, delete the `qa-chatbot` CNAME to `ghs.googlehosted.com`. A Custom Domain cannot be attached while another record exists.
3. Deploy: merge to `main`, or run `npm run deploy` locally.
4. Verify `curl https://qa-chatbot.xianzzz.com/health` and send a message from the site.
5. Remove the Google Cloud leftovers: the Cloud Run service and its domain mapping, the Artifact Registry image, the `openai-qa-chatbot-secret` secret, and the `PROJECT_ID`, `REGION`, `SERVICE`, `WORKLOAD_IDENTITY_PROVIDER`, `SERVICE_ACCOUNT_EMAIL` GitHub variables.
