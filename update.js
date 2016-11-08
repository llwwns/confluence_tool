const fs = require('fs');
const util = require('./util');
const co = require('co');

const wait = () => new Promise((resolve, reject) => {
    const reader = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return reader.question('Press enter to continue.', () => {
        resolve();
        reader.close();
    });
});

co(function*() {
    let data = JSON.parse(fs.readFileSync('content.json', 'utf8'));
    if (!data.id) {
        let wiki = fs.readFileSync(data.file, 'utf8')
        wiki = util.remove_comment(wiki.trim());
        console.log(util.short_str(wiki));
        console.log("create page");
        yield  wait();
        console.log("convert_wiki");
        const {value} = yield util.convert_wiki(wiki);
        data.body = {
            storage: {
                value: value,
                representation: "storage"
            }
        };
        console.log("create page");
        const res = yield util.create_page(data);
        if (res.body && res.body.storage && res.body.storage.value) {
            res.body.storage.value = util.short_str(res.body.storage.value);
        }
        console.log(res);
        data.id = res.id;
        delete data.body;
        fs.writeFileSync('content.json', JSON.stringify(data, null, 4));
        process.exit(0);
    } else {
        const page = yield util.get_page(data.id);
        const ver = +page.version.number;
        let wiki = fs.readFileSync(data.file, 'utf8');
        wiki = util.remove_comment(wiki.trim());
        console.log(util.short_str(wiki));
        console.log("update page");
        yield wait();
        const {value} = yield util.convert_wiki(wiki);
        data.body = {
            storage: {
                value: value,
                representation: "storage"
            }
        };
        console.log(`ver = ${ver}`);
        data.version = {
            number: ver + 1
        };
        const res = yield util.update_page(data.id, data);
        if (res.body && res.body.storage && res.body.storage.value) {
            res.body.storage.value = util.short_str(res.body.storage.value);
        }
        console.log(res);
        process.exit(0);
    }
}).catch(console.log);
