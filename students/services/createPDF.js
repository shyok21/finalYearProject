var pdf = require("html-pdf");
let ejs = require("ejs");
const { ROOT_URL } = require('./../config');

const createPDF = (html, data, path, callback) => {
    data.ROOT_URL = ROOT_URL;
    ejs.renderFile(html, { data }, (err, data) => {
        if (err) {
            console.log(err); 
            if (typeof callback == "function") 
                callback(err, path); 
        } else {
            let options = {
                "format": "A3",
                "orientation": "portrait",
                "border": {
                    "top": "0.5in",
                    "right": "0.5in",
                    "bottom": "0.5in",
                    "left": "0.5in"
                },
                base: 'file://' + __dirname + './../'
            };

            pdf.create(data, options).toFile(path, function (err, data) {
                if (err) { 
                    if (typeof callback == "function") 
                        callback(err, path); 
                } else {
                    console.log("PDF created successfully");
                    if (typeof callback == "function") 
                        callback(null, path); 
                }
            });
        }
    });
}

module.exports = createPDF;

