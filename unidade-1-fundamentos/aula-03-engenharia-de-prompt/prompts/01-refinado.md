# V1: prompt refinado

Versão construída com os sete elementos da anatomia apresentada em aula. Cada bloco
elimina uma suposição que o modelo teve que fazer sozinho na V0.

Técnicas aplicadas: role prompting, contexto, objetivo, tarefa, restrições, formato de
saída e critérios de qualidade.

```text
PAPEL
Você é engenheiro de qualidade de software com experiência em testes de
regras de validação de documentos brasileiros.

CONTEXTO
Estou implementando em Python 3.12 a função valida_cpf(cpf: str | None) -> bool,
que recebe um CPF e devolve True ou False. A função será usada no cadastro de
um sistema acadêmico, onde o campo é digitado manualmente pelo usuário e pode
vir com ou sem máscara. A suíte de testes usa unittest da biblioteca padrão.
Não posso instalar dependências externas.

OBJETIVO
Quero uma suíte de testes que encontre defeitos na minha implementação, e não
uma suíte que confirme que ela funciona. Assuma que a implementação está
errada em algum ponto e escreva os testes que revelariam isso.

TAREFA
1. Liste as classes de equivalência da entrada, separando válidas de inválidas.
2. Liste os valores de borda de cada classe.
3. Liste as entradas malformadas que o campo pode receber na prática.
4. Converta as três listas acima em casos de teste unittest.
5. Aponte qualquer regra do domínio que a assinatura da função não deixa clara.

RESTRIÇÕES
- apenas biblioteca padrão do Python;
- use subTest para casos parametrizados, em vez de repetir métodos;
- todo CPF usado como exemplo válido precisa ter os dígitos verificadores
  corretos pelo cálculo de módulo 11, e você deve mostrar a conta de pelo
  menos um deles para eu poder conferir;
- não escreva a implementação da função, apenas os testes;
- nomes de teste em português, no formato test_verbo_situacao.

FORMATO
Primeiro uma tabela com colunas: classe, exemplo, resultado esperado, motivo.
Depois o arquivo de teste completo, em um único bloco de código.
Por último, uma lista das perguntas em aberto sobre a regra de negócio.

CRITÉRIOS DE QUALIDADE
A suíte é considerada boa se, ao rodar contra uma implementação que só confere
tamanho e dígitos verificadores, pelo menos um teste falhar. Se todos passarem,
a suíte não está cobrindo o suficiente.
```

## Observação sobre o critério de qualidade

O último bloco foi o que mais mudou o resultado. Ele define uma condição verificável
em que a resposta fracassa, e isso eu consigo testar depois executando a suíte.
