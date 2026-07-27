## Why

`vue-filepond` 6.0.3 copies every enumerable FilePond instance key onto its Vue component instance. Under Vue 2.7.16 this attempts to overwrite props such as `disabled` and `server` and readonly Vue internals such as `$attrs` and `$listeners`, producing warnings and exposing FilePond state as an accidental component API.

## What Changes

- Replace broad FilePond instance enumeration and assignment with an explicit proxy for supported public FilePond file-operation methods.
- Keep option and state fields, `$`-prefixed keys, FilePond lifecycle methods, DOM-placement methods, and event-subscription methods off the Vue component instance.
- Preserve prop-driven FilePond option updates and FilePond callback-to-Vue event behavior.
- Align the published TypeScript component-ref surface with the explicit runtime method allowlist.
- Upgrade the development and regression-test baseline to Vue 2.7.16 and add focused mounting coverage for `disabled`, `server`, warnings, option updates, events, and public ref methods.
- Rebuild the distributed browser, minified, and ESM bundles from the corrected source.
- **BREAKING**: Code relying on undocumented FilePond option or state fields copied onto the Vue component ref must use Vue props instead.

## Capabilities

### New Capabilities

- `safe-filepond-component-api`: Defines the public FilePond methods exposed through a Vue component ref and prevents FilePond fields or reserved Vue keys from being copied onto the component.
- `vue-2-7-compatibility`: Defines Vue 2.7.16 mounting, option-update, callback/event, warning-free, typing, and distribution compatibility expectations.

### Modified Capabilities

None.

## Impact

- Runtime component implementation in `lib/index.js`.
- Public declarations and type fixtures in `types/`.
- Root development dependencies, lockfile, test configuration, and package scripts.
- New focused Vue 2.7.16 regression tests using a DOM-capable test environment.
- Generated files in `dist/`.
- The Vue peer range remains compatible with Vue 2.6 and Vue 2.7; the development and regression baseline becomes exactly Vue 2.7.16.
