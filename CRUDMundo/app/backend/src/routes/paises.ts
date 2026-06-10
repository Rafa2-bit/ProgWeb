import { Router } from "express";
import * as ctrl from "../controllers/paisesController";

const router = Router();

router.get("/",      ctrl.listar);
router.get("/:id",   ctrl.buscarPorId);
router.post("/",     ctrl.criar);
router.put("/:id",   ctrl.atualizar);
router.delete("/:id",ctrl.deletar);

export default router;
