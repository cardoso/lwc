// @ts-check

import { defineConfig, configDefaults } from 'vitest/config';

import plugins from './vitest-plugins';

import { test as testConfig } from './vitest-config';

export default defineConfig({
    plugins: plugins('test'),
    test: {
        name: 'lwc-karma:test',
        dir: 'test',
        include: ['**/*.spec.{js,ts}'],
        exclude: [...configDefaults.exclude, '**/__screenshots__/**'],
        globals: true,
        passWithNoTests: true,
        expandSnapshotDiff: false,
        setupFiles: ['./vitest-setup/index.ts'],
        ...testConfig,
    },
});
