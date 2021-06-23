module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
    "globals": {
        "ts-jest": {
            "tsconfig": "tsconfig.json"
        }
    },
    "moduleFileExtensions": ["ts","js"],
    "transform": {
        "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js"
    }
};
