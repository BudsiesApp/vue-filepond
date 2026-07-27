module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/test/**/*.spec.js'],
    setupFiles: ['<rootDir>/test/setup.js'],
    transform: {
        '^.+\\.js$': ['babel-jest', {
            configFile: false,
            presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
        }]
    }
};
