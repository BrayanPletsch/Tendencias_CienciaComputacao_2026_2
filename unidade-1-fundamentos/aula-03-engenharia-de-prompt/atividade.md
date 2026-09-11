# Atividade A2: Engenharia de Prompt

Disciplina: Tendências em Ciência da Computação
Unidade 1, aula 03 (27/08)
Valor: 0,5 ponto

## 1. Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| Turma | Tendências em Ciência da Computação, 2026/2, quinta-feira |
| Data da execução | 10/09/2026 |
| Ferramenta de IA | Claude Opus 5 (Anthropic) |
| Ambiente de verificação | Python 3.14, biblioteca padrão |

## 2. Problema escolhido

Gerar uma suíte de testes para a função `valida_cpf`, que confere se um CPF informado
no cadastro de um sistema acadêmico é válido.

O caso de uso está entre os sugeridos pela professora ("criar casos de teste"). Escolhi
esse em vez de "explicar um conceito" por um motivo específico: o resultado é
verificável por execução. Se eu pedir uma explicação, a única forma de julgar a resposta
é eu achá-la boa, o que é circular. Com casos de teste, eu escrevo a implementação,
rodo a suíte e o computador diz se a resposta da IA encontrou algum defeito ou não.

O problema é real. Validação de CPF aparece em praticamente todo sistema de cadastro
brasileiro, o algoritmo de módulo 11 é simples o bastante para eu conferir à mão, e a
regra tem pelo menos uma armadilha conhecida.

## 3. Objetivo

Obter uma suíte de testes que encontre defeitos na minha implementação, e não uma que
confirme que ela funciona. A diferença entre essas duas coisas é o que a atividade
investiga.

## 4. Prompt inicial

Arquivo: [prompts/00-inicial.md](prompts/00-inicial.md)

```text
Crie casos de teste para uma função que valida CPF.
```

## 5. Resultado inicial

A resposta veio organizada e razoável. Em resumo, ela entregou:

- uma explicação do algoritmo de módulo 11 que eu não tinha pedido;
- quatro casos de teste, escritos em pseudocódigo genérico, sem linguagem definida;
- um CPF válido de exemplo, `529.982.247-25`;
- os casos: CPF válido, CPF com dígito verificador errado, CPF com menos de onze
  dígitos e string sem dígitos.

Os quatro casos estão registrados na classe `TestesDoPromptInicial` do arquivo
[codigo/test_valida_cpf.py](codigo/test_valida_cpf.py), traduzidos para unittest.

## 6. Análise crítica

| Questão | Resposta |
|---|---|
| A resposta atendeu ao objetivo? | Parcialmente. Ela criou testes, mas testes que confirmam o caminho feliz. |
| A resposta foi clara? | Sim, e essa foi parte do problema. A clareza me fez parar de procurar defeitos nela. |
| O que ficou faltando? | Casos de borda, entradas malformadas, `None`, variações de máscara e a regra dos dígitos repetidos. |
| O que poderia ser melhorado? | A linguagem não foi definida, então veio pseudocódigo que eu tive que traduzir. |
| Existem informações que precisam ser verificadas? | Sim, o CPF de exemplo. Conferi o cálculo de módulo 11 e ele está correto. |
| A IA fez alguma suposição inadequada? | Sim, três: supôs que eu não sabia o algoritmo, supôs que quatro casos bastavam, e supôs que meu objetivo era demonstrar que a função funciona. |

O problema central não foi a IA ter errado. Foi eu não ter dito o que estava tentando
descobrir. Como o prompt só dizia "crie casos de teste", o modelo escolheu a
continuação mais provável para essa frase, que é uma demonstração didática do conceito.
E uma demonstração didática cobre o caso feliz e três negativos óbvios.

Rodei essa suíte contra a minha implementação inicial, a `valida_cpf_v1`, que só
confere tamanho e dígitos verificadores. Os quatro testes passaram. Se eu tivesse
parado aqui, teria entregue a função com um defeito e uma suíte verde.

## 7. Prompt refinado

Arquivo completo: [prompts/01-refinado.md](prompts/01-refinado.md)

Os sete blocos da anatomia da aula, com destaque para três decisões:

O bloco OBJETIVO passou a dizer explicitamente `assuma que a implementação está errada
em algum ponto e escreva os testes que revelariam isso`. Foi a mudança de maior efeito,
porque inverteu a postura da resposta.

O bloco RESTRIÇÕES exigiu `você deve mostrar a conta de pelo menos um deles para eu
poder conferir`. Isso serve como defesa contra alucinação: qualquer CPF que a IA
inventasse teria que vir com a conta, e eu conseguiria checar.

O bloco CRITÉRIOS DE QUALIDADE definiu uma condição de fracasso verificável: `se todos
passarem, a suíte não está cobrindo o suficiente`. Não é uma descrição de qualidade, é
um teste que eu posso executar sobre a própria resposta.

## 8. Resultado refinado

A resposta veio em três partes, como o formato pedia.

**Classes de equivalência.** Sete classes identificadas: válido com máscara, válido sem
máscara, tamanho abaixo, tamanho acima, conteúdo não numérico, verificadores incorretos
e sequência de dígitos repetidos.

**Casos de teste.** Doze métodos, com `subTest` para os grupos parametrizados. Estão na
classe `TestesDoPromptRefinado` do arquivo
[codigo/test_valida_cpf.py](codigo/test_valida_cpf.py).

**Perguntas em aberto sobre a regra de negócio.** Três, e é aqui que estava o valor:

1. A função deve rejeitar sequências como `111.111.111-11`? Elas passam no cálculo de
   módulo 11 e mesmo assim não são CPFs emitidos.
2. Uma entrada com máscara inconsistente, como `529982.247-25`, deve ser aceita?
3. `None` deve devolver `False` ou levantar exceção?

A primeira pergunta apontou o defeito que eu tinha. A `valida_cpf_v1` aceitava as onze
sequências de dígitos repetidos. Conferi o cálculo à mão para `111.111.111-11` antes de
acreditar, e a IA estava certa: o módulo 11 realmente valida esses números.

Corrigi a função acrescentando a guarda `if len(set(digitos)) == 1: return False`, o que
gerou a versão final em [codigo/valida_cpf.py](codigo/valida_cpf.py).

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

Comparação executada, não estimada. O script
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

O número que resume a atividade é o da terceira linha. As duas suítes rodaram contra o
mesmo código. Uma passou inteira, a outra encontrou o defeito.

## 11. Comparação das variações

As três variações partem da V1 e mudam um bloco de cada vez.

| Variação | Bloco alterado | Resultado |
|---|---|---|
| V1a didática | objetivo e formato | Oito casos com justificativa individual. Melhor para aprender o critério, pior como entregável. Foi a única que me fez entender por que a máscara inconsistente merece um caso próprio. |
| V1b cobertura | acréscimo de few-shot e meta por categoria | Formato de tabela idêntico ao dos exemplos, sem eu ter descrito o formato. Cobriu as seis categorias e disse, corretamente, que uma delas não se aplicava, em vez de inventar caso para preencher. |
| V1c persona | apenas papel e objetivo | A mais produtiva. Sob o papel de analista antifraude, a resposta abriu direto com os dígitos repetidos, ordenados por probabilidade de acontecer na prática. |

O resultado da V1c foi o que me chamou mais atenção. Entre a V1 e a V1c mudaram só dois
blocos de texto, e o restante do prompt era o mesmo. Ainda assim, a V1 tratou os dígitos
repetidos como uma pergunta em aberto no final da resposta, enquanto a V1c os colocou
como o primeiro item da lista.

Não vejo isso como o modelo "ficando mais inteligente" com o papel. A explicação que faz
sentido, a partir do mecanismo visto na [aula 02](../aula-02-llms-e-sua-logica/), é que o
texto do papel entra no contexto e desloca a distribuição. Um contexto que fala em
fraude torna mais provável a continuação que lista brechas conhecidas.

## 12. Validação

Esta seção existe porque a resposta da IA não vale nada até ser verificada. Três
verificações foram feitas.

**Conferência aritmética.** Recalculei os dígitos verificadores dos quatro CPFs usados
como válidos. Todos corretos. A conta de `111.111.111-11` também foi refeita à mão,
porque a afirmação de que ela passa no módulo 11 era contraintuitiva.

**Execução da suíte.** Dezesseis testes, todos passando contra a versão final.

```
Ran 16 tests in 0.002s

OK
```

**Execução da comparação.** Confirmou que os quatro casos de dígitos repetidos falham
na `v1` e passam na versão final, o que prova que a suíte refinada realmente detecta o
defeito e que a correção resolveu.

Para reproduzir:

```bash
cd codigo
python -m unittest test_valida_cpf -v
python comparar_versoes.py
```

Registro também o que eu não validei: não consultei a documentação oficial da Receita
Federal sobre a regra dos dígitos repetidos. O que confirmei foi que essas sequências
passam no módulo 11, o que é matemática, e que a prática de rejeitá-las é padrão em
bibliotecas de validação. A afirmação de que a Receita não emite esses números é algo
que eu aceitei da IA e que continua pendente de fonte primária.

## 13. Ética e responsabilidade

Quais riscos existem no uso da IA neste problema?

O risco mais concreto é o inverso do que se costuma imaginar. Não é a IA gerar um teste
errado, porque teste errado quebra e eu vejo. O risco é a IA gerar uma suíte correta e
incompleta, que passa inteira e me dá confiança em um código defeituoso. Foi
exatamente o que aconteceu na primeira rodada. Uma suíte verde é um sinal de qualidade
mais convincente do que uma resposta em texto, e por isso é mais perigosa.

O segundo risco é o CPF inventado. O modelo poderia ter produzido um número com aparência
correta e verificadores errados, e a suíte teria falhado sem que eu soubesse se o culpado
era o código ou o dado de teste. Foi por isso que o prompt exigiu a conta junto.

O terceiro é de contexto: eu usei CPFs de teste conhecidos e números sintéticos. Colar
dados reais de pessoas em um prompt seria tratamento de dado pessoal em serviço de
terceiro, o que exigiria base legal sob a LGPD.

Sobre autoria: a estrutura dos testes veio da IA e eu declaro isso. A escolha do
problema, os sete blocos do prompt refinado, o critério de qualidade verificável, a
implementação da função, o script de comparação e as três verificações são meus. E, o
mais importante para o critério da disciplina, eu consigo explicar cada caso de teste
da suíte e por que ele não é redundante.

## 14. Take Away

O que eu levo da atividade não é a técnica dos sete blocos, que eu já tinha lido nos
slides. É a percepção de que o bloco mais importante do prompt refinado foi o critério
de qualidade, e que ele funcionou porque era verificável.

`A suíte deve ser completa e bem escrita` é um critério que não faz nada. `Se todos os
testes passarem, a suíte não está cobrindo o suficiente` é um critério que muda a
resposta, porque descreve uma condição que pode ser checada.

A generalização que eu tiro: um prompt melhora quando cada exigência dele pode ser
conferida depois. Adjetivo não é exigência. Condição verificável é.

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
