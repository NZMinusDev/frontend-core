# ![Frontend-core](header.png)

## Description

---

It's simple bare bones repository for frontend developers using [BEM](https://en.bem.info/).

## Demo

---

_Here you can write link for your runtime project_.

## Use

---

### What do you need to start

1. Package manager [NPM](https://www.npmjs.com/) and [NodeJs](https://nodejs.org/en/) platform.
2. Some CLI to execute commands from directory of your project (bash recommended).
3. Clean VS Code editor.

### Installation

Just clone this repository and execute:

```bash
npm i
```

### Usage

In package.json you can see scripts which let to use this bundle executing

```bash
npm run {script-name}.
```

Script-names:

- start - builds bundles and runs server to be upgraded;
- dev - just builds bundles and place it into _dist_ directory;
- build - build minify bundles and place it into _dist_ directory;
- stats - visualize size of webpack output files with an interactive zoomable treemap using webpack-bundle-analyzer;
- ext - install necessary VS Code extensions.

## Inside

---

### Project tree

```tree
│   .gitignore
│   LICENSE
│   package-lock.json
│   package.json
│   README.md
│
├───.vscode
│       settings.json // VS Code workspace settings for compatibility (it's redefines users settings)
│
├───app
│   ├───cache
│   │   └───webpack__ImageMinimizerPlugin
│   ├───dist
│   │   │   favicon.ico
│   │   │   index.html
│   │   │   room-details.html
│   │   │   search-room.html
│   │   │   ui-kit.html
│   │   │
│   │   ├───assets
│   │   │   └───images
│   │   │       └───backgrounds
│   │   │           └───test
│   │   │                   test.jpg // minified img
│   │   │                   test.webp // the same img in webp (was jpg in src)
│   │   │
│   │   └───bundles //  chunked bundles
│   │       ├───index // index page imports
│   │       ├───index_head // index page imports in head section
│   │       ├───index_head~room-details_head~search-room_head~ui-kit_head // shared imports in head
│   │       ├───lazy-load~index~to-ui-kit // lazy load of uniq for index page imports to ui-kit page
│   │       ├───lazy-load~room-details~to-index
│   │       ├───lazy-load~search-room~to-index
│   │       ├───lazy-load~ui-kit~to-index
│   │       ├───room-details
│   │       ├───room-details_head
│   │       ├───search-room
│   │       ├───search-room_head
│   │       ├───ui-kit
│   │       ├───ui-kit_head
│   │       ├───vendors~index~lazy-load~index~to-ui-kit // shared imports between "index" imported files and "lazy-load~index~to-ui-kit"
│   │       └───vendors~index~room-details~search-room~ui-kit // shared imports for all pages
|   |
│   ├───log
│   │       stats.json // webpack --stats for webpack-bundle-analyzer
│   │
│   ├───src
│   │   ├───assets
│   │   │   ├───contents // content assets
│   │   │   └───images // decorative assets
│   │   │       ├───backgrounds
│   │   │       │       test.jpg
│   │   │       │
│   │   │       └───ico
│   │   │               favicon.ico
│   │   │
│   │   ├───components // our blocks
│   │   │   ├───adaptive
│   │   │   │   ├───desktop.blocks // desktop redefinition level
│   │   │   │   ├───large_desktop.blocks // large_desktop redefinition level
│   │   │   │   ├───mobile.blocks // mobile redefinition level
│   │   │   │   └───tablet.blocks // tablet redefinition level
│   │   │   ├───common.blocks // project redefinition level - it's the second lvl
│   │   │   │   ├───basic
│   │   │   │   │   ├───aside
│   │   │   │   │   │       aside.pug
│   │   │   │   │   │       aside.scss
│   │   │   │   │   │
│   │   │   │   │   ├───footer
│   │   │   │   │   │       footer.pug
│   │   │   │   │   │       footer.scss
│   │   │   │   │   │
│   │   │   │   │   ├───header
│   │   │   │   │   │       header.pug
│   │   │   │   │   │       header.scss
│   │   │   │   │   │
│   │   │   │   │   ├───main
│   │   │   │   │   │       main.pug
│   │   │   │   │   │       main.scss
│   │   │   │   │   │
│   │   │   │   │   └───modal
│   │   │   │   │           modal.pug
│   │   │   │   │           modal.scss
│   │   │   │   │
│   │   │   │   ├───containers
│   │   │   │   │   └───menu // block
│   │   │   │   │       │   menu.decl.ts // declaration for scss/ts/md includes of whole block
│   │   │   │   │       │   menu.pug // use it in another pug template somewhere
│   │   │   │   │       │   menu.scss
│   │   │   │   │       │
│   │   │   │   │       └───__item // element
│   │   │   │   │           │   menu__item.pug
│   │   │   │   │           │   menu__item.scss
│   │   │   │   │           │
│   │   │   │   │           └───_selected // menu modificator
│   │   │   │   │                   menu__item_selected.scss
│   │   │   │   │
│   │   │   │   ├───primitives
│   │   │   │   │   └───button
│   │   │   │   │       │   button.pug
│   │   │   │   │       │   button.scss
│   │   │   │   │       │
│   │   │   │   │       ├───_type_reset
│   │   │   │   │       │       button_type_reset.scss
│   │   │   │   │       │
│   │   │   │   │       └───_type_submit
│   │   │   │   │               button_type_submit.scss
│   │   │   │   │
│   │   │   │   └───specific
│   │   │   │       └───feedback-form
│   │   │   │               feedback-form.pug
│   │   │   │               feedback-form.scss
│   │   │   ├───experimental
│   │   │   │   ├───experiment-1.blocks // redefinition level for experiments (while project in production) - it's the last lvl
│   │   │   │   └───experiment-2.blocks
│   │   │   ├───library.blocks // library redefinition level - it's the first lvl
│   │   │   └───thematic
│   │   │       └───main-theme.blocks // redefinition level for decorations - penultimate lvl
│   │   │
│   │   ├───libs // this is where libraries live (for example, real well-made libraries)
│   │   ├───pages
│   │   │   ├───index
│   │   │   │       index.decl.ts
│   │   │   │       index.pug
│   │   │   │       index.ts
│   │   │   │
│   │   │   ├───room-details
│   │   │   │       room-details.decl.ts
│   │   │   │       room-details.pug
│   │   │   │       room-details.ts
│   │   │   │
│   │   │   ├───search-room
│   │   │   │       search-room.decl.ts
│   │   │   │       search-room.pug
│   │   │   │       search-room.ts
│   │   │   │
│   │   │   └───ui-kit
│   │   │           ui-kit.decl.ts
│   │   │           ui-kit.pug
│   │   │           ui-kit.ts
│   │   │
│   │   └───utils // this is the place where you live useful bits and pieces
│   │       └───head-templates
│   │               head-template.decl.ts // declaration for includes in head section of each page
│   │               head-template.scss
│   │
│   └───tests
└───configs
        .eslintrc.js
        .prettierrc.js
        .tsconfig.js
        webpack.config.js
```

### How it's collected to bundle

You can see explanation [here](https://en.bem.info/methodology/redefinition-levels/).

### Technologies

1. Shared VS Code settings.
2. VS code extensions which increase comfort:
   1. GitLens.
   2. PowerShell.
   3. Ayu.
   4. Material Icon Theme.
   5. All Autocomplete.
   6. Auto Complete Tag.
   7. Bracket Pair Colorizer.
   8. Code Spell Checker.
   9. TODO Highlight.
   10. ESLint.
   11. Prettier - Code formatter.
   12. VSCode Map Preview.
   13. SVG.
   14. markdownlint.
   15. Sort Lines by Selection.
   16. Live Server.
   17. JavaScript (ES6) code snippets.
   18. Webpack Snippets.
3. Preprocessors which speed up work:
   1. Pug.
   2. SCSS.
   3. TypeScript
4. Webpack which kill your headaches:
   1. Generate html without having to connect scripts and styles in the correct order.
   2. [Normalize.css](https://necolas.github.io/normalize.css/) into each page.
   3. Convert modern CSS into something most browsers can understand using [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) and [Autoprefixer](https://www.npmjs.com/package/autoprefixer).
   4. [Next generation JavaScript, today](https://babeljs.io/).
   5. Compression of images, scripts, styles, html in production mode. Tip: Each image also will have **.webp** clone.
   6. Split common imports into separate files for the best client performance.
   7. Useful alias for comfortable import management.
   8. Hot reloaded dev server.
5. ESLinter using [Airbnb standarts](https://github.com/airbnb/javascript) integrated with prettier and typescript which protects your knee from :gun: and your life from wasting :clock2:.

## Future scope

---

- React support;
- jsdoc/typedoc;
- audio, video support;
- [additional image optimization](https://github.com/mixtur/webpack-spritesmith);
- creating a declaration via an introspection of the file structure.

## License

This project is licensed under the terms of the [MIT license](LICENSE).
