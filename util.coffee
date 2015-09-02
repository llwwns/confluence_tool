config = require './config'
rest = require 'restler'
fs = require 'fs'
exports.remove_comment = (str) ->
  lines = str.split /\n|\r\n/
  res = ""
  is_comment = false
  for line in lines
    if is_comment
      if line.match /--##/
        is_comment = false
        if line.match /--##.+/
          res += (line.match /--##(.+)/)[1] + "\n"
    else
      if line.match /(.*)##--.*--##(.*)/
          match = line.match /(.*)##--.*--##(.*)/
          res += match[1] + match[2] + "\n"
      else if line.match /##--/
        is_comment = true
        if line.match /(.+)##--/
          res += (line.match /(.+)##--/)[1] + "\n"
      else
        res += line + "\n"
  res
    
exports.short_str = (str) ->
  if (str && str.length > 128)
    return str.slice(0, 128) + "..."
  str
exports.get_page = (id, callback) ->
  rest.get config.root + '/rest/api/content/' + id,
    query:
      expand:'body.storage,version,ancestors'
    username:config.username
    password:config.password
  .on 'complete',  (data) -> callback data

exports.create_page = (data, callback) ->
  rest.postJson config.root + '/rest/api/content/', data,
    username:config.username
    password:config.password
  .on 'complete',  (data) -> callback data

exports.update_page = (id, data, callback) ->
  rest.putJson config.root + '/rest/api/content/' + id, data ,
    username:config.username
    password:config.password
  .on 'complete', (data) -> callback data

exports.convert_wiki = (text, callback) ->
  rest.postJson config.root + '/rest/api/contentbody/convert/storage',
    value: text,
    representation: "wiki"
  ,
    username:config.username
    password:config.password
  .on 'complete',  (data) -> callback data.value
exports.convert_view = (text, callback) ->
  rest.postJson config.root + '/rest/api/contentbody/convert/view',
    value: text,
    representation: "storage"
  ,
    username:config.username
    password:config.password
  .on 'complete',  (data) -> callback data.value
exports.upload_attachment = (id, file, callback) ->
  size = fs.statSync(file).size
  console.log rest.file file, null, size
  rest.post config.root + '/rest/api/content/' + id + '/child/attachment',
    username:config.username
    password:config.password
    multipart:true
    data:
      file:rest.file(file, null, size)
    headers: 'X-Atlassian-Token': 'no-check'
  .on 'complete', (data) -> callback data
