const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const fs = require('fs')
// const upload = multer({ dest: "uploads/" });

app.use("/static", express.static("public"));
const { PdfMergerff } = require("./pdfmergermodul");
const bodyParser = require('body-parser');
const port = 3000;

// Initialize body-parser middleware with the extended option set to true
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the custom storage location
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "/template/index_merger.html"));
});


//  to get selected value from the user .....


app.post("/merge", upload.array("pdfs"), async function (req, res) {
    console.log(req.files);
    
    const selectedoption = req.body.selectedOption
    console.log(selectedoption)
    
    const filePaths = [];
    for (const file of req.files) {
        filePaths.push(path.join(__dirname, file.path));
    }
    //  when pass null its give full merge of the pdfs
    const fileName = await PdfMergerff(selectedoption === "" ? null : selectedoption, ...filePaths);
    res.redirect(`http://localhost:${port}/static/${fileName}`);

    // delete the uploaded files
    for (const file of req.files) {
        fs.unlink(path.join(__dirname, file.path), (err) => {
            if (err) throw err;
            console.log(`${file.path} was deleted`);
        });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});

// d