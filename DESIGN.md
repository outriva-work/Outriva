# Outriva design system

**Concept.** Every system starts as a scribble. The site shows the move from rough idea to
working system: lines resolve onto a grid, illustrations exist as both sketch and final, and the
whole site can be flipped to its own draft.

## Colour

| Token | Hex | Use |
|-------|-----|-----|
| `--paper` | `#F4F5F0` | Page, graph paper ground |
| `--paper-2` | `#E9EBE3` | Alternate sections |
| `--card` | `#FBFBF8` | Cards, inputs |
| `--ink` | `#16181D` | Text, dark band, outlines |
| `--ink-2` | `#4A4E57` | Secondary text |
| `--pencil` | `#5B6070` | Draft strokes and handwriting |
| `--blue` | `#2440E0` | Ballpoint: resolved lines, accents, links |
| `--marker` | `#FFE14D` | Highlighter: small fills, open FAQ, case covers |

Graph-paper grid: 24 px, blue at 7.5% opacity. Canvas drawings snap to the same 24 px grid.

## Type

- **Bricolage Grotesque** for everything. Display and headings at optical size 96 and width 92,
  tight tracking. Body at optical size 16.
- **Caveat** only for handwriting: notes, the Draft switch, Draft view headings, canvas labels.

## Shape and structure

Black 1.5 px outlines, 14–20 px radii on cards, pill buttons. Hover lifts an element and drops a
solid offset shadow, like a sticker being peeled. Numbering is used only for the process steps,
which are a real sequence.

## Motion

- One orchestrated hero moment: headline lines rise, the demo sketch draws itself, then tidies up.
- The process line draws itself on scroll: a coil that straightens out.
- Switching to Draft gives a short page-wide fade, and hero lines un-resolve; switching back
  resolves them live.
- Everything respects `prefers-reduced-motion`.
