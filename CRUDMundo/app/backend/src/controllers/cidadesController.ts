import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /cidades  — suporta ?nome=&paisId=&continenteId=&page=&limit=
export async function listar(req: Request, res: Response) {
  try {
    const { nome, paisId, continenteId, page = "1", limit = "10" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (nome) where.nome = { contains: String(nome), mode: "insensitive" };
    if (paisId) where.paisId = Number(paisId);
    if (continenteId) where.pais = { continenteId: Number(continenteId) };

    const [cidades, total] = await Promise.all([
      prisma.cidades.findMany({
        where,
        include: {
          pais: {
            select: {
              id: true,
              nome: true,
              moeda: true,
              continente: { select: { id: true, nome: true } },
            },
          },
        },
        orderBy: { nome: "asc" },
        skip,
        take: Number(limit),
      }),
      prisma.cidades.count({ where }),
    ]);

    res.json({
      data: cidades,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar cidades" });
  }
}

// GET /cidades/:id
export async function buscarPorId(req: Request, res: Response) {
  try {
    const cidade = await prisma.cidades.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        pais: {
          include: { continente: true },
        },
      },
    });
    if (!cidade) return res.status(404).json({ error: "Cidade não encontrada" });
    res.json(cidade);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidade" });
  }
}

// POST /cidades
export async function criar(req: Request, res: Response) {
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    if (!nome || !populacao || latitude === undefined || longitude === undefined || !paisId) {
      return res.status(400).json({ error: "Campos obrigatórios: nome, populacao, latitude, longitude, paisId" });
    }
    const cidade = await prisma.cidades.create({
      data: {
        nome,
        populacao: Number(populacao),
        latitude: Number(latitude),
        longitude: Number(longitude),
        paisId: Number(paisId),
      },
      include: {
        pais: { select: { id: true, nome: true, continente: { select: { id: true, nome: true } } } },
      },
    });
    res.status(201).json(cidade);
  } catch (err: any) {
    if (err.code === "P2003") return res.status(400).json({ error: "País não encontrado" });
    res.status(500).json({ error: "Erro ao criar cidade" });
  }
}

// PUT /cidades/:id
export async function atualizar(req: Request, res: Response) {
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    const cidade = await prisma.cidades.update({
      where: { id: Number(req.params.id) },
      data: {
        nome,
        populacao: populacao ? Number(populacao) : undefined,
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        paisId: paisId ? Number(paisId) : undefined,
      },
      include: {
        pais: { select: { id: true, nome: true, continente: { select: { id: true, nome: true } } } },
      },
    });
    res.json(cidade);
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Cidade não encontrada" });
    if (err.code === "P2003") return res.status(400).json({ error: "País não encontrado" });
    res.status(500).json({ error: "Erro ao atualizar cidade" });
  }
}

// DELETE /cidades/:id
export async function deletar(req: Request, res: Response) {
  try {
    await prisma.cidades.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Cidade deletada com sucesso" });
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Cidade não encontrada" });
    res.status(500).json({ error: "Erro ao deletar cidade" });
  }
}
