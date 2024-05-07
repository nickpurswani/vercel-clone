import express from "express";
import { S3 } from "aws-sdk";
const app = express();
const s3 = new S3();
let id :any="";
app.get("/favicon.ico", async (req, res) => {
    
    // Send the favicon.ico file contents
    res.send();
});
app.get("/:path(*)", async (req, res) => {
    if (req.query.id){
        id = req.query.id;
    }console.log(id);
    const filePath = req.params.path;
    
    console.log(`dist/${id}/${filePath}`);
try{
    const contents = await s3.getObject({
        Bucket: "vercel-clone-nikhil",
        Key: `dist/${id}/${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);}
    catch{
        res.send()
    }
});


app.listen(3001);