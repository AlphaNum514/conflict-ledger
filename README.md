# The Conflict Ledger
### A data-driven investigation into the economics of armed conflict

[![Deploy Status](https://img.shields.io/badge/deploy-live-brightgreen)](https://conflict-ledger.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1-orange)](https://www.w3.org/WAI/WCAG21/quickref/)

> *Defense stocks outperformed the S&P 500 by 66 percentage points since February 2022.  
> 580,000+ people died in active conflicts in the same period.  
> This report puts both numbers in the same frame.*

---

## Live Demo

**[conflict-ledger.com](https://conflict-ledger.com)**

![The Conflict Ledger — Public Edition](https://conflict-ledger.com/og-image.png)

---

## Overview

The Conflict Ledger is a single-page investigative data journalism piece examining the structural economic relationship between armed conflict and financial markets. It features two views:

- **Public Edition** — Concise, visual overview for general readers
- **Research Edition** — Full policy-grade analysis with methodology, footnotes, and interactive tools

---

## Features

| Feature | Details |
|---|---|
| Dual-view architecture | Public Edition + Research Edition in one file, toggled via tab switcher |
| Dark mode | System-preference aware, persisted via `localStorage` |
| Interactive charts | 4 Chart.js visualizations with lazy loading and skeleton placeholders |
| Portfolio simulator | 4-slider calculator with 3 preset scenarios |
| Scenario picker | Bull/Base/Bear with historical basis citations |
| Sortable data table | Click-to-sort sector performance table |
| Expandable glossary | 8 financial/geopolitical terms with accordion |
| PDF export | `window.print()` based, no external library |
| Keyboard navigation | Full `Tab`/`Enter` support, `:focus-visible` styles |
| Screen reader ready | `aria-label`, `aria-pressed`, `aria-expanded`, `aria-sort` throughout |
| Analytics hooks | Plausible.io event tracking (Switch View, Download PDF) |
| Open Graph | Rich link previews for WhatsApp, LinkedIn, Twitter |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5, ARIA attributes |
| Styling | Vanilla CSS with custom properties (`--navy`, `--red`, etc.) |
| Scripting | Vanilla JavaScript (ES5 compatible, no build step) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN with 3-source fallback |
| Data | `data.json` fetched async, inline fallback for offline/`file://` |
| Fonts | Google Fonts (Playfair Display, DM Sans, DM Mono, Syne, IBM Plex Mono) |
| Deployment | Cloudflare Pages (CDN edge, auto-deploy on push) |

**No framework. No npm. No build step.** Open `index.html` in a browser and it works.

---

## Project Structure

```
conflict-ledger/
├── index.html        # Markup for both views (Public + Research)
├── style.css         # All styles: variables, components, dark mode, print
├── script.js         # All JS: switchView, charts, calculator, localStorage
├── data.json         # Chart data, scenario definitions — update without touching JS
├── .github/
│   └── workflows/
│       └── deploy.yml  # CI/CD: auto-deploy to Cloudflare Pages on push
└── README.md
```

---

## Data Sources

All data is sourced from publicly available institutional databases:

| Source | Data | Period |
|---|---|---|
| [SIPRI](https://sipri.org/databases/milex) | Global military expenditure | 2025 edition |
| [UNHCR](https://unhcr.org/global-trends) | Forced displacement statistics | Mid-2024 |
| [ACLED](https://acleddata.com) | Conflict fatality estimates | 2022–Dec 2025 |
| Bloomberg / SEC filings | Equity sector returns | YTD Q1 2026 |
| World Bank | Ukraine economic assessments | 2022–2025 |
| Lloyd's of London | Maritime war risk premiums | Q1 2024 |

**To update data:** edit `data.json`. Charts and scenarios re-render automatically on next load. No JavaScript changes required.

---

## Technical Challenges Solved

### 1. Race Condition on CDN Chart.js Loading

**Problem:** Chart.js loads asynchronously from a CDN. `IntersectionObserver` (which triggers chart init when a canvas enters the viewport) could fire *before* Chart.js finished downloading — causing charts to silently fail with no error.

**Solution:** Added `s.onload` to the CDN loader that dispatches a `chartjs-loaded` custom event. Both the simple and research view IIFEs listen for this event and re-attempt any charts already in the viewport. This guarantees charts render regardless of network latency order.

```javascript
s.onload = function() {
  window.dispatchEvent(new Event('chartjs-loaded'));
};

window.addEventListener('chartjs-loaded', function() {
  // Re-check which canvases are in viewport and init them
});
```

### 2. CSS Scope Isolation in a Single-File Architecture

**Problem:** Both views (Public + Research) share one HTML document. CSS class names like `.reveal`, `.active`, `.pos`, `.neg` existed in both views and conflicted.

**Solution:** All simple-view CSS classes were prefixed with `s-` (`s-reveal`, `s-active`, etc.) using automated Python string replacement, scoping them without introducing CSS modules or build tooling.

### 3. JavaScript IIFE Scope Isolation

**Problem:** Both views' JavaScript ran in the same global scope, causing `const SEC_VALUES has already been declared` errors.

**Solution:** Each view's scripts are wrapped in an Immediately Invoked Function Expression (IIFE). Variables that need to cross the IIFE boundary (IntersectionObservers, onclick handlers) are explicitly exported via `window.varName = varName`.

### 4. Dark Mode Across Two CSS Systems

**Problem:** The two views used different CSS variable naming conventions. Dark mode toggle (only in Research view) didn't affect Public view, and vice versa.

**Solution:** Both views share the same `:root` and `[data-theme="dark"]` variable blocks. Dark mode state is persisted in `localStorage` and restored on page load before first paint, preventing flash of wrong theme.

---

## Running Locally

No build step or server required for basic viewing:

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server (required for data.json fetch)
npx serve .
# or
python3 -m http.server 8080
```

> **Note:** `data.json` fetch requires a local server (`http://`) — it won't work on `file://` protocol. The script falls back to inline hardcoded values automatically, so the site still functions fully without a server.

---

## Deployment

### Cloudflare Pages (Recommended)

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create project → Connect GitHub repo
3. Build settings: **none** (static site, no build command)
4. Output directory: `/` (root)
5. Add custom domain in Cloudflare dashboard

Every `git push` auto-deploys. The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles this automatically.

### GitHub Pages

```bash
# In repo settings: Pages → Branch: main → Folder: / (root)
# URL: username.github.io/conflict-ledger
```

---

## Analytics

The site includes [Plausible.io](https://plausible.io) analytics hooks (privacy-first, no cookie banner, GDPR-compliant). To activate:

1. Sign up at plausible.io
2. Uncomment the script tag in `index.html`:
   ```html
   <script defer data-domain="your-domain.com" 
     src="https://plausible.io/js/script.js"></script>
   ```
3. Custom events already wired: `Switch View` and `Download PDF`

---

## Accessibility

This project targets **WCAG 2.1 Level AA** compliance:

- ✅ All interactive elements keyboard accessible (`Tab`, `Enter`, `Space`)
- ✅ `:focus-visible` styles for keyboard navigation indicators
- ✅ `aria-label` on all buttons and form controls
- ✅ `aria-pressed` on toggle buttons (dark mode, view switcher)
- ✅ `aria-expanded` on accordion (glossary)
- ✅ `aria-sort` on sortable table headers
- ✅ `role="img"` + `aria-label` on all Chart.js canvases
- ✅ Skip-to-main-content link
- ✅ `lang="en"` on `<html>`
- ✅ Semantic HTML (`<main>`, `<nav>`, headings hierarchy)
- ✅ Sufficient color contrast (tested against WCAG AA thresholds)

---

## Disclaimer

This project is designed for portfolio and illustrative purposes only. Financial data, geopolitical scenarios, and market projections do not constitute real financial advice or real-time market reporting. All figures carry a reference date and should be treated as historical analysis, not current reporting.

The Conflict Ledger is a speculative editorial project and is not affiliated with any defense contractor, government entity, or investment firm.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Data from SIPRI, UNHCR, ACLED, and Bloomberg is used under their respective public access terms and is attributed inline throughout the report.

---

*Built with Vanilla JS · Chart.js · CSS Custom Properties*  
*No frameworks. No npm. No excuses.*
