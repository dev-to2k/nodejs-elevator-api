// src/models/Request.ts
import { Direction } from "../enums";

export class Request {
  constructor(
    public floor: number,
    public direction: Direction,
    public type: "CALL" | "SELECT"
  ) {}
}
