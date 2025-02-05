"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const Elevator_1 = require("../models/Elevator");
const Request_1 = require("../models/Request");
jest.useFakeTimers();
jest.mock("../db", () => ({
    connection: {
        query: jest.fn(),
    },
}));
describe("Elevator", () => {
    it("should move as required", () => {
        const elevator = new Elevator_1.Elevator(1);
        elevator.currentFloor = 1;
        const req = new Request_1.Request(5, enums_1.Direction.Up, "CALL");
        elevator.addRequest(req);
        jest.spyOn(elevator, "updateStatus").mockImplementation(() => { });
        while (elevator.currentFloor !== 5) {
            elevator.move();
            jest.runAllTimers();
        }
        expect(elevator.currentFloor).toBe(5);
    });
    afterAll(() => {
        jest.clearAllTimers();
    });
});
