# Aula 01: Fundamentos de IA e Modelos Generativos

Data: 13/08. Primeira aula da Unidade 1. Objetivo do plano de ensino: introduzir
fundamentos de IA e modelos generativos. Competência: compreender conceitos básicos
de IA.

Slides originais: [slides-aula-01.pdf](slides-aula-01.pdf).
Entrega da atividade: [atividade.md](atividade.md).

## O que é Inteligência Artificial

Uma área da computação dedicada ao desenvolvimento de sistemas capazes de realizar
tarefas que normalmente associamos à inteligência humana, o que inclui compreensão de
linguagem, reconhecimento de padrões e tomada de decisão.

A definição é ampla de propósito. Filtro de spam, cálculo de rota no mapa, tradução
automática e geração de texto entram todos na mesma categoria, embora usem técnicas
bem diferentes entre si.

## A hierarquia dos termos

Os quatro termos que mais se confundem são camadas, uma dentro da outra:

```
Inteligência Artificial
  └── Machine Learning
        └── Deep Learning
              └── IA Generativa
```

- **Inteligência Artificial** é o campo mais amplo, focado em criar sistemas inteligentes.
- **Machine Learning** é o subconjunto em que os algoritmos aprendem e identificam
  padrões a partir de dados, sem programação explícita das regras.
- **Deep Learning** é o subconjunto do ML baseado em redes neurais artificiais
  profundas, usado em reconhecimento de voz e de imagem.
- **IA Generativa** são os sistemas modernos, construídos sobre Deep Learning, capazes
  de gerar conteúdo inédito.

Dizer que um sistema "usa IA" quase nunca é informativo. Dizer em qual dessas camadas
ele opera já diz muito sobre o que ele consegue e o que ele não consegue fazer.

## Como a máquina aprende

A diferença entre programação tradicional e aprendizado de máquina está em o que entra
e o que sai do processo.

| | Entrada | Saída |
|---|---|---|
| Programação tradicional | dados + regras programadas manualmente | respostas |
| Machine Learning | dados + respostas conhecidas | regras e padrões identificados |

Na programação tradicional, o programador escreve a regra. Em ML, o programador
fornece exemplos de entrada com a resposta correta e o algoritmo constrói o modelo
sozinho. Isso muda o lugar do erro: ele deixa de estar principalmente no código e passa
a estar também nos dados.

## A regra de ouro: garbage in, garbage out

A qualidade dos dados influencia diretamente a qualidade do sistema. Dados incompletos,
enviesados, incorretos ou inadequados produzem previsões falhas, alucinações e
discriminação algorítmica.

Essa é a consequência prática do item anterior. Se o modelo aprende as regras a partir
dos dados, então qualquer distorção presente nos dados vira regra aprendida. O modelo
não tem como distinguir entre um padrão real e um padrão que só existe porque a coleta
foi mal feita.

## Redes neurais artificiais

Uma rede neural profunda tem três partes:

- **Camada de entrada**, que recebe os dados brutos.
- **Camadas ocultas**, unidades matemáticas que processam padrões complexos. É a
  profundidade dessas camadas que dá nome ao Deep Learning.
- **Camada de saída**, que produz o resultado final, seja uma classificação ou uma
  geração.

Aplicações típicas: reconhecimento de imagens, processamento de linguagem natural e
tradução.

## IA preditiva e IA generativa

| | IA preditiva (tradicional) | IA generativa (moderna) |
|---|---|---|
| Objetivo | identificar padrões para classificar ou prever | produzir conteúdo novo e inédito |
| Mecanismo | analisa dados existentes e aponta uma probabilidade | recebe um prompt e constrói uma sequência para atendê-lo |
| Exemplos | detectar fraude bancária, prever demanda, identificar spam | gerar texto, criar imagens, escrever código, resumir documentos |

A distinção importa na hora de avaliar um sistema. Um classificador de fraude erra
marcando uma compra legítima como suspeita, e isso é mensurável com falsos positivos e
falsos negativos. Um modelo generativo erra produzindo um texto plausível e incorreto,
e isso não aparece em nenhuma métrica que o usuário veja na tela.

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

O resultado não é mágico. Ele depende da arquitetura do modelo, dos dados de
treinamento e, de forma decisiva para quem usa a ferramenta, da instrução recebida.
Dos três fatores, o prompt é o único sob controle direto do usuário.

## A interface humana: o prompt

Comparação apresentada em aula:

Prompt simples:

```text
Explique o conceito de Inteligência Artificial para um estudante do ensino médio.
```

Resultado tende a ser genérico, longo demais ou fora do tom desejado.

Prompt estruturado:

```text
Explique Inteligência Artificial para estudantes do ensino médio.
Utilize linguagem simples, apresente três exemplos do cotidiano
e finalize com cinco perguntas para revisão.
```

Resultado direcionado, com formatação definida e tom adequado. O que mudou foi o
acréscimo de contexto (para quem), formato (três exemplos, cinco perguntas) e objetivo
(revisão).

## Limitações e pensamento crítico

Modelos generativos podem gerar informações incorretas, falsas ou não fundamentadas,
apresentadas com extrema confiança. Isso se chama alucinação. A causa está no
mecanismo: eles preveem a próxima palavra provável, não consultam verdades absolutas.

O papel do humano, então, não é apenas executar a tarefa, e sim saber trabalhar com o
sistema de IA para executá-la melhor, aplicando verificação constante. O aprofundamento
desse mecanismo é o assunto da [aula 02](../aula-02-llms-e-sua-logica/).

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
