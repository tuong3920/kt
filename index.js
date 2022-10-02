const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer")

const upload = multer();
const app = express();

//view engine
app.use(express.static('./GUI'));
app.set('view engine','ejs'); 
app.set('views','./GUI');

//dynamo config
const config = new AWS.Config({
    accessKeyId: "AKIAXSRWE6UPCSJTUFOG",
    secretAccessKey: "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",
    region: "ap-southeast-1",
});
AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "baibao1"

app.get("/", (req, res) => {
    const param = {
        TableName: tableName
    }
    docClient.scan(param, (e, data) => {
        if (e) {
            return res.status(400).send("Internal server erro")
        } else {
            // console.log(data.Items);
            return res.render("index", { baibao1: data.Items });
        }
    });
});
app.post("/", upload.fields([]), (req, res) => {
    const { id,tenBaiBao,tenTacGia,ISBN,soTrang,namXB }=req.body;
    const param= {
        TableName:tableName,
        Item:{
            id,tenBaiBao,tenTacGia,ISBN,soTrang,namXB
        }
    };
    docClient.put(param,(e,data)=>{
        if (e) {
           res.status(400).send("Internal server erro")
        } else {
            // console.log(req.body);
            res.redirect("/")
        }
    });
    // console.log(req.body);
    // return res.redirect('/');
});

app.post("/delete", upload.fields([]), (req, res) => {
    const {id}=req.body;
    const param= {
        TableName:tableName,
        Key:{
            id
        }
    };
    docClient.delete(param,(e,data)=>{
        if (e) {
           res.status(400).send("Internal server erro")
        } else {
            // console.log(req.body);
            res.redirect("/")
        }
    });
    // console.log(req.body);
    // return res.redirect('/');
});
app.listen(3000, () => {
    console.log("server listening on port 3000");
});