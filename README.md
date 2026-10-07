# Outriva — studio website

Next.js (App Router) site for Outriva: web development, SEO & AEO, AI automation and custom software.
Light theme, plain CSS, no UI libraries.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Deploys to Vercel as-is. Copy `.env.example` to `.env.local` and fill in the values.

## The idea

**Every system starts as a scribble.** The site shows creativity as a process:

- **Hero canvas** (`src/components/home/ScribbleCanvas.tsx`): a sheet of graph paper. A rough
  website sketch draws itself and then resolves onto the grid. Anything a visitor draws is
  simplified, straightened and snapped to the grid when they let go. On touch screens, visitors
  tap "Tap to draw" first so the page still scrolls normally.
- **Draft / Final switch** (header and the dark band): Draft shows the whole site as its own
  sketch — handwritten headings, pencil illustrations, dashed buttons and margin notes. The
  hero scribbles stay unresolved in Draft and tidy themselves up when you switch back. The choice
  is remembered in the visitor's browser.
- **Service illustrations** (`src/components/art/ServiceArt.tsx`): each is drawn once and shown
  twice, finished and as a pencil sketch. Hovering a card shows the sketch.
- **Work under NDA**: client names are never shown. NDA projects get blurred, redacted cover art
  and a stamp; their case pages add a redacted block.
- **Contact sketch pad**: visitors can draw their idea, tidy it onto the grid, and it is emailed
  as a PNG attachment.

The tidy-up maths lives in `src/lib/scribble.ts` (resampling, Ramer–Douglas–Peucker
simplification, straightening near-horizontal and vertical lines, and grid snapping).

## Editing content

All copy lives in `src/content/`:

| File | What it holds |
|------|---------------|
| `site.ts` | Email, location, social links, navigation |
| `services.ts` | The four services, their descriptions, chips and the handwritten note on each sketch |
| `cases.ts` | Case studies |
| `process.ts` | The four process steps |
| `faq.ts` | Questions and answers (also published as FAQPage structured data) |

### Adding a case study

Add an entry to `cases` in `src/content/cases.ts`:

```ts
{
  slug: "insurance-claims-portal",          // URL: /work/insurance-claims-portal
  sector: "Insurance, claims",              // shown instead of the client's name
  nda: true,                                // redacts the cover and adds the NDA stamp
  headline: "A claims portal customers can finish on their phone",
  services: ["software", "automation"],     // web | search | automation | software
  summary: "One-sentence summary for cards and search results.",
  brief: "What the client was struggling with.",
  did: ["What we did, one line each"],
  changed: ["What is different now, one line each"],
  stack: ["Next.js", "PostgreSQL"],
  cover: { glyph: "card", tone: "blue" },   // glyph: card | cross | hanger | route | org | plan | crate | book
                                            // tone: blue | marker | stone | ink
  featured: true,                           // show on the home page (first four)
}
```

It appears on the home page (if featured), on `/work` with its filters, in the sitemap, and
gets its own page.

### The sample case studies

The eight case studies are **illustrative samples** written for this build. Replace them with
Outriva's real projects before launch. They deliberately contain no client names and no
invented figures; keep it that way unless a client agrees otherwise.

### Things to replace before launch

- `src/content/site.ts`: email address, location line, social links (`#` placeholders)
- `src/content/cases.ts`: the sample case studies
- `src/content/faq.ts`: check every answer matches how Outriva actually works
- `public/og.png`: social sharing image (regenerate if the headline changes)

## Contact form

Submissions go to `src/app/api/contact/route.ts`. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL`
to have each message emailed through [Resend](https://resend.com), with the sketch attached
as `sketch.png`. Without them, messages print to the terminal in development and the form shows
an error in production, so nothing is silently lost. To use another email service, replace the
`fetch` call in that file.

## SEO and AEO

- Per-page titles, descriptions and canonical URLs; generated `sitemap.xml` and `robots.txt`
- Organization structured data on every page and FAQPage structured data on the home page
- Set `NEXT_PUBLIC_SITE_URL` to the live domain

## Accessibility and motion

All interactions work with a keyboard. Canvases have text alternatives and nothing on the page
depends on drawing. `prefers-reduced-motion` turns off the animations; the hero shows the
finished drawing straight away.
