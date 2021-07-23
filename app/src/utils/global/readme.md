# Folder description

```tree
│   global.decl.ts // used in webpack for adding modules
│   readme.md
│
└───modules
    ├───css
    │       fonts.ts // preinstalled fonts
    │       normalize.css // [normalization](https://necolas.github.io/normalize.css/) of browsers' styles in depends of browserslist in package.json
    │       reset.local.css // resetting of the most infuriating styles
    │
    └───scripts
            assets-lazy-loading.ts // adds placeholder for images/sources outside of view
            input.ts // bonds inputs with URL
            keyboardAccessibility.ts // adds keyboard accessibility for all elements that do not support basic keyboard presses
            unhandledrejection.ts // top level catcher of errors
 
```