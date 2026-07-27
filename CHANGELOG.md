# Changelog

## Unreleased

- **Breaking:** component refs now expose only the documented FilePond file-operation methods: `addFile`, `addFiles`, `browse`, `getFile`, `getFiles`, `moveFile`, `prepareFile`, `prepareFiles`, `processFile`, `processFiles`, `removeFile`, `removeFiles`, and `sort`.
- Configure FilePond options with Vue props; FilePond option and state fields are no longer copied onto component refs.
- Update the development and regression-test baseline to Vue 2.7.16.

## 6.0.3

- FilePond esm version also imports vue esm version

## 6.0.2

- Fix TypeScript issue with `vueFilePond(plugins)` call


## 6.0.1

- Fix TypeScript issue with `vueFilePond()` call


## 6.0.0

- Add TypeScript Types


## 5.1.3

- Fix FilePond detach handling


## 5.1.2

- Fix issue with 'input' event.


## 5.1.1

- Add `detached` method, the component now waits to be removed from the DOM, it then destroys the FilePond instance (the `destroyed` and `beforeDestroy` methods both run while the component is still in the DOM when using transitions).


## 5.1.0

- Add v-model support


## 5.0.0

- Update `filepond` peer dependency to match version 4.0.0
- Add example folder
