# Atividade: refinamento de prompts

Disciplina: Tendências em Ciência da Computação

Unidade 1, aula 04 (03/09)

## Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data da execução | 10/09/2026 |
| Ferramenta de IA | Claude Opus 5 (Anthropic) |
| Ambiente de verificação | Python 3.14.2, biblioteca padrão |

## Problema escolhido

### Contexto

Um colega do segundo semestre me perguntou por que buscar um item em um dicionário
Python é mais rápido do que em uma lista. Ele já programa em Python e usa `dict` todo
dia, mas nunca viu tabela hash e ainda não cursou análise de algoritmos.

### Problema

Produzir uma explicação de tabela hash que sirva de verdade para essa pessoa. O risco era
a explicação escorregar para complexidade assintótica e notação O grande, vocabulário que
ele ainda não tem, ou ficar tão simplificada que não explicasse nada.

### Objetivo

Investigar quanto a formulação do prompt muda a resposta e verificar se a resposta
refinada fica só mais bem apresentada ou também mais correta.

## Prompt 1: versão inicial

```text
Explique tabela hash.
```

### Resultado

A resposta veio em cinco parágrafos, com estrutura de verbete. Cobriu a definição de
tabela hash, função de espalhamento, buckets, colisões (com encadeamento e com
endereçamento aberto) e complexidade média O(1) contra pior caso O(n).

O conteúdo estava certo, só que desconectado do problema. Anotei três trechos:

- usou "função de dispersão", "endereçamento aberto" e "fator de carga" sem definir
  nenhum dos três;
- o exemplo de código estava em pseudocódigo com cara de C, com alocação manual de
  vetor;
- afirmou que "em Python, os dicionários são implementados como tabelas hash e, por
  isso, não garantem a ordem de inserção dos elementos".

### Primeira impressão

| Pergunta | Resposta |
|---|---|
| O que funcionou? | A cobertura conceitual. Nada de importante sobre tabela hash ficou de fora. |
| O que faltou? | Qualquer ligação com Python, que era o contexto real da pergunta. |
| O que ficou genérico? | O texto inteiro. É uma resposta de enciclopédia, genérica a ponto de não servir para nenhum leitor em particular. |
| O que poderia ser melhor? | O nível. Quem nunca viu tabela hash não precisa de endereçamento aberto logo de início. |
| Algo precisa ser verificado? | Sim, a afirmação sobre ordem de inserção. |

## Prompt 2: primeiro refinamento

### Alterações realizadas

| Elemento | O que foi acrescentado |
|---|---|
| Papel | professor de estruturas de dados acostumado a turmas iniciantes |
| Contexto | estudante de segundo semestre, usa `dict`, nunca viu tabela hash nem análise de algoritmos |
| Objetivo | responder por que `dict` é mais rápido que lista, sem expor a teoria completa |
| Público | uma pessoa específica, com repertório conhecido |
| Formato | analogia, depois mecanismo, depois comparação em tabela |
| Restrições | sem notação O grande, sem termo técnico não definido, máximo 500 palavras, exemplos em Python |
| Critérios | ao final, ele deve conseguir prever qual estrutura usar em uma situação nova |

```text
Você é professor de estruturas de dados e costuma dar aula para turmas
iniciantes.

CONTEXTO
Um estudante do segundo semestre me perguntou por que buscar um item em um
dicionário Python é mais rápido do que em uma lista. Ele programa em Python,
usa dict todo dia, mas nunca estudou tabela hash e não cursou análise de
algoritmos.

OBJETIVO
Responder exatamente a essa dúvida. Não é uma aula completa sobre tabelas hash.

TAREFA
1. Comece por uma analogia com algo do cotidiano.
2. Explique o mecanismo: o que a função hash faz com a chave.
3. Explique o que acontece quando duas chaves caem no mesmo lugar.
4. Compare dict e list em uma tabela.
5. Termine dizendo em que situação a lista ainda é a melhor escolha.

RESTRIÇÕES
- máximo de 500 palavras;
- não use notação O grande;
- todo termo técnico deve ser definido na primeira vez que aparecer;
- exemplos apenas em Python.

CRITÉRIO DE QUALIDADE
Depois de ler, ele deve conseguir decidir sozinho qual estrutura usar em um
caso que não foi mencionado no texto.
```

### Resultado

A melhora foi clara. A analogia escolhida foi a de um guarda-volumes numerado: em vez de
abrir armário por armário procurando a mochila, a etiqueta diz o número do armário. O
mecanismo foi explicado como "a função hash transforma a chave em um número, e esse
número indica a posição". A colisão apareceu como duas mochilas recebendo a mesma
etiqueta, resolvida guardando as duas no mesmo armário e conferindo qual é qual na hora
de retirar.

A tabela comparativa saiu com quatro linhas: busca por chave, busca por valor, ordenação
e uso de memória. No fechamento, a resposta apontou corretamente que a lista é melhor
quando a ordem importa, quando se percorre tudo de qualquer jeito e quando o dado não tem
uma chave natural.

Dois problemas continuaram:

- a afirmação sobre ordem de inserção voltou, agora na linha "ordenação" da tabela,
  escrita como "o dict não mantém a ordem";
- a resposta afirmou que "a função hash garante que chaves diferentes recebam posições
  diferentes", o que contradiz o parágrafo sobre colisões que ela mesma tinha escrito.

## Comparação entre Prompt 1 e Prompt 2

| Critério | Prompt 1 | Prompt 2 |
|---|---:|---:|
| Clareza | 3 | 5 |
| Precisão | 3 | 3 |
| Relevância | 2 | 5 |
| Organização | 4 | 5 |
| Adequação ao público | 1 | 5 |
| Atendimento ao objetivo | 2 | 5 |
| Utilidade prática | 2 | 4 |
| Total | 17 | 32 |

Escala: 1 muito insatisfatório, 2 insatisfatório, 3 adequado, 4 muito bom, 5 excelente.

Para mim a linha mais importante é a de precisão, que ficou em 3 nas duas versões. Todos
os outros critérios subiram, e adequação ao público subiu quatro pontos, de 1 para 5. O refinamento resolveu adequação,
foco e formato e não mexeu na correção do conteúdo. É o que o enunciado antecipa quando
diz que refinar o prompt não elimina a necessidade de validar.

## Prompt 3: segundo refinamento

### O que ainda precisava melhorar

Duas afirmações factuais duvidosas sobreviveram a um refinamento inteiro, e nenhum dos
sete blocos do prompt anterior pedia que a resposta se responsabilizasse pelo que
afirmava.

### Hipótese de melhoria

Se eu exigir que cada afirmação de comportamento seja marcada como verificável ou não, e
que a resposta indique como verificá-la, a IA vai ter que separar o que sabe do que está
supondo. Eu não espero que ela pare de errar, só que os erros fiquem localizáveis.

### Prompt

Mesmos blocos do Prompt 2, com três acréscimos:

```text
RESTRIÇÕES ADICIONAIS
- informe a versão do Python considerada e não faça afirmações que dependam
  de versões anteriores a ela;
- para cada afirmação sobre comportamento ou desempenho, marque com
  [verificável] e escreva o trecho de Python que a comprova, ou marque com
  [conceitual] se não houver como comprovar por execução;
- se duas afirmações suas se contradisserem, aponte a contradição em vez de
  deixar as duas no texto.

CRITÉRIO DE QUALIDADE ADICIONAL
Eu vou executar todos os trechos marcados como [verificável]. Se algum deles
não comprovar o que a afirmação diz, a resposta falhou.
```

### Resultado

A explicação didática ficou praticamente igual à do Prompt 2, o que eu já esperava,
porque essa parte estava boa. Mudou o tratamento das afirmações.

A resposta declarou Python 3.12 como referência e produziu cinco afirmações marcadas:

| Afirmação | Marca | Trecho proposto |
|---|---|---|
| A busca por chave em `dict` não depende do tamanho | [verificável] | medição com `timeit` em tamanhos crescentes |
| Em `list`, o custo de busca cresce com o tamanho | [verificável] | mesma medição com `in` sobre lista |
| Desde a versão 3.7, `dict` preserva a ordem de inserção | [verificável] | inserir chaves fora de ordem e iterar |
| Chaves diferentes podem produzir o mesmo hash | [verificável] | `hash(1) == hash(1.0)` |
| Função hash boa distribui as chaves de forma uniforme | [conceitual] | depende da distribuição dos dados de entrada |

A terceira linha corrige, sem que eu tenha apontado, a afirmação que estava errada nas
duas respostas anteriores. A quarta contradiz a frase sobre garantia de posições
distintas que aparecia no Prompt 2.

Então a informação correta estava disponível para o modelo nas três execuções. Faltava o
prompt exigir que ele separasse o que afirma do que consegue comprovar.

## Comparação final

| Critério | Prompt 1 | Prompt 2 | Prompt 3 |
|---|---:|---:|---:|
| Clareza | 3 | 5 | 5 |
| Precisão | 3 | 3 | 5 |
| Relevância | 2 | 5 | 5 |
| Organização | 4 | 5 | 5 |
| Adequação ao público | 1 | 5 | 5 |
| Atendimento ao objetivo | 2 | 5 | 5 |
| Utilidade prática | 2 | 4 | 5 |
| Total | 17 | 32 | 35 |

O salto de 17 para 32 veio de contexto, público e formato. O de 32 para 35 veio de uma
coisa só, o critério de verificabilidade. Ele apareceu na precisão, que foi de 3 para 5, e
em utilidade prática, que foi de 4 para 5.

### Qual modificação teve maior impacto?

Depende do problema que se quer resolver. Foi a principal conclusão que tirei da
atividade.

Na adequação, o que decidiu foi o contexto sobre quem é o leitor. Foi isso que levou a
nota de adequação de 1 para 5.

Na correção, o contexto não fez diferença nenhuma. O único elemento que mexeu na
precisão foi a exigência de marcar cada afirmação como verificável ou conceitual, e mesmo
assim ela funcionou porque eu declarei que ia executar os trechos.

## Validação

Executei os quatro trechos marcados como verificáveis. O script está em
[codigo/verificar_afirmacoes.py](codigo/verificar_afirmacoes.py) e a saída em
[codigo/saida.txt](codigo/saida.txt).

```bash
cd codigo
python verificar_afirmacoes.py
```

### Afirmações 1 e 2: custo de busca

```
Afirmacao 2: em lista o custo cresce com o tamanho
      tamanho     dict (ns)      lista (ns)
        1,000          96.2         28098.0
       10,000         126.0        232186.0
      100,000         136.3       3624459.0
    1,000,000         420.7      21357594.0
```

As duas se confirmaram, com uma ressalva que eu não esperava. Com o tamanho multiplicado
por mil, a lista ficou cerca de 760 vezes mais lenta, que é o crescimento linear
previsto. O dicionário também ficou mais lento, cerca de 4 vezes.

Então "não depende do tamanho" vale para o número de comparações, mas não para o tempo
de relógio. Um dicionário de um milhão de chaves não cabe na cache do processador, então
cada busca custa um acesso à memória principal. A afirmação da IA estava correta no
nível em que foi feita, e a medição mostrou uma camada abaixo dela que a explicação
didática ignora. Para mim isso é limite da abstração, por isso não contei como erro da
resposta.

### Afirmação 3: ordem de inserção

```
   versao do Python: 3.14.2
   ordem de insercao: ['zulu', 'alfa', 'mike', 'bravo']
   ordem ao iterar:   ['zulu', 'alfa', 'mike', 'bravo']
   preserva a ordem:  True
```

A execução confirma a versão do Prompt 3 e refuta a dos Prompts 1 e 2: o `dict` preserva
a ordem de inserção. No CPython 3.6 isso passou a ser detalhe de implementação, e no 3.7
virou garantia da linguagem. A afirmação contrária circula em material antigo e é o tipo
de erro que a cartilha da disciplina descreve, informação desatualizada apresentada com
confiança.

Se eu tivesse aceitado a resposta do Prompt 2, que era muito mais agradável de ler do que
a do Prompt 1, teria repassado essa informação errada para o colega.

### Afirmação 4: colisão de hash

```
   hash(1)    = 1
   hash(1.0)  = 1
   hash(True) = 1
   os tres sao iguais: True
   dict apos inserir as tres chaves: {1: 'booleano'}
   quantidade de itens: 1
```

Confirmada, e o resultado diz mais do que a afirmação. Além de produzirem o mesmo hash,
`1`, `1.0` e `True` são iguais entre si em Python, então depois das três inserções o
dicionário fica com uma entrada só, com o valor da última atribuição e a chave da
primeira.

Isso refuta de vez a frase do Prompt 2 sobre a função hash garantir posições distintas.

### Checklist de validação

- [x] A informação pode ser confirmada? Sim, quatro das cinco por execução.
- [x] Os conceitos existem? Sim, todos conferidos na documentação do Python.
- [x] Os dados estão atualizados? Nos Prompts 1 e 2, não. No Prompt 3, sim.
- [x] A resposta atende ao problema? A do Prompt 3, sim.
- [x] Existem afirmações sem sustentação? Uma, marcada como conceitual pela própria resposta.
- [x] As referências existem? Nenhuma referência foi citada, e eu deveria ter exigido.
- [x] Consigo explicar com minhas palavras? Sim, e o script mostra isso.

## Reflexão individual

### 1. Qual foi a principal diferença entre o prompt inicial e o prompt refinado?

O prompt inicial dizia só o assunto. O refinado descrevia uma situação: quem pergunta, o
que essa pessoa já sabe, para que serve a resposta e como eu saberia que ela serviu.

### 2. Quais elementos tiveram maior impacto no resultado?

Para adequação, contexto e público. Para precisão, o critério de qualidade verificável.
Eles resolvem problemas diferentes, então um não substitui o outro.

### 3. Um prompt mais longo necessariamente produz uma resposta melhor?

Não. O Prompt 3 é maior que o Prompt 2, mas o ganho veio de um bloco específico. Um
prompt que só acrescenta adjetivos fica maior e não remove nenhuma ambiguidade, que é o
único trabalho que o texto do prompt realmente faz.

### 4. O que acontece quando o objetivo não está claramente definido?

O modelo escolhe o objetivo mais provável para aquele texto. "Explique tabela hash" tem
como continuação mais provável um verbete de enciclopédia, e foi isso que eu recebi. Foi
a resposta correta para a pergunta que eu fiz, então o modelo não errou.

### 5. Quais informações você considera indispensáveis para elaborar um bom prompt?

Quem é o leitor, qual decisão a resposta precisa apoiar e como eu vou saber se ela
serviu. As duas primeiras direcionam o conteúdo. A terceira protege contra resposta
bonita e errada, e é a que eu costumava esquecer.

### 6. Como o refinamento de prompts pode ser útil para um profissional de Ciência da Computação?

A situação desta atividade é rotina de trabalho: pedir explicação de um sistema
desconhecido, gerar teste, revisar código, escrever documentação. Em todos esses casos a
saída da IA entra em algo que outra pessoa vai usar. Do que fiz aqui, o que eu levaria
para o trabalho é o hábito de definir o critério de aceite antes de pedir. A técnica de
escrever prompt em si pesa menos.

### 7. Que riscos surgem ao confiar em uma resposta sem avaliar sua qualidade?

A própria atividade deu um exemplo. A resposta do Prompt 2 era clara, organizada, tinha
uma analogia boa e mesmo assim continha uma informação errada sobre o comportamento de
uma estrutura de dados. Se eu tivesse repassado, teria ensinado errado com convicção. O
risco maior está na resposta boa com um erro dentro, porque a resposta ruim a gente
percebe.

### 8. Houve alguma situação em que o Prompt 3 ficou pior que o Prompt 2?

Sim, na fluidez. As marcações `[verificável]` e `[conceitual]` no meio do texto
atrapalham a leitura corrida. Para o meu objetivo, que era validar, isso compensou. Se o
objetivo fosse entregar o texto pronto para o colega, eu teria pedido as marcações numa
seção separada no fim.

### 9. Existe um ponto em que adicionar mais instruções começa a prejudicar?

Existe, e vi isso de duas formas. Quando duas instruções competem, o modelo atende uma e
sacrifica a outra: "máximo de 500 palavras" e "defina todo termo técnico" não cabem
juntas se o assunto tiver muitos termos. E instrução de formato demais deixa o texto
travado, como no item anterior. Cada restrição tem um custo, então só vale colocar uma
se ela resolver um problema que eu observei.

### 10. O que você faria para verificar se a resposta está tecnicamente correta?

Foi o que fiz: exigi que cada afirmação viesse com um meio de comprovação, escrevi o
script, executei e comparei os números com o texto. Para o que não dá para executar, eu
iria na documentação oficial. Fazer uma segunda pergunta à mesma IA não resolve, porque
ela erraria duas vezes pelo mesmo motivo.

## Take away

> Um bom prompt não é simplesmente um prompt longo. Ele precisa eliminar as suposições
> que o modelo teria que fazer sozinho e definir, antes da resposta chegar, como ela
> será conferida.

## Cinco recomendações práticas

1. Escreva o critério de aceite antes de escrever o prompt. Se você não consegue
   descrever como saberia que a resposta serviu, o problema ainda não está formulado.
2. Diga para quem é a resposta e o que essa pessoa já sabe. Foi o que mais mudou a
   adequação, e custa uma linha de texto.
3. Exija que afirmações factuais venham com meio de comprovação. O erro ainda pode
   acontecer, só que fica localizável.
4. Refine um elemento por vez e compare. Trocando cinco coisas de uma vez, a resposta
   melhora e você não descobre o que funcionou.
5. Cole o material no prompt em vez de descrevê-lo. O que está no contexto é a única
   parte que você controla.

## Desafio final

Um colega diz: "meu prompt não funcionou, a IA respondeu errado". Antes de mexer no
prompt, eu faria cinco perguntas:

1. Você definiu, antes de perguntar, como saberia que a resposta estava certa?
2. A resposta está errada ou está fora do que você queria? São problemas diferentes, com
   correções diferentes.
3. A informação necessária estava no prompt ou você esperava que o modelo soubesse?
4. Você conferiu o erro em uma fonte independente ou está julgando pela impressão?
5. A tarefa é do tipo que o modelo consegue fazer? Contar caracteres e informar evento
   recente são casos em que o problema não está no prompt.

### Pergunta final

O problema está no prompt, na resposta da IA, nas informações utilizadas ou na forma
como o usuário avaliou o resultado?

Nesta atividade apareceram os quatro. O Prompt 1 estava mal formulado. A afirmação sobre
ordem de inserção era informação desatualizada vinda do treinamento, e a frase sobre a
função hash garantir posições distintas era um erro de raciocínio dentro da própria
resposta. A nota 3 que eu dei em precisão para o Prompt 2, sem verificar nada, foi falha
da minha avaliação. Dos quatro, esse é o único que eu não teria descoberto sem executar
o código.

## Checklist da atividade

- [x] Escolhi um problema de Ciência da Computação.
- [x] Registrei o Prompt 1 e o Resultado 1.
- [x] Analisei as limitações.
- [x] Construí o Prompt 2 e registrei o Resultado 2.
- [x] Comparei os resultados com nota.
- [x] Construí o Prompt 3 e registrei o Resultado 3.
- [x] Comparei as três versões.
- [x] Verifiquei as informações por execução de código.
- [x] Identifiquei duas afirmações incorretas.
- [x] Respondi às dez questões de reflexão.
- [x] Completei o Take Away.
- [x] Registrei cinco recomendações.
- [x] Respondi ao desafio final.
- [x] Organizei o arquivo no GitHub.
