import { Filme, CriterioOrdenacao, ResultadoBusca } from "../types/Filme";


export class CatalogoFilmes {
  private filmes: Filme[] = [];

  adicionarFilme(filme : Filme) : void {
    if(filme.avaliacao !== undefined) {
      if(filme.avaliacao < 0 || filme.avaliacao > 10) {
        throw new Error(`Avaliação inválida (${filme.avaliacao}). Deve ser entre 0 e 10.`);
      }
    }

    const existe = this.filmes.find(f => f.titulo.toLowerCase() === filme.titulo.toLowerCase());
    if(existe) {
      throw new Error(`Já existe um filme com o título "${filme.titulo}".`);
    }
    
    this.filmes.push(filme);
  }

  listarTodos() : Filme[] {
    return [...this.filmes];
  }

  buscarPorTitulo(titulo : string) : ResultadoBusca {
    return this.filmes.find(f => f.titulo.toLowerCase().includes(titulo.toLowerCase()));
  }

  buscarPorGenero(genero : string) : Filme[] {
    return this.filmes.filter(f => f.genero.toLowerCase() === genero.toLowerCase());
  }

  removerPorTitulo(titulo : string) : boolean {
    const indice = this.filmes.findIndex(f => f.titulo.toLowerCase() === titulo.toLowerCase());
    if(indice === -1) {
      return false;
    }

    this.filmes.splice(indice, 1);
    return true;
  }

  ordenarPor(criterio : CriterioOrdenacao) : Filme[] {
    const copia = [...this.filmes];

    return copia.sort((a, b) => {
      switch(criterio) {
        case "titulo":
          return a.titulo.localeCompare(b.titulo);
        case "ano":
          return a.anoLancamento - b.anoLancamento;
        case "avaliacao":
          return (b.avaliacao ?? 0) - (a.avaliacao ?? 0);
        case "duracao":
          return a.duracaoMinutos - b.duracaoMinutos;
        default:
          return 0;
      }
    });
  }

  totalFilmes() : number {
    return this.filmes.length;
  }

  mediaAvaliacoes() : number | null {
    const avaliados = this.filmes.filter(f => f.avaliacao !== undefined);
    if(avaliados.length === 0) {
      return null;
    }

    const soma = avaliados.reduce((acc, f) => acc + (f.avaliacao ?? 0), 0);
    return parseFloat((soma / avaliados.length).toFixed(1));
  }
}