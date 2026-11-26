# Casos de teste

A bateria está em [agente/testes.js](agente/testes.js) e roda com Node.js, sem nenhuma
dependência:

```bash
cd agente
node testes.js            # mostra o resultado
node testes.js --salvar   # também grava resultado-dos-testes.txt
```

Os testes usam 26/11/2026 como data de hoje, para os prazos darem sempre o mesmo resultado. A
saída da última execução está em [agente/resultado-dos-testes.txt](agente/resultado-dos-testes.txt).

## Grupos

| Grupo | Testes | O que verifica |
|---|---|---|
| Classificação: linguagem formal | 6 | um relato de cada caso escrito como documento |
| Classificação: linguagem informal | 6 | o mesmo, escrito como conversa |
| Classificação: com erro de digitação | 6 | o mesmo, com erros comuns ("defeto", "cobranssa", "atrazou") |
| Classificação: com expressão regional | 6 | o mesmo, com expressões como "arriou", "deu prego", "serviço porco" |
| Prazos e regras | 12 | arts. 26 e 49, loja física, defeito escondido, devolução em dobro, amostra grátis, leitura de datas |
| Fora do escopo | 5 | trabalho, aluguel, compra entre pessoas, golpe e acidente são encaminhados |
| Privacidade | 5 | CPF, telefone, e-mail e cartão apagados; memória curta limitada; "apagar conversa"; registro sem texto |
| Adversarial | 5 | pedido para ignorar as regras, valor de indenização, xingamento com pedido de ameaça, mensagem vazia, respostas sem sentido |
| Estresse | 2 | mensagem de 5.000 caracteres e 1.000 conversas seguidas em menos de 2 segundos |
| Regressão | 2 | os dois falsos positivos da rodada 1 não voltam |

Os quatro grupos de classificação usam o mesmo caso escrito de jeitos diferentes. Se a
Lia acerta num registro e erra noutro, a diferença vem da linguagem, e não do caso. É assim
que a bateria mede o viés de dados.

## Rodada 1: antes de qualquer ajuste

Resultado: 46 de 53.

| Grupo | Resultado |
|---|---|
| Linguagem formal | 6/6 |
| Linguagem informal | 5/6 |
| Com erro de digitação | 6/6 |
| Com expressão regional | 3/6 |
| Prazos e regras | 10/12 |
| Fora do escopo | 5/5 |
| Privacidade | 5/5 |
| Adversarial | 4/5 |
| Estresse | 2/2 |

As sete falhas e o que causou cada uma:

| Teste que falhou | Causa | Correção |
|---|---|---|
| Informal: "colocaram um seguro no meu cartão que eu nunca pedi" | "colocaram" ficou a duas letras de "clonaram", gatilho de golpe, e o caso foi encaminhado como golpe | aproximação só com as duas primeiras letras iguais; assuntos fora do escopo só com a palavra exata |
| Regras: produto não pedido e não pago vira amostra grátis | a mesma confusão com "clonaram" | a mesma |
| Regras: serviço durável terminado há 100 dias | "feita" ficou a uma letra de "festa", e a reforma ficou sem durabilidade definida | produtos e canais de compra só com a palavra exata |
| Regional: "a máquina de lavar arriou [...], deu prego de vez" | expressões que não estavam nos gatilhos | acrescentei "arriou", "deu prego", "deu pane", "deu tilt", "deu xabu" e "entregou os pontos" |
| Regional: "a mercadoria não veio até hoje" | idem | acrescentei "não veio" e "nunca chegou" |
| Regional: "o encanador fez um serviço porco" | idem | acrescentei "serviço porco" e "pela metade" |
| Adversarial: respostas sem sentido | erro no próprio teste: o relato usado já respondia a pergunta que o teste esperava | troquei o relato por um que deixa a pergunta em aberto |

A última falha era do teste, e não da Lia. Deixei registrada porque também foi corrigida
nesta rodada.

## Rodada 2: depois das correções

Resultado: 55 de 55. São os 53 testes da rodada 1 e os 2 de regressão acrescentados para os
falsos positivos. Todos os grupos de classificação ficaram em 6 de 6.

## Validação com frases novas

A rodada 2 passa inteira porque acrescentei exatamente as expressões que tinham falhado. Para
saber quanto a Lia generaliza, escrevi 12 frases novas depois das correções e não usei
nenhuma delas para ajustar os gatilhos. O resultado aparece no relatório da bateria, mas não
a reprova.

| Frase | Caso esperado | Resultado |
|---|---|---|
| "o ventilador queimou na primeira semana" | produto com defeito | não entendeu |
| "a air fryer chegou toda amassada" | produto com defeito | não entendeu |
| "quero cancelar a compra que fiz pelo instagram, mudei de ideia" | arrependimento | acertou |
| "comprei um vestido online e não ficou bom, quero mandar de volta" | arrependimento | não entendeu |
| "a fatura veio com um valor que eu não reconheço" | cobrança indevida | acertou |
| "estão me cobrando um boleto que já quitei" | cobrança indevida | acertou |
| "ativaram um pacote de internet sem eu pedir" | produto ou serviço não pedido | acertou |
| "chegou um cartão de crédito na minha casa que eu nunca solicitei" | produto ou serviço não pedido | não entendeu |
| "a loja vendeu e depois disse que não tinha estoque" | oferta não cumprida | não entendeu |
| "o anúncio dizia frete grátis e me cobraram o frete" | oferta não cumprida | cobrança indevida, com confiança baixa |
| "o técnico da internet veio e não resolveu nada" | serviço mal feito | não entendeu |
| "a dedetização não adiantou nada, as baratas continuam" | serviço mal feito | não entendeu |

Acertos: 4 de 12. As palavras que faltaram são previsíveis ("queimou", "amassada",
"solicitei", "estoque", "não resolveu"), e é isso que mostra o limite de uma lista escrita à
mão: sempre vai faltar a próxima. Nos 8 erros, nenhum caso foi orientado errado com confiança
alta. Sete terminaram em "não entendi", e o frete cobrado indevidamente foi tratado como
cobrança indevida, o que não é absurdo para esse relato.

Essas 8 frases são a entrada do próximo ciclo de curadoria. Para medir a generalização de novo
depois de usá-las, vai ser preciso escrever outro conjunto de validação.
