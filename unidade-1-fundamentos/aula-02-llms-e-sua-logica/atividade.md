# Atividade prática: demonstrando a lógica de um LLM

Disciplina: Tendências em Ciência da Computação
Unidade 1, aula 02 (20/08)
Estudante: Brayan A. Pletsch

## Objetivo

O plano de aulas prevê uma demonstração prática para a competência "identificar
funcionamento de modelos generativos". Em vez de descrever o mecanismo em texto, eu
implementei um modelo de linguagem mínimo e observei nele os comportamentos que os
modelos grandes apresentam.

A pergunta que a atividade investiga é: quais comportamentos de um LLM são consequência
direta da previsão do próximo token, e não de algum recurso adicional do produto?

## Método

Escrevi um modelo de bigrama em Python puro. O modelo lê um corpus de sete frases,
conta quantas vezes cada palavra aparece depois de cada palavra, e transforma essas
contagens em probabilidades. Para gerar texto, ele sorteia a próxima palavra respeitando
essas probabilidades e realimenta o resultado.

É o modelo de linguagem mais simples que existe e não tem nada em comum com um
Transformer em termos de arquitetura. Mas a etapa final é a mesma nos dois casos:
transformar um contexto em uma distribuição de probabilidade e escolher um item dela.
Os comportamentos que dependem só dessa etapa devem aparecer aqui também, e é isso que
o experimento testa.

Arquivo: [experimentos/proximo_token.py](experimentos/proximo_token.py)
Saída completa: [experimentos/saida.txt](experimentos/saida.txt)

Reprodução:

```bash
cd experimentos
python proximo_token.py
```

A semente do gerador aleatório está fixada em 42, então a saída é idêntica em qualquer
máquina.

O corpus tem 47 tokens e 20 tokens distintos. Ele é pequeno de propósito: dá para
conferir todas as contagens à mão e confirmar que os números da saída estão certos.

## Experimento 1: a saída é uma distribuição, não uma palavra

Contexto testado: a palavra `um`.

```
1. Distribuicao do proximo token depois de "um"
-----------------------------------------------
   erro              80.0%
   aviso             20.0%
```

Conferindo no corpus: `um` aparece cinco vezes, seguido de `erro` em quatro delas e de
`aviso` em uma. Os 80% e 20% batem exatamente com a contagem.

O resultado reproduz a lógica do slide da aula, que mostrava `erro` com 85%, `aviso` com
10% e `comportamento` com 5% para um contexto parecido. O ponto não são os valores em
si, e sim o formato da saída: o modelo não devolve uma resposta, devolve um ranking com
peso.

Uma diferença importante em relação a um LLM real: aqui, tokens que nunca apareceram
depois de `um` têm probabilidade zero. Em um Transformer, a camada final aplica softmax
sobre o vocabulário inteiro, então nenhum token fica com probabilidade exatamente zero.
Essa diferença é justamente o que explica o experimento 4.

## Experimento 2: a temperatura reescala a distribuição

```
2. Efeito da temperatura sobre o contexto "um"
----------------------------------------------
   token              T=0.2   T=1.0   T=2.0
   erro               99.9%   80.0%   66.7%
   aviso               0.1%   20.0%   33.3%
```

Com temperatura 0,2, a diferença entre 80% e 20% vira uma diferença entre 99,9% e 0,1%.
A escolha deixa de ser sorteio na prática. Com temperatura 2,0, a distância entre as
duas opções encolhe e o token menos provável ganha um terço da massa.

A implementação eleva cada probabilidade a `1/T` e normaliza de novo. É uma versão
simplificada do que acontece nos modelos reais, onde a temperatura divide os logits
antes da softmax, mas o efeito é o mesmo: temperatura baixa concentra, temperatura alta
achata.

Isso explica por que documentações recomendam temperatura próxima de zero para geração
de código e extração de dados. Nessas tarefas, escolher a segunda opção mais provável
não é criatividade, é erro.

## Experimento 3: o mesmo prompt não devolve a mesma resposta

Cinco execuções a partir do mesmo token inicial (`o`), com temperatura 1,0:

```
   execucao 1: o codigo apresentou um erro de depreciacao o
   execucao 2: o codigo apresentou um erro de sintaxe o
   execucao 3: o codigo apresentou um erro na linha vinte
   execucao 4: o codigo apresentou um aviso de sintaxe o
   execucao 5: o teste passou sem nenhum aviso de indentacao
```

As mesmas cinco execuções com temperatura 0,2:

```
   execucao 1: o codigo apresentou um erro de depreciacao o
   execucao 2: o codigo apresentou um erro de sintaxe o
   execucao 3: o codigo apresentou um erro de sintaxe o
   execucao 4: o codigo apresentou um erro de sintaxe o
   execucao 5: o codigo apresentou um erro de asercao o
```

Com temperatura 1,0, as cinco saídas são diferentes entre si. Com temperatura 0,2, três
das cinco convergem para a mesma frase. Nenhuma linha do código mudou entre as duas
rodadas, apenas o parâmetro.

Este é o experimento mais direto da atividade: a variabilidade que a gente observa ao
repetir um prompt no ChatGPT ou no Copilot não é instabilidade do serviço nem falta de
memória. É o sorteio.

## Experimento 4: o modelo combina o que viu e produz o que nunca viu

Este resultado eu não tinha planejado e é o mais interessante da atividade.

A execução 1, com temperatura 1,0, produziu:

```
o codigo apresentou um erro de depreciacao
```

Essa frase não existe no corpus. O corpus tem `um erro de sintaxe`, `um erro de
indentacao` e `um aviso de depreciacao`. O modelo combinou o começo de uma frase com o
final de outra e gerou uma sentença nova, gramaticalmente correta e completamente
plausível para quem lê.

A execução 4 fez o mesmo, produzindo `um aviso de sintaxe`, que também não está no
corpus.

Aqui está o mecanismo da alucinação, em um modelo com 47 tokens de treinamento. O modelo
não copiou nada errado: ele seguiu a probabilidade token a token, e cada passo
individual estava correto segundo o que ele aprendeu. O erro só existe quando alguém
compara a frase inteira com a realidade, e essa comparação o modelo não faz.

É exatamente o formato de uma referência acadêmica inventada. O nome do autor é real, o
título é plausível, o periódico existe, e a combinação dos três nunca foi publicada.

## Experimento 5: contexto fora do corpus

```
5. Contexto ausente do corpus
-----------------------------
   contexto "banco": sem continuacao possivel
   contexto "kubernetes": sem continuacao possivel
```

O modelo de bigrama para, porque não tem nenhuma contagem para esses contextos. Um LLM
real não faz isso.

Essa é a diferença que mais importa entre a maquete e o sistema real. Como o
Transformer aplica softmax sobre um vocabulário fixo, a distribuição nunca fica vazia:
sempre existe um token com a maior probabilidade, ainda que essa probabilidade seja
baixa em termos absolutos. Não há caminho no mecanismo que leve a "sem continuação
possível".

Ou seja, a recusa educada de um assistente ("não tenho informação sobre isso") não vem
da arquitetura. Ela vem da fase de alinhamento, em que o modelo foi treinado para
produzir esse tipo de resposta em certas situações. É comportamento aprendido, e por
isso não é confiável como sinal de que o modelo realmente não sabe.

## Experimento 6: por que contar letras falha

```
6. Por que o modelo nao sabe contar letras
------------------------------------------
   a palavra "indentacao" e um unico token para este modelo
   o modelo enxerga 1 unidade, nao 10 caracteres
```

No meu modelo, o token é a palavra inteira. Em um LLM real, a tokenização é mais fina e
uma palavra pode virar dois ou três tokens, mas a natureza do problema é a mesma: a
unidade que o modelo manipula não é o caractere.

Pedir para um LLM contar letras é pedir uma operação sobre um nível de representação ao
qual ele não tem acesso direto. Ele até acerta com frequência, porque viu muitos textos
falando sobre soletração, mas está inferindo a resposta em vez de contar.

## Tabela de resultados

| Experimento | O que foi observado | Consequência para quem usa a ferramenta |
|---|---|---|
| 1 | saída é distribuição (80% / 20%) | não existe "a" resposta, existe a mais provável |
| 2 | T=0,2 vira 99,9% / 0,1% | temperatura baixa para código, alta para variação |
| 3 | cinco saídas diferentes com T=1,0 | repetir o prompt não é teste de correção |
| 4 | gerou frase inexistente no corpus | alucinação é recombinação provável, não cópia errada |
| 5 | o bigrama para, o LLM não pararia | recusa é comportamento treinado, não sinal de limite |
| 6 | token é a unidade, não o caractere | tarefas de contagem exigem verificação externa |

## Limitações do experimento

Registro para não superestimar o que foi demonstrado.

Um bigrama olha apenas para o token anterior. Um Transformer usa atenção sobre a
sequência inteira, o que é a diferença entre gerar frases soltas e manter coerência ao
longo de páginas. Nada aqui demonstra como a atenção funciona.

O corpus tem 47 tokens contra os trilhões usados no pré-treinamento de um modelo atual.
A escala não muda apenas a qualidade, ela faz surgir capacidades que não existem em
escala pequena.

E o modelo aqui não passou por ajuste de instrução nem por alinhamento. Ele continua
texto, não responde perguntas.

O que o experimento demonstra, dentro dessas limitações, é a etapa final compartilhada:
transformar contexto em distribuição e amostrar. Os seis comportamentos observados
derivam só dessa etapa, e é por isso que aparecem tanto no bigrama quanto no LLM.

## Conclusão

O que eu esperava confirmar era a variabilidade da saída. O que apareceu de fato foi
mais forte do que isso: a alucinação surgiu espontaneamente na primeira execução, sem
que eu tivesse construído nada no corpus para provocá-la.

Isso mudou a forma como eu enxergo o problema. Antes eu tratava a alucinação como uma
falha que modelos melhores vão corrigir. Depois deste experimento, ficou claro que ela é
o mesmo mecanismo que produz as respostas certas, operando sobre uma combinação que não
corresponde a nada real. Um modelo maior alucina menos porque tem mais dados para
tornar as combinações erradas menos prováveis, mas o mecanismo continua sendo o mesmo.

A consequência prática para as próximas aulas é direta. Se a arquitetura e os dados de
treinamento estão fora do meu alcance, e a única entrada que eu controlo é o texto do
prompt, então escrever esse texto de forma deliberada não é uma questão de estilo. É a
única alavanca disponível.
