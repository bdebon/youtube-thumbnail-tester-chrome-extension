#!/usr/bin/env node

const readline = require('readline')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

// Charger les variables d'environnement
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath })
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('📋 Configuration OAuth pour Chrome Web Store\n')

// Utiliser les variables d'environnement si disponibles
const envClientId = process.env.CHROME_CLIENT_ID
const envClientSecret = process.env.CHROME_CLIENT_SECRET

if (envClientId && envClientSecret) {
    console.log('✅ Credentials trouvés dans .env')
    console.log(`   Client ID: ${envClientId.substring(0, 20)}...`)
    console.log(`   Client Secret: ${envClientSecret.substring(0, 10)}...\n`)
    
    rl.question('Utiliser ces credentials ? (O/n): ', (answer) => {
        if (answer.toLowerCase() === 'n') {
            askForCredentials()
        } else {
            processAuth(envClientId, envClientSecret)
        }
    })
} else {
    console.log('ℹ️  Pas de fichier .env trouvé ou credentials manquants')
    console.log('   Créez un fichier .env basé sur .env.example pour éviter de retaper les credentials\n')
    askForCredentials()
}

function askForCredentials() {
    rl.question('Client ID: ', (clientId) => {
        rl.question('Client Secret: ', (clientSecret) => {
            processAuth(clientId, clientSecret)
        })
    })
}

function processAuth(clientId, clientSecret) {
        const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${clientId}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`
        
        console.log('\n🔗 Ouvrez cette URL dans votre navigateur:')
        console.log(authUrl)
        
        // Essayer d'ouvrir automatiquement
        const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
        spawn(opener, [authUrl], { detached: true })
        
        console.log('\n✅ Autorisez l\'accès et copiez le code qui s\'affiche\n')
        
        rl.question('Code d\'autorisation: ', (authCode) => {
            const postData = new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: authCode,
                grant_type: 'authorization_code',
                redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
            }).toString()
            
            const options = {
                hostname: 'oauth2.googleapis.com',
                port: 443,
                path: '/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length
                }
            }
            
            const req = https.request(options, (res) => {
                let data = ''
                
                res.on('data', (chunk) => {
                    data += chunk
                })
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data)
                        if (response.refresh_token) {
                            console.log('\n🎉 Succès ! Voici votre refresh token:')
                            console.log('\n' + response.refresh_token + '\n')
                            console.log('📌 Ajoutez-le comme secret GitHub: CHROME_REFRESH_TOKEN')
                        } else {
                            console.error('\n❌ Erreur:', response)
                        }
                    } catch (e) {
                        console.error('\n❌ Erreur de parsing:', data)
                    }
                    rl.close()
                })
            })
            
            req.on('error', (e) => {
                console.error('\n❌ Erreur de requête:', e)
                rl.close()
            })
            
            req.write(postData)
            req.end()
        })
}