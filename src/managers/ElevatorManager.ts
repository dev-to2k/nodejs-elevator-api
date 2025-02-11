import { Direction } from "../enums";
import { Elevator } from "../models/Elevator";
import { Request } from "../models/Request";
import { io } from "../websocket";

export class ElevatorManager {
  public elevators: Elevator[] = [];
  private updateIntervalId: NodeJS.Timeout | null = null;
  private requestQueue: Request[] = [];

  constructor(numElevators: number) {
    for (let i = 0; i < numElevators; i++) {
      this.elevators.push(new Elevator(i + 1));
    }
  }

  public handleRequest(request: Request): void {
    this.requestQueue.push(request);
    this.processQueue();

    if (!this.updateIntervalId) {
      this.startUpdating();
    }
  }

  private processQueue(): void {
    while (this.requestQueue.length > 0) {
      const req = this.requestQueue[0];

      const suitableElevators = this.elevators.filter(
        (elevator) =>
          elevator.direction === Direction.Idle ||
          elevator.direction === req.direction
      );

      if (suitableElevators.length === 0) {
        console.log(`No available elevator for request at floor ${req.floor}`);
        break;
      }

      const distances = suitableElevators.map((elevator) =>
        Math.abs(elevator.currentFloor - req.floor)
      );
      const minDistance = Math.min(...distances);

      const bestElevators = suitableElevators.filter(
        (elevator) =>
          Math.abs(elevator.currentFloor - req.floor) === minDistance
      );

      const chosenElevator =
        bestElevators[Math.floor(Math.random() * bestElevators.length)];

      if (chosenElevator) {
        chosenElevator.addRequest(req);
        console.log(
          `Allocated elevator ${chosenElevator.id} to floor request ${req.floor}`
        );
        chosenElevator.updateStatus();
        this.requestQueue.shift();
      } else {
        break;
      }
    }
  }

  public startUpdating(): void {
    console.log("Starting elevator update interval...");
    this.updateIntervalId = setInterval(() => {
      this.updateElevators();
      if (this.allElevatorsIdle()) {
        this.stopUpdating();
      }
    }, 2000);
  }

  public stopUpdating(): void {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
      console.log("Stopped elevator update interval (system idle).");
    }
  }

  public updateElevators(): void {
    this.elevators.forEach((elevator) => elevator.move());
    this.broadcastStatus();
  }

  private allElevatorsIdle(): boolean {
    return this.elevators.every(
      (elevator) =>
        elevator.targetFloors.length === 0 &&
        elevator.direction === Direction.Idle
    );
  }

  public broadcastStatus(): void {
    const status = this.elevators.map((elevator) => ({
      id: elevator.id,
      currentFloor: elevator.currentFloor,
      direction: elevator.direction,
      doorOpen: elevator.doorOpen,
      targets: elevator.targetFloors,
    }));

    io.emit("STATUS_UPDATE", status);
  }
}
