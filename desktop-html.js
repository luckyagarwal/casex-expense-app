// Desktop PWA shell — assembles the Glass design's CSS + JSX into a single inline HTML page.
// CSS, icons-data, and JSX files are imported as raw text via Wrangler [[rules]] (see wrangler.toml).

import STYLES         from "./expense-app-source/styles.css";
import DESK_STYLES    from "./expense-app-source/desktop-styles.css";
import ICONS_DATA     from "./expense-app-source/icons-lib-data.js";
import ICONS_JSX      from "./expense-app-source/icons.jsx";
import COMPONENTS_JS  from "./expense-app-source/components.jsx";
import SCREENS_JS     from "./expense-app-source/screens.jsx";
import DESKTOP_APP_JS from "./expense-app-source/desktop-app.jsx";

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1280" />
<meta name="theme-color" id="themeColorMeta" content="#050507" />
<link rel="preconnect" href="https://unpkg.com" crossorigin />
<link rel="dns-prefetch" href="https://unpkg.com" />
<title>Expense Tracker — Desktop</title>
<style>
/* Glass design system — Monokai Spectrum × Apple Vision (desktop shell) */
html, body { margin: 0; padding: 0; background: #000; color: var(--text-1); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
html, body, #root { height: 100%; overflow: hidden; }
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
</body>
</html>`;

export const DESKTOP_HTML =
  HEAD +
  STYLES +
  "\n" +
  DESK_STYLES +
  BETWEEN_STYLE_AND_BODY +
  ICONS_DATA +
  BETWEEN_ICONS_AND_JSX +
  ICONS_JSX + "\n" +
  COMPONENTS_JS + "\n" +
  SCREENS_JS + "\n" +
  DESKTOP_APP_JS +
  TAIL;
