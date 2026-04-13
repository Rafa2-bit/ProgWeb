import * as readline from "readline";
import { Filme } from "../types/Filme";

// ─── Interface readline ───────────────────────────────────────────────────────

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pergunta que retorna uma Promise
export function pergunta(texto: string): Promise<string> {
  return new Promise((resolve) => rl.question(texto, resolve));
}

// ─── Exibição ─────────────────────────────────────────────────────────────────

export function exibirFilme(filme: Filme, indice?: number): void {
  const prefixo = indice !== undefined ? `[${indice + 1}] ` : "  ";
  console.log(`\n${prefixo}🎬 ${filme.titulo}`);
  console.log(`     Ano      : ${filme.anoLancamento}`);
  console.log(`     Gênero   : ${filme.genero}`);
  console.log(`     Duração  : ${filme.duracaoMinutos} min`);
  console.log(
    `     Avaliação: ${
      filme.avaliacao !== undefined ? `${filme.avaliacao}/10` : "Sem avaliação"
    }`
  );
}

export function exibirLista(filmes: Filme[]): void {
  if (filmes.length === 0) {
    console.log("\n⚠️  Nenhum filme encontrado.");
    return;
  }
  filmes.forEach((f, i) => exibirFilme(f, i));
}

export function linha(): void {
  console.log("\n" + "─".repeat(50));
}

export function cabecalho(titulo: string): void {
  linha();
  console.log(`  ${titulo}`);
  linha();
}

// ─── Menu principal ───────────────────────────────────────────────────────────

export function exibirMenu(): void {
  console.log("\n╔══════════════════════════════════╗");
  console.log("║     🎥  CATÁLOGO DE FILMES       ║");
  console.log("╠══════════════════════════════════╣");
  console.log("║  1. Adicionar filme              ║");
  console.log("║  2. Listar todos os filmes       ║");
  console.log("║  3. Buscar por título            ║");
  console.log("║  4. Buscar por gênero            ║");
  console.log("║  5. Remover filme                ║");
  console.log("║  6. Ordenar filmes               ║");
  console.log("║  7. Ver estatísticas             ║");
  console.log("║  0. Encerrar                     ║");
  console.log("╚══════════════════════════════════╝");
}
