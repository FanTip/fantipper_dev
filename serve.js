'use strict'
require('greenlock-express').create({
  version : 'draft-11',
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  email : 'ggkpmalith@gmail.com',
  agreeTos : true,
  approvedDomains: [ 'fantipper.com.au', 'www.fantipper.com.au' ], 
  configDir: '~/.config/acme/', 
  communityMember: true, 
  telemetry: false                  
, app: require('./app.js')
}).listen(80, 443)