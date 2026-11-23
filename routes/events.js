import { Router } from "express";
import * as eventsController from "../controllers/eventsController.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.use(requireLogin);

router.get("/", eventsController.list);
router.post("/", eventsController.create);
router.delete("/:id", eventsController.destroy);

export default router;