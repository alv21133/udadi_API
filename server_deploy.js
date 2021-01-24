const { Ignitor } = require('@adonisjs/ignitor')
const path = require('path')
const https = require('https')
const fs = require('fs')

// Certificate
const options = {
    key: fs.readFileSync(path.join(__dirname, '/home/fishdev/udadifish.com.key')),
    cert: fs.readFileSync(path.join(__dirname, '/home/fishdev/bundle.crt'))
}

new Ignitor(require('@adonisjs/fold'))
    .appRoot(__dirname)
    .fireHttpServer((handler) => {
        return https.createServer(options, handler)
    })
    .catch(console.error)

