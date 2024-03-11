"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.login = exports.validUsername = void 0;
const User_1 = __importDefault(require("../models/User"));
const app_1 = require("../app");
const bcrypt_1 = require("bcrypt");
exports.validUsername = ["picsou", "gpicxel"];
const login = async (req, res) => {
    const username = req.body.username;
    const plainedPassword = req.body.password;
    const data = await User_1.default.findOne({ username: username });
    try {
        const match = await (0, bcrypt_1.compare)(plainedPassword, data.password);
        if (match)
            return res.status(200).json({ message: "ok" });
        else
            return res.status(400).json({ error: "Invalid password" });
    }
    catch (e) {
        res.status(500).json({ e });
    }
    ;
};
exports.login = login;
const createUser = async (username) => {
    const createdUser = new User_1.default({
        username: username,
        password: "password",
        isAdmin: (username === "picsou" || username === "gpicxel") ?? false,
        servers: []
    });
    try {
        await createdUser.save();
        app_1.logger.info(__filename, `Created user with username : ${username}`);
        return true;
    }
    catch (e) {
        app_1.logger.error(__filename, `Error while creating username : ${username}`);
        console.error(e);
        return false;
    }
    ;
};
exports.createUser = createUser;
