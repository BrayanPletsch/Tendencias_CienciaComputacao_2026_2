# Aula 01: fundamentos de IA e modelos generativos

Data: 13/08. Primeira aula da Unidade 1. Objetivo do plano de ensino: introduzir
fundamentos de IA e modelos generativos. Competência: compreender conceitos básicos
de IA.

Slides originais: [slides-aula-01.pdf](slides-aula-01.pdf).
Entrega da atividade: [atividade.md](atividade.md).

## O que é inteligência artificial

É uma área da computação dedicada a desenvolver sistemas capazes de realizar tarefas
que normalmente associamos à inteligência humana, o que inclui compreensão de
linguagem, reconhecimento de padrões e tomada de decisão.

A definição é ampla de propósito. Filtro de spam, cálculo de rota no mapa, tradução
automática e geração de texto cabem todos nela, mesmo usando técnicas bem diferentes
entre si.

## A hierarquia dos termos

Os quatro termos que mais se confundem ficam um dentro do outro, em camadas:

```
Inteligência Artificial
  └── Machine Learning
        └── Deep Learning
              └── IA Generativa
```

O campo mais amplo é a Inteligência Artificial, focada em criar sistemas inteligentes.
Dentro dela está o Machine Learning, em que os algoritmos aprendem e identificam
padrões a partir de dados, sem que as regras sejam programadas explicitamente. O Deep
Learning é o subconjunto do ML baseado em redes neurais artificiais profundas, usado em
reconhecimento de voz e de imagem. E a IA Generativa reúne os sistemas modernos,
construídos sobre Deep Learning, capazes de gerar conteúdo inédito.

Por isso dizer que um sistema "usa IA" quase não informa nada. Saber em qual dessas
camadas ele opera já diz bastante sobre o que ele consegue e o que não consegue fazer.

## Como a máquina aprende

A diferença entre programação tradicional e aprendizado de máquina está no que entra e
no que sai do processo.

| | Entrada | Saída |
|---|---|---|
| Programação tradicional | dados + regras programadas manualmente | respostas |
| Machine Learning | dados + respostas conhecidas | regras e padrões identificados |

Na programação tradicional, o programador escreve a regra. Em ML, ele fornece exemplos
de entrada com a resposta correta e o algoritmo constrói o modelo sozinho. Com isso o
erro, que antes ficava principalmente no código, pode estar também nos dados.

## Regra de ouro: garbage in, garbage out

A qualidade dos dados influencia diretamente a qualidade do sistema. Dados incompletos,
enviesados, incorretos ou inadequados produzem previsões falhas, alucinações e
discriminação algorítmica.

Isso decorre direto da seção anterior. Se o modelo aprende as regras a partir dos
dados, qualquer distorção nos dados vira regra aprendida, e o modelo não tem como saber
se um padrão é real ou se só existe porque a coleta foi mal feita.

## Redes neurais artificiais

Uma rede neural profunda tem três partes:

- a camada de entrada, que recebe os dados brutos;
- as camadas ocultas, unidades matemáticas que processam padrões complexos (é a
  profundidade dessas camadas que dá nome ao Deep Learning);
- a camada de saída, que produz o resultado final, seja uma classificação ou uma
  geração.

As aplicações típicas são reconhecimento de imagens, processamento de linguagem natural
e tradução.

## IA preditiva e IA generativa

| | IA preditiva (tradicional) | IA generativa (moderna) |
|---|---|---|
| Objetivo | identificar padrões para classificar ou prever | produzir conteúdo novo e inédito |
| Mecanismo | analisa dados existentes e aponta uma probabilidade | recebe um prompt e constrói uma sequência para atendê-lo |
| Exemplos | detectar fraude bancária, prever demanda, identificar spam | gerar texto, criar imagens, escrever código, resumir documentos |

Essa distinção faz diferença na hora de avaliar um sistema. Quando um classificador de
fraude erra, ele marca uma compra legítima como suspeita, e dá para medir isso com
falsos positivos e falsos negativos. O erro de um modelo generativo é um texto
plausível e incorreto, que não aparece em nenhuma métrica que o usuário veja na tela.

## A mecânica de um modelo

O fluxo é sempre o mesmo, independentemente do tipo:

```
[ENTRADA] -> [MODELO] -> [SAÍDA]
```

Dois exemplos concretos:

| Exemplo | Entrada | Modelo | Saída |
|---|---|---|---|
| Visão | foto de um animal | modelo de visão computacional | "cachorro" |
| Linguagem | pergunta em texto | modelo de linguagem (LLM) | resposta estruturada |

O resultado depende da arquitetura do modelo, dos dados de treinamento e da instrução
recebida. Para quem usa a ferramenta, a instrução é o fator decisivo, porque dos três é
o único que o usuário controla diretamente.

## O prompt como interface humana

Comparação apresentada em aula entre um prompt simples e um estruturado.

Prompt simples:

```text
Explique o conceito de Inteligência Artificial para um estudante do ensino médio.
```

O resultado tende a sair genérico, longo demais ou fora do tom desejado.

Prompt estruturado:

```text
Explique Inteligência Artificial para estudantes do ensino médio.
Utilize linguagem simples, apresente três exemplos do cotidiano
e finalize com cinco perguntas para revisão.
```

Aqui o resultado sai direcionado, com formatação definida e tom adequado. A diferença
está no que foi acrescentado: contexto (para quem), formato (três exemplos, cinco
perguntas) e objetivo (revisão).

## Limitações e pensamento crítico

Modelos generativos podem gerar informações incorretas, falsas ou não fundamentadas,
apresentadas com extrema confiança. Isso se chama alucinação, e acontece por causa do
próprio mecanismo: o modelo prevê a próxima palavra provável e não consulta nenhuma
fonte de verdade absoluta.

Então o papel de quem usa passa a ser, além de executar a tarefa, saber trabalhar com o
sistema de IA para executá-la melhor, com verificação constante. Esse mecanismo é
aprofundado na [aula 02](../aula-02-llms-e-sua-logica/).

## Conceitos-chave da aula

| Termo | Definição |
|---|---|
| IA | Campo amplo focado em sistemas inteligentes. |
| Machine Learning | Aprendizado de padrões a partir de dados. |
| Deep Learning | Aprendizado baseado em redes neurais profundas. |
| IA Generativa / LLM | Modelos que produzem novos conteúdos (textos, códigos, imagens). |
| Prompt | A instrução ou comando fornecido ao sistema. |
| Alucinação | Geração de informação incorreta apresentada como verdadeira. |

## Checkpoint de compreensão

As seis perguntas de fechamento da aula estão respondidas na seção final da
[atividade](atividade.md#checkpoint-de-compreensão).
