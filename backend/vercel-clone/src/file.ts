import fs from "fs";
import path from "path";
let response: string[] = [];
export const getAllFiles = (folderPath: string) => {
    

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
           getAllFiles(fullFilePath)
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}