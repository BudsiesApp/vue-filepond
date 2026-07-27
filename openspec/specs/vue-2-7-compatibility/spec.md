# vue-2-7-compatibility Specification

## Purpose
TBD - created by archiving change i-36838-upgrade-vue-2-7-safe-filepond-proxy. Update Purpose after archive.

## Requirements

### Requirement: Vue 2.7.16 development baseline
The package SHALL use Vue 2.7.16 as its exact development and regression-test version while retaining a public Vue peer range that supports compatible Vue 2.6 and Vue 2.7 consumers.

#### Scenario: Development dependencies are installed
- **WHEN** the root package dependencies are installed from the committed manifest and lockfile
- **THEN** the component and its tests resolve Vue 2.7.16 and a matching Vue compiler package where required by the test tooling

#### Scenario: Vue 2.6 consumer resolves the package
- **WHEN** a consumer uses a compatible Vue 2.6 release
- **THEN** the package peer dependency continues to accept that Vue 2 release

### Requirement: Warning-free Vue 2.7 mount with FilePond options
The component MUST mount under Vue 2.7.16 with `disabled` and `server` props without producing Vue warnings caused by prop mutation or writes to readonly Vue internals.

#### Scenario: Disabled and server are supplied at mount
- **WHEN** the component mounts with `disabled` enabled and a valid `server` configuration
- **THEN** FilePond receives both initial options and Vue emits no prop-mutation, `$attrs`, or `$listeners` readonly warning

#### Scenario: Public methods are used after optioned mount
- **WHEN** the consumer calls `getFiles`, `addFiles`, and `removeFiles` through the ref of that mounted component
- **THEN** the methods delegate successfully without changing the Vue-owned option props

### Requirement: Reactive option updates remain supported
After FilePond mounts, changes to Vue option props SHALL update the corresponding FilePond instance options without copying FilePond state back onto the component.

#### Scenario: Disabled prop changes
- **WHEN** the parent changes the component's `disabled` prop after mount
- **THEN** the FilePond instance receives the new `disabled` value and Vue emits no prop-mutation warning

#### Scenario: Server prop changes
- **WHEN** the parent replaces the component's `server` prop after mount
- **THEN** the FilePond instance receives the new server configuration and the Vue prop remains parent-owned

### Requirement: Callback and Vue event behavior remains compatible
FilePond callback options SHALL continue to emit the callback-derived Vue event and the component's `input` event with the current FilePond file collection.

#### Scenario: FilePond callback runs
- **WHEN** FilePond invokes a mapped callback with callback arguments
- **THEN** the component emits the matching Vue event with those arguments and emits `input` with the current files

### Requirement: Published bundles contain the compatible implementation
All distributed browser, minified, and ESM bundles SHALL be rebuilt from the corrected Vue 2.7-compatible source and SHALL omit broad FilePond instance-key copying.

#### Scenario: Package build completes
- **WHEN** maintainers run the package build after the source change
- **THEN** every configured distribution bundle is generated successfully

#### Scenario: Generated bundles are inspected
- **WHEN** the generated bundles are searched for the former FilePond instance enumeration and component assignment pattern
- **THEN** no distribution bundle contains that broad-copy behavior

### Requirement: Module-aware browser bundles share the application Vue runtime
The package SHALL resolve through its ESM distribution in a module-aware browser bundle, and that distribution MUST use a bare `vue` peer import so the application and `vue-filepond` share one Vue runtime module.

#### Scenario: Browser bundler resolves the package root
- **WHEN** a Webpack browser-target build imports `vue-filepond` through the package root using standard module-aware resolution
- **THEN** the package resolves to `dist/vue-filepond.esm.js` rather than the UMD `dist/vue-filepond.js` entry

#### Scenario: Application and wrapper both import Vue
- **WHEN** a browser bundle includes an application `import Vue from 'vue'` and the ESM `vue-filepond` distribution
- **THEN** both imports resolve to the same `vue.runtime.esm.js` module and the bundle contains no `vue.runtime.common.js` or `vue.esm.js` runtime

#### Scenario: Parent updates a FilePond prop
- **WHEN** the application Vue runtime updates a prop such as `disabled` or `files` on a mounted FilePond component
- **THEN** the component uses the same Vue child-update guard and emits no `$attrs` or `$listeners` readonly warning caused by a split runtime

### Requirement: ESM distribution preserves consumer-controlled Vue resolution
The generated ESM distribution MUST retain `import Vue from 'vue'` and MUST NOT rewrite Vue to a deep distribution import.

#### Scenario: ESM distribution is generated
- **WHEN** maintainers run the package build
- **THEN** `dist/vue-filepond.esm.js` imports the bare `vue` peer and contains no import from `vue/dist/vue.esm` or another Vue distribution file

### Requirement: Alternate distribution formats remain available
The package SHALL retain its UMD entry for CommonJS consumers and its minified standalone entry while changing the module-aware browser resolution path.

#### Scenario: CommonJS consumer resolves the package
- **WHEN** a CommonJS or Node consumer loads `vue-filepond` through `main`
- **THEN** it receives `dist/vue-filepond.js` and resolves Vue through the consumer's CommonJS peer dependency

#### Scenario: Standalone consumer resolves the package
- **WHEN** a standalone-script consumer uses the package's `unpkg` metadata
- **THEN** it receives the minified UMD distribution at `dist/vue-filepond.min.js`
