# V1b: variação com few-shot e foco em cobertura

Mesma tarefa da V1, com dois exemplos resolvidos antes da tarefa real. O objetivo é
fixar o formato da tabela e o nível de detalhe da coluna "motivo" sem precisar
descrevê-los.

Diferença em relação à V1: acréscimo do bloco EXEMPLOS e substituição do critério de
qualidade por uma meta numérica de cobertura.

```text
PAPEL
Você é engenheiro de qualidade de software especializado em análise de
classes de equivalência e valores de borda.

CONTEXTO
Função alvo: valida_cpf(cpf: str | None) -> bool, em Python 3.12, usada no
cadastro de um sistema acadêmico. Entrada digitada pelo usuário, com ou sem
máscara. Testes com unittest da biblioteca padrão.

EXEMPLOS
Este é o formato e o nível de detalhe que eu espero em cada linha.

| classe | exemplo | esperado | motivo |
|---|---|---|---|
| tamanho abaixo do mínimo | "5299822472" | False | 10 dígitos, o cálculo do segundo verificador nem chega a ser possível |
| caractere não numérico no meio | "529.982.24A-25" | False | a limpeza da máscara pode remover a letra por engano e mascarar o defeito |

OBJETIVO
Cobrir o espaço de entrada da função com o menor número de casos que ainda
detecte defeitos em cada uma das seguintes categorias: tamanho, conteúdo,
formatação, cálculo dos verificadores, regra de domínio e entrada nula.

TAREFA
1. Preencha a tabela acima com pelo menos um caso por categoria listada no
   objetivo, seguindo exatamente o formato dos dois exemplos.
2. Para cada linha, marque se o caso é positivo ou negativo.
3. Identifique qual categoria costuma ser esquecida em suítes de validação de
   CPF e explique por quê.
4. Converta a tabela em um arquivo unittest usando subTest.

RESTRIÇÕES
- apenas biblioteca padrão;
- no máximo dezoito casos no total;
- todo CPF marcado como válido deve ter os verificadores conferidos pelo
  módulo 11;
- não implemente a função.

FORMATO
Tabela completa, depois a resposta do item 3 em um parágrafo, depois o arquivo
de teste em um único bloco de código.

CRITÉRIO DE QUALIDADE
Nenhuma das seis categorias do objetivo pode ficar sem caso. Se alguma categoria
não fizer sentido para esta função, diga isso em vez de inventar um caso para
preencher a tabela.
```
