# Aula 02: LLMs e sua lógica

Data: 20/08. Objetivo do plano de ensino: apresentar LLMs e sua lógica. Atividade
prevista: demonstração prática. Competência: identificar o funcionamento de modelos
generativos.

Entrega da atividade: [atividade.md](atividade.md).
Código do experimento: [experimentos/proximo_token.py](experimentos/proximo_token.py).

## O que é um LLM

LLM é a sigla de Large Language Model, modelo de linguagem de grande porte. É uma rede
neural treinada para uma tarefa bem mais simples do que o comportamento final faz
parecer: dado um trecho de texto, prever qual é a próxima unidade da sequência.

Responder pergunta, escrever código, resumir documento e traduzir saem todos dessa
previsão, feita bem o bastante e repetidas vezes. O modelo prevê uma unidade, acrescenta
essa unidade ao texto e prevê de novo com o texto já atualizado.

Os modelos atuais usam a arquitetura Transformer, proposta em 2017 no artigo
*Attention Is All You Need*. A peça principal dela é a atenção, que deixa o modelo pesar
quais partes do texto de entrada importam para prever a próxima unidade, sem precisar
percorrer a sequência posição por posição.

## Tokens

O texto não entra no modelo como letras nem como palavras. Ele é fatiado em tokens,
pedaços de tamanho variável. Palavras comuns costumam virar um token só, palavras raras
são quebradas em vários, e espaço e pontuação também contam.

Isso explica uma coisa que parece absurda à primeira vista: um modelo capaz de escrever
um algoritmo de ordenação erra ao contar quantas letras "r" existem em uma palavra. As
letras nunca chegaram até ele. O que
chegou foi um token, que para o modelo é uma unidade indivisível, mais ou menos como a
gente não enxerga os bytes de um caractere.

A quantidade de tokens também é a medida do custo e do limite de uma requisição. A
janela de contexto de N tokens se refere a isso.

## Previsão do próximo token

Para um contexto qualquer, o modelo devolve uma distribuição de probabilidade sobre todo
o vocabulário. Com o contexto "o código apresentou um", a saída teria uma forma parecida
com esta:

```
erro            85%
aviso           10%
comportamento    5%
...              resto do vocabulário, com probabilidades muito baixas
```

Daí saem duas consequências.

Nenhum token fica com probabilidade exatamente zero. A camada final aplica uma função
softmax, que espalha a massa de probabilidade pelo vocabulário inteiro. O mecanismo não
tem um estado de "não sei responder": sempre vai existir um token mais provável, mesmo
quando o contexto é absurdo. É por isso que o modelo continua respondendo com
desenvoltura sobre assuntos que não conhece.

Além disso, a resposta sai de uma escolha feita dentro dessa distribuição. O modelo não
tem a frase certa guardada em algum lugar para ir buscar.

## Temperatura e amostragem

A temperatura é o parâmetro que controla como essa escolha é feita.

| Temperatura | Efeito | Uso típico |
|---|---|---|
| próxima de 0 | concentra quase toda a massa no token mais provável, saída praticamente determinística | extração de dados, classificação, geração de código |
| em torno de 1 | mantém a distribuição como o modelo a calculou | conversa de uso geral |
| acima de 1 | achata a distribuição e aumenta a chance de tokens improváveis | brainstorming, variação criativa |

Junto com a temperatura também se usam mecanismos de corte, como top-k (só os k tokens
mais prováveis podem ser sorteados) e top-p ou nucleus sampling (só os tokens que somam
p de probabilidade acumulada). Todos decidem a mesma coisa: até onde, a partir do topo
da distribuição, a escolha pode ir.

Isso responde uma dúvida que aparece o tempo todo, a de por que o mesmo prompt devolve
respostas diferentes. Com temperatura acima de zero existe sorteio, então a variação é o
funcionamento normal do modelo.

## Como o modelo é treinado

O treinamento acontece em fases, e cada uma explica um comportamento diferente.

1. Pré-treinamento. O modelo lê um volume enorme de texto e aprende a prever o próximo
   token. Nessa fase ele adquire gramática, estrutura de código e conhecimento factual,
   e também absorve os vieses presentes nesse texto.
2. Ajuste por instrução. O modelo é treinado com pares de instrução e resposta. Antes
   disso ele só continua texto; com esse ajuste aprende a se comportar como assistente.
3. Alinhamento com preferência humana. Avaliadores humanos comparam respostas e esse
   sinal é usado para ajustar o modelo. Daí vem a resposta educada e formatada, e também
   a recusa em certos casos.

A fase 3 otimiza o modelo para produzir respostas que pessoas consideram boas. Só que um
avaliador humano dá nota boa a uma resposta segura, bem escrita e confiante mesmo quando
ela está errada. Então o treinamento incentiva a resposta a parecer correta e não tem
nenhum mecanismo direto que garanta que ela esteja.

## Por que os modelos alucinam

Juntando o que veio antes, dá para explicar a alucinação:

- o modelo escolhe a continuação mais provável, e o mais provável nem sempre é verdadeiro;
- não existe estado interno de "desconhecido", porque a softmax sempre produz um vencedor;
- o treinamento premia respostas que parecem boas;
- o modelo não consulta fonte nenhuma na hora de responder, a menos que a ferramenta em
  volta dele faça uma busca e coloque o resultado no contexto.

O exemplo mais fácil de entender é a referência inventada. O modelo aprendeu o formato de
uma citação acadêmica, nomes de autores da área e títulos plausíveis. Combinando isso,
sai uma citação com a estrutura certinha de um trabalho que não existe.

## Limite de conhecimento e contexto

Um LLM tem uma data de corte de conhecimento. O que aconteceu depois do treinamento não
está nos pesos do modelo. Quando um assistente acerta algo sobre um evento recente, quase
sempre foi porque a ferramenta fez uma busca e colocou o texto encontrado no contexto
antes de perguntar ao modelo.

Então o modelo trabalha com dois tipos de informação:

| Origem | Onde está | Como corrigir se estiver errada |
|---|---|---|
| Conhecimento paramétrico | codificado nos pesos, vindo do treinamento | não dá para corrigir na hora, só contornar |
| Contexto | o texto que eu envio no prompt | reescrever o prompt |

Por isso compensa colar no prompt o trecho de código, a regra de negócio ou o enunciado,
em vez de descrever de memória. O contexto é a única parte que fica sob meu controle.

## O que isso muda para quem usa

| Comportamento observado | Explicação pelo mecanismo |
|---|---|
| A mesma pergunta gera respostas diferentes | há amostragem sobre uma distribuição |
| O modelo erra ao contar letras ou sílabas | ele opera sobre tokens, e não sobre caracteres |
| Ele inventa referência com formato perfeito | aprendeu o formato da citação, sem saber se a obra existe |
| Ele nunca diz que não sabe, a menos que treinado para isso | não existe distribuição vazia |
| Prompt mais específico melhora a resposta | reduz a incerteza sobre qual continuação é a esperada |
| Colar o material funciona melhor que citá-lo | o contexto pode ser editado, os pesos não |

Daí sai a conclusão que abre a aula seguinte. Como o usuário não consegue alterar a arquitetura
nem os dados de treinamento, o que sobra sob controle dele é o texto de entrada.
Estruturar esse texto de propósito é o que a disciplina chama de Engenharia de Prompt.

## Referências

- VASWANI, A. et al. *Attention Is All You Need*. NeurIPS, 2017.
  Disponível em: https://arxiv.org/abs/1706.03762
- BENDER, E. M. et al. *On the Dangers of Stochastic Parrots: Can Language Models Be
  Too Big?*. FAccT, 2021. Disponível em: https://dl.acm.org/doi/10.1145/3442188.3445922
- ANTHROPIC. *Prompt engineering overview*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- OPENAI. *Text generation*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://developers.openai.com/api/docs/guides/text
