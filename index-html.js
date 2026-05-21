// Mobile PWA shell — assembles the Glass design's CSS + JSX into a single inline HTML page.
// CSS, icons-data, and JSX files are imported as raw text via Wrangler [[rules]] (see wrangler.toml).

import STYLES        from "./expense-app-source/styles.css";
import ICONS_DATA    from "./expense-app-source/icons-lib-data.js";
import ICONS_JSX     from "./expense-app-source/icons.jsx";
import COMPONENTS_JS from "./expense-app-source/components.jsx";
import SCREENS_JS    from "./expense-app-source/screens.jsx";
import APP_JS        from "./expense-app-source/app.jsx";

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="format-detection" content="telephone=no" />
<meta name="theme-color" id="themeColorMeta" content="#050507" />
<link rel="manifest" href="/manifest.json" />
<title>Expense Tracker</title>
<style>
/* Glass design system — Monokai Spectrum × Apple Vision (mobile shell) */
html, body { margin: 0; padding: 0; background: var(--bg-base, #050507); color: var(--text-1); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
html, body, #root { height: 100%; overscroll-behavior: none; }
input, button, textarea, select { font-family: inherit; }
</style>
<style>
`;

const BETWEEN_STYLE_AND_BODY = `
</style>
</head>
<body>
<div id="root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

<script>
`;

const BETWEEN_ICONS_AND_JSX = `
</script>

<script type="text/babel" data-presets="env,react">
`;

const TAIL = `
</script>

<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
</script>
</body>
</html>`;

export const HTML =
  HEAD +
  STYLES +
  BETWEEN_STYLE_AND_BODY +
  ICONS_DATA +
  BETWEEN_ICONS_AND_JSX +
  ICONS_JSX + "\n" +
  COMPONENTS_JS + "\n" +
  SCREENS_JS + "\n" +
  APP_JS +
  TAIL;
