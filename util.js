const config = require('./config');
const rest = require('restler');
const fs = require('fs');

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

exports.get_page = (id) => rest_promise(rest.get.bind(null, config.root + '/rest/api/content/' + id), {
    query: {
        expand: 'body.storage,version,ancestors'
    }
});

exports.create_page = (data) => rest_promise(rest.postJson.bind(null, config.root + '/rest/api/content/', data));

exports.update_page = (id, data) => rest_promise(rest.putJson.bind(null, config.root + '/rest/api/content/' + id, data));

exports.convert_wiki = (text) => rest_promise(rest.postJson.bind(null, config.root + '/rest/api/contentbody/convert/storage', {
    value: text,
    representation: "wiki"
}));

exports.convert_view = (text) => rest_promise(rest.postJson.bind(null, config.root + '/rest/api/contentbody/convert/view', {
    value: text,
    representation: "storage"
}));

exports.upload_attachment = (id, file) => {
    const size = fs.statSync(file).size;
    return rest_promise(rest.post.bind(null, config.root + '/rest/api/content/' + id + '/child/attachment'), {
        multipart: true,
        data: {
            file: rest.file(file, null, size)
        },
        headers: {
            'X-Atlassian-Token': 'no-check'
        }
    });
};
