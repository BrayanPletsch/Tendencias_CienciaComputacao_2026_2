# Aula inaugural: a jornada do semestre

Data: 06/08. Apresentação do plano de ensino, dos critérios de avaliação e da Missão 01,
chamada de atividade de decolagem.

Slides: [slides-jornada-do-semestre.pdf](slides-jornada-do-semestre.pdf).

## Como a disciplina se posiciona

A frase que abre os slides é que o semestre é uma viagem em que o estudante é quem
organiza e conduz. Na prática, isso aparece em duas decisões de formato: a avaliação é
majoritariamente prática, e a entrega é feita em repositório público, não em formulário.

A rota declarada vai do fundamento dos LLMs até a criação de agentes autônomos, passando
por engenharia de prompt, programação assistida e abordagens low code.

## Sistema de avaliação

| Item | Valor |
|---|---|
| A1 | 5,0 |
| A2 | 5,0 |
| Nota final | 10,0 |

- Aprovação com nota final igual ou superior a 6,0 e frequência igual ou superior a 75%.
- Avaliação Final disponível se a nota final ficar abaixo de 6,0, substituindo a menor nota.
- A A2 é composta por atividades práticas de 0,5 ponto cada, entregues no GitHub.

## Bibliografia indicada

- CARRARO, F. *Inteligência artificial e ChatGPT: da revolução à engenharia de prompt.*
- MURTA, R. *Conversando com robôs: a arte de GPTear.*
- LEE, P. et al. *A revolução da IA na medicina.*
- Complementar: BARCAUI, A. *Guia da IA*; CÓRDOVA, D. *Entre o fascínio e o medo.*

## Missão 01

O enunciado da atividade de decolagem tem duas linhas:

```text
MISSÃO 01:
> 1. Crie um prompt simples agora.
> 2. Compartilhe o resultado no Readme do repositório da disciplina.
```

### Prompt criado

```text
Explique o que é engenharia de prompt para alguém que já programa,
mas nunca usou IA generativa para trabalhar.
```

### Resultado

A resposta definiu engenharia de prompt como o trabalho de estruturar a instrução dada
a um modelo de linguagem, comparou o prompt à especificação de uma função (entrada,
comportamento esperado, formato de retorno) e listou quatro elementos: papel, contexto,
tarefa e formato.

### O que eu observei na época

Três coisas, registradas no dia da aula.

A comparação com assinatura de função foi útil e apareceu sozinha, sem eu ter pedido.
Provavelmente porque o prompt informava que o leitor já programa, e essa informação
puxou uma analogia do repertório de programação.

A resposta foi genérica na parte prática. Ela explicou o que é, mas não deu nenhum
exemplo de prompt bom contra prompt ruim, que era o que faltava para eu conseguir usar
aquilo.

E a frase que fechava a resposta, de que prompts bem escritos produzem resultados
melhores, é verdadeira e não informa nada. É o tipo de conclusão que soa bem e não muda
nenhuma decisão.

Essas três observações viraram a base do que eu fui investigar na
[Unidade 1](../unidade-1-fundamentos/): por que a informação sobre o leitor mudou a
analogia, por que uma resposta pode ser correta e inútil ao mesmo tempo, e como escrever
o prompt de forma que o resultado seja verificável em vez de apenas agradável de ler.

## Observação sobre este diretório

O arquivo de slides originalmente versionado neste repositório com o nome
`AulaInaugural_Programming_the_Jetson_Future.pdf` estava corrompido, com 2 bytes de
conteúdo. Ele foi substituído pelo PDF íntegro da apresentação da aula inaugural.
