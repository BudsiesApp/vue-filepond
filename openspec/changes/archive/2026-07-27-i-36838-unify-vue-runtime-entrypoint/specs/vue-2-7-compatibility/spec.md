## ADDED Requirements

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
