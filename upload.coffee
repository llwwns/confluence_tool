fs = require 'fs'
util = require './util'
if process.argv[2]
  data = JSON.parse fs.readFileSync 'content.json', 'utf8'
  if data.id && process.argv.length > 1
    for i in [2...process.argv.length]
      util.upload_attachment data.id, process.argv[i], (res) -> console.log res
