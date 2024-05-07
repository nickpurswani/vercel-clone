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
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const generateRandom_1 = require("./generateRandom"); // Fix the typo here
const file_1 = require("./file");
const path_1 = __importDefault(require("path"));
const aws_1 = require("./aws");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let map = {};
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const repoUrl = req.body.repoUrl; // Assuming the key is 'repoUrl', fix typo here if needed
    console.log(repoUrl);
    const id = (0, generateRandom_1.generate)(); // Fix the function call here
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    const uploadPromises = files.map(file => (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file));
    // Wait for all upload promises to resolve
    yield Promise.all(uploadPromises);
    // After all uploads are complete, perform lPush operation
    map[id] = repoUrl;
    yield publisher.lPush("build-queue", id);
    yield publisher.hSet("status", id, "uploaded");
    res.json({ id: id });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({
        status: response
    });
}));
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
