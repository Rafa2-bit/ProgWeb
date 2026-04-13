import { CatalogoFilmes } from "./classes/CatalogoFilmes";
import { Filme, CriterioOrdenacao } from "./types/Filme";
import {
  rl,
  pergunta,
  exibirMenu,
  exibirLista,
  exibirFilme,
  cabecalho,
  linha,
} from "./utils/ui";


const catalogo = new CatalogoFilmes();

// Filmes iniciais para demonstração
const filmesIniciais: Filme[] = [
  {
    titulo: "Interestelar",
    anoLancamento: 2014,
    genero: "Ficção Científica",
    duracaoMinutos: 169,
    avaliacao: 9.2,
  },
  {
    titulo: "O Poderoso Chefão",
    anoLancamento: 1972,
    genero: "Drama",
    duracaoMinutos: 175,
    avaliacao: 9.5,
  },
  {
    titulo: "Parasita",
    anoLancamento: 2019,
    genero: "Suspense",
    duracaoMinutos: 132,
    avaliacao: 8.5,
  },
  {
    titulo: "Toy Story",
    anoLancamento: 1995,
    genero: "Animação",
    duracaoMinutos: 81,
  },
];

filmesIniciais.forEach((f) => catalogo.adicionarFilme(f));


async function adicionarFilme(): Promise<void> {
  cabecalho("ADICIONAR FILME");

  const titulo = await pergunta("Título: ");
  if (!titulo.trim()) {
    console.log("!! Título não pode ser vazio !!");
    return;
  }

  const anoStr = await pergunta("Ano de lançamento: ");
  const ano = parseInt(anoStr);
  if (isNaN(ano) || ano < 1888 || ano > new Date().getFullYear() + 5) {
    console.log("!! Ano inválido !!");
    return;
  }

  const genero = await pergunta("Gênero: ");
  if (!genero.trim()) {
    console.log("!! Gênero não pode ser vazio !!");
    return;
  }

  const duracaoStr = await pergunta("Duração (minutos): ");
  const duracao = parseInt(duracaoStr);
  if (isNaN(duracao) || duracao <= 0) {
    console.log("!! Duração inválida !!");
    return;
  }

  const avaliacaoStr = await pergunta("Avaliação (0–10, deixe em branco para pular): ");
  let avaliacao: number | undefined = undefined;

  if (avaliacaoStr.trim() !== "") {
    avaliacao = parseFloat(avaliacaoStr);
    if (isNaN(avaliacao) || avaliacao < 0 || avaliacao > 10) {
      console.log("!! Avaliação deve ser um número entre 0 e 10 !!");
      return;
    }
  }

  const novoFilme: Filme = {
    titulo: titulo.trim(),
    anoLancamento: ano,
    genero: genero.trim(),
    duracaoMinutos: duracao,
    avaliacao,
  };

  try {
    catalogo.adicionarFilme(novoFilme);
    console.log(`\nFilme "${novoFilme.titulo}" adicionado com sucesso!`);
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      console.log(`\nErro: ${erro.message}`);
    }
  }
}

async function listarFilmes(): Promise<void> {
  cabecalho("TODOS OS FILMES");
  const filmes = catalogo.listarTodos();
  exibirLista(filmes);
  console.log(`\nTotal: ${catalogo.totalFilmes()} filme(s)`);
}

async function buscarPorTitulo(): Promise<void> {
  cabecalho("BUSCAR POR TÍTULO");
  const titulo = await pergunta("Digite o título (ou parte dele): ");

  const resultado = catalogo.buscarPorTitulo(titulo);
  if (resultado) {
    console.log("\nFilme encontrado:");
    exibirFilme(resultado);
  } else {
    console.log(`\nNenhum filme encontrado com "${titulo}".`);
  }
}

async function buscarPorGenero(): Promise<void> {
  cabecalho("BUSCAR POR GÊNERO");
  const genero = await pergunta("Digite o gênero: ");

  const resultados = catalogo.buscarPorGenero(genero);
  if (resultados.length > 0) {
    console.log(`\n${resultados.length} filme(s) encontrado(s):`);
    exibirLista(resultados);
  } else {
    console.log(`\nNenhum filme do gênero "${genero}" encontrado.`);
  }
}

async function removerFilme(): Promise<void> {
  cabecalho("REMOVER FILME");
  const titulo = await pergunta("Título exato do filme a remover: ");

  const confirmacao = await pergunta(
    `Tem certeza que deseja remover "${titulo}"? (s/n): `
  );
  if (confirmacao.toLowerCase() !== "s") {
    console.log("Operação cancelada.");
    return;
  }

  const removido = catalogo.removerPorTitulo(titulo);
  if (removido) {
    console.log(`\nFilme "${titulo}" removido com sucesso!`);
  } else {
    console.log(`\nFilme "${titulo}" não encontrado.`);
  }
}

async function ordenarFilmes(): Promise<void> {
  cabecalho("ORDENAR FILMES");
  console.log("Critérios disponíveis:");
  console.log("  1. Título (A-Z)");
  console.log("  2. Ano de lançamento");
  console.log("  3. Avaliação (maior primeiro)");
  console.log("  4. Duração");

  const opcao = await pergunta("\nEscolha o critério (1–4): ");

  const mapa: Record<string, CriterioOrdenacao> = {
    "1": "titulo",
    "2": "ano",
    "3": "avaliacao",
    "4": "duracao",
  };

  const criterio = mapa[opcao];
  if (!criterio) {
    console.log("Opção inválida!");
    return;
  }

  const ordenados = catalogo.ordenarPor(criterio);
  console.log(`\nFilmes ordenados por "${criterio}":`);
  exibirLista(ordenados);
}

function exibirEstatisticas(): void {
  cabecalho("ESTATÍSTICAS");
  const total = catalogo.totalFilmes();
  const media = catalogo.mediaAvaliacoes();

  console.log(`\n  Total de filmes  : ${total}`);
  console.log(
    `  Média de avaliações: ${media !== null ? `${media}/10` : "N/A (sem avaliações)"}`
  );
  linha();
}

// ─── Loop principal ───────────────

async function main(): Promise<void> {
  console.log("\nBem-vindo ao Catálogo de Filmes!");
  console.log(`   ${filmesIniciais.length} filmes carregados para demonstração.`);

  let rodando = true;

  while (rodando) {
    exibirMenu();
    const opcao = await pergunta("\nEscolha uma opção: ");

    switch (opcao.trim()) {
      case "1":
        await adicionarFilme();
        break;
      case "2":
        await listarFilmes();
        break;
      case "3":
        await buscarPorTitulo();
        break;
      case "4":
        await buscarPorGenero();
        break;
      case "5":
        await removerFilme();
        break;
      case "6":
        await ordenarFilmes();
        break;
      case "7":
        exibirEstatisticas();
        break;
      case "0":
        console.log("\nEncerrando o catálogo. Até logo!\n");
        rodando = false;
        break;
      default:
        console.log("\n!! Opção inválida. Tente novamente !!");
    }
  }

  rl.close();
}

main().catch(console.error);
