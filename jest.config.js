const { createDefaultPreset } = require('ts-jest')

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        ...tsJestTransformCfg,
    },
    collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/__tests__/**', '!src/**/*.d.ts'],
    coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '/__tests__/'],
}
