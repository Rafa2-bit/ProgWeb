import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /continentes
export async function listar(req: Request, res: Response) {
  try {
    const { nome } = req.query;
    const continentes = await prisma.continentes.findMany({
      where: nome ? { nome: { contains: String(nome), mode: "insensitive" } } : undefined,
      include: { _count: { select: { paises: true } } },
      orderBy: { nome: "asc" },
    });
    res.json(continentes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar continentes" });
  }
}

// GET /continentes/:id
export async function buscarPorId(req: Request, res: Response) {
  try {
    const continente = await prisma.continentes.findUnique({
      where: { id: Number(req.params.id) },
      include: { paises: true },
    });
    if (!continente) return res.status(404).json({ error: "Continente não encontrado" });
    res.json(continente);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar continente" });
  }
}

// POST /continentes
export async function criar(req: Request, res: Response) {
  try {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
      return res.status(400).json({ error: "Campos obrigatórios: nome, descricao" });
    }
    const continente = await prisma.continentes.create({ data: { nome, descricao } });
    res.status(201).json(continente);
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ error: "Já existe um continente com esse nome" });
    res.status(500).json({ error: "Erro ao criar continente" });
  }
}

// PUT /continentes/:id
export async function atualizar(req: Request, res: Response) {
  try {
    const { nome, descricao } = req.body;
    const continente = await prisma.continentes.update({
      where: { id: Number(req.params.id) },
      data: { nome, descricao },
    });
    res.json(continente);
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Continente não encontrado" });
    if (err.code === "P2002") return res.status(409).json({ error: "Já existe um continente com esse nome" });
    res.status(500).json({ error: "Erro ao atualizar continente" });
  }
}

// DELETE /continentes/:id
export async function deletar(req: Request, res: Response) {
  try {
    await prisma.continentes.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Continente deletado com sucesso" });
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Continente não encontrado" });
    res.status(500).json({ error: "Erro ao deletar continente" });
  }
}
