const fs = require('fs');
const util = require('./util');

const data = JSON.parse(fs.readFileSync('content.json', 'utf8'));

if (data.id) {
    util.get_page(data.id).then((page) => {
        if (page.body && page.body.storage && page.body.storage.value) {
            page.body.storage.value = util.short_str(page.body.storage.value);
            if (page._links && process.argv.some((e) => e === '-u')) {
                console.log(page._links.base + page._links.webui);
                process.exit(0);
            }
            return console.log(page);
        } else {
            throw page;
        }
    }).catch(console.log);
}
