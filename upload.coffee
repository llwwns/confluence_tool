fs = require 'fs'
util = require './util'
if process.argv[2]
  data = JSON.parse fs.readFileSync 'content.json', 'utf8'
  if data.id && process.argv.length > 1
    process.argv.slice(2).forEach (e) ->
      util.upload_attachment data.id, e, console.log
