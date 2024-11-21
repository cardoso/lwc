/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { globSync } = require('glob');

(async () => {
    const newVersion = process.argv[2] || (await promptVersion());
    updatePackages(newVersion);
})().catch(console.error);

async function promptVersion() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        const answer = await new Promise((resolve) =>
            rl.question('Enter a new LWC version: ', resolve)
        );
        return answer;
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        rl.close();
    }
}

function updatePackages(newVersion) {
    try {
        const packagesToUpdate = getPackagesToUpdate();

        for (const { packageJson } of packagesToUpdate) {
            packageJson.version = newVersion;
        }

        // Update package.json files and print updated packges
        for (const { originalVersion, packageJson, packageJsonPath } of packagesToUpdate) {
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
            console.log(
                `Updated ${packageJson.name} from ${originalVersion} to ${packageJson.version}`
            );
        }
    } catch (error) {
        console.error(error);
    }
}

function getPackagesToUpdate() {
    const rootPath = path.resolve(__dirname, '../../');
    const rootPackageJsonPath = `${rootPath}/package.json`;
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
    const packagesToUpdate = [];

    const workspacePkgs = rootPackageJson.workspaces.reduce(
        (accWorkspacePkgs, workspace) => {
            const workspacePkg = globSync(`${workspace}/package.json`);
            return [...accWorkspacePkgs, ...workspacePkg];
        },
        [rootPackageJsonPath]
    );

    for (const pkgName of workspacePkgs) {
        const packageJsonPath = path.resolve(rootPath, pkgName);
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            packagesToUpdate.push({
                originalVersion: packageJson.version,
                packageJsonPath,
                packageJson,
            });
        }
    }

    return packagesToUpdate;
}
