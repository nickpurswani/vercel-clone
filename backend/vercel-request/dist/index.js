"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const app = (0, express_1.default)();
const s3 = new aws_sdk_1.S3();
let id = "";
app.get("/favicon.ico", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Send the favicon.ico file contents
    res.send();
}));
app.get("/:path(*)", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id) {
        id = req.query.id;
    }
    console.log(id);
    const filePath = req.params.path;
    console.log(`dist/${id}/${filePath}`);
    try {
        const contents = yield s3.getObject({
            Bucket: "vercel-clone-nikhil",
            Key: `dist/${id}/${filePath}`
        }).promise();
        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
        res.set("Content-Type", type);
        res.send(contents.Body);
    }
    catch (_a) {
        res.send();
    }
}));
app.listen(3001);
