# Catálogo de Filmes — TypeScript

Atividade Avaliativa — Programação Web | Fatec SJC  
Professor: André Olímpio

---

## Estrutura de arquivos

```
catalogo-filmes/
├── src/
│   ├── index.ts                  ← Ponto de entrada / menu interativo
│   ├── types/
│   │   └── Filme.ts              ← Interface Filme e tipos auxiliares
│   ├── classes/
│   │   └── CatalogoFilmes.ts     ← Classe com toda a lógica do catálogo
│   └── utils/
│       └── ui.ts                 ← Funções de exibição e leitura do console
├── tsconfig.json
├── package.json
└── README.md
```

---

## Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo desenvolvimento
```bash
npm run dev
```

### 3. Compilar e executar (produção)
```bash
npm run build
npm start
```

---

## Funcionalidades

| Opção | Descrição |
|-------|-----------|
| 1 | Adicionar novo filme (com validações) |
| 2 | Listar todos os filmes cadastrados |
| 3 | Buscar filme por título (busca parcial) |
| 4 | Buscar filmes por gênero |
| 5 | Remover filme pelo título (com confirmação) |
| 6 | Ordenar filmes (título, ano, avaliação, duração)  |
| 7 | Ver estatísticas do catálogo  |
| 0 | Encerrar a aplicação |

>  Melhorias extras implementadas

---

## Conceitos TypeScript utilizados

- `interface` para tipagem do Filme
- `type` para union types (`Genero`, `CriterioOrdenacao`)
- Propriedades opcionais (`avaliacao?`)
- Retorno explícito em todas as funções
- Classes com atributos `private`
- Métodos de array: `push`, `filter`, `find`, `map`, `sort`, `splice`
- Tratamento de erros com `try/catch`
- `async/await` para leitura do console
- Generics implícitos nos métodos de array
