#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const manifestPath = path.join(__dirname, '..', 'manifest.json')
const packagePath = path.join(__dirname, '..', 'package.json')

function bumpVersion(type = 'patch') {
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        
        // Parse manifest version (e.g., "1.6" -> major: 1, minor: 6)
        const [major, minor] = manifest.version.split('.').map(Number)
        
        let newMajor = major
        let newMinor = minor
        
        if (type === 'major') {
            newMajor = major + 1
            newMinor = 0
        } else if (type === 'minor' || type === 'patch') {
            newMinor = minor + 1
        }
        
        const newManifestVersion = `${newMajor}.${newMinor}`
        const newPackageVersion = `0.${newManifestVersion}`
        
        // Update manifest.json
        manifest.version = newManifestVersion
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
        
        // Update package.json
        packageJson.version = newPackageVersion
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
        
        console.log(`✅ Version bumped:`)
        console.log(`   manifest.json: ${newManifestVersion}`)
        console.log(`   package.json: ${newPackageVersion}`)
        
        return newManifestVersion
    } catch (error) {
        console.error('❌ Error bumping version:', error)
        process.exit(1)
    }
}

const type = process.argv[2] || 'patch'
bumpVersion(type)