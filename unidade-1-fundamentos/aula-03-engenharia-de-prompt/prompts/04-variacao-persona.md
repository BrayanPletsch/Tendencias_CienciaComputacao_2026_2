# V1c: variação com troca de persona

Mesma tarefa da V1, com o papel trocado de engenheiro de qualidade para alguém que quer
burlar a validação. A hipótese é que o papel muda quais casos o modelo considera
relevantes, mesmo com o restante do prompt praticamente idêntico.

Diferença em relação à V1: apenas os blocos PAPEL e OBJETIVO foram reescritos.

```text
PAPEL
Você é analista de prevenção a fraude e está avaliando o cadastro de um
sistema acadêmico. Seu trabalho não é aprovar o código, é encontrar qual
entrada consegue passar pela validação sem corresponder a um documento real.

CONTEXTO
O cadastro chama valida_cpf(cpf: str | None) -> bool antes de criar a conta.
A implementação atual confere o tamanho e recalcula os dois dígitos
verificadores pelo módulo 11. Nenhuma consulta a base externa é feita.

OBJETIVO
Listar entradas que a implementação atual aceita e que, mesmo assim, não devem
gerar um cadastro válido. Priorize as que um usuário conseguiria digitar sem
nenhum conhecimento técnico.

TAREFA
1. Liste cada entrada nessa condição.
2. Para cada uma, mostre por que ela passa no cálculo de módulo 11.
3. Estime o impacto de aceitar essa entrada no sistema de cadastro.
4. Proponha a verificação que fecharia a brecha, em uma linha de Python.
5. Escreva o caso de teste correspondente em unittest.

RESTRIÇÕES
- apenas entradas que passam no cálculo dos verificadores, o resto não interessa;
- ordene da mais provável para a menos provável de acontecer na prática;
- não proponha consulta a serviço externo.

FORMATO
Uma seção por entrada, com os cinco itens da tarefa.

CRITÉRIO DE QUALIDADE
Se não existir nenhuma entrada nessa condição, diga isso claramente em vez de
forçar uma resposta.
```

## Por que esta variação foi incluída

O papel de "revisor que quer aprovar" e o de "analista que quer encontrar brecha" levam
a listas diferentes a partir do mesmo código. Esta variação foi a que produziu o
resultado mais útil da atividade, e o motivo está registrado na
[análise da entrega](../atividade.md#comparação-das-variações).
