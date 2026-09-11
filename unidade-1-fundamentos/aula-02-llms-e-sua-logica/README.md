# Aula 02: LLMs e sua lógica

Data: 20/08. Objetivo do plano de ensino: apresentar LLMs e sua lógica. Atividade
prevista: demonstração prática. Competência: identificar o funcionamento de modelos
generativos.

Entrega da atividade: [atividade.md](atividade.md).
Código do experimento: [experimentos/proximo_token.py](experimentos/proximo_token.py).

## O que é um LLM

LLM é a sigla de Large Language Model, modelo de linguagem de grande porte. É uma rede
neural treinada com um objetivo bem mais simples do que o comportamento final sugere:
dado um trecho de texto, prever qual é a próxima unidade da sequência.

Todo o resto (responder pergunta, escrever código, resumir documento, traduzir) é
consequência de fazer essa previsão bem o suficiente e repetidas vezes. O modelo prevê
uma unidade, acrescenta essa unidade ao texto, e prevê de novo com o texto já
atualizado.

A arquitetura usada pelos modelos atuais é o Transformer, proposto em 2017 no artigo
*Attention Is All You Need*. O mecanismo central é a atenção, que permite ao modelo
pesar quais partes do texto de entrada são relevantes para prever a próxima unidade,
em vez de tratar a sequência posição por posição.

## Token, não palavra

O texto não entra no modelo em forma de letras nem de palavras. Ele é fatiado em
tokens, que são pedaços de tamanho variável. Palavras comuns costumam virar um token
só, palavras raras são quebradas em vários, e espaço e pontuação também contam.

Isso explica um comportamento que parece absurdo à primeira vista: um modelo capaz de
escrever um algoritmo de ordenação erra ao contar quantas letras "r" existem em uma
palavra. Ele nunca viu as letras. Ele viu um token, que para ele é uma unidade
indivisível, do mesmo jeito que nós não enxergamos os bytes de um caractere.

A quantidade de tokens também é a unidade de medida do custo e do limite de uma
requisição. Quando se fala em janela de contexto de N tokens, é disso que se trata.

## Previsão do próximo token

Diante de um contexto, o modelo não devolve uma palavra. Ele devolve uma distribuição
de probabilidade sobre todo o vocabulário. Para o contexto "o código apresentou um", a
saída teria uma forma parecida com esta:

```
erro            85%
aviso           10%
comportamento    5%
...              resto do vocabulário, com probabilidades muito baixas
```

Duas consequências importantes saem daí.

A primeira é que nenhum token tem probabilidade exatamente zero. A camada final aplica
uma função softmax, que distribui a massa de probabilidade sobre o vocabulário inteiro.
Não existe estado de "não sei responder" no mecanismo: sempre haverá um token mais
provável, mesmo quando o contexto é absurdo. É por isso que o modelo continua
respondendo com desenvoltura sobre assuntos que ele não conhece.

A segunda é que a resposta é o resultado de uma escolha dentro dessa distribuição, e
não da leitura de um valor armazenado. O modelo não guarda a frase certa em algum
lugar para recuperá-la.

## Temperatura e amostragem

O parâmetro que controla como a escolha é feita dentro da distribuição é a temperatura.

| Temperatura | Efeito | Uso típico |
|---|---|---|
| próxima de 0 | concentra quase toda a massa no token mais provável, saída praticamente determinística | extração de dados, classificação, geração de código |
| em torno de 1 | mantém a distribuição como o modelo a calculou | conversa de uso geral |
| acima de 1 | achata a distribuição e aumenta a chance de tokens improváveis | brainstorming, variação criativa |

Existem outros mecanismos de corte usados junto com a temperatura, como top-k (só os k
tokens mais prováveis podem ser sorteados) e top-p ou nucleus sampling (só os tokens
que somam p de probabilidade acumulada). Todos servem para o mesmo fim: decidir o quão
longe do topo da distribuição a escolha pode ir.

Isso responde a uma pergunta prática que aparece o tempo todo: por que o mesmo prompt
devolve respostas diferentes. Porque, com temperatura acima de zero, há sorteio. Não é
instabilidade nem defeito, é o modo de operação.

## Como o modelo é treinado

O treinamento acontece em fases, e cada fase explica um comportamento diferente:

1. **Pré-treinamento.** O modelo lê um volume enorme de texto e aprende a prever o
   próximo token. É aqui que ele adquire gramática, estrutura de código e conhecimento
   factual. É também aqui que ele absorve os vieses presentes nesse texto.
2. **Ajuste por instrução.** O modelo é treinado com pares de instrução e resposta para
   aprender a se comportar como assistente, e não apenas a continuar o texto.
3. **Alinhamento com preferência humana.** Avaliadores humanos comparam respostas e
   esse sinal é usado para ajustar o modelo. É o que torna a resposta educada, formatada
   e recusável em certos casos.

O ponto que merece atenção é que a fase 3 otimiza o modelo para produzir respostas que
pessoas consideram boas. Uma resposta segura, bem escrita e confiante é avaliada como
boa por um humano ainda que esteja errada. O treinamento, portanto, tem um incentivo
embutido para a resposta parecer correta, e nenhum mecanismo direto para garantir que
ela seja.

## Por que os modelos alucinam

Reunindo as peças anteriores, a alucinação deixa de ser um mistério:

- o modelo escolhe a continuação mais provável, e provável não é sinônimo de verdadeiro;
- não existe estado interno de "desconhecido", porque a softmax sempre produz um vencedor;
- o treinamento premia respostas que parecem boas;
- o modelo não consulta fonte alguma no momento de responder, a menos que a ferramenta
  em volta dele faça uma busca e insira o resultado no contexto.

Uma referência inventada é o caso mais didático. O modelo aprendeu o formato de uma
citação acadêmica, aprendeu nomes de autores da área e aprendeu títulos plausíveis.
Combinar as três coisas produz uma citação com estrutura perfeita e que não existe.

## Limite de conhecimento e contexto

Um LLM tem uma data de corte de conhecimento: o que aconteceu depois do treinamento não
está nos pesos do modelo. Quando um assistente responde corretamente sobre um evento
recente, quase sempre é porque a ferramenta fez uma busca e colocou o texto encontrado
no contexto antes de perguntar ao modelo.

Isso separa dois tipos de informação que o modelo usa:

| Origem | Onde está | Como corrigir se estiver errada |
|---|---|---|
| Conhecimento paramétrico | codificado nos pesos, vindo do treinamento | não dá para corrigir na hora, só contornar |
| Contexto | o texto que eu envio no prompt | reescrever o prompt |

Essa é a razão prática de colar o trecho de código, a regra de negócio ou o enunciado
dentro do prompt em vez de descrevê-lo de memória. O que está no contexto é a única
parte que está sob meu controle.

## O que isso muda para quem usa

| Comportamento observado | Explicação pelo mecanismo |
|---|---|
| A mesma pergunta gera respostas diferentes | há amostragem sobre uma distribuição |
| O modelo erra ao contar letras ou sílabas | ele opera sobre tokens, não caracteres |
| Ele inventa referência com formato perfeito | aprendeu o formato, não a existência |
| Ele nunca diz que não sabe, a menos que treinado para isso | não existe distribuição vazia |
| Prompt mais específico melhora a resposta | reduz a incerteza sobre qual continuação é a esperada |
| Colar o material funciona melhor que citá-lo | contexto é editável, pesos não são |

A conclusão que abre a aula seguinte é esta: como não dá para alterar a arquitetura nem
os dados de treinamento, a única variável sob controle do usuário é o texto de entrada.
Estruturar esse texto de forma deliberada é o que a disciplina chama de Engenharia de
Prompt.

## Referências

- VASWANI, A. et al. *Attention Is All You Need*. NeurIPS, 2017.
  Disponível em: https://arxiv.org/abs/1706.03762
- BENDER, E. M. et al. *On the Dangers of Stochastic Parrots: Can Language Models Be
  Too Big?*. FAccT, 2021. Disponível em: https://dl.acm.org/doi/10.1145/3442188.3445922
- ANTHROPIC. *Prompt engineering overview*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- OPENAI. *Text generation*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://developers.openai.com/api/docs/guides/text
