const port = 3000;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    var arr = [];
    fs.readdir("./files", function (err, files) {
        // here files refer to the array of fileName's given by the readdir
        if (err) return res.send(err);
        else files.forEach(function (filename) {
            let data = fs.readFileSync(`./files/${filename}`);
            arr.push({ fileName: filename, fileData: data });
        });
        res.render("index", { files: arr });
    });
});
app.get("/create", function (req, res) {
    res.render("create");
});
app.post("/create", function (req, res) {
    fs.writeFile(`./files/${req.body.fileName}`, req.body.fileData, function (err) {
        if (err) return res.send(err);
        else res.redirect("/");
    });    
});
app.get("/delete/:filename", function (req, res) {
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        if (err) return res.send(err);
        else res.redirect("/");
    });
});
app.get("/edit/:filename", function (req, res) {
    var fileData = fs.readFileSync(`./files/${req.params.filename}`);
    res.render("edit", { fileName: req.params.filename, fileData });
});
app.post("/update/:filename", function (req, res){
    fs.writeFile(`./files/${req.params.filename}`, req.body.fileData, function (err) {
        if (err) return res.send(err);
        else res.redirect("/");
    })
})

app.listen(port);