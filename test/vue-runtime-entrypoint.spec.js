const fs = require('fs');
const os = require('os');
const path = require('path');
const webpack = require('webpack');

if (!global.setImmediate) {
    global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
}

const fixture = path.resolve(__dirname, 'fixtures/vue-runtime-entrypoint');
const packageRoot = path.resolve(__dirname, '..');

const compileFixture = outputPath => new Promise((resolve, reject) => {
    const fixtureNodeModules = path.join(outputPath, 'node_modules');
    fs.mkdirSync(fixtureNodeModules);
    fs.symlinkSync(packageRoot, path.join(fixtureNodeModules, 'vue-filepond'), 'dir');

    webpack({
        context: fixture,
        mode: 'development',
        target: 'web',
        entry: './index.js',
        output: {
            path: outputPath,
            filename: 'bundle.js'
        },
        resolve: {
            modules: [fixtureNodeModules, path.resolve(packageRoot, 'node_modules')],
            symlinks: false
        },
        optimization: {
            concatenateModules: false
        }
    }, (error, stats) => {
        if (error) {
            reject(error);
            return;
        }

        const json = stats.toJson({
            all: false,
            errors: true,
            errorsCount: true,
            modules: true
        });

        if (stats.hasErrors()) {
            reject(new Error(json.errors.map(({ message }) => message).join('\n')));
            return;
        }

        resolve(json);
    });
});

describe('published browser runtime entrypoint', () => {
    it('shares the application Vue runtime through the package root', async () => {
        const outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-filepond-webpack-'));

        try {
            const stats = await compileFixture(outputPath);
            const modules = stats.modules || [];
            const moduleNames = modules.map(({ name, identifier }) => name || identifier || '');
            const vueRuntimeModules = moduleNames.filter(name => /vue[\\/]dist[\\/]vue\.runtime\.esm\.js$/.test(name));

            expect(moduleNames.some(name => /vue-filepond[\\/]dist[\\/]vue-filepond\.esm\.js$/.test(name))).toBe(true);
            expect(vueRuntimeModules).toHaveLength(1);
            expect(moduleNames.some(name => /vue[\\/]dist[\\/]vue\.runtime\.common\.js$/.test(name))).toBe(false);
            expect(moduleNames.some(name => /vue[\\/]dist[\\/]vue\.esm\.js$/.test(name))).toBe(false);
        } finally {
            fs.rmSync(outputPath, { recursive: true, force: true });
        }
    });
});
