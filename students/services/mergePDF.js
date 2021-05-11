const PDFMerger = require('pdf-merger-js');

const mergePDF = async (pdfs, path, callback) => {
    try {
        var merger = new PDFMerger();
        pdfs.forEach(pdf => {
            merger.add(pdf);
        });
        await merger.save(path);
        
        if(typeof callback == "function")
            callback(null);
    }
    catch(err) {
        if(typeof callback == "function")
            callback(err);
    }
    
}

module.exports = mergePDF;

