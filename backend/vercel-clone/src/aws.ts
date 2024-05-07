import { S3 } from "aws-sdk";
import fs from "fs";
const s3 = new S3();
// fileName => output/12312/src/App.jsx
// filePath => /Users/.../dist/output/{id #genrated id}/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-clone-nikhil",
        Key: fileName,
    }).promise();
    console.log(response);
}