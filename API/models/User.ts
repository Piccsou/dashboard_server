import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    servers: [
        new Schema<IServers>({
            name: { type: String, required: true },
            description: { type: String, required: true },
            type: { type: String, required: true },
            id: { type: Number, required: true, unique: true }
        }, { _id: false })
    ]
});

export interface IUser {
    username: string,
    password: string,
    isAdmin: boolean,
    servers: [IServers]
}

export interface IServers {
    name: string,
    description: string,
    type: ValidTypes,
    id: number
}

export enum ValidTypes {
    Unturned = "unturned",
    CS = "cs",
    Minecraft = "minecraft",
    Gmod = "gmod",
    DiscordBot = "discordBot",
    Stockage = "stockage"
}

export default model("user", userSchema);