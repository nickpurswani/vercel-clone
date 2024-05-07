import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generate } from './generateRandom'; // Fix the typo here
import {getAllFiles} from './file';
import path from 'path';
import { uploadFile } from './aws';
import {createClient} from 'redis';
const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

const app = express();

app.use(cors());
app.use(express.json());
let map: { [key: string]: string } = {};

app.post("/deploy", async (req: Request, res: Response) => {
    console.log(req.body);
    const repoUrl = req.body.repoUrl; // Assuming the key is 'repoUrl', fix typo here if needed
    console.log(repoUrl);
    const id = generate(); // Fix the function call here
    await simpleGit().clone(repoUrl, path.join(__dirname,`output/${id}`));
    const files = getAllFiles(path.join(__dirname,`output/${id}`));
    const uploadPromises = files.map(file => uploadFile(file.slice(__dirname.length + 1), file));
    
    // Wait for all upload promises to resolve
    await Promise.all(uploadPromises);

    // After all uploads are complete, perform lPush operation
    map[id] = repoUrl;
    await publisher.lPush("build-queue", id);
    await publisher.hSet("status", id, "uploaded");
    res.json({ id: id });
});
app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
