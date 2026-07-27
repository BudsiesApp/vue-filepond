## ADDED Requirements

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
