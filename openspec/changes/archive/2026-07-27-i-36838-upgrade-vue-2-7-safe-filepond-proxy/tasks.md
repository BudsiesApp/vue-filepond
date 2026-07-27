## 1. Vue 2.7 Test Baseline

- [x] 1.1 Update the root development dependency to exact Vue 2.7.16, add matching `vue-template-compiler` 2.7.16, Vue Test Utils 1.x, Jest/Babel/jsdom test dependencies, and preserve the existing Vue and FilePond peer ranges.
- [x] 1.2 Add root runtime-test and type-test scripts plus the minimal Jest, Babel, and jsdom configuration needed to import and mount the JavaScript render-function component.
- [x] 1.3 Regenerate and review the root lockfile so the new test stack resolves Vue 2.7.16 without unrelated FilePond or application dependency upgrades.

## 2. Safe Component-Ref API

- [x] 2.1 Add the explicit 13-method FilePond component-ref allowlist and Vue-owned delegates that forward arguments and return values through the current `_pond` instance.
- [x] 2.2 Remove the FilePond method blacklist and all `Object.keys(this._pond)` component-instance copying from the source.
- [x] 2.3 Add controlled-instance tests proving synchronous and Promise-returning delegation, receiver preservation, and exclusion of lifecycle, DOM-placement, event-subscription, option, state, arbitrary, and `$`-prefixed fields.

## 3. Vue 2.7 Behavioral Compatibility

- [x] 3.1 Add a real Vue 2.7.16/FilePond regression test that mounts with `disabled` and `server`, captures Vue warnings, and verifies `getFiles`, `addFiles`, and `removeFiles` remain usable through the component ref.
- [x] 3.2 Add tests proving post-mount `disabled` and `server` prop changes still update the FilePond instance without prop-mutation or readonly-internal warnings.
- [x] 3.3 Add tests proving mapped FilePond callbacks still emit the corresponding Vue event and `input` with the current file collection.
- [x] 3.4 Run the focused runtime suite and confirm mounts, method calls, prop updates, callbacks, and teardown complete without leaked Vue warning handlers or FilePond instances.

## 4. Public Types

- [x] 4.1 Replace the blacklist-derived component-ref method type with a positive selection of the same 13 FilePond methods exposed at runtime.
- [x] 4.2 Update TypeScript fixtures to exercise allowed method signatures and reject excluded FilePond lifecycle, option, and state members where supported by the declaration shape.
- [x] 4.3 Run the type test with the Vue 2.7.16 declarations and resolve only incompatibilities caused by this change.

## 5. Documentation and Distribution

- [x] 5.1 Update the README and changelog to list the supported component-ref methods and direct consumers to Vue props instead of accidental FilePond option/state fields.
- [x] 5.2 Run the complete runtime tests, type tests, and existing package build successfully.
- [x] 5.3 Regenerate the browser, minified, and ESM distribution bundles and verify none contains the former FilePond instance enumeration/component-assignment pattern.
- [x] 5.4 Review the final source, declarations, tests, manifest, lockfile, documentation, and generated-bundle diff for scope consistency and record any unexecuted validation.
