import { Router } from "express";
import {
  createBank,
  deleteBank,
  getAllBanks,
  getBankFromId,
  updateBank,
} from "../controllers/bankController";

const router = Router();

router.post("/", createBank);
router.get("/:id", getBankFromId);
router.get("/", getAllBanks);
router.patch("/:id", updateBank);
router.delete("/:id", deleteBank);

export default router;
