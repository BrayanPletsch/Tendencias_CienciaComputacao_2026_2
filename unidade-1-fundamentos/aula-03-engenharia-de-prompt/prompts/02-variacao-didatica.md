# V1a: variação com foco didático

Mesma tarefa da V1, com o objetivo trocado. Aqui eu não quero a suíte pronta, quero
entender o critério que leva a escolher cada caso.

Diferença em relação à V1: o bloco OBJETIVO e o bloco FORMATO foram reescritos, o bloco
CRITÉRIOS DE QUALIDADE foi trocado por um critério de compreensão.

```text
PAPEL
Você é engenheiro de qualidade de software e está fazendo pair programming
comigo.

CONTEXTO
Estou implementando em Python 3.12 a função valida_cpf(cpf: str | None) -> bool
para o cadastro de um sistema acadêmico. Sei escrever testes com unittest, mas
nunca usei análise de classes de equivalência de forma sistemática.

OBJETIVO
Aprender o raciocínio que leva de uma regra de negócio até um conjunto de casos
de teste. O código pronto me interessa menos do que o critério de escolha.

TAREFA
Para cada caso de teste que você propuser, explique nesta ordem:
1. qual característica da entrada esse caso representa;
2. que tipo de defeito ele conseguiria pegar;
3. por que ele não é redundante com os casos anteriores.

RESTRIÇÕES
- no máximo oito casos, escolhidos pelo valor que agregam;
- não apresente o arquivo de teste completo neste momento;
- explique qualquer termo técnico na primeira vez que usá-lo.

FORMATO
Uma seção por caso, com as três explicações em texto corrido.

CRITÉRIO DE QUALIDADE
Ao final, eu devo conseguir propor sozinho um nono caso e justificar por que ele
não é redundante. Termine me pedindo exatamente isso.
```
