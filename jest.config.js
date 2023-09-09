const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    moduleNameMapper: {
        "@engine-core/(.*)": "<rootDir>/src/renderer/engine/core/$1"

    },
};
