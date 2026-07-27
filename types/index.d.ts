// TypeScript Version: 3.6
import Vue, { ComponentOptions } from "vue"
import { FilePondOptionProps, FilePondCallbackProps, FilePond } from "filepond";

type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;

/** Props for the component */
type VueFilepondProps = Except<FilePondOptionProps, keyof FilePondCallbackProps>;

/** FilePond methods intentionally exposed through a component ref */
type VueFilePondMethod =
    'addFile' |
    'addFiles' |
    'browse' |
    'getFile' |
    'getFiles' |
    'moveFile' |
    'prepareFile' |
    'prepareFiles' |
    'processFile' |
    'processFiles' |
    'removeFile' |
    'removeFiles' |
    'sort';

type VueFilePondDeclaredMethod = Extract<VueFilePondMethod, keyof FilePond>;

type VueFilePondInstanceMethods = Pick<FilePond, VueFilePondDeclaredMethod> & {
    prepareFile: (query?: FilePond['getFile'] extends (query?: infer Query) => any ? Query : never) => Promise<any>;
    prepareFiles: (...queries: Array<FilePond['getFile'] extends (query?: infer Query) => any ? Query : never>) => Promise<any[]>;
};

/** Reference type for typed $refs */
export type VueFilePondComponent = Vue & VueFilePondInstanceMethods;

declare const VueFilePond: (...plugins: any[]) => ComponentOptions<any, VueFilePondInstanceMethods, any, VueFilepondProps>

export default VueFilePond;
