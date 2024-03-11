import { Router } from "express";
import { createServer, getServer, deleteServer, getAllServers, updateServer } from "../functions/server";

const router = Router();

router.post("/createServer/:username", createServer);
router.get("/getServer/:serverId", getServer);
router.get("/getAllServers/:username", getAllServers);
router.put("/updateServer/:serverId", updateServer);
router.delete("/deleteServer/:serverId", deleteServer);

export default router;