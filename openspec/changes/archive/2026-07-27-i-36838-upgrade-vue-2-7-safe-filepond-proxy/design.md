## Context

The Vue 2 wrapper builds its prop and callback surface dynamically from FilePond `OptionTypes`, creates a FilePond instance during `mounted`, and currently enumerates every key on that instance. A blacklist removes a handful of lifecycle and DOM methods, but all remaining methods, option fields, state fields, and reserved-looking keys are assigned directly to the Vue instance.

Vue 2.7.16 protects component props and internals more visibly than the current Vue 2.6.11 development baseline. Assigning FilePond's `disabled` and `server` fields mutates Vue props, while assigning `$attrs` or `$listeners` targets readonly Vue internals. The wrapper's intended public contract is narrower: FilePond options enter through Vue props, FilePond callbacks leave through Vue events, and supported file-operation methods are callable through the component ref.

The repository has no root runtime test harness. It publishes generated browser, minified, and ESM bundles and includes TypeScript declarations derived from a blacklist of the FilePond interface.

## Goals / Non-Goals

**Goals:**

- Make Vue 2.7.16 the exact development and regression-test baseline while retaining the existing Vue 2 peer compatibility range.
- Expose only the supported FilePond file-operation methods through the component ref.
- Prevent all FilePond option fields, state fields, and `$`-prefixed keys from being copied to the Vue instance.
- Preserve FilePond method arguments, return values, thrown errors, and Promise behavior.
- Preserve prop-driven option updates, global option updates, callback mapping, Vue events, and component-owned FilePond destruction.
- Keep runtime code, TypeScript declarations, tests, and generated bundles aligned.

**Non-Goals:**

- Add Vue 3 support or convert the component to the Composition API.
- Upgrade FilePond or change its option, callback, or plugin behavior.
- Expose FilePond lifecycle, DOM-placement, event-subscription, or instance `setOptions` methods through the component ref.
- Modernize the example application, Vue CLI, build pipeline, package-lock format, or ESM Vue import beyond changes required to install and validate Vue 2.7.16.
- Promise useful ref-method behavior before FilePond has mounted or on an unsupported client.

## Decisions

### Define Vue-owned delegates from an explicit method allowlist

Create a single explicit allowlist containing:

`addFile`, `addFiles`, `browse`, `getFile`, `getFiles`, `moveFile`, `prepareFile`, `prepareFiles`, `processFile`, `processFiles`, `removeFile`, `removeFiles`, and `sort`.

Build the component's Vue `methods` option from this allowlist. Each method will call the method of the same name on `this._pond` with all received arguments and return its result unchanged. Calling through `this._pond` retains the FilePond receiver instead of relying on copied function references.

This removes all enumeration and assignment of FilePond instance keys. A mounted allowlisted assignment was considered, but Vue-owned delegates are safer because the component surface is established declaratively and cannot be expanded by FilePond options, plugins, or future instance fields.

### Keep framework-owned integration paths separate

FilePond options continue to be initialized from global options, mapped callbacks, fallthrough attributes, and Vue props. Existing generated prop watchers continue updating the corresponding `_pond` option. Callback options continue emitting `input` and the callback-derived Vue event. `setOptions`, FilePond event subscription, DOM placement, and destruction remain controlled by the wrapper's existing integration and lifecycle paths.

No `$`-prefix filter is needed at runtime because no FilePond keys are enumerated or assigned. Tests will nevertheless include reserved and option/state fields to make the safety invariant explicit.

### Derive TypeScript method exposure from the same positive contract

Replace the blacklist-derived `VueFilePondInstanceMethods` type with a positive union of the 13 exposed method names and a `Pick<FilePond, ...>`-style surface. Vue option props remain represented separately by `VueFilepondProps`. Type fixtures will assert the allowed methods and reject excluded FilePond lifecycle/state access where the declaration shape permits negative assertions.

### Add focused real and controlled-instance tests

Use Vue 2.7.16, matching `vue-template-compiler` 2.7.16, Vue Test Utils 1.x, Jest, Babel transformation, and jsdom at the root.

A real FilePond mounting regression will pass `disabled` and `server`, capture Vue warnings, and exercise component-ref methods. Focused controlled-instance coverage will make option/state and `$`-prefixed keys enumerable on a fake pond so the test fails if broad copying returns. Additional assertions will cover prop watcher updates and callback-to-Vue event behavior.

Testing the JavaScript render-function component avoids adding an SFC transformer. The compiler package remains because Vue Test Utils 1.x declares it as a peer and uses compiler-only APIs.

### Preserve the published peer range and rebuild distributions

Set the root development dependency to exactly Vue 2.7.16, but retain `vue >=2.6.0 <3.x` as the public peer range because the corrected Options API component remains compatible with Vue 2.6. FilePond remains at the existing development version and peer range.

After source and tests pass, regenerate all tracked distribution bundles with the existing build pipeline and verify that the broad `Object.keys(this._pond)` copy is absent from every bundle.

## Risks / Trade-offs

- [Consumers may rely on accidental option/state fields on the component ref] → Document that configuration belongs in Vue props and call out the removal in the changelog/release notes.
- [An explicit allowlist can lag behind a future FilePond public method] → Keep one named allowlist shared conceptually by runtime, declarations, and tests; adding a method becomes an intentional compatibility decision.
- [Vue-owned methods exist before `_pond` is initialized] → Document and test the supported lifecycle only: ref methods are callable after mount on supported clients, matching normal component-ref usage.
- [Real FilePond behavior can be sensitive to jsdom browser support] → Keep one integration regression for the actual warning and method path, with controlled-instance tests for deterministic API-boundary assertions.
- [Adding tests with the current npm 11 toolchain may rewrite the v1 lockfile] → Review lockfile changes separately and avoid unrelated dependency upgrades.
- [Generated bundles can drift from source] → Make build output verification part of the required validation and inspect all bundle variants for the removed broad-copy pattern.

## Migration Plan

1. Add the Vue 2.7.16-compatible root test dependencies and scripts, then regenerate the lockfile with reviewed scope.
2. Add the failing real and controlled-instance regressions against the current broad-copy implementation.
3. Introduce the explicit runtime method delegates and remove the blacklist/enumeration copy.
4. Align TypeScript declarations and fixtures with the allowlist.
5. Run runtime tests, type checks, and the production build; inspect generated bundles.
6. Document the component-ref surface cleanup and rebuild committed distribution artifacts.

Rollback consists of reverting the source, dependency, lockfile, test, declaration, documentation, and generated bundle changes together so source and published artifacts never disagree.

## Open Questions

None. The public method set, Vue version, compatibility range, and regression behaviors are defined by this change.
