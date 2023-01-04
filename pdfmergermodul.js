const PDFMerger = require('pdf-merger-js');

const PdfMergerff = async (no_of_pgs,...arr) => {
    const merger = new PDFMerger();  // create a new merger object for each request
    if (arr.length > 0) {
        for (const filePath of arr) {
            await merger.add(filePath, no_of_pgs);
        }
    } else {
        console.log('No PDFs to merge');
        return;
    }

    // merge all pages. parameter is the 
    d = new Date().getTime()
    const fileName = `${d}merge.pdf`;
    await merger.save(`public/${fileName}`);
    return fileName;
};


module.exports = { PdfMergerff }

