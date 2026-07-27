## Why

Browser bundlers currently resolve `vue-filepond` through its UMD `browser` entry, causing the wrapper's `require('vue')` dependency to load Vue's CommonJS runtime alongside an application's ESM Vue runtime. Vue 2.7 stores child-update guards inside each runtime instance, so parent-driven FilePond prop updates can incorrectly emit `$attrs` or `$listeners` readonly warnings even though both runtimes have the same version.

## What Changes

- Make module-aware browser consumers resolve the ESM `vue-filepond` distribution instead of the UMD browser distribution.
- Preserve the source-level bare `import Vue from 'vue'` in the generated ESM distribution rather than rewriting it to `vue/dist/vue.esm`.
- Retain the UMD distribution for CommonJS `main` consumers and the minified standalone `unpkg` entry.
- Add a real browser-bundler resolution regression that proves the application and `vue-filepond` share one Vue runtime module.
- Rebuild and commit all tracked distribution files without changing the component API or requiring a downstream application alias.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `vue-2-7-compatibility`: Extend distribution compatibility requirements to guarantee a shared Vue runtime in module-aware browser bundles while preserving the CommonJS and standalone entrypoints.

## Impact

- Package entrypoint metadata and build scripts in `package.json`.
- Generated browser, minified, and ESM files in `dist/`.
- Root development/test dependencies and lockfile for the browser-bundler regression harness.
- Focused distribution-resolution tests.
- Downstream browser bundles will select the ESM wrapper and deduplicate Vue with the application's bare `vue` import; CommonJS and standalone-script consumers retain their existing entrypoints.
