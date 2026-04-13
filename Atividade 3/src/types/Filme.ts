export type Genero = "Ação" | "Aventura" | "Comédia" | "Drama" | "Ficção Científica" | "Terror" | "Romance" | "Animação" | "Documentário" | "Suspense" | string;

export type CriterioOrdenacao = "titulo" | "ano" | "avaliacao" | "duracao";

export interface Filme {
  titulo: string;
  anoLancamento: number;
  genero: Genero;
  duracaoMinutos: number;
  avaliacao?: number;
}

export type ResultadoBusca = Filme | undefined;