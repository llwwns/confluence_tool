fs = require 'fs'
util = require './util'
if process.argv[2]
  data = JSON.parse fs.readFileSync 'content.json', 'utf8'
  if data.id && process.argv[2]
    util.upload_attachment data.id, process.argv[2], (res) -> console.log res
