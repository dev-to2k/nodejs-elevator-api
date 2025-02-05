"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const enums_1 = require("../enums");
const ElevatorManager_1 = require("../managers/ElevatorManager");
const Request_1 = require("../models/Request");
jest.mock("../websocket", () => ({
    wsServer: {
        connections: [],
    },
}));
describe("ElevatorManager", () => {
    let elevatorManager;
    beforeAll(() => {
        elevatorManager = new ElevatorManager_1.ElevatorManager(3);
    });
    it("should allocate the correct elevator when receiving the request", () => {
        const req = new Request_1.Request(3, enums_1.Direction.Up, "CALL");
        elevatorManager.handleRequest(req);
        expect(elevatorManager.elevators[0].targetFloors).toContain(3);
    });
    afterAll((done) => {
        db_1.connection.end((err) => {
            if (err)
                console.error("Error closing connection:", err);
            done();
        });
    });
});
