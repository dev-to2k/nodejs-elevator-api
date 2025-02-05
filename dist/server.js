"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elevatorManager = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const elevatorRoutes_1 = __importDefault(require("./routes/elevatorRoutes"));
const ElevatorManager_1 = require("./managers/ElevatorManager");
const websocket_1 = require("./websocket");
websocket_1.app.use((0, cors_1.default)());
websocket_1.app.use(express_1.default.json());
const elevatorManager = new ElevatorManager_1.ElevatorManager(3);
exports.elevatorManager = elevatorManager;
// Routes
websocket_1.app.use("/api/elevators", elevatorRoutes_1.default);
console.log("Server is running and ElevatorManager is active.");
