import { RequestHandler } from "express";
import { Request } from "../models/Request";
import { elevatorManager } from "../server";
import { validateElevatorRequest } from "../validates";

export const callElevator: RequestHandler = (req, res) => {
  const validationResult = validateElevatorRequest(req.body);
  if ("error" in validationResult) {
    res.status(400).json({ error: validationResult.error });
    return;
  }

  const { floor, direction } = validationResult;

  const elevatorRequest = new Request(floor, direction, "CALL");
  elevatorManager.handleRequest(elevatorRequest);

  res.status(200).json({ message: "Request sent" });
};

export const getElevatorStatus: RequestHandler = (req, res) => {
  res.status(200).json({ elevators: elevatorManager.elevators });
};
