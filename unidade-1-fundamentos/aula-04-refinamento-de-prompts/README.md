# Aula 04: Refinamento de Prompts

Data: 03/09. Objetivo do plano de ensino: refinamento de prompts. Atividade prevista:
comparar resultados de diferentes prompts. Competência: ajustar prompts para maior
precisão.

O material da professora numera esta aula como "Aula 03". Aqui ela aparece como aula 04
por seguir a ordem cronológica dos encontros da unidade.

Enunciado original: [enunciado-da-professora.md](enunciado-da-professora.md).
Entrega da atividade: [atividade.md](atividade.md).
Código de verificação: [codigo/verificar_afirmacoes.py](codigo/verificar_afirmacoes.py).

## O que significa refinar

Refinar um prompt é modificar a instrução a partir da análise do resultado que ela
produziu. O ponto de partida não é o prompt, é a resposta anterior.

A aula 03 tratou de escrever um bom prompt. Esta aula trata do que fazer quando ele não
funcionou. São coisas diferentes: a primeira é composição, a segunda é diagnóstico.

O ciclo é:

```
CRIAR -> TESTAR -> ANALISAR -> REFINAR -> TESTAR NOVAMENTE -> COMPARAR -> VALIDAR
```

Duas etapas desse ciclo costumam ser puladas. A de analisar, porque a tentação é
reescrever o prompt na hora, por intuição, sem identificar o que faltou. E a de
comparar, porque quem escreveu a segunda versão já acredita que ela é melhor.

## Refinar não é aumentar

Este é o ponto central da aula. Compare:

```text
Explique Python.
```

com:

```text
Explique Python de maneira muito completa, detalhada, bem estruturada,
extremamente didática, bastante clara, muito aprofundada e com muitos exemplos.
```

O segundo tem quinze palavras a mais e continua sem dizer nada. "Completo" para quem?
"Aprofundado" até onde? Cada adjetivo acrescentado é mais uma decisão que o modelo vai
tomar sozinho, e não menos.

Agora este:

```text
Explique listas em Python para um estudante que já conhece variáveis e
estruturas condicionais, mas nunca utilizou coleções.

Apresente:
- conceito;
- sintaxe;
- três operações básicas;
- um exemplo comentado;
- um erro comum.

Finalize com um exercício sem apresentar a solução.
```

Menor que o segundo e muito mais informativo, porque cada linha remove uma
possibilidade em vez de acrescentar um adjetivo.

Quantidade de palavras não é sinônimo de qualidade do prompt. O que conta é quantas
suposições o texto elimina.

## O que pode ser refinado

| Elemento | Pergunta que ele responde |
|---|---|
| Papel | de que perspectiva a resposta deve ser escrita |
| Objetivo | o que se pretende alcançar com ela |
| Contexto | qual a situação em que ela será usada |
| Público | quem vai ler |
| Formato | como o resultado deve ser apresentado |
| Restrições | quais limites precisam ser respeitados |
| Critérios de qualidade | como avaliar se a resposta serve |
| Exemplos | qual padrão de entrada e saída seguir |

Na prática, refinar bem é escolher qual desses elementos estava faltando, e não
acrescentar todos de uma vez.

## Perguntas de diagnóstico

Antes de reescrever, o enunciado propõe examinar a resposta anterior:

- O objetivo ficou claro?
- A IA compreendeu o público?
- Houve informação excessivamente genérica?
- O nível de profundidade foi adequado?
- A estrutura serviu?
- A resposta trouxe informação desnecessária?
- Faltaram exemplos?
- Alguma informação precisa ser verificada?

## Comparação com nota

O enunciado pede comparação com nota de 1 a 5 em sete critérios: clareza, precisão,
relevância, organização, adequação ao público, atendimento ao objetivo e utilidade
prática.

A nota isolada vale pouco, porque quem atribui é a mesma pessoa que escreveu o prompt.
O que a tabela produz de útil é obrigar a separar dimensões que normalmente se
confundem. Uma resposta pode ganhar em organização e perder em precisão ao mesmo tempo,
e sem a tabela essa troca passa despercebida.

## Uma resposta melhor escrita não é uma resposta correta

A cartilha *IA no comando? Você no controle* alerta que sistemas de IA produzem textos
coerentes e convincentes que podem conter conceitos incorretos, dados sem fonte,
referências inventadas, generalizações e conclusões apressadas.

O refinamento do prompt melhora a adequação da resposta ao que foi pedido. Ele não
melhora a veracidade. Uma resposta refinada é mais bem direcionada e continua exigindo
a mesma verificação que a primeira.

Checklist de validação usado na atividade:

- A informação pode ser confirmada?
- Os conceitos apresentados existem?
- Os dados estão atualizados?
- A resposta atende ao problema?
- Existem generalizações ou afirmações sem sustentação?
- As referências citadas existem?
- Eu consigo explicar a resposta com minhas palavras?

## IA como apoio, não como substituição

O enunciado contrasta dois tipos de comando. Em vez de:

```text
Resolva esse problema por mim.
```

experimentar:

```text
Ajude-me a compreender o caminho para resolver esse problema.
Faça perguntas para identificar o que eu já sei.
Não apresente a resposta completa imediatamente.
Quando eu cometer um erro, explique qual conceito preciso revisar.
```

A formulação da cartilha é usar a IA para pensar melhor, e não para pensar menos.

## Material de apoio

- **IA no comando? Você no controle.** Guia prático para usar a inteligência artificial
  de forma inteligente, crítica e responsável na universidade. Grupo IA da STHEM/SEMESP
  e MetaRed TIC.
- PYTHON SOFTWARE FOUNDATION. *Built-in Types: Mapping Types*.
  Disponível em: https://docs.python.org/3/library/stdtypes.html#mapping-types-dict
- PYTHON SOFTWARE FOUNDATION. *timeit: Measure execution time of small code snippets*.
  Disponível em: https://docs.python.org/3/library/timeit.html
