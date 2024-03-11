import express from "express";
import { connect } from "mongoose";
import serverRoutes from "./routes/server";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import ConsoleLogger from "node-logconsole";

export const logger = new ConsoleLogger("API.logs");
const app = express();
const port = "3000";

app.use((req, res, next) => {
    logger.info(__filename, `Request was send to ${req.url} with ${req.method} method.`);
    next(); 
});

app.get("/ping", (req, res) => {
    return res.status(200).json({ message: "Pong !" });
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/", serverRoutes);
app.use("/", userRoutes);

//liste des évents : https://mongoosejs.com/docs/connections.html#connection-events
mongoose.connection
.on("connected", () => logger.success(__filename, "Connected to database !"))
.on("open", () => logger.success(__filename, "open"))
.on("disconnecting", () => logger.error(__filename, "Database is disconnecting !"))
.on("disconnected", () => logger.error(__filename, "Database is disconnected"))
.on("close", () => logger.error(__filename, "close"))
.on("reconnected", () => logger.warn(__filename, "Database is reconnected"))
.on("error", (e: mongoose.Error) => {
    logger.error(__filename, "A database error was provided");
    console.error(e.message);
});

(async function() {
    await connect("mongodb+srv://picsou:picpicsousou@serverdashboarb.he6gczm.mongodb.net/?retryWrites=true&w=majority", {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    });
})();

app.set("port", port);
app.listen(port);

logger.success(__filename, `Listening on port ${port}`);
