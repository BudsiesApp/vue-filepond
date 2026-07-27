const Vue = require('vue');
const { mount } = require('@vue/test-utils');
const createComponent = require('../lib').default;

describe('Vue 2.7 FilePond integration', () => {
    let originalWarnHandler;
    let warnings;

    beforeEach(() => {
        originalWarnHandler = Vue.config.warnHandler;
        warnings = [];
        Vue.config.warnHandler = message => warnings.push(message);
    });

    afterEach(() => {
        Vue.config.warnHandler = originalWarnHandler;
    });

    it('mounts with disabled and server props and exposes supported methods', async () => {
        const FilePond = createComponent();
        const wrapper = mount(FilePond, {
            attachTo: document.body,
            propsData: {
                disabled: true,
                server: { process: '/api' }
            }
        });

        expect(wrapper.vm.getFiles()).toEqual([]);
        await wrapper.vm.addFiles([]);
        await wrapper.vm.removeFiles();
        expect(warnings).toEqual([]);

        wrapper.destroy();
        expect(wrapper.vm._pond).toBeNull();
    });
});
