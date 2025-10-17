# web-client — TypeScript + SCSS + HTML (esbuild + sass)

Lightweight starter for a TypeScript + SCSS + HTML web app without webpack.

Why this setup?
- Uses esbuild for fast TypeScript bundling.
- Uses the official Sass CLI for SCSS compilation.
- No webpack or large bundlers required.
- Simple npm scripts for dev and build.

Getting started

1. Install dependencies `npm install`

2. Development `npm run dev`

   - Runs esbuild in watch mode (writes bundle to src/assets/app.js)
   - Runs sass in watch mode (writes CSS to src/assets/css/main.css)
   - Serves the src/ folder at http://localhost:3000 (live reload)

3. Build for production `npm run build`

   - Produces a `dist/` folder with minified assets and copied HTML.

Notes / next steps
- You can swap live-server for any static server you prefer.
- If you prefer all outputs in dist/ during dev, we can add a tiny file-watcher or use a different approach (e.g. Vite). This current approach keeps dev fast and simple.