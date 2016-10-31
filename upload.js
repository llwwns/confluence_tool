const fs = require('fs');
const util = require('./util');

if (process.argv[2]) {
    data = JSON.parse(fs.readFileSync('content.json', 'utf8'));
    let tasks = [];
    if (data.id && process.argv.length > 1) {
        process.argv.slice(2).forEach(function(e) {
            tasks.push(util.upload_attachment(data.id, e));
        });
        Promise.all(tasks).then(console.log).catch(console.log);
    }
}
