"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElevatorStatus = exports.callElevator = void 0;
const Request_1 = require("../models/Request");
const server_1 = require("../server");
const validates_1 = require("../validates");
const callElevator = (req, res) => {
    const validationResult = (0, validates_1.validateElevatorRequest)(req.body);
    if ("error" in validationResult) {
        res.status(400).json({ error: validationResult.error });
        return;
    }
    const { floor, direction } = validationResult;
    const elevatorRequest = new Request_1.Request(floor, direction, "CALL");
    server_1.elevatorManager.handleRequest(elevatorRequest);
    res.status(200).json({ message: "Request sent" });
};
exports.callElevator = callElevator;
const getElevatorStatus = (req, res) => {
    res.status(200).json({ elevators: server_1.elevatorManager.elevators });
};
exports.getElevatorStatus = getElevatorStatus;
