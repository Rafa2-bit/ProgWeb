-- CreateTable
CREATE TABLE "continentes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "continentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "populacao" INTEGER NOT NULL,
    "idioma" TEXT NOT NULL,
    "moeda" TEXT NOT NULL,
    "continenteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "populacao" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "paisId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cidades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "continentes_nome_key" ON "continentes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "paises_nome_key" ON "paises"("nome");

-- AddForeignKey
ALTER TABLE "paises" ADD CONSTRAINT "paises_continenteId_fkey" FOREIGN KEY ("continenteId") REFERENCES "continentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "paises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
