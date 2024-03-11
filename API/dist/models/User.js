"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidTypes = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    servers: [
        new mongoose_1.Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            type: { type: String, required: true },
            id: { type: Number, required: true, unique: true }
        }, { _id: false })
    ]
});
var ValidTypes;
(function (ValidTypes) {
    ValidTypes["Unturned"] = "unturned";
    ValidTypes["CS"] = "cs";
    ValidTypes["Minecraft"] = "minecraft";
    ValidTypes["Gmod"] = "gmod";
    ValidTypes["DiscordBot"] = "discordBot";
    ValidTypes["Stockage"] = "stockage";
})(ValidTypes || (exports.ValidTypes = ValidTypes = {}));
exports.default = (0, mongoose_1.model)("user", userSchema);
