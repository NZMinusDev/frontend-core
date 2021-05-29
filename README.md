# Frontend-core

![Frontend-core](./app/src/assets/readme/root/logo.png)

## Description

---

It's simple bare bones repository for frontend developers using [BEM](https://en.bem.info/).

## Demo

---

_Here you can place gifs demonstation of your project's work_.

## Playground

---

_If you need you can place playground link here_.

## Usage

---

_Place here API, settings, plug in, etc paragraphs description_.

## Contribution

---

### What do you need to start

1. Package manager [NPM](https://www.npmjs.com/) and [NodeJs](https://nodejs.org/en/) platform.
2. Some CLI to execute commands from directory of your project (bash is recommended).
3. Clean VS Code editor(optional).

### Installation

```bash
git clone [link]
cd [path]
npm i
```

### Managing

In [package.json](./package.json) you can find useful scripts for managing the project. To run script, use the following command:

```bash
npm run {script-name}
```

Script-names:

- **start** - builds bundles and runs server to be upgraded;
- **dev** - just builds bundles and place it into [dist](./app/dist) directory;
- **build** - build minify bundles and place it into [dist](./app/dist) directory + run _types_ script;
- **types** - generate d.ts files and place it into [dist/types](./app/dist/types) directory;
- **UML** - generate .puml files and place it into [src](./app/src/components) directory. P.S.: you should work [with your hands](https://plantuml.com/en/class-diagram) a little cause of the [tool](https://github.com/bafolts/tplant) has bugs(["default" isn't keyword](https://github.com/bafolts/tplant/issues/66), [error when output directory doesn't exist](https://github.com/bafolts/tplant/issues/51), [Missing Aggregation/Composition](https://github.com/bafolts/tplant/issues/48), etc);
- **test** - run jest tests(matches .spec. or .test. files), P.S.: it can work in a separate console in parallel with **start** script;
- **analyze** - visualize size of webpack output files with an interactive zoomable treemap using webpack-bundle-analyzer;
- **ext** - install necessary VS Code extensions.

### Project tree

```tree

```

### How it's collected to bundle

For each page, only the necessary styles and scripts are loaded from all levels of redefinition. This is achieved by analyzing the class names in the template (page / html) and automatically adding the corresponding files by matching the name.

You can see explanation [here](https://en.bem.info/methodology/redefinition-levels/).

The order of redefinition levels is as follows: library -> common -> thematic* -> experimental*.

_\* - inside the directories, there are additional folders for each individual redefinition sublevel. To connect them, you need to modify webpack.config_.

### Technologies

1. [Shared VS Code settings](./.vscode/settings.json).
2. VS code extensions which increase comfort:
   1. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens).
   2. [PowerShell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell).
   3. [Ayu](https://marketplace.visualstudio.com/items?itemName=teabyii.ayu).
   4. [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme).
   5. [CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek).
   6. [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css).
   7. [Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete).
   8. [Auto Complete Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-complete-tag).
   9. [Change-Case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case).
   10. [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer).
   11. [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker).
   12. [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight).
   13. [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode).
   14. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
   15. [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
   16. [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview).
   17. [VSCode Map Preview](https://marketplace.visualstudio.com/items?itemName=jumpinjackie.vscode-map-preview).
   18. [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg).
   19. [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint).
   20. [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml).
   21. [Sort Lines by Selection](https://marketplace.visualstudio.com/items?itemName=earshinov.sort-lines-by-selection).
   22. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
   23. [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost).
   24. [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets).
   25. [Webpack Snippets](https://marketplace.visualstudio.com/items?itemName=gogocrow.webpack-snippets).
3. Preprocessors which speed up work:
   1. [Pug](https://pugjs.org/api/getting-started.html).
   2. [SCSS](https://sass-lang.com/).
   3. [TypeScript](https://www.typescriptlang.org/).
4. [Webpack](https://v4.webpack.js.org/concepts/) which kill your headaches:
   1. [Pages](./app/src/pages/) only need to be created, and the collector can determine the entry points on its own. Scripts and styles connect to the page themselves, and the order of connection is always correct. Resources used by multiple pages are loaded only 1 time.
   2. Connect images and use auxiliary modules directly in the [templates](./app/src/pages/cards/cards.pug).
   3. The normalization of the initial styles through [Normalize.css](https://necolas.github.io/normalize.css/) for each page based on the browsers specified as supported.
   4. No need to remember a bunch of css prefixes and what properties are supported thanks to [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) and [Autoprefixer](https://www.npmjs.com/package/autoprefixer).
   5. Users with mobile devices will not download code that is only intended for personal computers(use the mobile first approach: inside scss, specify [nested @media](./app/src/components/common.blocks/basic/footer/__copyright-bar/footer__copyright-bar.scss), and for scripts use [webpack magic comments with match media](); P.S.: use pre-configured snippets: [1](./.vscode/@media-snippets.code-snippets), [2]()).
   6. [Modern JavaScript, today](https://babeljs.io/).
   7. Compression of images, scripts, styles, html in production mode. Note: Each image will also have a\*_. webp_ \* clone, which further reduces the final size and only the necessary elements will be taken from the script modules, and not the code of the entire module.
   8. There is no need to write relative paths for import when there are [excellent aliases](./configs/webpack.config.js) for the most popular paths in development.
   9. During development, when changing files, the result is immediately visible without manual reboots and builds.
   10. During the build, webpack will notify you if: there are circular dependencies, libraries of different versions are connected, there are unused files, there are css properties that browsers do not support. Displays the speed of source processing at each stage of the build.
   11. If the source code is changed, the user device will know about it and download only the latest version of the project (provided by hashing the output files).
   12. It should work the same on different platforms.
5. [ESLinter](https://eslint.org/) based on [Airbnb standarts](https://github.com/airbnb/javascript) integrated with prettier and typescript which protects your knee from :gun: and your life from wasting :clock2:.
6. [Jest](https://jestjs.io/): delightful JavaScript Testing Framework with a focus on simplicity, it works fine with TypeScript.
7. Pre-installed libraries:
   1. [fontawesome-free](https://fontawesome.com/) and [material-icons-regular](https://github.com/google/material-design-icons).
   2. [JQuery](https://jquery.com/).
   3. [lodash-es](https://lodash.com/) to supplement the js standard. Tip: you should use only import of lodash-es(moreover, when importing, only care about the readability and strictness of the code, and not the optimization of the weight) instead of common lodash because ES6+ module syntax is supported by terser for optimization.
   4. [inputmask](https://github.com/RobinHerbots/Inputmask) for form validation.
   5. [js-cookie](https://github.com/js-cookie/js-cookie): a simple, lightweight JavaScript API for handling cookies.
   6. [JSBI](https://github.com/GoogleChromeLabs/jsbi): BigInt replacement that works in today’s environments.
   7. [es6-promisify](https://github.com/mikehall314/es6-promisify): converts callback-based functions to ES6/ES2015 Promises, using a boilerplate callback function.
   8. [idb](https://github.com/jakearchibald/idb): adds fine IndexedDB API.
   9. [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket): webSocket that will automatically reconnect if the connection is closed.
8. Custom Tools:
   1. Basic [pug layers](./app/src/layouts/) and [mixins](./app/src/pug/mixins/);
   2. scss and ts [shortcuts](./app/src/utils/devTools/);
   3. pug and scss snippets: [1](./.vscode/template-snippetts.code-snippets), [2](./.vscode/@media-snippets.code-snippets);
   4. [placeholder](./app/src/assets/pictures/images/placeholders/lazy-loading-placeholder.svg) for unloaded img (img [would be loaded](./app/src/utils/global/modules/scripts/assets-lazy-loading.ts) by user's scroll);
   5. [arrow-to-top](./app/src/components/common.blocks/specific/arrow-to-top/) component;
   6. [click-jacking-protector](./app/src/components/common.blocks/specific/click-jacking-protector/) for each page(you can configure it in [template](./app/src/layouts/basic/main-layout/main-layout.pug));
   7. [global error catcher](./app/src/utils/global/modules/scripts/unhandledrejection.ts) for unhandled errors.
   8. [Keyboard accessibility](./app/src/utils/global/modules/scripts/keyboardAccessibility.ts) for elements that do not support basic keyboard presses.

### How it works

_Place UML here_.

## In the process of adding

---

- jsdoc/typedoc integration;
- audio, video assets optimization;
- [additional image optimization](https://github.com/mixtur/webpack-spritesmith).

## License

This project is licensed under the terms of the [MIT license](LICENSE).
