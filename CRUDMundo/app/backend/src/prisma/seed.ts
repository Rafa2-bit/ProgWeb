import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Continentes
  const americaSul = await prisma.continente.upsert({
    where: { nome: "América do Sul" },
    update: {},
    create: { nome: "América do Sul", descricao: "Continente com 12 países soberanos" },
  });
  const europa = await prisma.continente.upsert({
    where: { nome: "Europa" },
    update: {},
    create: { nome: "Europa", descricao: "Continente com rica história e cultura" },
  });
  const asia = await prisma.continente.upsert({
    where: { nome: "Ásia" },
    update: {},
    create: { nome: "Ásia", descricao: "O maior continente do mundo" },
  });
  const africa = await prisma.continente.upsert({
    where: { nome: "África" },
    update: {},
    create: { nome: "África", descricao: "Segundo maior continente do mundo" },
  });

  console.log("✅ Continentes criados");

  // Países
  const brasil = await prisma.pais.upsert({
    where: { nome: "Brasil" },
    update: {},
    create: { nome: "Brasil", populacao: 215000000, idioma: "Português", moeda: "BRL", continenteId: americaSul.id },
  });
  const argentina = await prisma.pais.upsert({
    where: { nome: "Argentina" },
    update: {},
    create: { nome: "Argentina", populacao: 46000000, idioma: "Espanhol", moeda: "ARS", continenteId: americaSul.id },
  });
  const alemanha = await prisma.pais.upsert({
    where: { nome: "Alemanha" },
    update: {},
    create: { nome: "Alemanha", populacao: 84000000, idioma: "Alemão", moeda: "EUR", continenteId: europa.id },
  });
  const franca = await prisma.pais.upsert({
    where: { nome: "França" },
    update: {},
    create: { nome: "França", populacao: 68000000, idioma: "Francês", moeda: "EUR", continenteId: europa.id },
  });
  const japao = await prisma.pais.upsert({
    where: { nome: "Japão" },
    update: {},
    create: { nome: "Japão", populacao: 125000000, idioma: "Japonês", moeda: "JPY", continenteId: asia.id },
  });
  await prisma.pais.upsert({
    where: { nome: "Nigéria" },
    update: {},
    create: { nome: "Nigéria", populacao: 220000000, idioma: "Inglês", moeda: "NGN", continenteId: africa.id },
  });

  console.log("✅ Países criados");

  // Cidades
  const cidadesData = [
    { nome: "São Paulo", populacao: 12000000, latitude: -23.55, longitude: -46.63, paisId: brasil.id },
    { nome: "Rio de Janeiro", populacao: 6800000, latitude: -22.9, longitude: -43.17, paisId: brasil.id },
    { nome: "Buenos Aires", populacao: 3100000, latitude: -34.6, longitude: -58.38, paisId: argentina.id },
    { nome: "Berlim", populacao: 3700000, latitude: 52.52, longitude: 13.4, paisId: alemanha.id },
    { nome: "Paris", populacao: 2200000, latitude: 48.85, longitude: 2.35, paisId: franca.id },
    { nome: "Tóquio", populacao: 13900000, latitude: 35.68, longitude: 139.69, paisId: japao.id },
  ];

  for (const cidade of cidadesData) {
    await prisma.cidade.upsert({
      where: { nome_paisId: { nome: cidade.nome, paisId: cidade.paisId } },
      update: {},
      create: cidade,
    });
  }

  console.log("✅ Cidades criadas");
  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
