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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
exports.router = router;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var verifyCache_1 = require("../middleware/verifyCache");
var resize_1 = __importDefault(require("../utility/resize"));
var fileExist_1 = __importDefault(require("../utility/fileExist"));
router.get('/img', verifyCache_1.verifyCache, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filename, chosenWidth, chosenHeight, exist, cacheKey, imgPath, newImgPath, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filename = req.query.filename;
                chosenWidth = Number(req.query.width);
                chosenHeight = Number(req.query.height);
                if (!filename) {
                    return [2 /*return*/, res
                            .status(400)
                            .send("You have to select one of the existed images by put image's name in the query parameters !")];
                }
                return [4 /*yield*/, (0, fileExist_1.default)(path_1.default.join(__dirname, '..', '..', 'dist', 'images', "".concat(filename, ".jpg")))];
            case 1:
                exist = _a.sent();
                if (!exist) {
                    return [2 /*return*/, res
                            .status(400)
                            .send("Could not find an image with the given filename!")];
                }
                else if (!chosenWidth ||
                    !chosenHeight ||
                    isNaN(chosenWidth) ||
                    isNaN(chosenHeight) ||
                    chosenWidth <= 0 ||
                    chosenHeight <= 0) {
                    console.log("No width or height is given, send original image!");
                    return [2 /*return*/, res
                            .status(200)
                            .setHeader('Content-Type', 'image/jpg')
                            .sendFile(path_1.default.join(__dirname, '..', '..', 'dist', 'images', "".concat(filename, ".jpg")))];
                }
                cacheKey = "".concat(filename).concat(chosenWidth).concat(chosenHeight);
                imgPath = path_1.default.join(__dirname, '..', '..', 'dist', 'images', "".concat(filename, ".jpg"));
                newImgPath = path_1.default.join(__dirname, '..', '..', 'dist', 'thumb', "".concat(filename).concat(chosenWidth).concat(chosenHeight, "_thumb.jpg"));
                return [4 /*yield*/, (0, resize_1.default)(imgPath, chosenWidth, chosenHeight, newImgPath)];
            case 2:
                _a.sent();
                return [4 /*yield*/, fs_1.promises.readFile(newImgPath)];
            case 3:
                data = _a.sent();
                verifyCache_1.cache.set(cacheKey, data);
                res.status(201).setHeader('Content-Type', 'image/jpg').sendFile(newImgPath);
                return [2 /*return*/];
        }
    });
}); });
