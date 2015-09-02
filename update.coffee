fs = require 'fs'
util = require './util'
wait = (callback) ->
  reader = require('readline').createInterface
    input: process.stdin
    output: process.stdout
  reader.question 'Press enter to continue.',  (ans) ->
    callback()
    reader.close()

data = JSON.parse fs.readFileSync 'content.json', 'utf8'
if !data.id
  fs.readFile data.file, 'utf8',  (err,wiki) ->
    wiki = util.remove_comment wiki.trim()
    
    console.log util.short_str wiki
    console.log "create page"
    wait () ->
      util.convert_wiki wiki, (text) ->
        data.body =
          storage:
            value:text,
            representation:"storage"
        util.create_page data, (res)->
          data.id = res.id
          delete data.body
          fs.writeFileSync 'content.json', JSON.stringify data, null, 4
          if res.body.storage.value
            res.body.storage.value = util.short_str res.body.storage.value
          console.log res
          process.exit 0
else
  util.get_page data.id, (page)->
    ver = page.version.number
    fs.readFile data.file, 'utf8',  (err,wiki) ->
      wiki = util.remove_comment wiki.trim()
      console.log util.short_str wiki
      console.log "update page"
      wait () ->
        util.convert_wiki wiki, (text) ->
          data.body =
            storage:
              value:text,
              representation:"storage"
          data.version = number:ver + 1
          util.update_page data.id, data, (res)->
            if res.body.storage.value
              res.body.storage.value = util.short_str res.body.storage.value
            console.log res
            process.exit 0
