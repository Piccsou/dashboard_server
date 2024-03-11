"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const server_1 = __importDefault(require("./routes/server"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_2 = __importDefault(require("mongoose"));
const node_logconsole_1 = __importDefault(require("node-logconsole"));
exports.logger = new node_logconsole_1.default("API.logs");
const app = (0, express_1.default)();
const port = "3000";
app.use((req, res, next) => {
    exports.logger.info(__filename, `Request was send to ${req.url} with ${req.method} method.`);
    next();
});
app.get("/ping", (req, res) => {
    return res.status(200).json({ message: "Pong !" });
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", server_1.default);
app.use("/", user_1.default);
//liste des évents : https://mongoosejs.com/docs/connections.html#connection-events
mongoose_2.default.connection
    .on("connected", () => exports.logger.success(__filename, "Connected to database !"))
    .on("open", () => exports.logger.success(__filename, "open"))
    .on("disconnecting", () => exports.logger.error(__filename, "Database is disconnecting !"))
    .on("disconnected", () => exports.logger.error(__filename, "Database is disconnected"))
    .on("close", () => exports.logger.error(__filename, "close"))
    .on("reconnected", () => exports.logger.warn(__filename, "Database is reconnected"))
    .on("error", (e) => {
    exports.logger.error(__filename, "A database error was provided");
    console.error(e.message);
});
(async function () {
    await (0, mongoose_1.connect)("mongodb+srv://picsou:picpicsousou@serverdashboarb.he6gczm.mongodb.net/?retryWrites=true&w=majority", {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    });
})();
app.set("port", port);
app.listen(port);
exports.logger.success(__filename, `Listening on port ${port}`);
