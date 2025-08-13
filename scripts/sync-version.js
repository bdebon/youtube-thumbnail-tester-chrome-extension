#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const manifestPath = path.join(__dirname, '..', 'manifest.json')
const packagePath = path.join(__dirname, '..', 'package.json')

function syncVersions() {
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        
        const manifestVersion = manifest.version
        const packageVersion = `0.${manifestVersion}`
        
        if (packageJson.version !== packageVersion) {
            packageJson.version = packageVersion
            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
            console.log(`✅ Synced package.json version to ${packageVersion}`)
        } else {
            console.log(`✅ Versions already in sync: ${packageVersion}`)
        }
    } catch (error) {
        console.error('❌ Error syncing versions:', error)
        process.exit(1)
    }
}

syncVersions()