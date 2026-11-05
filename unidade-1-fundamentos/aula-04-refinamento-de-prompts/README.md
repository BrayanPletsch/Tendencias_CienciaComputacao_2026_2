# Aula 04: Refinamento de prompts

Data: 03/09. Objetivo do plano de ensino: refinamento de prompts. Atividade prevista:
comparar resultados de diferentes prompts. Competência: ajustar prompts para maior
precisão.

O material da professora numera esta aula como "Aula 03". Aqui ela é a aula 04 porque
sigo a ordem cronológica dos encontros da unidade.

Enunciado original: [enunciado-da-professora.md](enunciado-da-professora.md).
Entrega da atividade: [atividade.md](atividade.md).
Código de verificação: [codigo/verificar_afirmacoes.py](codigo/verificar_afirmacoes.py).

## O que significa refinar

Refinar um prompt é modificar a instrução a partir da análise do resultado que ela
produziu, então o ponto de partida é a resposta anterior.

A aula 03 tratou de escrever um bom prompt, que é um trabalho de composição. Esta trata
do que fazer quando ele não funcionou, e aí o trabalho é de diagnóstico.

O ciclo é:

```
CRIAR -> TESTAR -> ANALISAR -> REFINAR -> TESTAR NOVAMENTE -> COMPARAR -> VALIDAR
```

Duas etapas desse ciclo costumam ser puladas. A análise, porque dá vontade de reescrever
o prompt na hora, por intuição, sem identificar o que faltou. E a comparação, porque quem
escreveu a segunda versão já acredita que ela é melhor.

## Tamanho e precisão do prompt

Três versões de um pedido sobre Python mostram a diferença entre aumentar um prompt e
refiná-lo. A primeira:

```text
Explique Python.
```

A segunda:

```text
Explique Python de maneira muito completa, detalhada, bem estruturada,
extremamente didática, bastante clara, muito aprofundada e com muitos exemplos.
```

A segunda tem dezessete palavras a mais e continua sem especificar nada. "Completo" para
quem? "Aprofundado" até onde? Cada adjetivo acrescentado é mais uma decisão que o modelo
vai tomar sozinho.

A terceira:

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

Ela é menor que a segunda e informa muito mais, porque cada linha remove uma
possibilidade. O que melhora um prompt é a quantidade de suposições que ele elimina, e o
número de palavras diz pouco sobre isso.

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

Na prática, refinar bem é descobrir qual desses elementos estava faltando e acrescentar
esse, sem colocar todos de uma vez.

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
A tabela ajuda porque obriga a separar dimensões que normalmente se confundem. Uma
resposta pode ganhar em organização e perder em precisão ao mesmo tempo, e sem a tabela
essa troca passa despercebida.

## Validação da resposta refinada

A cartilha *IA no comando? Você no controle* alerta que sistemas de IA produzem textos
coerentes e convincentes que podem conter conceitos incorretos, dados sem fonte,
referências inventadas, generalizações e conclusões apressadas.

Refinar o prompt melhora a adequação da resposta ao que foi pedido, mas a veracidade
continua a mesma. Por isso a resposta refinada, mesmo mais bem direcionada, exige a
mesma verificação que a primeira.

Checklist de validação usado na atividade:

- A informação pode ser confirmada?
- Os conceitos apresentados existem?
- Os dados estão atualizados?
- A resposta atende ao problema?
- Existem generalizações ou afirmações sem sustentação?
- As referências citadas existem?
- Eu consigo explicar a resposta com minhas palavras?

## IA como apoio

O enunciado compara dois tipos de comando. No lugar de:

```text
Resolva esse problema por mim.
```

ele sugere experimentar:

```text
Ajude-me a compreender o caminho para resolver esse problema.
Faça perguntas para identificar o que eu já sei.
Não apresente a resposta completa imediatamente.
Quando eu cometer um erro, explique qual conceito preciso revisar.
```

A cartilha resume isso como usar a IA "para pensar melhor, e não para pensar menos".

## Material de apoio

- *IA no comando? Você no controle.* Guia prático para usar a inteligência artificial
  de forma inteligente, crítica e responsável na universidade. Grupo IA da STHEM/SEMESP
  e MetaRed TIC.
- PYTHON SOFTWARE FOUNDATION. *Built-in Types: Mapping Types*.
  Disponível em: https://docs.python.org/3/library/stdtypes.html#mapping-types-dict
- PYTHON SOFTWARE FOUNDATION. *timeit: Measure execution time of small code snippets*.
  Disponível em: https://docs.python.org/3/library/timeit.html
