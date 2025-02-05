"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = exports.httpServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const websocket_1 = require("websocket");
const app = (0, express_1.default)();
exports.app = app;
const PORT = 5000;
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV !== "test") {
        console.log(`HTTP Server is running on port ${PORT}`);
    }
});
const wsServer = new websocket_1.server({
    httpServer: httpServer,
    autoAcceptConnections: false,
});
exports.wsServer = wsServer;
wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    if (process.env.NODE_ENV !== "test") {
        console.log("Client connected qua WebSocket");
        connection.sendUTF(JSON.stringify({ message: "Connected to WebSocket server" }));
    }
});
