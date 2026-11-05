# Atividade A2: engenharia de prompt

Disciplina: Tendências em Ciência da Computação

Unidade 1, aula 03 (27/08)

Valor: 0,5 ponto

## 1. Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data da execução | 10/09/2026 |
| Ferramenta de IA | Claude Opus 5 (Anthropic) |
| Ambiente de verificação | Python 3.14, biblioteca padrão |

## 2. Problema escolhido

Gerar uma suíte de testes para a função `valida_cpf`, que confere se o CPF informado no
cadastro de um sistema acadêmico é válido.

"Criar casos de teste" está entre os casos de uso sugeridos pela professora. Preferi esse
a "explicar um conceito" porque o resultado pode ser conferido executando. Se eu pedir
uma explicação, a única forma de julgar a resposta é eu achar que ela está boa, o que é
circular. Com casos de teste, eu escrevo a implementação, rodo a suíte e o computador
mostra se a resposta da IA encontrou algum defeito.

Validação de CPF aparece em praticamente todo sistema de cadastro brasileiro. O
algoritmo de módulo 11 é simples o bastante para eu conferir à mão, e a regra tem pelo
menos uma armadilha conhecida.

## 3. Objetivo

Obter uma suíte de testes que encontre defeitos na minha implementação. Boa parte da
atividade é sobre a diferença entre uma suíte assim e uma que só confirma que a função
funciona.

## 4. Prompt inicial

Arquivo: [prompts/00-inicial.md](prompts/00-inicial.md)

```text
Crie casos de teste para uma função que valida CPF.
```

## 5. Resultado inicial

A resposta veio organizada e razoável. Ela trouxe:

- uma explicação do algoritmo de módulo 11 que eu não tinha pedido;
- quatro casos de teste, escritos em pseudocódigo genérico, sem linguagem definida;
- um CPF válido de exemplo, `529.982.247-25`;
- os casos: CPF válido, CPF com dígito verificador errado, CPF com menos de onze
  dígitos e string sem dígitos.

Traduzi os quatro casos para unittest e eles estão na classe `TestesDoPromptInicial` do
arquivo [codigo/test_valida_cpf.py](codigo/test_valida_cpf.py).

## 6. Análise crítica

| Questão | Resposta |
|---|---|
| A resposta atendeu ao objetivo? | Parcialmente. Ela criou testes, mas testes que confirmam o caminho feliz. |
| A resposta foi clara? | Sim, e isso foi parte do problema: como estava clara, parei de procurar defeitos nela. |
| O que ficou faltando? | Casos de borda, entradas malformadas, `None`, variações de máscara e a regra dos dígitos repetidos. |
| O que poderia ser melhorado? | A linguagem não foi definida, então veio pseudocódigo que eu tive que traduzir. |
| Existem informações que precisam ser verificadas? | Sim, o CPF de exemplo. Conferi o cálculo de módulo 11 e ele está correto. |
| A IA fez alguma suposição inadequada? | Sim, três: que eu não conhecia o algoritmo, que quatro casos bastavam e que meu objetivo era demonstrar que a função funciona. |

Os quatro testes estão corretos. O que faltou foi eu dizer no prompt o que estava
tentando descobrir. Como ele só dizia "crie casos de teste", o modelo seguiu pela
continuação mais provável dessa frase, que é uma demonstração didática do conceito, e
uma demonstração didática cobre o caso feliz e três negativos óbvios.

Rodei essa suíte contra a minha implementação inicial, a `valida_cpf_v1`, que só
confere tamanho e dígitos verificadores. Os quatro testes passaram. Se eu tivesse
parado aqui, teria entregue a função com um defeito e uma suíte verde.

## 7. Prompt refinado

Arquivo completo: [prompts/01-refinado.md](prompts/01-refinado.md)

O prompt usa os sete blocos da anatomia vista em aula. Três decisões pesaram mais.

No bloco OBJETIVO passei a dizer `assuma que a implementação está errada em algum ponto e escreva os testes que revelariam isso`.
Foi a mudança de maior efeito, porque inverteu a postura da resposta.

O bloco RESTRIÇÕES exigiu `você deve mostrar a conta de pelo menos um deles para eu poder conferir`.
É uma defesa contra alucinação: qualquer CPF que a IA inventasse teria que vir com a
conta, e eu conseguiria checar.

O bloco CRITÉRIOS DE QUALIDADE definiu uma condição de fracasso verificável:
`se todos passarem, a suíte não está cobrindo o suficiente`. Com isso eu consigo julgar
a resposta executando a própria suíte que ela entrega.

## 8. Resultado refinado

A resposta veio em três partes, como o formato pedia.

Na primeira, sete classes de equivalência: válido com máscara, válido sem máscara,
tamanho abaixo, tamanho acima, conteúdo não numérico, verificadores incorretos e
sequência de dígitos repetidos.

Depois, os casos de teste: doze métodos, com `subTest` para os grupos parametrizados.
Estão na classe `TestesDoPromptRefinado` do arquivo
[codigo/test_valida_cpf.py](codigo/test_valida_cpf.py).

No fim, três perguntas em aberto sobre a regra de negócio, que foram a parte mais útil
da resposta:

1. A função deve rejeitar sequências como `111.111.111-11`? Elas passam no cálculo de
   módulo 11 e mesmo assim não são CPFs emitidos.
2. Uma entrada com máscara inconsistente, como `529982.247-25`, deve ser aceita?
3. `None` deve devolver `False` ou levantar exceção?

A primeira pergunta apontava o defeito que eu tinha: a `valida_cpf_v1` aceitava as dez
sequências de dígitos repetidos (de `000.000.000-00` a `999.999.999-99`). Antes de acreditar, refiz à mão o cálculo para
`111.111.111-11`, e a IA estava certa, o módulo 11 valida esses números.

Corrigi a função com a guarda `if len(set(digitos)) == 1: return False`. A versão final
está em [codigo/valida_cpf.py](codigo/valida_cpf.py).

## 9. Técnicas utilizadas

- [x] Role prompting
- [x] Few-shot prompting (na variação V1b)
- [x] Contexto
- [x] Restrições
- [x] Formato de saída
- [x] Prompt em etapas
- [x] Refinamento iterativo
- [x] Critério de qualidade verificável

## 10. Comparação

Os números abaixo vêm de execução. O script
[codigo/comparar_versoes.py](codigo/comparar_versoes.py) roda os vinte casos das duas
suítes contra as duas versões da função.

```
total de casos: 20
v1 sem a guarda: 4 falha(s)
    '00000000000' (caso vindo do prompt refinado)
    '11111111111' (caso vindo do prompt refinado)
    '22222222222' (caso vindo do prompt refinado)
    '99999999999' (caso vindo do prompt refinado)
final: 0 falha(s)
```

Saída completa em [codigo/saida-comparacao.txt](codigo/saida-comparacao.txt).

| Critério | Prompt inicial | Prompt refinado |
|---|---:|---:|
| Casos de teste gerados | 4 | 12 métodos, 20 asserções distintas |
| Classes de equivalência cobertas | 3 de 7 | 7 de 7 |
| Defeitos encontrados na implementação | 0 | 1 |
| Precisou de tradução para Python | sim | não |
| CPFs de exemplo com cálculo conferível | não | sim |
| Perguntas levantadas sobre a regra | 0 | 3 |

As duas suítes rodaram contra o mesmo código. A do prompt inicial passou inteira e a do
refinado encontrou o defeito.

## 11. Comparação das variações

As três variações partem da V1 e mudam um bloco de cada vez.

| Variação | Bloco alterado | Resultado |
|---|---|---|
| V1a didática | objetivo e formato | Oito casos, cada um com sua justificativa. Boa para aprender o critério, fraca como entregável. Foi a única que me fez entender por que a máscara inconsistente merece um caso próprio. |
| V1b cobertura | acréscimo de few-shot e meta por categoria | Tabela no mesmo formato dos exemplos, sem eu ter descrito o formato. Cobriu as seis categorias e disse, corretamente, que uma delas não se aplicava, sem inventar caso para preencher. |
| V1c persona | apenas papel e objetivo | Foi a mais produtiva. Com o papel de analista antifraude, a resposta já abriu com os dígitos repetidos, ordenados pela probabilidade de acontecer na prática. |

A V1c foi a que mais me chamou atenção. Da V1 para ela mudaram só dois blocos de texto,
o resto do prompt era o mesmo, e mesmo assim a V1 deixou os dígitos repetidos como uma
pergunta em aberto no final da resposta, enquanto a V1c os colocou como o primeiro item
da lista.

Pelo mecanismo visto na [aula 02](../aula-02-llms-e-sua-logica/), a explicação que faz
sentido para mim é que o texto do papel entra no contexto e desloca a distribuição. Um
contexto que fala em fraude torna mais provável a continuação que lista brechas
conhecidas.

## 12. Validação

Fiz três verificações, porque sem elas eu não teria como confiar na resposta da IA.

Primeiro recalculei os dígitos verificadores dos quatro CPFs usados como válidos, e
todos estavam corretos. Também refiz à mão a conta de `111.111.111-11`, porque a
afirmação de que ela passa no módulo 11 era contraintuitiva.

Depois rodei a suíte: dezesseis testes, todos passando contra a versão final.

```
Ran 16 tests in 0.002s

OK
```

Por último rodei a comparação. Ela confirmou que os quatro casos de dígitos repetidos
falham na `v1` e passam na versão final, ou seja, a suíte refinada detecta o defeito e a
correção resolveu.

Para reproduzir:

```bash
cd codigo
python -m unittest test_valida_cpf -v
python comparar_versoes.py
```

Não consultei a documentação oficial da Receita Federal sobre a regra dos dígitos
repetidos. Confirmei que essas sequências passam no módulo 11, o que é matemática, e
que rejeitá-las é prática padrão em bibliotecas de validação. Já a afirmação de que a
Receita não emite esses números eu aceitei da IA, e ela continua pendente de fonte
primária.

## 13. Ética e responsabilidade

Quais riscos existem no uso da IA neste problema?

O risco mais concreto aqui é a IA gerar uma suíte correta e incompleta, que passa
inteira e me dá confiança num código com defeito. Foi o que aconteceu na primeira
rodada. Um teste errado me preocupa menos, porque ele quebra e eu vejo. Já uma suíte
verde convence mais do que uma resposta em texto, e por isso é mais perigosa.

Outro risco é o CPF inventado. O modelo podia ter produzido um número com cara de
válido e verificadores errados, e a suíte teria falhado sem que eu soubesse se o
problema estava no código ou no dado de teste. Por isso o prompt exigiu a conta junto.

Tem também a questão dos dados pessoais. Usei CPFs de teste conhecidos e números
sintéticos. Colar dados reais de pessoas em um prompt seria tratamento de dado pessoal
em serviço de terceiro, o que exigiria base legal sob a LGPD.

Quanto à autoria, a estrutura dos testes veio da IA, e declaro isso. São meus a escolha
do problema, os sete blocos do prompt refinado, o critério de qualidade verificável, a
implementação da função, o script de comparação e as três verificações. Para o critério
da disciplina, o que mais conta é que eu consigo explicar cada caso de teste da suíte e
por que ele não é redundante.

## 14. Take away

A técnica dos sete blocos eu já tinha lido nos slides. O que levo da atividade é que o
bloco mais importante do prompt refinado foi o critério de qualidade, e que ele
funcionou porque dava para verificar.

Um critério como `A suíte deve ser completa e bem escrita` não muda nada na resposta.
Já `Se todos os testes passarem, a suíte não está cobrindo o suficiente` muda, porque
descreve uma condição que pode ser checada.

Generalizando, acho que um prompt melhora quando cada exigência dele pode ser conferida
depois, e um adjetivo como "completa" não tem como ser conferido.

Reflexão completa em [reflexao.md](reflexao.md).

## 15. Link

Repositório: https://github.com/BrayanPletsch/Tendencias_CienciaComputacao_2026_2

Caminho desta atividade:
`unidade-1-fundamentos/aula-03-engenharia-de-prompt/`

## 16. Checklist de entrega

- [x] O problema foi definido.
- [x] O objetivo foi apresentado.
- [x] O prompt inicial foi registrado.
- [x] A primeira resposta foi analisada.
- [x] O prompt foi refinado.
- [x] O segundo resultado foi registrado.
- [x] As três variações foram criadas e testadas.
- [x] Os resultados foram comparados.
- [x] As técnicas utilizadas foram identificadas.
- [x] A resposta da IA foi criticamente avaliada.
- [x] A questão ética foi discutida.
- [x] O Take Away foi respondido.
- [x] O arquivo reflexao.md foi produzido.
- [x] O arquivo foi publicado no GitHub.
- [x] O link da atividade foi informado.
