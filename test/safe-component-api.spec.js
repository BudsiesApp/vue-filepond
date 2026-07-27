const Vue = require('vue');
const { mount } = require('@vue/test-utils');

const componentMethods = [
    'addFile',
    'addFiles',
    'browse',
    'getFile',
    'getFiles',
    'moveFile',
    'prepareFile',
    'prepareFiles',
    'processFile',
    'processFiles',
    'removeFile',
    'removeFiles',
    'sort'
];

const createFakePond = () => {
    const pond = {
        disabled: 'pond-disabled',
        server: 'pond-server',
        status: 'pond-status',
        arbitraryField: 'not-public',
        $attrs: 'not-vue-attrs',
        $listeners: 'not-vue-listeners',
        setOptions: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        appendTo: jest.fn(),
        destroy: jest.fn()
    };

    componentMethods.forEach(method => {
        pond[method] = jest.fn(function (...args) {
            return { method, args, receiver: this };
        });
    });

    return pond;
};

const loadComponent = pond => {
    jest.resetModules();
    const filepond = {
        OptionTypes: {
            disabled: 'boolean',
            server: 'serverapi',
            onaddfile: 'function'
        },
        create: jest.fn(() => pond),
        registerPlugin: jest.fn(),
        supported: jest.fn(() => true)
    };

    jest.doMock('filepond', () => filepond);
    const createComponent = require('../lib').default;
    return { Component: createComponent(), filepond };
};

describe('safe FilePond component API', () => {
    let originalWarnHandler;
    let warnings;

    beforeEach(() => {
        originalWarnHandler = Vue.config.warnHandler;
        warnings = [];
        Vue.config.warnHandler = message => warnings.push(message);
    });

    afterEach(() => {
        Vue.config.warnHandler = originalWarnHandler;
        jest.dontMock('filepond');
    });

    it('delegates allowed methods with their FilePond receiver and return value', () => {
        const pond = createFakePond();
        const { Component } = loadComponent(pond);
        const wrapper = mount(Component, {
            propsData: { disabled: true, server: { process: '/api' } }
        });
        const asyncResult = Promise.resolve('added');
        pond.addFiles.mockReturnValue(asyncResult);

        componentMethods.forEach(method => {
            expect(typeof wrapper.vm[method]).toBe('function');
        });
        expect(wrapper.vm.getFiles('query')).toEqual({
            method: 'getFiles',
            args: ['query'],
            receiver: pond
        });
        expect(pond.getFiles).toHaveBeenCalledWith('query');
        expect(wrapper.vm.addFiles(['first'], { index: 0 })).toBe(asyncResult);
        expect(pond.addFiles).toHaveBeenCalledWith(['first'], { index: 0 });

        expect(wrapper.vm.disabled).toBe(true);
        expect(wrapper.vm.server).toEqual({ process: '/api' });
        expect(wrapper.vm.status).toBeUndefined();
        expect(wrapper.vm.arbitraryField).toBeUndefined();
        expect(wrapper.vm.setOptions).toBeUndefined();
        expect(wrapper.vm.on).toBeUndefined();
        expect(wrapper.vm.appendTo).toBeUndefined();
        expect(wrapper.vm.$attrs).not.toBe('not-vue-attrs');
        expect(wrapper.vm.$listeners).not.toBe('not-vue-listeners');
        expect(warnings).toEqual([]);

        wrapper.destroy();
        expect(pond.destroy).toHaveBeenCalledTimes(1);
        expect(wrapper.vm._pond).toBeNull();
    });

    it('updates FilePond options from props and forwards callbacks as Vue events', async () => {
        const pond = createFakePond();
        pond.getFiles.mockReturnValue(['current-file']);
        const { Component, filepond } = loadComponent(pond);
        const wrapper = mount(Component, {
            propsData: { disabled: true, server: { process: '/api' } }
        });
        const options = filepond.create.mock.calls[0][1];

        options.onaddfile('error', 'file');
        expect(wrapper.emitted('addfile')).toEqual([['error', 'file']]);
        expect(wrapper.emitted('input')).toEqual([[['current-file']]]);

        const server = { process: '/changed-api' };
        await wrapper.setProps({ disabled: false, server });
        expect(pond.disabled).toBe(false);
        expect(pond.server).toBe(server);
        expect(warnings).toEqual([]);

        wrapper.destroy();
        expect(pond.destroy).toHaveBeenCalledTimes(1);
    });
});
