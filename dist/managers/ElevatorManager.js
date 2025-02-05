"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevatorManager = void 0;
const enums_1 = require("../enums");
const Elevator_1 = require("../models/Elevator");
const websocket_1 = require("../websocket");
class ElevatorManager {
    constructor(numElevators) {
        this.elevators = [];
        this.updateIntervalId = null;
        this.requestQueue = [];
        for (let i = 0; i < numElevators; i++) {
            this.elevators.push(new Elevator_1.Elevator(i + 1));
        }
    }
    handleRequest(request) {
        this.requestQueue.push(request);
        this.processQueue();
        if (!this.updateIntervalId) {
            this.startUpdating();
        }
    }
    processQueue() {
        while (this.requestQueue.length > 0) {
            const req = this.requestQueue[0];
            const suitableElevators = this.elevators.filter((elevator) => elevator.direction === enums_1.Direction.Idle ||
                elevator.direction === req.direction);
            if (suitableElevators.length === 0) {
                console.log(`No available elevator for request at floor ${req.floor}`);
                break;
            }
            const distances = suitableElevators.map((elevator) => Math.abs(elevator.currentFloor - req.floor));
            const minDistance = Math.min(...distances);
            const bestElevators = suitableElevators.filter((elevator) => Math.abs(elevator.currentFloor - req.floor) === minDistance);
            const chosenElevator = bestElevators[Math.floor(Math.random() * bestElevators.length)];
            if (chosenElevator) {
                chosenElevator.addRequest(req);
                console.log(`Allocated elevator ${chosenElevator.id} to floor request ${req.floor}`);
                chosenElevator.updateStatus();
                this.requestQueue.shift();
            }
            else {
                break;
            }
        }
    }
    startUpdating() {
        console.log("Starting elevator update interval...");
        this.updateIntervalId = setInterval(() => {
            this.updateElevators();
            if (this.allElevatorsIdle()) {
                this.stopUpdating();
            }
        }, 2000);
    }
    stopUpdating() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
            console.log("Stopped elevator update interval (system idle).");
        }
    }
    updateElevators() {
        this.elevators.forEach((elevator) => elevator.move());
        this.broadcastStatus();
    }
    allElevatorsIdle() {
        return this.elevators.every((elevator) => elevator.targetFloors.length === 0 &&
            elevator.direction === enums_1.Direction.Idle);
    }
    broadcastStatus() {
        const status = this.elevators.map((elevator) => ({
            id: elevator.id,
            currentFloor: elevator.currentFloor,
            direction: elevator.direction,
            doorOpen: elevator.doorOpen,
            targets: elevator.targetFloors,
        }));
        const message = JSON.stringify({ type: "STATUS_UPDATE", data: status });
        websocket_1.wsServer.connections.forEach((conn) => {
            if (conn.connected) {
                conn.sendUTF(message);
            }
        });
    }
}
exports.ElevatorManager = ElevatorManager;
