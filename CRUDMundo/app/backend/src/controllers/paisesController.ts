import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /paises
export async function listar(req: Request, res: Response) {
  try {
    const { nome, continenteId } = req.query;
    const paises = await prisma.paises.findMany({
      where: {
        ...(nome ? { nome: { contains: String(nome), mode: "insensitive" } } : {}),
        ...(continenteId ? { continenteId: Number(continenteId) } : {}),
      },
      include: {
        continente: { select: { id: true, nome: true } },
        _count: { select: { cidades: true } },
      },
      orderBy: { nome: "asc" },
    });
    res.json(paises);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar países" });
  }
}

// GET /paises/:id
export async function buscarPorId(req: Request, res: Response) {
  try {
    const pais = await prisma.paises.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        continente: true,
        cidades: true,
      },
    });
    if (!pais) return res.status(404).json({ error: "País não encontrado" });
    res.json(pais);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar país" });
  }
}

// POST /paises
export async function criar(req: Request, res: Response) {
  try {
    const { nome, populacao, idioma, moeda, continenteId } = req.body;
    if (!nome || !populacao || !idioma || !moeda || !continenteId) {
      return res.status(400).json({ error: "Campos obrigatórios: nome, populacao, idioma, moeda, continenteId" });
    }
    const pais = await prisma.paises.create({
      data: { nome, populacao: Number(populacao), idioma, moeda, continenteId: Number(continenteId) },
      include: { continente: { select: { id: true, nome: true } } },
    });
    res.status(201).json(pais);
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ error: "Já existe um país com esse nome" });
    if (err.code === "P2003") return res.status(400).json({ error: "Continente não encontrado" });
    res.status(500).json({ error: "Erro ao criar país" });
  }
}

// PUT /paises/:id
export async function atualizar(req: Request, res: Response) {
  try {
    const { nome, populacao, idioma, moeda, continenteId } = req.body;
    const pais = await prisma.paises.update({
      where: { id: Number(req.params.id) },
      data: {
        nome,
        populacao: populacao ? Number(populacao) : undefined,
        idioma,
        moeda,
        continenteId: continenteId ? Number(continenteId) : undefined,
      },
      include: { continente: { select: { id: true, nome: true } } },
    });
    res.json(pais);
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "País não encontrado" });
    if (err.code === "P2002") return res.status(409).json({ error: "Já existe um país com esse nome" });
    res.status(500).json({ error: "Erro ao atualizar país" });
  }
}

// DELETE /paises/:id
export async function deletar(req: Request, res: Response) {
  try {
    await prisma.paises.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "País deletado com sucesso" });
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "País não encontrado" });
    res.status(500).json({ error: "Erro ao deletar país" });
  }
}
