import { connection } from "../db";
import { Direction } from "../enums";
import { ElevatorManager } from "../managers/ElevatorManager";
import { Request } from "../models/Request";

jest.mock("../websocket", () => ({
  wsServer: {
    connections: [],
  },
}));

describe("ElevatorManager", () => {
  let elevatorManager: ElevatorManager;

  beforeAll(() => {
    elevatorManager = new ElevatorManager(3);
  });

  it("should allocate the correct elevator when receiving the request", () => {
    const req = new Request(3, Direction.Up, "CALL");
    elevatorManager.handleRequest(req);
    expect(elevatorManager.elevators[0].targetFloors).toContain(3);
  });

  afterAll((done) => {
    connection.end((err) => {
      if (err) console.error("Error closing connection:", err);
      done();
    });
  });
});
