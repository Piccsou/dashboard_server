import { HydratedDocument } from 'mongoose';
import userModel, { IUser } from '../models/User';
import { Request, Response } from "express-serve-static-core";
import { logger } from '../app';
import { compare } from "bcrypt";

export const validUsername = ["picsou", "gpicxel"];

export const login = async(req: Request, res: Response) => {
    const username = req.body.username;
    const plainedPassword = req.body.password;
    const data = await userModel.findOne({ username: username }) as HydratedDocument<IUser>;

    try {
        const match =  await compare(plainedPassword, data.password);

        if(match) return res.status(200).json({ message: "ok" });
        else return res.status(400).json({ error: "Invalid password" });
    } catch(e) {
        res.status(500).json({ e });
    };
};

export const createUser = async(username: string): Promise<boolean> => {
    const createdUser = new userModel({ 
        username: username,
        password: "password",
        isAdmin: (username === "picsou" || username === "gpicxel") ?? false,
        servers: []
    }) as unknown as HydratedDocument<IUser>;

    try {
        await createdUser.save();
        logger.info(__filename, `Created user with username : ${username}`);
        return true;
    }
    catch(e) {
        logger.error(__filename, `Error while creating username : ${username}`);
        console.error(e);
        return false;
    };
};