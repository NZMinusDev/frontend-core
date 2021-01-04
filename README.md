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
3. Clean VS Code editor.

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

_* - inside the directories, there are additional folders for each individual redefinition sublevel. To connect them, you need to modify webpack.config_.

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
   15. Prettier - Code formatter.
   16. Image preview.
   17. VSCode Map Preview.
   18. SVG.
   19. markdownlint.
   20. Sort Lines by Selection.
   21. Live Server.
   22. Import Cost.
   23. JavaScript (ES6) code snippets.
   24. Webpack Snippets.
3. Preprocessors which speed up work:
   1. Pug.
   2. SCSS.
   3. TypeScript
4. Webpack which kill your headaches:
   1. Pages only need to be created, and the collector can determine the entry points on its own. Scripts and styles connect to the page themselves, and the order of connection is always correct. Resources used by multiple pages are loaded only 1 time.
   2. The normalization of the initial styles through [Normalize.css](https://necolas.github.io/normalize.css/) for each page based on the browsers specified as supported.
   3. No need to remember a bunch of css prefixes and what properties are supported where thanks to [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) and [Autoprefixer](https://www.npmjs.com/package/autoprefixer).
   4. [Modern JavaScript, today](https://babeljs.io/).
   5. Compression of images, scripts, styles, html in production mode. Note: Each image will also have a**. webp* * clone, which further reduces the final size.
   6. There is no need to write relative paths for import when there are excellent aliases for the most popular paths in development.
   7. During development, when changing pug/cs/ts, the result is immediately visible without manual reboots and builds.
   8. During the build, webpack will notify you if: there are circular dependencies, libraries of different versions are connected, there are unused files, there are css properties that browsers do not support. Displays the speed of source processing at each stage of the build.
   9. If the source code is changed, the user device will know about it and download only the latest version of the project (provided by hashing the output files).
   10. It works the same on different platforms.
5. ESLinter using [Airbnb standarts](https://github.com/airbnb/javascript) integrated with prettier and typescript which protects your knee from :gun: and your life from wasting :clock2:.
6. Pre-installed libraries:
   1. fontawesome-free and material-icons-regular;
   2. jquery to support old projects;
   3. inputmask for form validation;
   4. lodash-es to supplement the js standard.
7. Custom Tools:
   1. Basic pug layers and mixins;
   2. scss and ts shortcuts.

## In the process of adding

---

- React support;
- jsdoc/typedoc integration;
- audio, video assets optimization;
- [additional image optimization](https://github.com/mixtur/webpack-spritesmith).

## License

This project is licensed under the terms of the [MIT license](LICENSE).
