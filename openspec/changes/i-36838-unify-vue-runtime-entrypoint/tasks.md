## 1. Browser-Bundler Regression Baseline

- [x] 1.1 Add a pinned Webpack 5 development dependency and regenerate the lockfile without changing the Vue or FilePond peer ranges.
- [x] 1.2 Add a browser-target fixture that imports both `vue` and `vue-filepond` through their package roots and resolves the local package through its published metadata.
- [x] 1.3 Add a focused compilation test that inspects un-concatenated Webpack module stats and fails against the current UMD browser entry/CommonJS Vue runtime graph.

## 2. Package Resolution and ESM Generation

- [x] 2.1 Remove the package `browser` field while retaining the UMD `main`, ESM `module`, and minified UMD `unpkg` entries.
- [x] 2.2 Remove the ESM build-script replacement of `import Vue from 'vue'` with `vue/dist/vue.esm`, leaving the source's bare peer import unchanged.
- [x] 2.3 Regenerate `dist/vue-filepond.js`, `dist/vue-filepond.min.js`, and `dist/vue-filepond.esm.js` from the updated package build.
- [x] 2.4 Verify the generated ESM file imports bare `vue`, contains no Vue deep import, and the UMD/minified entrypoints remain available for their existing consumers.

## 3. Resolution and Compatibility Validation

- [x] 3.1 Run the Webpack regression and confirm the package root resolves to `dist/vue-filepond.esm.js` with exactly one `vue.runtime.esm.js` module and no CommonJS or compiler-inclusive Vue runtime.
- [x] 3.2 Add or run focused CommonJS and package-metadata checks proving `main` still loads the UMD distribution and `unpkg` still identifies the minified UMD distribution.
- [x] 3.3 Run the complete runtime tests, type tests, and package build, then confirm the generated bundle diff is limited to the intended entrypoint/import changes.
- [x] 3.4 Run strict OpenSpec validation for `i-36838-unify-vue-runtime-entrypoint` and record any validation that could not be executed.
