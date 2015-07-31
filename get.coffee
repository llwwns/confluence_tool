fs = require 'fs'
util = require './util'

data = JSON.parse fs.readFileSync 'content.json', 'utf8'
if data.id
  util.get_page data.id, (page)->
    if page.body.storage.value
      page.body.storage.value = util.short_str page.body.storage.value
      if page._links
        for val in process.argv
          if val == '-u'
            console.log page._links.base + page._links.webui
            process.exit 0
      console.log page
