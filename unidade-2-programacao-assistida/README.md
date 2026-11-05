# Unidade 2: Programação assistida por IA

Três encontros, de 10/09 a 24/09, sobre usar a IA durante a programação: gerar código a
partir de uma especificação, revisar, refatorar, depurar e automatizar tarefas
repetitivas. A unidade fecha com um parecer individual sobre tudo isso.

Pelo plano de ensino a unidade iria de 17/09 a 01/10. As datas abaixo seguem os materiais
que a professora publicou, que começam em 10/09 com a programação em pares.

## Aulas

| Data | Aula | Tema | Entrega |
|---|---|---|---|
| 10/09 | [Programação em pares com IA](aula-06-programacao-em-pares-com-ia/) | mini-projeto com a IA como par: base escrita por mim, refatoração pela IA | [atividade](aula-06-programacao-em-pares-com-ia/atividade.md) |
| 17/09 | [Boas práticas na colaboração humano-IA](aula-07-boas-praticas-colaboracao-humano-ia/) | leitura do artigo sobre vibe coding, questões norteadoras e estudo de caso | [atividade](aula-07-boas-praticas-colaboracao-humano-ia/atividade.md) |
| 24/09 | [Programação assistida e automação com IA](aula-08-automacao-com-ia/) | script de automação com apoio de IA, testes e refatoração (0,5 ponto) | [atividade](aula-08-automacao-com-ia/atividade.md) |

Parecer da unidade, pedido nos slides da aula 07:
[parecer-da-unidade-2.md](parecer-da-unidade-2.md).

## Competências do plano de ensino

1. utilizar IA como apoio à programação;
2. criar soluções automatizadas com suporte de IA;
3. avaliar limites e potencial da colaboração.

## Como as aulas se ligam

A aula 06 coloca a IA como par de programação. Eu escrevo uma base, ela refatora, eu
avalio e decido. É o ciclo de colaboração dos slides aplicado a um problema pequeno.

A aula 07 sai do código e vai para a pesquisa. O artigo de Sarkar e Drosos mostra
programadores experientes fazendo vibe coding e conclui que o conhecimento de programação
continua necessário, só que usado para revisar, depurar e decidir quando editar à mão.

A aula 08 junta as duas coisas num script de automação. O processo é todo o do material
da professora: planejar antes de pedir, montar o prompt com casos de teste, analisar o
código, testar, pedir refatoração e comparar as versões.

## Como as atividades de código foram feitas

Nas aulas 06 e 08 os prompts foram enviados ao Claude Opus 5.5 (Anthropic) pelo chat. Cada
prompt está na pasta `prompts/` da aula, com a resposta copiada ao lado. O código que veio
da IA foi guardado sem alteração (`cep_ia.py` e `contar_niveis_v1.py`) para que dê para
comparar com a versão final.

## Código produzido na unidade

| Arquivo | O que faz |
|---|---|
| [aula-06/codigo/cep_base.py](aula-06-programacao-em-pares-com-ia/codigo/cep_base.py) | Base da consulta de CEP, escrita por mim, com os defeitos registrados. |
| [aula-06/codigo/cep_ia.py](aula-06-programacao-em-pares-com-ia/codigo/cep_ia.py) | Versão refatorada pela IA, sem alteração. |
| [aula-06/codigo/cep.py](aula-06-programacao-em-pares-com-ia/codigo/cep.py) | Versão final. |
| [aula-06/codigo/test_cep.py](aula-06-programacao-em-pares-com-ia/codigo/test_cep.py) | Treze testes com mock, sem rede. |
| [aula-06/codigo/executar_casos.py](aula-06-programacao-em-pares-com-ia/codigo/executar_casos.py) | Roda seis CEPs reais contra uma das versões. |
| [aula-08/codigo/contar_niveis_v1.py](aula-08-automacao-com-ia/codigo/contar_niveis_v1.py) | Primeira versão do contador de logs, gerada pela IA. |
| [aula-08/codigo/contar_niveis_log.py](aula-08-automacao-com-ia/codigo/contar_niveis_log.py) | Versão final, depois da correção das linhas em branco e da refatoração. |
| [aula-08/codigo/test_contar_niveis_log.py](aula-08-automacao-com-ia/codigo/test_contar_niveis_log.py) | Doze testes do contador. |
| [aula-08/codigo/comparar_versoes.py](aula-08-automacao-com-ia/codigo/comparar_versoes.py) | Conta os logs de exemplo com as duas versões. |
