import express from "express";
import * as ElevatorController from "../controllers/ElevatorController";

const router = express.Router();

router.post("/call", ElevatorController.callElevator);
router.get("/status", ElevatorController.getElevatorStatus);

export default router;
