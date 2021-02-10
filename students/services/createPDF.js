var pdf = require("html-pdf");
let ejs = require("ejs");

const createPDF = (html, data, path) => {
    
    ejs.renderFile(html, { data }, (err, data) => {
        if (err) {
            console.log(err); 
        } else {
            let options = {
                "format": "A4",
                "orientation": "portrait",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
                base: 'file://' + __dirname + './../uploads/student_photo/'
            };

            pdf.create(data, options).toFile(path, function (err, data) {
                if (err) {
                    console.log(err); 
                } else {
                    console.log("PDF created successfully");
                    console.log(data);
                }
            });
        }
    });
}

module.exports = createPDF;

