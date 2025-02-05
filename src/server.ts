import cors from "cors";
import express from "express";
import elevatorRoutes from "./routes/elevatorRoutes";

import { ElevatorManager } from "./managers/ElevatorManager";
import { app } from "./websocket";

app.use(cors());
app.use(express.json());

const elevatorManager = new ElevatorManager(3);

// Routes
app.use("/api/elevators", elevatorRoutes);

console.log("Server is running and ElevatorManager is active.");

export { elevatorManager };
