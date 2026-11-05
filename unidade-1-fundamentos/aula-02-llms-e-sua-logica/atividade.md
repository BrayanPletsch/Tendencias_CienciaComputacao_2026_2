# Atividade prática: demonstrando a lógica de um LLM

Disciplina: Tendências em Ciência da Computação

Unidade 1, aula 02 (20/08)

- Estudante: Brayan A. Pletsch
- RGM: 38473585
- Turma: Engenharia de Software, N1, noturno (disciplina optativa)

## Objetivo

O plano de aulas prevê uma demonstração prática para a competência "identificar
funcionamento de modelos generativos". Para isso implementei um modelo de linguagem
mínimo e observei nele os comportamentos que os modelos grandes apresentam.

A pergunta que eu quis responder foi: quais comportamentos de um LLM vêm direto da
previsão do próximo token, sem depender de algum recurso adicional do produto?

## Método

Escrevi um modelo de bigrama em Python puro. Ele lê um corpus de sete frases, conta
quantas vezes cada palavra aparece depois de cada palavra e transforma essas contagens
em probabilidades. Para gerar texto, sorteia a próxima palavra respeitando essas
probabilidades e realimenta o resultado.

É o modelo de linguagem mais simples que existe, e a arquitetura não tem nada em comum
com a de um Transformer. Mas a etapa final é igual nos dois: transformar um contexto em
uma distribuição de probabilidade e escolher um item dela. Se um comportamento depende
só dessa etapa, ele deve aparecer aqui também, e foi isso que testei.

O código está em [experimentos/proximo_token.py](experimentos/proximo_token.py) e a saída
completa em [experimentos/saida.txt](experimentos/saida.txt).

Reprodução:

```bash
cd experimentos
python proximo_token.py
```

A semente do gerador aleatório está fixada em 42, então a saída é idêntica em qualquer
máquina.

O corpus tem 47 tokens e 20 tokens distintos. Deixei pequeno de propósito: assim dá
para conferir todas as contagens à mão e confirmar que os números da saída estão certos.

## Experimento 1: a saída é uma distribuição de probabilidade

Contexto testado: a palavra `um`.

```
1. Distribuicao do proximo token depois de "um"
-----------------------------------------------
   erro              80.0%
   aviso             20.0%
```

Conferindo no corpus: `um` aparece cinco vezes, seguido de `erro` em quatro delas e de
`aviso` em uma. Os 80% e 20% batem exatamente com a contagem.

O slide da aula mostrava, para um contexto parecido, `erro` com 85%, `aviso` com 10% e
`comportamento` com 5%. Os valores aqui são outros, mas o formato da saída é o mesmo: o
modelo devolve um ranking com pesos.

Tem uma diferença em relação a um LLM real. Aqui, tokens que nunca apareceram depois de
`um` ficam com probabilidade zero. Em um Transformer, a camada final aplica softmax sobre
o vocabulário inteiro, então nenhum token fica com probabilidade exatamente zero. Essa
diferença é justamente o que explica o experimento 5.

## Experimento 2: a temperatura reescala a distribuição

```
2. Efeito da temperatura sobre o contexto "um"
----------------------------------------------
   token              T=0.2   T=1.0   T=2.0
   erro               99.9%   80.0%   66.7%
   aviso               0.1%   20.0%   33.3%
```

Com temperatura 0,2, a diferença entre 80% e 20% vira uma diferença entre 99,9% e 0,1%,
e na prática a escolha deixa de ser sorteio. Com temperatura 2,0 a distância entre as
duas opções encolhe, e o token menos provável fica com um terço da massa.

A implementação eleva cada probabilidade a `1/T` e normaliza de novo. Nos modelos reais
a temperatura divide os logits antes da softmax, então a minha versão é simplificada, mas
o efeito é o mesmo: temperatura baixa concentra e temperatura alta achata.

Isso explica por que documentações recomendam temperatura próxima de zero para geração de
código e extração de dados. Nessas tarefas, quando o modelo pega a segunda opção mais
provável, o resultado é um erro.

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

Com temperatura 1,0 as cinco saídas são diferentes entre si. Com 0,2, três das cinco
convergem para a mesma frase. Entre as duas rodadas só mudou o parâmetro; nenhuma linha
do código foi alterada.

Esse é o experimento mais direto da atividade. Quando a gente repete um prompt no ChatGPT
ou no Copilot e recebe outra resposta, o que está agindo é esse sorteio, e não
instabilidade do serviço ou falta de memória.

## Experimento 4: o modelo combina o que viu e produz o que nunca viu

Eu não tinha planejado esse resultado, e foi o mais interessante da atividade.

A execução 1, com temperatura 1,0, produziu:

```
o codigo apresentou um erro de depreciacao
```

Essa frase não existe no corpus. O corpus tem `um erro de sintaxe`, `um erro de
indentacao` e `um aviso de depreciacao`. O modelo juntou o começo de uma frase com o
final de outra e gerou uma frase nova, gramaticalmente correta e plausível para quem lê.

A execução 4 fez o mesmo e produziu `um aviso de sintaxe`, que também não está no corpus.

É o mecanismo da alucinação acontecendo num modelo treinado com 47 tokens. Nada foi
copiado errado. O modelo seguiu a probabilidade token a token, e cada passo estava certo
de acordo com o que ele aprendeu. O erro só aparece quando alguém compara a frase
inteira com a realidade, e essa comparação o modelo não faz.

Uma referência acadêmica inventada tem exatamente esse formato: o nome do autor é real,
o título é plausível, o periódico existe, e a combinação dos três nunca foi publicada.

## Experimento 5: contexto fora do corpus

```
5. Contexto ausente do corpus
-----------------------------
   contexto "banco": sem continuacao possivel
   contexto "kubernetes": sem continuacao possivel
```

O modelo de bigrama para, porque não tem nenhuma contagem para esses contextos. Um LLM
real não para.

Para mim essa é a diferença que mais importa entre a maquete e o sistema real. Como o
Transformer aplica softmax sobre um vocabulário fixo, a distribuição nunca fica vazia.
Sempre existe um token com a maior probabilidade, ainda que essa probabilidade seja
baixa em termos absolutos, e nenhum caminho no mecanismo leva a "sem continuação
possível".

Então a recusa educada de um assistente ("não tenho informação sobre isso") vem da fase
de alinhamento, em que o modelo foi treinado para responder assim em certas situações, e
não da arquitetura. Como é comportamento aprendido, não dá para confiar nele como sinal
de que o modelo realmente não sabe.

## Experimento 6: por que contar letras falha

```
6. Por que o modelo nao sabe contar letras
------------------------------------------
   a palavra "indentacao" e um unico token para este modelo
   o modelo enxerga 1 unidade, nao 10 caracteres
```

No meu modelo, o token é a palavra inteira. Em um LLM real a tokenização é mais fina e
uma palavra pode virar dois ou três tokens, mas o problema é o mesmo: a unidade que o
modelo manipula não é o caractere.

Pedir para um LLM contar letras é pedir uma operação num nível de representação a que
ele não tem acesso direto. Ele até acerta com frequência, porque viu muito texto sobre
soletração, mas está inferindo a resposta, sem contar de fato.

## Tabela de resultados

| Experimento | O que foi observado | Consequência para quem usa a ferramenta |
|---|---|---|
| 1 | saída é distribuição (80% / 20%) | existe a resposta mais provável, entre várias possíveis |
| 2 | T=0,2 vira 99,9% / 0,1% | temperatura baixa para código, alta para variação |
| 3 | cinco saídas diferentes com T=1,0 | repetir o prompt não é teste de correção |
| 4 | gerou frase inexistente no corpus | alucinação é recombinação provável de trechos que existem, e não cópia errada |
| 5 | o bigrama para, o LLM não pararia | recusa é comportamento treinado e não indica limite do modelo |
| 6 | token é a unidade, não o caractere | tarefas de contagem exigem verificação externa |

## Limitações do experimento

Um bigrama olha só para o token anterior. Um Transformer usa atenção sobre a sequência
inteira, e é isso que permite manter coerência ao longo de páginas em vez de gerar
frases soltas. Nada aqui mostra como a atenção funciona.

O corpus tem 47 tokens, contra os trilhões usados no pré-treinamento de um modelo atual.
Essa diferença de escala muda a qualidade e também faz surgir capacidades que não
existem em escala pequena.

O modelo também não passou por ajuste de instrução nem por alinhamento. Ele só continua
texto e não responde perguntas.

Dentro desses limites, o experimento mostra a etapa final que os dois modelos têm em
comum: transformar contexto em distribuição e amostrar. Os seis comportamentos
observados vêm só dessa etapa, por isso aparecem tanto no bigrama quanto no LLM.

## Conclusão

Eu esperava confirmar a variabilidade da saída. O que apareceu foi mais forte: a
alucinação surgiu sozinha na primeira execução, sem que eu tivesse montado nada no
corpus para provocar isso.

Isso mudou o jeito como eu vejo o problema. Antes eu tratava a alucinação como uma
falha que modelos melhores iam corrigir. Depois deste experimento, passei a ver que ela
é o mesmo mecanismo que produz as respostas certas, aplicado a uma combinação que não
corresponde a nada real. Um modelo maior alucina menos porque tem mais dados para tornar
as combinações erradas menos prováveis, mas o mecanismo continua o mesmo.

Para as próximas aulas a consequência prática é direta. A arquitetura e os dados de
treinamento estão fora do meu alcance, e a única entrada que eu controlo é o texto do
prompt. Então escrever esse texto de forma deliberada é o único jeito que eu tenho de
influenciar a resposta.
