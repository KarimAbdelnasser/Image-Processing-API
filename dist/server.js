"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var PORT = 8080;
var imgRoute_1 = require("./routes/imgRoute");
app.use('/', imgRoute_1.router);
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT, "..."));
});
exports.default = app;
