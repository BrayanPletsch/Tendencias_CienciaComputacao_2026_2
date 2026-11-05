# Casos de teste

Todos os dados são fictícios. Os e-mails de teste foram para caixas temporárias de
serviços de e-mail descartável, uma por caso, e no T8 para o e-mail institucional de um
integrante. Nos prints os endereços aparecem borrados.

A conta que envia (a conectada ao módulo Gmail do Make) é diferente das caixas que
recebem.

Os envios do fluxo completo foram feitos por requisição HTTP ao endereço de resposta do
formulário, com os mesmos dois campos que a página manda. Assim a entrada de cada caso
ficou exatamente igual à da tabela, inclusive os espaços do T3. Os envios inválidos (F1 a
F4) foram feitos pelo mesmo caminho, para ver se a validação vale no servidor do Google e
não só na tela. A mensagem na tela aparece no print
[validacao-formulario.png](evidencias/validacao-formulario.png).

T7, T9 e T10 não foram executados. Eles dependiam de mudar a configuração do formulário e
do cenário durante o teste.

Como montar o ambiente: [guia-de-montagem.md](guia-de-montagem.md).

## Antes dos testes

| ID | Verificação | Esperado | Obtido |
|---|---|---|---|
| P1 | Validação do formulário na visualização: `ana@gmail.com ` (espaço no fim), `.ana@gmail.com` e `ana@gmail` | o primeiro passa, os outros dois mostram a mensagem de erro | na tela, `.teste@gmail.com` e `teste!@@gmail.com` mostraram a mensagem de erro (print validacao-formulario.png); o endereço com espaços antes e depois foi aceito no T3 |
| P2 | Run once sem nenhuma resposta nova | módulo 1 volta sem bundles e gasta 1 crédito | módulo 1 sem dados ("The module didn't return any new data"), filtro Pendente com 0; o painel mostrou "1 operation · 0 credits", embora a documentação diga 1 crédito por verificação |
| P3 | Colunas D e E depois do primeiro Update a Row | continuam calculadas, sem `#REF!` | D2 e E2 continuaram calculadas (05/11) |

## Barreira do formulário

Estes envios não podem chegar na planilha.

| ID | Entrada | Esperado | Obtido |
|---|---|---|---|
| F1 | e-mail `anagmail.com` (sem @) | formulário recusa e mostra a mensagem de erro | recusado pelo servidor (HTTP 400), não entrou na planilha |
| F2 | e-mail `ana@gmail` (sem terminação) | formulário recusa | recusado pelo servidor (HTTP 400), não entrou na planilha |
| F3 | e-mail `.ana@gmail.com` (começa com ponto) | formulário recusa | recusado pelo servidor (HTTP 400), não entrou na planilha; na tela, `.teste@gmail.com` mostrou a mensagem de erro |
| F4 | nome em branco | formulário não envia, campo obrigatório | recusado pelo servidor (HTTP 400), não entrou na planilha |

## Fluxo completo

Estes envios chegam na planilha. São onze, porque o T5 tem dois envios. A coluna Status é
a coluna F da planilha.

| ID | Como executar | Entrada | Status esperado | E-mail esperado | Obtido |
|---|---|---|---|---|---|
| T1 | enviar e rodar | Ana Teste, caixa temporária 1 | ENVIADO | chega, começa com "Olá, Ana!" | ENVIADO, processado em 05/11/2026 17:15; e-mail chegou às 17:15 com "Olá, Ana!" |
| T2 | enviar e rodar | José da Silva Araújo, caixa temporária 2 | ENVIADO | chega, "Olá, José!" | ENVIADO (17:21); e-mail chegou às 17:21 com "Olá, José!" |
| T3 | enviar e rodar | Bruno Teste, endereço da caixa temporária 3 com maiúsculas, dois espaços antes e um depois (como no celular) | ENVIADO, com D em minúsculas e sem espaços | chega | ENVIADO (17:21); C guardou o endereço como digitado e D ficou em minúsculas e sem espaços; e-mail chegou às 17:21 com "Olá, Bruno!" |
| T4 | enviar e rodar, depois do T1 | Ana T., caixa temporária 1 (repete o T1) | DUPLICADO | nenhum e-mail novo | DUPLICADO (17:17). A caixa temporária expirou antes de conferirmos se chegou outro e-mail; a rota Duplicado não tem módulo de envio |
| T5 | enviar duas vezes e só então rodar | Carla Teste, caixa temporária 4, duas vezes | primeira ENVIADO, segunda DUPLICADO | só um e-mail | primeira ENVIADO, segunda DUPLICADO (17:21); a caixa recebeu um e-mail só, com "Olá, Carla!" |
| T6 | enviar e rodar | `<b>Ana</b> Teste`, caixa temporária 5 | ENVIADO | chega, mostrando `<b>Ana</b>` como texto, sem negrito | ENVIADO (17:27); e-mail chegou com "Olá, <b>Ana</b>!" com as tags como texto |
| T7 | desligar a validação do formulário, enviar, religar a validação, rodar | Davi Teste, `teste@invalido` | EMAIL_INVALIDO | nenhum e-mail | não executado |
| T8 | enviar e rodar | Pedro Teste, e-mail institucional de um integrante (domínio com subdomínio, como `nome@cs.udf.edu.br`) | ENVIADO | chega no e-mail institucional | ENVIADO (17:21); e-mail chegou no institucional com "Olá, Pedro!" |
| T9 | trocar o campo To do módulo 3 por `teste@@exemplo`, enviar, rodar, voltar o To ao normal | Erica Teste, caixa temporária 6 | ERRO_ENVIO, com a mensagem do Gmail em Detalhe | nenhum e-mail; as outras linhas da mesma execução seguem | não executado |
| T10 | ligar o agendamento a cada 15 minutos, enviar, não clicar em nada, esperar até 15 minutos, desligar o agendamento | Fábio Teste, caixa temporária 7 | ENVIADO sem ninguém rodar o cenário | chega | não executado |

Os textos esperados do T6 e do T9 dependem de comportamentos que não deu para conferir
antes de montar (como o Gmail mostra o HTML escapado e qual erro ele devolve para um
endereço malformado). Se o resultado for outro, o que vale é anotar o que aconteceu.

## Segurança e privacidade

| ID | Verificação | Esperado | Obtido |
|---|---|---|---|
| S1 | Compartilhamento da planilha | acesso restrito às contas do grupo | restrito à conta dona; os outros integrantes ainda não foram adicionados |
| S2 | Formulário | não pede login e não coleta o e-mail da conta Google | abre e aceita respostas sem login; as respostas sem e-mail da conta foram aceitas, então a coleta está desligada |
| S3 | Repositório | nenhum link do formulário, senha, token ou e-mail real; blueprint conferido | nenhum link do formulário, da planilha ou do cenário e nenhum endereço usado nos testes; o blueprint não foi exportado |
| S4 | Prints | endereços de e-mail borrados ou trocados | borrados nos prints da planilha e dos e-mails; os demais não mostram endereço real |
| S5 | Créditos | total gasto nos testes, lido no histórico do cenário | não conferido |

## Critérios de sucesso da etapa 1

| Critério | Casos que verificam | Atingido? |
|---|---|---|
| Em 10 cadastros de teste, todos aparecem na planilha sem perder nem repetir nenhum | T1 a T10 (11 envios) e a contagem de linhas da planilha | em parte: os 8 envios feitos apareceram na planilha e nenhum foi tratado duas vezes, mas T7, T9 e T10 não rodaram |
| Todo cadastro válido recebe o e-mail | T1, T2, T3, T5, T6, T8, T10 | sim nos casos rodados; o T10 não rodou |
| Cadastro com e-mail inválido não é aceito | F1 a F3 no formulário, T7 no Make | sim no formulário; a segunda conferência, no Make, não foi testada |
| O processo funciona do começo ao fim sem ninguém intervir | T10 | não verificado |

Na etapa 1 o critério "sem repetir" se referia a nenhum cadastro aparecer duas vezes por
causa da automação. Os casos T4 e T5 acrescentam outra situação, a mesma pessoa
mandando o formulário duas vezes: as duas linhas ficam na planilha, mas só uma recebe
e-mail.

Data da execução: 05/11/2026

Créditos gastos no total: não conferido
