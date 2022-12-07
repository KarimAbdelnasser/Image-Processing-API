"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fileExist = function (path) {
    return fs_1.promises
        .access(path, fs_1.promises.constants.F_OK)
        .then(function () { return true; })
        .catch(function () { return false; });
};
exports.default = fileExist;
