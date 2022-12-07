"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.verifyCache = void 0;
var node_cache_1 = __importDefault(require("node-cache"));
var cache = new node_cache_1.default();
exports.cache = cache;
var verifyCache = function (req, res, next) {
    try {
        var filename = req.query.filename;
        var chosenWidth = Number(req.query.width);
        var chosenHeight = Number(req.query.height);
        var cacheKey = "".concat(filename).concat(chosenWidth).concat(chosenHeight);
        if (cache.has(cacheKey)) {
            console.log("cached image with name ".concat(cacheKey, " has been found"));
            return res
                .status(200)
                .setHeader('Content-Type', 'image/jpg')
                .send(cache.get(cacheKey));
        }
        console.log("Could not find an image with name ".concat(cacheKey, " in cached images!"));
        return next();
    }
    catch (err) {
        console.log(err);
    }
};
exports.verifyCache = verifyCache;
