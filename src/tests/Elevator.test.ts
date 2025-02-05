import { Direction } from "../enums";
import { Elevator } from "../models/Elevator";
import { Request } from "../models/Request";

jest.useFakeTimers();
jest.mock("../db", () => ({
  connection: {
    query: jest.fn(),
  },
}));

describe("Elevator", () => {
  it("should move as required", () => {
    const elevator = new Elevator(1);
    elevator.currentFloor = 1;
    const req = new Request(5, Direction.Up, "CALL");
    elevator.addRequest(req);

    jest.spyOn(elevator, "updateStatus").mockImplementation(() => {});

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
