var fs = require('fs');
var path = require('path');
var request = require('request').defaults({ encoding: null });
filePath = path.join(__dirname, 'src.txt');
fileDesc = path.join(__dirname, 'desc.txt');

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                var data = { res: res, body: body }
                resolve(data);
            } else {
                reject(error);
            }
        });
    });
}
async function urlToBase64(url) {
    try {
        const fetchData = await doRequest(url);
        const base64 = fetchData.res.headers["content-type"] + ";base64," + new Buffer(fetchData.body).toString('base64');
        return base64;
    } catch (error) {
        throw (error);
    }
}
fs.readFile(filePath, { encoding: 'utf-8' }, async function (err, data) {
    if (!err) {
        var text = data;
        var regex = /https?:\/\/[^)\s]+/g;
        var match = data.match(regex);
        for (var i = 0; i < match.length; i++) {
            var url = match[i];
            var base64 = await urlToBase64(url)
            text = text.replace(url, 'data:application/' + base64);
        }
        fs.writeFile(fileDesc, text, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    } else {
        console.log(err);
    }
});