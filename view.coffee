fs = require 'fs'
util = require './util'

fs.readFile 'conquest.txt', 'utf8',  (err,wiki) ->
  wiki = wiki.trim()
  util.convert_wiki wiki, (storage) ->
    util.convert_view storage, (text) ->
      console.log text
