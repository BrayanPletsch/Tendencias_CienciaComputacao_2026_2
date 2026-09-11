# Unidade 1: Fundamentos de IA e Engenharia de Prompt

Cinco encontros, de 13/08 a 10/09. A unidade sai do conceito geral de Inteligência
Artificial e chega na construção controlada de prompts, passando pela mecânica dos
modelos de linguagem.

O fio condutor é sempre o mesmo: um modelo generativo não consulta uma base de
verdades, ele calcula qual continuação é provável. Tudo o que vem depois na unidade
(estrutura de prompt, refinamento, papéis, restrições, validação) é consequência
prática desse fato.

## Aulas

| Data | Aula | Objetivo do plano de ensino | Entrega |
|---|---|---|---|
| 13/08 | [Fundamentos de IA e modelos generativos](aula-01-fundamentos-de-ia-e-modelos-generativos/) | Introduzir fundamentos de IA e modelos generativos | [atividade](aula-01-fundamentos-de-ia-e-modelos-generativos/atividade.md) |
| 20/08 | [LLMs e sua lógica](aula-02-llms-e-sua-logica/) | Apresentar LLMs e sua lógica | [atividade](aula-02-llms-e-sua-logica/atividade.md) |
| 27/08 | [Engenharia de Prompt](aula-03-engenharia-de-prompt/) | Introduzir Engenharia de Prompt | [atividade](aula-03-engenharia-de-prompt/atividade.md) |
| 03/09 | [Refinamento de prompts](aula-04-refinamento-de-prompts/) | Refinamento de prompts | [atividade](aula-04-refinamento-de-prompts/atividade.md) |
| 10/09 | [Contexto e estrutura de prompts](aula-05-contexto-e-estrutura-de-prompts/) | Contexto e estrutura de prompts | [atividade](aula-05-contexto-e-estrutura-de-prompts/atividade.md) |

## Competências desenvolvidas

O plano de ensino define uma competência por encontro:

1. compreender conceitos básicos de IA;
2. identificar o funcionamento de modelos generativos;
3. elaborar instruções claras para IA;
4. ajustar prompts para maior precisão;
5. aplicar técnicas avançadas de prompting.

## Como as aulas se encadeiam

A aula 01 estabelece o vocabulário e a hierarquia entre IA, aprendizado de máquina,
aprendizado profundo e IA generativa, e separa IA preditiva de IA generativa.

A aula 02 abre a caixa e mostra o mecanismo: previsão do próximo token sobre uma
distribuição de probabilidade. É onde alucinação e variabilidade deixam de ser defeito
misterioso e passam a ser consequência esperada do funcionamento.

A aula 03 usa esse mecanismo para justificar por que estruturar o prompt importa. Se o
modelo escolhe a continuação mais provável dado o contexto, então o contexto é a
variável que está sob controle de quem escreve.

A aula 04 transforma isso em método iterativo: testar, analisar a resposta, formular
hipótese de melhoria, refinar, comparar e validar.

A aula 05 fecha com as técnicas que dão controle fino sobre o resultado: papéis,
restrições, delimitadores, exemplos e decomposição em etapas.

## Conceitos usados em toda a unidade

| Conceito | Definição curta |
|---|---|
| Inteligência Artificial | Área da computação dedicada a sistemas capazes de realizar tarefas que associamos à inteligência humana. |
| Machine Learning | Algoritmos que identificam padrões a partir de dados, em vez de seguir regras programadas manualmente. |
| Deep Learning | Aprendizado baseado em redes neurais artificiais profundas. |
| IA preditiva | Analisa dados existentes para classificar ou prever. |
| IA generativa | Recebe uma instrução e produz conteúdo novo a partir dela. |
| LLM | Modelo de linguagem de grande porte, treinado para prever o próximo token de uma sequência. |
| Token | Unidade em que o texto é fatiado antes de entrar no modelo. Nem sempre corresponde a uma palavra. |
| Prompt | A instrução fornecida ao modelo. |
| Alucinação | Informação incorreta gerada com aparência de resposta confiável. |
| Temperatura | Parâmetro que controla o quanto a escolha do próximo token se afasta do mais provável. |

## Material de apoio

| Documento | Onde está |
|---|---|
| Slides da aula 01 | [aula-01/slides-aula-01.pdf](aula-01-fundamentos-de-ia-e-modelos-generativos/slides-aula-01.pdf) |
| Slides de Engenharia de Prompt | [aula-03/slides-engenharia-de-prompt.pdf](aula-03-engenharia-de-prompt/slides-engenharia-de-prompt.pdf) |
| Slides da atividade A2 | [aula-03/slides-atividade-a2.pdf](aula-03-engenharia-de-prompt/slides-atividade-a2.pdf) |
| Enunciado do refinamento de prompts | [aula-04/enunciado-da-professora.md](aula-04-refinamento-de-prompts/enunciado-da-professora.md) |
| Visão geral da unidade | [docs/unidade-1-visao-geral.pdf](../docs/unidade-1-visao-geral.pdf) |
| Cartilha *IA no comando? Você no controle* | [docs/cartilha-ia-no-comando.pdf](../docs/cartilha-ia-no-comando.pdf) |
| Plano de aulas da disciplina | [docs/plano-de-aulas.pdf](../docs/plano-de-aulas.pdf) |

## Código produzido na unidade

| Arquivo | O que faz |
|---|---|
| [aula-02/experimentos/proximo_token.py](aula-02-llms-e-sua-logica/experimentos/proximo_token.py) | Modelo de bigrama que demonstra previsão do próximo token, temperatura e alucinação por recombinação. |
| [aula-03/codigo/valida_cpf.py](aula-03-engenharia-de-prompt/codigo/valida_cpf.py) | Função alvo da atividade, em duas versões, antes e depois do refinamento do prompt. |
| [aula-03/codigo/test_valida_cpf.py](aula-03-engenharia-de-prompt/codigo/test_valida_cpf.py) | Suíte de testes separada por origem do caso, prompt inicial contra prompt refinado. |
| [aula-03/codigo/comparar_versoes.py](aula-03-engenharia-de-prompt/codigo/comparar_versoes.py) | Roda os vinte casos contra as duas versões e conta as falhas. |
| [aula-04/codigo/verificar_afirmacoes.py](aula-04-refinamento-de-prompts/codigo/verificar_afirmacoes.py) | Mede as afirmações da IA sobre `dict` e refuta duas delas. |
| [aula-05/codigo/trecho_analisado.py](aula-05-contexto-e-estrutura-de-prompts/codigo/trecho_analisado.py) | Trecho com quatro defeitos plantados, comprovados por execução. |
| [aula-05/codigo/trecho_corrigido.py](aula-05-contexto-e-estrutura-de-prompts/codigo/trecho_corrigido.py) | Versão corrigida após as quatro revisões com papéis diferentes. |
