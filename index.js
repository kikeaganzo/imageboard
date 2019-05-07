// Server settings
const express = require("express");
const app = express();
const s3 = require("./s3");
const bodyParser = require("body-parser");
app.use(express.static("./public"));
const db = require("./db");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

//Unique name to the file uploaded
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

// Limit the size of the file
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//Post route Upload
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        var urlConc = "https://s3.amazonaws.com/aganzo/" + req.file.filename;
        console.log("url complete of the pic", urlConc);

        db.insertDb(
            urlConc,
            req.body.description,
            req.body.title,
            req.body.username
        )
            .then(data => {
                res.json(data.rows);
            })
            .catch(error => {
                console.log(error);
            });
    }
});

app.get("/big-image/:id", (req, res) => {
    db.getImageID(req.params.id)
        .then(results => {
            console.log("single image get : ", results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error; ", err);
        });
});

//
app.get("/get-images", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(error => {
            console.log(error);
        });

    app.post("/addComment", (req, res) => {
        db.addComment(req.body.usercomment, req.body.username, req.body.id)
            .then(results => {
                console.log("Adding comments working? ", results);
                res.json(results);
                console.log("req.body.id", req.body.id);
            })
            .catch(err => {
                console.log("error in add-comment: ", err);
            });
    });

    app.get("/show-comments/:id", (req, res) => {
        console.log("req.params.id ", req.params.id);

        db.showComments(req.params.id)
            .then(results => {
                console.log("show-comments working?  ", results);
                res.json(results);
            })
            .catch(err => {
                console.log("error show-comments: ", err);
            });
    });
});

app.use(bodyParser.json());

app.listen(8080, () => console.log("Listening!"));
