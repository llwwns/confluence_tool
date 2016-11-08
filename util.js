const config = require('./config');
const fs = require('fs');
let request = require("request");
const bluebird = require('bluebird');
request = request.defaults({
    auth: {
        username: config.username,
        password: config.password
    },
    json: true
});
bluebird.promisifyAll(request, {promisifier: (f) => {
    return function() {
        let args = [].slice.call(arguments);
        return new bluebird((resolve, reject) => {
            args.push((err, res, body) => {
                if (err) {
                    return reject(err);
                }
                resolve(body);
            });
            f.apply(this, args);
        });
    };
}});

exports.remove_comment = (str) => {
    const lines = str.split(/\n|\r\n/);
    let res = "";
    let is_comment = false;
    for (line of lines) {
        if (is_comment) {
            if (line.match(/--##/)) {
                is_comment = false;
                if (line.match(/--##.+/)) {
                    res += (line.match(/--##(.+)/))[1] + "\n";
                }
            }
        } else {
            if (line.match(/(.*)##--.*--##(.*)/)) {
                match = line.match(/(.*)##--.*--##(.*)/);
                res += match[1] + match[2] + "\n";
            } else if (line.match(/##--/)) {
                is_comment = true;
                if (line.match(/(.+)##--/)) {
                    res += (line.match(/(.+)##--/))[1] + "\n";
                }
            } else {
                res += line + "\n";
            }
        }
    }
    return res;
};

rest_promise = (f, opts = {}) => new Promise((resolve, reject) => {
    opts = Object.assign(opts, {
        username: config.username,
        password: config.password
    });
    f(opts).on('complete', resolve).on('error', reject);
});

exports.short_str = (str) => {
    if (str && str.length > 128) {
        return str.slice(0, 128) + "...";
    }
    return str;
};

exports.get_page = (id) => request.getAsync(`${config.root}/rest/api/content/${id}`, {
    qs: {
        expand: 'body.storage,version,ancestors'
    }
});

exports.create_page = (data) => request.postAsync(`${config.root}/rest/api/content`, {body: data});

exports.update_page = (id, data) => request.putAsync(`${config.root}/rest/api/content/${id}`, {body: data});

exports.convert_wiki = (text) => request.postAsync(`${config.root}/rest/api/contentbody/convert/storage`, {
    body: {
        value: text,
        representation: "wiki"
    }
});

exports.convert_view = (text) => request.postAsync(`${config.root}/rest/api/contentbody/convert/view`, {
    body: {
        value: text,
        representation: "storage"
    }
});

exports.upload_attachment = (id, file) => request.postAsync(`${config.root}/rest/api/content/${id}/child/attachment`, {
    formData: {
        file: fs.createReadStream(file)
    },
    headers: {
        'X-Atlassian-Token': 'no-check'
    }
});
