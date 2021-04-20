# ![Frontend-core](./app/src/assets/ico/readme-logo.png)

## Description

---

It's simple bare bones repository for frontend developers using [BEM](https://en.bem.info/).

## Demo

---

_Here you can write link for your runtime project_.

## For the beginning

---

### What do you need to start

1. Package manager [NPM](https://www.npmjs.com/) and [NodeJs](https://nodejs.org/en/) platform.
2. Some CLI to execute commands from directory of your project (bash is recommended).
3. Clean VS Code editor(optional).

### Installation

Just clone this repository and execute:

```bash
npm i
```

### Usage

In package.json you can find useful scripts for managing the build. To do this, use the following:

```bash
npm run {script-name}.
```

Script-names:

- start - builds bundles and runs server to be upgraded;
- dev - just builds bundles and place it into _dist_ directory;
- build - build minify bundles and place it into _dist_ directory;
- test - run jest tests(matches .spec. or .test. files), P.S.: it can work in a separate console in parallel with webpack;
- stats - visualize size of webpack output files with an interactive zoomable treemap using webpack-bundle-analyzer;
- ext - install necessary VS Code extensions.

## Inside

---

### Project tree

```tree

```

### How it's collected to bundle

For each page, only the necessary styles and scripts are loaded from all levels of redefinition. This is achieved by analyzing the class names in the template (page / html) and automatically adding the corresponding files by matching the name.

You can see explanation [here](https://en.bem.info/methodology/redefinition-levels/).

The order of redefinition levels is as follows: library -> common -> thematic* -> experimental*.

_\* - inside the directories, there are additional folders for each individual redefinition sublevel. To connect them, you need to modify webpack.config_.

### Technologies

1. Shared VS Code settings.
2. VS code extensions which increase comfort:
   1. GitLens.
   2. PowerShell.
   3. Ayu.
   4. Material Icon Theme.
   5. CSS Peek.
   6. HTML CSS Support.
   7. Path Autocomplete.
   8. Auto Complete Tag.
   9. Change-Case.
   10. Bracket Pair Colorizer.
   11. Code Spell Checker.
   12. TODO Highlight.
   13. Quokka.js.
   14. ESLint.
   15. lit-html.
   16. Prettier - Code formatter.
   17. Image preview.
   18. VSCode Map Preview.
   19. SVG.
   20. markdownlint.
   21. Sort Lines by Selection.
   22. Live Server.
   23. Import Cost.
   24. JavaScript (ES6) code snippets.
   25. Webpack Snippets.
3. Preprocessors which speed up work:
   1. Pug.
   2. SCSS.
   3. TypeScript
4. Webpack which kill your headaches:
   1. Pages only need to be created, and the collector can determine the entry points on its own. Scripts and styles connect to the page themselves, and the order of connection is always correct. Resources used by multiple pages are loaded only 1 time.
   2. Connect images and use auxiliary modules directly in the [templates](./app/src/pages/cards/cards.pug).
   3. The normalization of the initial styles through [Normalize.css](https://necolas.github.io/normalize.css/) for each page based on the browsers specified as supported.
   4. No need to remember a bunch of css prefixes and what properties are supported where thanks to [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) and [Autoprefixer](https://www.npmjs.com/package/autoprefixer).
   5. Users with mobile devices will not download code that is only intended for personal computers(use the mobile first approach: inside scss, specify [nested @media](./app/src/components/common.blocks/basic/footer/__copyright-bar/footer__copyright-bar.scss), and for scripts use [webpack magic comments with match media](); P.S.: use pre-configured snippets: [1](./.vscode/@media-snippets.code-snippets), [2]()).
   6. [Modern JavaScript, today](https://babeljs.io/).
   7. Compression of images, scripts, styles, html in production mode. Note: Each image will also have a\*_. webp_ \* clone, which further reduces the final size and only the necessary elements will be taken from the script modules, and not the code of the entire module.
   8. There is no need to write relative paths for import when there are excellent aliases for the most popular paths in development.
   9. During development, when changing pug/cs/ts, the result is immediately visible without manual reboots and builds.
   10. During the build, webpack will notify you if: there are circular dependencies, libraries of different versions are connected, there are unused files, there are css properties that browsers do not support. Displays the speed of source processing at each stage of the build.
   11. If the source code is changed, the user device will know about it and download only the latest version of the project (provided by hashing the output files).
   12. It works the same on different platforms.
5. ESLinter using [Airbnb standarts](https://github.com/airbnb/javascript) integrated with prettier and typescript which protects your knee from :gun: and your life from wasting :clock2:.
6. Jest: delightful JavaScript Testing Framework with a focus on simplicity, it works fine with TypeScript.
7. Pre-installed libraries:
   1. fontawesome-free and material-icons-regular;
   2. jquery to support old projects;
   3. inputmask for form validation;
   4. lodash-es to supplement the js standard. Tip: you should use only import of lodash-es(moreover, when importing, only care about the readability and strictness of the code, and not the optimization of the weight) instead of common lodash because ES6+ module syntax is supported by terser for optimization;
   5. js-cookie: a simple, lightweight JavaScript API for handling cookies;
   6. JSBI: BigInt replacement that works in today’s environments;
   7. es6-promisify: converts callback-based functions to ES6/ES2015 Promises, using a boilerplate callback function;
   8. idb: adds fine IndexedDB API;
   9. reconnecting-websocket: webSocket that will automatically reconnect if the connection is closed;
   10. lit-html to highlight html inside js/ts and only update the parts of the template that have changed since the last render.
8. Custom Tools:
   1. Basic pug layers and mixins;
   2. scss and ts shortcuts;
   3. pug and scss snippets: [1](./.vscode/template-snippetts.code-snippets), [2](./.vscode/@media-snippets.code-snippets);
   4. [placeholder](./app/src/assets/pictures/images/placeholders/lazy-loading-placeholder.svg) for unloaded img (img [would be loaded](./app/src/utils/global/modules/scripts/assets-lazy-loading.ts) by user's scroll);
   5. [arrow-to-top](./app/src/components/common.blocks/specific/arrow-to-top/) component;
   6. [click-jacking-protector](./app/src/components/common.blocks/specific/click-jacking-protector/) for each page(you can configure it in [template](./app/src/layouts/basic/main-layout/main-layout.pug));
   7. [global error catcher](./app/src/utils/global/modules/scripts/unhandledrejection.ts) for unhandled errors.

## In the process of adding

---

- React support;
- jsdoc/typedoc integration;
- audio, video assets optimization;
- [additional image optimization](https://github.com/mixtur/webpack-spritesmith).

## License

This project is licensed under the terms of the [MIT license](LICENSE).
