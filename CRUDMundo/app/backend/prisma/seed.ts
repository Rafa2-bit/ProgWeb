import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpa o banco na ordem correta (filhos primeiro)
  await prisma.cidades.deleteMany();
  await prisma.paises.deleteMany();
  await prisma.continentes.deleteMany();

  // Continentes
  const americaSul = await prisma.continentes.create({
    data: { nome: "América do Sul", descricao: "Continente com 12 países soberanos" },
  });
  const europa = await prisma.continentes.create({
    data: { nome: "Europa", descricao: "Continente com rica história e cultura" },
  });
  const asia = await prisma.continentes.create({
    data: { nome: "Ásia", descricao: "O maior continente do mundo" },
  });
  const africa = await prisma.continentes.create({
    data: { nome: "África", descricao: "Segundo maior continente do mundo" },
  });

  console.log("✅ Continentes criados");

  // Países
  const brasil = await prisma.paises.create({
    data: { nome: "Brasil", populacao: 215000000, idioma: "Português", moeda: "BRL", continenteId: americaSul.id },
  });
  const argentina = await prisma.paises.create({
    data: { nome: "Argentina", populacao: 46000000, idioma: "Espanhol", moeda: "ARS", continenteId: americaSul.id },
  });
  const alemanha = await prisma.paises.create({
    data: { nome: "Alemanha", populacao: 84000000, idioma: "Alemão", moeda: "EUR", continenteId: europa.id },
  });
  const franca = await prisma.paises.create({
    data: { nome: "França", populacao: 68000000, idioma: "Francês", moeda: "EUR", continenteId: europa.id },
  });
  const japao = await prisma.paises.create({
    data: { nome: "Japão", populacao: 125000000, idioma: "Japonês", moeda: "JPY", continenteId: asia.id },
  });
  await prisma.paises.create({
    data: { nome: "Nigéria", populacao: 220000000, idioma: "Inglês", moeda: "NGN", continenteId: africa.id },
  });

  console.log("✅ Países criados");

  // Cidades
  await prisma.cidades.createMany({
    data: [
      { nome: "São Paulo",      populacao: 12000000, latitude: -23.55, longitude: -46.63, paisId: brasil.id },
      { nome: "Rio de Janeiro", populacao: 6800000,  latitude: -22.90, longitude: -43.17, paisId: brasil.id },
      { nome: "Brasília",       populacao: 3100000,  latitude: -15.78, longitude: -47.92, paisId: brasil.id },
      { nome: "Buenos Aires",   populacao: 3100000,  latitude: -34.60, longitude: -58.38, paisId: argentina.id },
      { nome: "Berlim",         populacao: 3700000,  latitude: 52.52,  longitude: 13.40,  paisId: alemanha.id },
      { nome: "Munique",        populacao: 1500000,  latitude: 48.13,  longitude: 11.57,  paisId: alemanha.id },
      { nome: "Paris",          populacao: 2200000,  latitude: 48.85,  longitude: 2.35,   paisId: franca.id },
      { nome: "Tóquio",         populacao: 13900000, latitude: 35.68,  longitude: 139.69, paisId: japao.id },
    ],
  });

  console.log("✅ Cidades criadas");
  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
