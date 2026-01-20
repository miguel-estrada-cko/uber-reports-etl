const { createDefaultPreset } = require('ts-jest')

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        ...tsJestTransformCfg,
    },
    coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '/__tests__/'],
}
