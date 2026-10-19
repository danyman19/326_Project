
import { Router } from "express";
import * as eventsController from "../controllers/eventsController.js";

const router = Router();

router.get("/", eventsController.list);
router.post("/", eventsController.create);
router.delete("/", eventsController.destroy);

export default router;
