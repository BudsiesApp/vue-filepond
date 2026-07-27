const fs = require('fs');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const manifest = require('../package.json');

describe('published package entries', () => {
    it('keeps the CommonJS main and standalone unpkg distributions', () => {
        expect(manifest.main).toBe('dist/vue-filepond.js');
        expect(manifest.module).toBe('dist/vue-filepond.esm.js');
        expect(manifest.unpkg).toBe('dist/vue-filepond.min.js');
        expect(manifest.browser).toBeUndefined();

        expect(require.resolve(packageRoot)).toBe(path.join(packageRoot, manifest.main));
        expect(require(packageRoot)).toEqual(expect.objectContaining({
            default: expect.any(Function),
            setOptions: expect.any(Function)
        }));
        expect(fs.existsSync(path.join(packageRoot, manifest.unpkg))).toBe(true);
    });
});
