## Context

The package publishes three distribution forms: a UMD file through `main` and `browser`, an ESM file through `module`, and a minified UMD file through `unpkg`. In a browser-targeted Webpack 5 build, `browser` outranks `module`, so importing the package root selects the UMD file. Webpack interprets that wrapper's `require('vue')` as a CommonJS/AMD dependency and resolves `vue.runtime.common.js`, while an application ESM import resolves `vue.runtime.esm.js`.

Vue 2.7 keeps `isUpdatingChildComponent` as module-local state. A parent update performed by the ESM runtime therefore does not suppress readonly `$attrs` and `$listeners` warnings from setters created by the CommonJS runtime. The existing source-level component fix remains valid, but its direct-source Jest tests cannot represent this published-package resolution boundary.

The current ESM build is not yet a safe replacement because its build command rewrites the source's bare Vue import to `vue/dist/vue.esm`. That deep import selects Vue's full compiler build instead of sharing the application's runtime-only ESM module.

## Goals / Non-Goals

**Goals:**

- Make module-aware browser bundlers select the package's ESM distribution.
- Make the ESM distribution delegate Vue selection to the consumer through a bare `vue` peer import.
- Guarantee that a Webpack browser graph containing application Vue and `vue-filepond` contains one Vue runtime module.
- Preserve the UMD `main` entry for CommonJS/SSR consumers and the minified `unpkg` entry for standalone scripts.
- Keep generated distributions, manifest metadata, and regression coverage aligned.

**Non-Goals:**

- Add native Node ESM conditional exports or rename distributions to `.mjs` and `.cjs`.
- Convert the UMD build to ESM or remove standalone-script support.
- Change the Vue peer range, component API, FilePond behavior, or downstream application code.
- Add an application-level Vue alias as the durable fix.
- Expand the change into general package-build modernization.

## Decisions

### Remove the `browser` string entry and allow `module` to win

Remove the root `browser` field while retaining `main`, `module`, and `unpkg`. Webpack and other module-aware browser bundlers can then select `dist/vue-filepond.esm.js` through `module`; Node/CommonJS consumers continue selecting `dist/vue-filepond.js` through `main`.

Pointing `browser` directly at the ESM file was considered. It fixes Webpack deterministically but can make browser-oriented CommonJS tools such as Browserify consume syntax they do not support. Removing `browser` preserves their fallback to the existing UMD `main` entry while allowing module-aware bundlers to prefer ESM.

Adding a conditional `exports` map was also considered. It would provide explicit native Node `import` and `require` routing, but it introduces a larger compatibility boundary for older bundlers and any deep-import consumers. Native Node ESM support is not required to fix the Vue 2 browser runtime split.

### Preserve the bare Vue import in the ESM distribution

Generate `dist/vue-filepond.esm.js` from `lib/index.js` without replacing `import Vue from 'vue'`. Because Vue remains a peer dependency, both the application and wrapper then make the same bare request in an ESM dependency context, allowing the consumer's bundler to resolve and deduplicate one Vue runtime.

Keeping `vue/dist/vue.esm` was rejected because it selects Vue's compiler-inclusive ESM build and remains distinct from applications using Vue's default `vue.runtime.esm.js` module.

### Test the published package boundary with Webpack

Add a focused Webpack 5 browser-target regression using a fixture that imports both `vue` and the `vue-filepond` package root. Resolve the local package through its root metadata, disable module concatenation for observable stats, and inspect compilation modules rather than relying on Node's `require.resolve`, which intentionally follows `main`.

The test will assert that:

- the package root resolves to `dist/vue-filepond.esm.js`;
- Vue resolves to exactly `vue.runtime.esm.js` for both importer paths; and
- `vue.runtime.common.js`, its development/production children, and `vue.esm.js` are absent.

Using only manifest-string assertions or a generic resolver was rejected because neither proves the dependency type and transitive module graph that caused the downstream warning. The regression should avoid writing committed output; it can use an in-memory output filesystem or an isolated temporary directory cleaned by the test harness.

### Rebuild every tracked distribution

Run the existing build after changing metadata/build behavior and commit the UMD, minified UMD, and ESM artifacts together. The UMD outputs are expected to remain functionally equivalent, while the ESM output must contain the bare Vue import. Rebuilding all configured artifacts preserves the repository's source/distribution consistency and archive-consumer behavior.

## Risks / Trade-offs

- [A browser tool honors `browser` but not `module`] → Removing `browser` makes it fall back to the UMD `main`, preserving the previous consumable format rather than exposing unsupported ESM syntax.
- [A future build script reintroduces a deep Vue import] → Assert the ESM module graph and generated import in the focused distribution regression.
- [Webpack regression dependencies increase development install size] → Keep the harness focused, pin the selected Webpack major/version through the lockfile, and avoid adding an application framework test stack.
- [A resolver configuration intentionally prioritizes `main` over `module`] → Treat that custom mixed-runtime configuration as consumer-controlled; the package guarantees its standard module-aware browser path without adding an application alias.
- [Generated archives do not run `prepare`] → Commit regenerated `dist` files and test the tracked package shape used by archive consumers.

## Migration Plan

1. Add the bundler regression dependency and failing package-resolution fixture against the current manifest/distributions.
2. Remove the `browser` entry and the ESM build-time Vue deep-import replacement.
3. Rebuild every distribution artifact and run runtime, type, build, and bundler-resolution validation.
4. Update the downstream archive/branch pin after the corrected commit is available; no downstream source patch is required.

Rollback consists of reverting the manifest, build script, test dependency/lockfile, regression fixture, and generated distributions together.

## Open Questions

None. Native Node ESM conditional exports remain explicitly deferred.
