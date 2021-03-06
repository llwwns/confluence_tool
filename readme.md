# Dependency

1. Install node.js

2. Cd into the directory and install modules by `npm install`

# How to use

## Create configuation

Copy the config\_sample. to config.js and fix configuations.

## Create a new page / Update page:

A confluence page contains with two files: content.cwk and content.json

The content.cwk is the content of the page, written by [confluence-wiki](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html).

The content.json is a config file with the page title, file name of content.cwk, ancestors' page id, content type, space key and page id.

Sample:

```json
{
    "title": "Page Title",
    "file": "./content.cwk",
    "ancestors": [{
        "type": "page",
        "id": 000001
    }],
    "type": "page",
    "space": {
        "key": "s00001"
    },
    "id": 000002
}
```

If the id is empty, update.js will create a new page and automatically fill the id.

If id is privided, update.js will update the confluence page.

Usege:

Cd into the page's directory and run:

```
node path_to_script/update.js
```

## Upload attachments

Make sure this content.json with the id filled.

```
node path_to_script/upload.js file_name ...
```

## Get page infomation

Make sure this content.json with the id filled.

Get all infomation:

```
node path_to_script/get.js
```

Get url:

```
node path_to_script/get.js -u
```

# For cygwin user

Because nodejs does not support cygwin, install win32 version instead and make sure the path of nodejs and npm in cygwin's $PATH

The path of npm may be a path like this:

```
/cygdrive/c/Users/user_name/AppData/Roaming/npm
```

