"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elevator = void 0;
const db_1 = require("../db");
const enums_1 = require("../enums");
class Elevator {
    constructor(id) {
        this.id = id;
        this.currentFloor = 1;
        this.targetFloors = [];
        this.pendingUpRequests = [];
        this.pendingDownRequests = [];
        this.direction = enums_1.Direction.Idle;
        this.doorOpen = false;
    }
    addRequest(request) {
        if (this.direction === enums_1.Direction.Idle) {
            this.targetFloors.push(request.floor);
        }
        else {
            if (this.direction === enums_1.Direction.Up && request.direction === 1) {
                if (request.floor > this.currentFloor) {
                    this.targetFloors.push(request.floor);
                }
            }
            else if (this.direction === enums_1.Direction.Down &&
                request.direction === -1) {
                if (request.floor < this.currentFloor) {
                    this.targetFloors.push(request.floor);
                }
            }
            else {
                if (request.direction === 1) {
                    this.pendingUpRequests.push(request.floor);
                }
                else if (request.direction === -1) {
                    this.pendingDownRequests.push(request.floor);
                }
            }
        }
        this.sortTargets();
    }
    sortTargets() {
        if (this.direction === enums_1.Direction.Up) {
            this.targetFloors.sort((a, b) => a - b);
        }
        else if (this.direction === enums_1.Direction.Down) {
            this.targetFloors.sort((a, b) => b - a);
        }
        else {
            this.targetFloors.sort((a, b) => a - b);
        }
    }
    move() {
        if (this.targetFloors.length === 0) {
            // Nếu không có yêu cầu trong targetFloors, kiểm tra pending requests
            if (this.direction === enums_1.Direction.Up &&
                this.pendingDownRequests.length > 0) {
                // Nếu đang đi lên nhưng có yêu cầu đi xuống pending,
                // cho thang máy hoàn thành hành trình lên (ví dụ, lên tầng 10) rồi chuyển hướng.
                // Hoặc nếu thang máy đang Idle, ta có thể chọn chuyển hướng ngay.
                // Đối với ví dụ đơn giản, ta giữ nguyên trạng thái Idle.
                this.direction = enums_1.Direction.Idle;
            }
            else if (this.direction === enums_1.Direction.Down &&
                this.pendingUpRequests.length > 0) {
                this.direction = enums_1.Direction.Idle;
            }
            else {
                this.direction = enums_1.Direction.Idle;
                return;
            }
        }
        const target = this.targetFloors[0];
        if (this.currentFloor < target) {
            this.direction = enums_1.Direction.Up;
            this.currentFloor++;
        }
        else if (this.currentFloor > target) {
            this.direction = enums_1.Direction.Down;
            this.currentFloor--;
        }
        if (this.currentFloor === target) {
            this.openDoor();
            setTimeout(() => {
                this.closeDoor();
                this.targetFloors.shift();
                // Sau khi xử lý yêu cầu hiện tại, kiểm tra pending requests
                if (this.direction === enums_1.Direction.Up &&
                    this.pendingDownRequests.length > 0 &&
                    this.targetFloors.length === 0) {
                    // Nếu thang máy đã xử lý xong yêu cầu đi lên, chuyển sang pending đi xuống
                    this.targetFloors = [...this.pendingDownRequests];
                    this.pendingDownRequests = [];
                }
                else if (this.direction === enums_1.Direction.Down &&
                    this.pendingUpRequests.length > 0 &&
                    this.targetFloors.length === 0) {
                    this.targetFloors = [...this.pendingUpRequests];
                    this.pendingUpRequests = [];
                }
                this.updateStatus();
            }, 1000);
        }
        else {
            this.updateStatus();
        }
    }
    openDoor() {
        this.doorOpen = true;
        console.log(`Elevator ${this.id} opened at floor ${this.currentFloor}`);
    }
    closeDoor() {
        this.doorOpen = false;
        console.log(`Elevator ${this.id} closed at floor ${this.currentFloor}`);
    }
    updateStatus() {
        const query = "UPDATE elevators SET current_floor = ?, direction = ?, door_open = ? WHERE id = ?";
        db_1.connection.query(query, [this.currentFloor, this.direction, this.doorOpen, this.id], (err, results) => {
            if (err) {
                console.error("Error updating elevator status:", err);
            }
            else {
                console.log(`Update elevator status ${this.id} successfully`);
            }
        });
    }
}
exports.Elevator = Elevator;
