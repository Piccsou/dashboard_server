import { HydratedDocument } from "mongoose";
import  user, { IServers, IUser, ValidTypes } from "../models/User";
import { Request, Response } from "express-serve-static-core";
import { logger } from "../app";
import { validUsername, createUser } from "./user";

export const SERVER_NAME_MAX_CHARACTER_LENGTH = 15;
export const SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH = 100;

export const createServer = async (req: Request, res: Response): Promise<Response<any>> => {
    const username = req.params.username;
    const serverName = req.body.serverName;
    const serverDescription = req.body.serverDescription;
    const type = req.body.type;

    if(!username) return res.status(400).json({ error: "username is missing" });
    if(!validUsername.includes(username)) return res.status(400).json({ error: "username is invalid" });

    const data = await user.findOne({ username: username }) as HydratedDocument<IUser>;

    if(!data) {
        if(await createUser(validUsername[validUsername.indexOf(username)])) return res.status(500).json({ error: "User not find but created with success" });
        else return res.status(500).json({ error: "User not find and failed to create it" });
    };
    if(!serverName) return res.status(400).json({ error: "serverName is missing" });
    if(serverName.length > SERVER_NAME_MAX_CHARACTER_LENGTH) return res.status(400).json({ error: "serverName must be less than 15 carachers !" });
    if(data?.servers.find(o => o.name === serverName && o.type === type)) return res.status(400).json({ error: "A server with same name and same type already exists" });
    if(!serverDescription) return res.status(400).json({ error: "serverDescription is missing" });
    if(serverDescription.length > SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH) return res.status(400).json({ error: "serverDescription is too long ! (100 characters max)" });
    if(!type) return res.status(400).json({ error: "ServerType is missing" });
    if(!Object.values(ValidTypes).includes(type)) return res.status(400).json({ error: "ServerType is invalid !" });

    const id = Math.floor(Math.random() * 100);
    data.servers.push({
        name: serverName,
        description: serverDescription,
        type: type,
        id: id
    });

    try {
        data.save();
        logger.success(__filename, `${username} created a ${type} server with id ${id}`);
        return res.status(201).json({ message: `Serveur created with id : ${id}` });
    } catch(e) {
        logger.error(__filename, `${username} try to created a ${type} server with id ${id}.`);
        return res.status(500).json({ e });
    };
};

export const getServer = async(req: Request, res: Response): Promise<IServers|Response<any>> => {
    const id = req.params.serverId;

    if(!id) return res.status(400).json({ error: "serverId is missing" });
    
    const data = (await user.findOne({ "servers.id": id }) as HydratedDocument<IUser>).servers.find(s => s.id.toString() === id);

    if(!data) return res.status(404).json({ error: "Server not found" });
    return res.status(200).json({ data });
};

export const getAllServers = async(req: Request, res: Response): Promise<[IServers]|Response<any>> => {
    const username = req.params.username;
    
    if(!username) return res.status(400).json({ error: "username is missing" });
    if(!validUsername.includes(username)) return res.status(400).json({ error: "Invalid username" });

    const data = (await user.findOne({ username: username }) as HydratedDocument<IUser>).servers;
    if(!data) return res.status(404).json({ error: "User doesn't haves servers" });
    else return res.status(200).json({ data });
};

export const updateServer = async(req: Request, res: Response) => {
    const serverName = req.body?.serverName;
    const serverDescription = req.body?.serverDescription;
    const id = parseInt(req.params.serverId);

    const data = (await user.findOne({ "servers.id": id }) as HydratedDocument<IUser>);
    const server = data.servers.find(s => s.id === id);

    if(!data) return res.status(500).json({ error: "internal error "});
    if(!server) return res.status(404).json({ error: "server not found" });
    if(serverName?.length > SERVER_NAME_MAX_CHARACTER_LENGTH) return res.status(400).json({ error: "serverName must be less than 15 carachers !" });
    if(serverDescription?.length > SERVER_DESCRIPTION_MAX_CHARACTER_LENGTH) return res.status(400).json({ error: "serverDescription is too long ! (100 characters max)" });

    if(serverName) server.name = serverName;
    if(serverDescription) server.description = serverDescription;

    try {
        data.save();

        logger.info(__filename, `Updated server with id ${id}`);
        return res.status(201).json({ message: `Updated server` });
    } catch(e: any) {
        logger.error(__filename, `Error while updating server ${id} | ${e.message}`);
        return res.status(500).json({ error: e.message });
    };
};

export const deleteServer = async(req: Request, res: Response) => {
    const id = req.params.serverId;
    const username = req.body.username;

    if(!username) return res.status(400).json({ error: "username is missing" });
    if(!validUsername.includes(username)) return res.status(400).json({ error: "Invalid username" });

    const data = await user.findOne({ username: username }) as HydratedDocument<IUser>;
    if(!data) return res.status(500).json({ error: "internal error" });

    const server = data.servers.find(s => s.id.toString() === id);

    if(!server) return res.status(404).json({ error: "Server not found" });
    data.servers.splice(data.servers.indexOf(server, 1));

    try {
        data.save();
        
        return res.status(201).json({ message: "Deleted server" });
    } catch(e: any) {
        logger.error(__filename, `Error while deleting server : ${id} | ${e.message}`);
        return res.status(400).json({ e })
    };
}; 