import app from "./app";
import prisma from "./prisma/client";

// Global BigInt serialization fix
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const PORT = process.env.PORT || 3333;

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Rotas disponíveis:`);
      console.log(`   GET/POST   /api/continentes`);
      console.log(`   GET/PUT/DELETE /api/continentes/:id`);
      console.log(`   GET/POST   /api/paises`);
      console.log(`   GET/PUT/DELETE /api/paises/:id`);
      console.log(`   GET/POST   /api/cidades`);
      console.log(`   GET/PUT/DELETE /api/cidades/:id`);
    });
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
    process.exit(1);
  }
}

main();
