import { connection } from "../db";
import { Direction } from "../enums";
import { Request } from "./Request";

export class Elevator {
  public currentFloor: number = 1;
  public targetFloors: number[] = [];
  public pendingUpRequests: number[] = [];
  public pendingDownRequests: number[] = [];
  public direction: Direction = Direction.Idle;
  public doorOpen: boolean = false;

  constructor(public id: number) {}

  public addRequest(request: Request): void {
    if (this.direction === Direction.Idle) {
      this.targetFloors.push(request.floor);
    } else {
      if (this.direction === Direction.Up && request.direction === 1) {
        if (request.floor > this.currentFloor) {
          this.targetFloors.push(request.floor);
        }
      } else if (
        this.direction === Direction.Down &&
        request.direction === -1
      ) {
        if (request.floor < this.currentFloor) {
          this.targetFloors.push(request.floor);
        }
      } else {
        if (request.direction === 1) {
          this.pendingUpRequests.push(request.floor);
        } else if (request.direction === -1) {
          this.pendingDownRequests.push(request.floor);
        }
      }
    }
    this.sortTargets();
  }

  private sortTargets(): void {
    if (this.direction === Direction.Up) {
      this.targetFloors.sort((a, b) => a - b);
    } else if (this.direction === Direction.Down) {
      this.targetFloors.sort((a, b) => b - a);
    } else {
      this.targetFloors.sort((a, b) => a - b);
    }
  }

  public move(): void {
    if (this.targetFloors.length === 0) {
      if (
        this.direction === Direction.Up &&
        this.pendingDownRequests.length > 0
      ) {
        this.direction = Direction.Idle;
      } else if (
        this.direction === Direction.Down &&
        this.pendingUpRequests.length > 0
      ) {
        this.direction = Direction.Idle;
      } else {
        this.direction = Direction.Idle;
        return;
      }
    }

    const target = this.targetFloors[0];

    if (this.currentFloor < target) {
      this.direction = Direction.Up;
      this.currentFloor++;
    } else if (this.currentFloor > target) {
      this.direction = Direction.Down;
      this.currentFloor--;
    }

    if (this.currentFloor === target) {
      this.openDoor();
      setTimeout(() => {
        this.closeDoor();
        this.targetFloors.shift();
        if (
          this.direction === Direction.Up &&
          this.pendingDownRequests.length > 0 &&
          this.targetFloors.length === 0
        ) {
          this.targetFloors = [...this.pendingDownRequests];
          this.pendingDownRequests = [];
        } else if (
          this.direction === Direction.Down &&
          this.pendingUpRequests.length > 0 &&
          this.targetFloors.length === 0
        ) {
          this.targetFloors = [...this.pendingUpRequests];
          this.pendingUpRequests = [];
        }
        this.updateStatus();
      }, 1000);
    } else {
      this.updateStatus();
    }
  }

  public openDoor(): void {
    this.doorOpen = true;
    console.log(`Elevator ${this.id} opened at floor ${this.currentFloor}`);
  }

  public closeDoor(): void {
    this.doorOpen = false;
    console.log(`Elevator ${this.id} closed at floor ${this.currentFloor}`);
  }

  public updateStatus(): void {
    const query =
      "UPDATE elevators SET current_floor = ?, direction = ?, door_open = ? WHERE id = ?";
    connection.query(
      query,
      [this.currentFloor, this.direction, this.doorOpen, this.id],
      (err, results) => {
        if (err) {
          console.error("Error updating elevator status:", err);
        } else {
          console.log(`Update elevator status ${this.id} successfully`);
        }
      }
    );
  }
}
