## ADDED Requirements

### Requirement: Explicit component-ref method surface
The component SHALL expose exactly the supported FilePond file-operation methods `addFile`, `addFiles`, `browse`, `getFile`, `getFiles`, `moveFile`, `prepareFile`, `prepareFiles`, `processFile`, `processFiles`, `removeFile`, `removeFiles`, and `sort` through a mounted Vue component ref.

#### Scenario: Consumer accesses supported ref methods
- **WHEN** a consumer obtains the component ref after FilePond mounts on a supported client
- **THEN** each listed file-operation method is callable on the component ref

#### Scenario: Wrapper-owned methods remain private
- **WHEN** a consumer inspects the public component-ref method surface
- **THEN** FilePond `setOptions`, event-subscription, DOM-placement, replacement, restoration, and destruction methods are not exposed as FilePond proxies

### Requirement: Delegated method behavior
Each exposed component-ref method SHALL forward all arguments to the method of the same name on the current FilePond instance and SHALL return its result without transformation.

#### Scenario: Synchronous method delegation
- **WHEN** a consumer calls `getFiles` through the mounted component ref
- **THEN** FilePond receives the call and the consumer receives FilePond's current file collection

#### Scenario: Asynchronous method delegation
- **WHEN** a consumer calls an asynchronous method such as `addFiles` through the mounted component ref
- **THEN** all arguments and the original Promise result are preserved

#### Scenario: Removal method delegation
- **WHEN** a consumer calls `removeFiles` through the mounted component ref
- **THEN** FilePond receives the supplied queries or options and its result is returned unchanged

### Requirement: FilePond fields are isolated from the Vue instance
The component MUST NOT enumerate or copy FilePond option fields, state fields, arbitrary instance fields, or keys beginning with `$` onto the Vue component instance.

#### Scenario: Option fields coexist with Vue props
- **WHEN** the FilePond instance exposes enumerable `disabled` and `server` fields
- **THEN** those fields are not assigned from FilePond to the Vue component and the Vue props remain framework-owned

#### Scenario: Reserved Vue keys coexist with FilePond keys
- **WHEN** the FilePond instance exposes enumerable `$attrs`, `$listeners`, or another `$`-prefixed key
- **THEN** the corresponding Vue component internals are neither replaced nor mutated

#### Scenario: Future FilePond field is introduced
- **WHEN** FilePond or a plugin adds an enumerable field not present in the explicit method allowlist
- **THEN** the field does not become part of the Vue component ref API

### Requirement: Type declarations match the runtime API
The published Vue component-ref declaration SHALL positively select the same supported FilePond methods exposed at runtime and SHALL NOT model FilePond option or state fields as proxied instance members.

#### Scenario: TypeScript consumer calls an allowed method
- **WHEN** a TypeScript consumer calls a supported file-operation method on a typed component ref
- **THEN** the call uses the corresponding FilePond method signature and return type

#### Scenario: TypeScript consumer accesses an excluded FilePond member
- **WHEN** a TypeScript consumer tries to use an excluded FilePond lifecycle, DOM, event-subscription, option, or state member as a proxied ref API
- **THEN** the public declaration does not advertise that member as a FilePond proxy
