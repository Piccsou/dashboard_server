"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServer = exports.updateServer = exports.getAllServers = exports.getServer = exports.createServer = exports.SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH = exports.SERVER_NAME_MAX_CHARACTER_LENGTH = void 0;
const User_1 = __importStar(require("../models/User"));
const app_1 = require("../app");
const user_1 = require("./user");
exports.SERVER_NAME_MAX_CHARACTER_LENGTH = 15;
exports.SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH = 100;
const createServer = async (req, res) => {
    const username = req.params.username;
    const serverName = req.body.serverName;
    const serverDescription = req.body.serverDescription;
    const type = req.body.type;
    if (!username)
        return res.status(400).json({ error: "username is missing" });
    if (!user_1.validUsername.includes(username))
        return res.status(400).json({ error: "username is invalid" });
    const data = await User_1.default.findOne({ username: username });
    if (!data) {
        if (await (0, user_1.createUser)(user_1.validUsername[user_1.validUsername.indexOf(username)]))
            return res.status(500).json({ error: "User not find but created with success" });
        else
            return res.status(500).json({ error: "User not find and failed to create it" });
    }
    ;
    if (!serverName)
        return res.status(400).json({ error: "serverName is missing" });
    if (serverName.length > exports.SERVER_NAME_MAX_CHARACTER_LENGTH)
        return res.status(400).json({ error: "serverName must be less than 15 carachers !" });
    if (data?.servers.find(o => o.name === serverName && o.type === type))
        return res.status(400).json({ error: "A server with same name and same type already exists" });
    if (!serverDescription)
        return res.status(400).json({ error: "serverDescription is missing" });
    if (serverDescription.length > exports.SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH)
        return res.status(400).json({ error: "serverDescription is too long ! (100 characters max)" });
    if (!type)
        return res.status(400).json({ error: "ServerType is missing" });
    if (!Object.values(User_1.ValidTypes).includes(type))
        return res.status(400).json({ error: "ServerType is invalid !" });
    const id = Math.floor(Math.random() * 100);
    data.servers.push({
        name: serverName,
        description: serverDescription,
        type: type,
        id: id
    });
    try {
        data.save();
        app_1.logger.success(__filename, `${username} created a ${type} server with id ${id}`);
        return res.status(201).json({ message: `Serveur created with id : ${id}` });
    }
    catch (e) {
        app_1.logger.error(__filename, `${username} try to created a ${type} server with id ${id}.`);
        return res.status(500).json({ e });
    }
    ;
};
exports.createServer = createServer;
const getServer = async (req, res) => {
    const id = req.params.serverId;
    if (!id)
        return res.status(400).json({ error: "serverId is missing" });
    const data = (await User_1.default.findOne({ "servers.id": id })).servers.find(s => s.id.toString() === id);
    if (!data)
        return res.status(404).json({ error: "Server not found" });
    return res.status(200).json({ data });
};
exports.getServer = getServer;
const getAllServers = async (req, res) => {
    const username = req.params.username;
    if (!username)
        return res.status(400).json({ error: "username is missing" });
    if (!user_1.validUsername.includes(username))
        return res.status(400).json({ error: "Invalid username" });
    const data = (await User_1.default.findOne({ username: username })).servers;
    if (!data)
        return res.status(404).json({ error: "User doesn't haves servers" });
    else
        return res.status(200).json({ data });
};
exports.getAllServers = getAllServers;
const updateServer = async (req, res) => {
    const serverName = req.body?.serverName;
    const serverDescription = req.body?.serverDescription;
    const id = parseInt(req.params.serverId);
    const data = await User_1.default.findOne({ "servers.id": id });
    const server = data.servers.find(s => s.id === id);
    if (!data)
        return res.status(500).json({ error: "internal error " });
    if (!server)
        return res.status(404).json({ error: "server not found" });
    if (serverName?.length > exports.SERVER_NAME_MAX_CHARACTER_LENGTH)
        return res.status(400).json({ error: "serverName must be less than 15 carachers !" });
    if (serverDescription?.length > exports.SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH)
        return res.status(400).json({ error: "serverDescription is too long ! (100 characters max)" });
    if (serverName)
        server.name = serverName;
    if (serverDescription)
        server.description = serverDescription;
    try {
        data.save();
        app_1.logger.info(__filename, `Updated server with id ${id}`);
        return res.status(201).json({ message: `Updated server` });
    }
    catch (e) {
        app_1.logger.error(__filename, `Error while updating server ${id} | ${e.message}`);
        return res.status(500).json({ error: e.message });
    }
    ;
};
exports.updateServer = updateServer;
const deleteServer = async (req, res) => {
    const id = req.params.serverId;
    const username = req.body.username;
    if (!username)
        return res.status(400).json({ error: "username is missing" });
    if (!user_1.validUsername.includes(username))
        return res.status(400).json({ error: "Invalid username" });
    const data = await User_1.default.findOne({ username: username });
    if (!data)
        return res.status(500).json({ error: "internal error" });
    const server = data.servers.find(s => s.id.toString() === id);
    if (!server)
        return res.status(404).json({ error: "Server not found" });
    data.servers.splice(data.servers.indexOf(server, 1));
    try {
        data.save();
        return res.status(201).json({ message: "Deleted server" });
    }
    catch (e) {
        app_1.logger.error(__filename, `Error while deleting server : ${id} | ${e.message}`);
        return res.status(400).json({ e });
    }
    ;
};
exports.deleteServer = deleteServer;
