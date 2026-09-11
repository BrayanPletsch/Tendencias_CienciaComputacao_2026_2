# Aula 03: Engenharia de Prompt

Data: 27/08. Objetivo do plano de ensino: introduzir Engenharia de Prompt. Competência:
elaborar instruções claras para IA. Atividade avaliativa A2, valor 0,5 ponto.

O material da professora numera esta aula como "Aula 02". Aqui ela aparece como aula 03
porque a numeração das pastas segue a ordem cronológica dos encontros da Unidade 1.

Entrega da atividade: [atividade.md](atividade.md).
Reflexão individual: [reflexao.md](reflexao.md).
Prompts testados: [prompts/](prompts/).
Código usado na validação: [codigo/](codigo/).
Slides da aula: [slides-engenharia-de-prompt.pdf](slides-engenharia-de-prompt.pdf).
Slides da atividade A2: [slides-atividade-a2.pdf](slides-atividade-a2.pdf).

## Prompt e Engenharia de Prompt

Um prompt é a instrução, pergunta ou conjunto de informações fornecidas a um sistema de
IA para orientar a geração de uma resposta.

Engenharia de Prompt é o processo de criar, estruturar, testar, avaliar e aperfeiçoar
essas instruções. A palavra que importa nessa definição é processo. O senso comum trata
o assunto como "saber perguntar", o que sugere um acerto de uma vez só. A prática é
outra: escrever, executar, comparar com um critério e reescrever.

```
Problema -> Prompt -> Resposta -> Análise -> Refinamento -> Nova resposta -> Validação
```

O ciclo apresentado em aula tem sete etapas: planejar, estruturar, experimentar,
avaliar, refinar, validar e utilizar.

## Por que estruturar

Considere a instrução:

```text
Crie uma atividade sobre programação.
```

O modelo precisa supor público, nível, linguagem, objetivo, duração, formato,
dificuldade e resultado esperado. Oito decisões que ele vai tomar sozinho, escolhendo
em cada uma a alternativa mais provável no material que ele viu durante o treinamento.
A chance de as oito coincidirem com o que eu queria é baixa.

Agora a mesma tarefa com as decisões explicitadas:

```text
Você é professor de programação.
Crie uma atividade prática sobre Python para estudantes
iniciantes de Computação.

Objetivo:
Introduzir estruturas condicionais.

A atividade deve:
- durar aproximadamente 30 minutos;
- conter um problema prático;
- apresentar instruções;
- possuir critérios de avaliação;
- terminar com três perguntas de reflexão.

Utilize linguagem clara e adequada para estudantes iniciantes.
```

O segundo prompt não é melhor por ser maior. Ele é melhor por eliminar suposições. Essa
distinção é o centro da aula seguinte.

## Anatomia de um prompt

| Elemento | Responde a | Exemplo |
|---|---|---|
| Papel | quem responde | `Você é um revisor de código Python.` |
| Contexto | qual a situação | `Os estudantes estão no primeiro semestre.` |
| Objetivo | o que se quer alcançar | `O objetivo é identificar requisitos ausentes.` |
| Tarefa | o que fazer | `Crie cinco exemplos de requisitos funcionais.` |
| Restrições | quais limites respeitar | `No máximo 300 palavras. Sem bibliotecas externas.` |
| Formato | como apresentar | `Tabela com Requisito, Descrição e Prioridade.` |
| Critérios de qualidade | como avaliar o resultado | `A resposta deve ser executável e testável.` |

Nem todo prompt precisa dos sete. Uma pergunta simples com um prompt de sete blocos
fica pior, não melhor.

## Os seis princípios

1. **Clareza.** Evitar instruções ambíguas e de dupla interpretação.
2. **Contexto.** Informar para quem e para qual finalidade a resposta será produzida.
3. **Especificidade.** Definir exatamente o que deve ser produzido e qual o escopo.
4. **Formato de saída.** Informar como se deseja receber o resultado.
5. **Restrições.** Definir os limites do modelo.
6. **Critérios de qualidade.** Definir as métricas de sucesso esperadas da resposta.

## Técnicas

**Role prompting.** Atribuir um papel ao modelo. O efeito prático é restringir o
vocabulário e as prioridades da resposta. Um revisor de segurança e um revisor de
performance olham o mesmo código e produzem listas diferentes. Essa técnica é
explorada em profundidade na [aula 05](../aula-05-contexto-e-estrutura-de-prompts/).

**Few-shot prompting.** Fornecer exemplos de entrada e saída antes da tarefa real. É a
forma mais confiável de fixar formato, porque mostrar o formato desejado funciona
melhor do que descrevê-lo.

```text
Classifique os requisitos como funcionais ou não funcionais.

Exemplo:
"O sistema deve permitir cadastrar alunos."   -> Funcional
"O sistema deve responder em até 2 segundos." -> Não funcional

Agora classifique:
"O sistema deve permitir recuperar a senha."
```

**Prompt com restrições.** Estabelecer limites explícitos de tamanho, vocabulário,
quantidade de itens e tecnologias permitidas.

**Prompt em etapas.** Dividir uma tarefa complexa em passos numerados, para que o modelo
não pule direto para a conclusão.

**Refinamento iterativo.** Tratar o prompt como versão. V1, testar, avaliar, V2, testar,
avaliar.

## Ética e responsabilidade

Uma resposta pode ser incorreta, incompleta, desatualizada, enviesada ou inventada, e
ainda assim aparentemente convincente. Resposta bem escrita não significa resposta
correta.

O ciclo de pensamento crítico proposto em aula: gerar, questionar, verificar, comparar,
validar, utilizar.

A responsabilidade não se transfere junto com a tarefa. Como está no material da
disciplina, o estudante é o único responsável pelo que entrega, e se ele não consegue
explicar o que escreveu ou programou, não houve aprendizagem.

## Critérios de avaliação da atividade

| Critério | Pontuação |
|---|---:|
| Definição do problema | 0,05 |
| Prompt inicial | 0,05 |
| Análise crítica | 0,10 |
| Prompt refinado | 0,15 |
| Comparação dos resultados | 0,05 |
| Ética e responsabilidade | 0,05 |
| Organização e registro no GitHub | 0,05 |
| Total | 0,50 |

## Referências

- ANTHROPIC. *Prompt engineering overview* e *Prompting best practices*. Documentação
  oficial, consultada em 10/09/2026.
  Disponível em: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- OPENAI. *Text generation*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://developers.openai.com/api/docs/guides/text
- PYTHON SOFTWARE FOUNDATION. *unittest: Unit testing framework*.
  Disponível em: https://docs.python.org/3/library/unittest.html
