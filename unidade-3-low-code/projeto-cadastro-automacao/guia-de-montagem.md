# Guia de montagem

Passo a passo para montar o protótipo do zero: formulário, planilha e cenário no Make.
Leva em torno de uma hora na primeira vez. Os testes estão em
[casos-de-teste.md](casos-de-teste.md).

O que precisa:

- uma conta Google para criar o formulário e a planilha e para enviar os e-mails (pode
  ser a de um integrante ou uma conta criada só para o projeto);
- uma conta gratuita no Make (make.com);
- para os testes, um segundo endereço Gmail que vai receber os e-mails, de preferência
  diferente do que envia.

Os nomes dos botões do Make estão em inglês porque a interface é em inglês.

## 1. Formulário

1. Em forms.google.com, crie um formulário em branco com o título "Cadastro".
2. Primeira pergunta: "Nome completo", tipo Resposta curta, com Obrigatória ligada.
3. Segunda pergunta: "E-mail", tipo Resposta curta, com Obrigatória ligada.
4. Na pergunta de e-mail, clique nos três pontos, depois em Validação de resposta.
   Escolha Expressão regular, depois Corresponde, e cole:

   ```
   ^\s*[A-Za-z0-9_%+-][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z0-9][A-Za-z0-9-]*)*\.[A-Za-z]{2,}\s*$
   ```

   No campo de texto de erro, escreva: `Digite um e-mail válido, por exemplo nome@exemplo.com`.
5. Em Configurações > Respostas, deixe a coleta de e-mails desligada. O e-mail vem da
   pergunta, e assim ninguém precisa entrar com conta Google para se cadastrar.
6. Na aba Respostas, clique em Vincular ao Planilhas e escolha criar uma planilha nova.
7. Abra a visualização do formulário (ícone de olho) e teste a validação sem enviar:
   `ana@gmail.com ` (com espaço no fim) tem que passar, e `.ana@gmail.com` e
   `ana@gmail` têm que mostrar a mensagem de erro.

Depois de montar o cenário, não mude as perguntas. Uma pergunta nova cria coluna na
planilha e desalinha o resto.

## 2. Planilha

1. Abra a planilha criada pelo formulário. A aba se chama "Respostas ao formulário 1" e
   tem as colunas A (Carimbo de data/hora), B (Nome completo) e C (E-mail). O Sheets
   pode criar essa aba como tabela, com o nome `Form_Responses` em cima do cabeçalho, e
   tabela não aceita fórmula na linha de cabeçalho. Nesse caso, clique na seta ao lado de
   `Form_Responses` e escolha a opção de voltar para dados não formatados (em inglês,
   Revert to unformatted data). Não use a opção de excluir a tabela, que apaga os dados.
2. Em Arquivo > Configurações, confira se a localidade é Brasil. Isso define o separador
   das fórmulas (ponto e vírgula).
3. Na célula D1, cole:

   ```
   =ARRAYFORMULA(SE(LIN(C:C)=1;"E-mail normalizado";SE(C:C="";;MINÚSCULA(ARRUMAR(C:C)))))
   ```

4. Na célula E1, cole:

   ```
   =ARRAYFORMULA(SE(LIN(D:D)=1;"Ocorrencia";SE(D:D="";;CONT.SES(D:D;D:D;LIN(D:D);"<="&LIN(D:D)))))
   ```

   Se alguma das duas der erro de nome de função, use a versão com nomes em inglês, ainda
   com ponto e vírgula:

   ```
   =ARRAYFORMULA(IF(ROW(C:C)=1;"E-mail normalizado";IF(C:C="";;LOWER(TRIM(C:C)))))
   =ARRAYFORMULA(IF(ROW(D:D)=1;"Ocorrencia";IF(D:D="";;COUNTIFS(D:D;D:D;ROW(D:D);"<="&ROW(D:D)))))
   ```

5. Digite os títulos `Status` em F1, `Processado em` em G1 e `Detalhe` em H1.
6. Selecione as colunas D a H, clique com o botão direito, depois Ver mais ações da célula >
   Proteger intervalo, e marque "Mostrar um aviso ao editar este intervalo". Assim quem
   abrir a planilha é avisado antes de digitar em cima das fórmulas.
7. Em Compartilhar, deixe o acesso restrito às contas do grupo.

Regras para a aba de respostas, que valem durante todo o projeto:

- nada de digitar nas colunas D e E (quebra a fórmula);
- nada de apagar, limpar ou ordenar linhas (o Make controla o que já leu pela posição das
  linhas, e linha em branco no meio faz ele parar de ler as seguintes);
- se quiser ver os dados ordenados, crie outra aba.

Mande uma resposta pelo formulário com um e-mail seu. Ela vai servir de dado para o Make
mostrar os campos na hora de mapear. Confira que D e E foram preenchidas sozinhas.

## 3. Cenário no Make

Em make.com, crie a conta no plano Free. Depois vá em Scenarios > Create a new scenario.

### Módulo 1: Google Sheets > Watch New Rows

1. Clique no círculo grande, procure Google Sheets e escolha Watch New Rows.
2. Em Connection, clique em Add (ou Create a connection) e depois em Sign in with Google.
   Entre com a conta dona da planilha e autorize.
3. Preencha:
   - Search Method: Select from all (ou Search by path);
   - Spreadsheet ID: a planilha do formulário;
   - Sheet Name: Respostas ao formulário 1;
   - Table contains headers: Yes;
   - Row with headers: `A1:H1`;
   - Limit: `20`.
4. Na janela Choose where to start, escolha All, para a resposta de teste entrar.

### Filtro "Pendente" (entre o módulo 1 e o Router)

Depois de adicionar o Router (próximo passo), clique na ligação entre o módulo 1 e o
Router, em Set up a filter:

- Label: `Pendente`;
- Condition: o campo Status do módulo 1, operador Basic operators: Does not exist.

Esse filtro impede que uma linha que já tem status seja tratada de novo.

### Router

Clique em Add another module à direita do módulo 1 e escolha Flow Control > Router.
Ele já vem com duas rotas. Para as outras duas, clique com o botão direito no Router e
escolha Add a route. Os filtros das rotas ficam nas linhas que saem do Router, na ordem
abaixo.

### Rota A: "Confirmar"

Filtro da ligação entre o Router e o primeiro módulo da rota:

- Label: `Confirmar`;
- Condição 1: E-mail normalizado, operador Matches pattern (texto), valor:

  ```
  ^[A-Za-z0-9_%+-][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z0-9][A-Za-z0-9-]*)*\.[A-Za-z]{2,}$
  ```

- clique em Add AND rule;
- Condição 2: Ocorrencia, operador numérico Equal to, valor `1`.

Módulo 3, Gmail > Send an email:

1. Connection: Add, depois Sign in with Google, com a conta que vai enviar os e-mails.
   Com conta pessoal @gmail.com o Make pede para reautorizar a cada seis meses. Se a
   conexão não completar, o Make tem um guia para criar um cliente próprio no Google Cloud
   (https://apps.make.com/create-and-configure-a-google-cloud-platform-project-for-gmail),
   que é usado em Advanced settings da conexão.
2. To: o campo E-mail normalizado do módulo 1.
3. Subject: `Cadastro confirmado`.
4. Body type: Raw HTML.
5. Body contents (o trecho entre chaves se monta pelo painel de funções: `escapeHTML`,
   `first`, `split` e `trim`, com o campo Nome completo do módulo 1 dentro; o separador
   do `split` é a palavra-chave `space`, da aba de palavras-chave do painel, sem aspas):

   ```html
   <p>Olá, {{escapeHTML(first(split(trim(1.Nome completo); space)))}}!</p>
   <p>Recebemos o seu cadastro e ele está confirmado. Não é preciso fazer mais nada.</p>
   <p>Se não foi você quem se cadastrou, responda a este e-mail para nos avisar.</p>
   <p>Equipe do Sistema de Cadastro</p>
   ```

Módulo 4, Google Sheets > Update a Row, depois do Gmail:

- mesma conexão, planilha e aba do módulo 1, Table contains headers: Yes;
- Row number: o campo Row number (`__ROW_NUMBER__`) do módulo 1;
- Status: `ENVIADO`;
- Processado em: `{{formatDate(now; "DD/MM/YYYY HH:mm"; "America/Sao_Paulo")}}`, com
  as aspas. Depois de pronto, o campo mostra `formatDate(` e `now` como peças e o formato
  como texto comum. Na primeira montagem, sem aspas, o editor mostrou cada `/` como
  operador em verde e a data foi para a planilha como `2026-11-05T16:43:44.930-03:00`;
- todas as outras colunas vazias.

Tratamento de erro do Gmail:

1. Clique com o botão direito no módulo 3 e escolha Add error handler.
2. Adicione Google Sheets > Update a Row (módulo 5), com a mesma configuração do módulo 4,
   mas Status `ERRO_ENVIO` e Detalhe com a mensagem de erro (no painel de mapeamento do
   erro aparece um campo de mensagem do módulo 3).
3. Depois do módulo 5, adicione o manipulador Skip (no menu de error handlers). Se o Make
   não deixar colocar um módulo antes do Skip, use só o Skip e anote o erro à mão na
   planilha durante o teste T9.

### Rota B: "Duplicado"

- Label: `Duplicado`;
- Condição 1: E-mail normalizado, Matches pattern, a mesma regex da rota A;
- Add AND rule;
- Condição 2: Ocorrencia, numérico Greater than, `1`.

Módulo 6, Google Sheets > Update a Row: igual ao módulo 4, com Status `DUPLICADO`.

### Rota C: "Inválido"

- Label: `Inválido`;
- Condição: E-mail normalizado, operador Does not match pattern, a mesma regex.

Se o operador Does not match pattern não existir na lista, use Matches pattern com esta
expressão, que pega tudo o que não é e-mail válido:

```
^(?![A-Za-z0-9_%+-][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z0-9][A-Za-z0-9-]*)*\.[A-Za-z]{2,}$)
```

Módulo 7, Google Sheets > Update a Row: igual ao módulo 4, com Status `EMAIL_INVALIDO`.

### Rota D: fallback

Abra o filtro da quarta rota e marque Yes em "Set the route as a fallback". A janela vem
com uma condição vazia, que deve ser removida no X. Essa rota roda por último e só pega a
linha que não entrou em nenhuma das outras.

Módulo 8, Google Sheets > Update a Row: igual ao módulo 4, com Status `REVISAR` e Detalhe
`Nenhuma rota pegou a linha; conferir colunas D e E`.

### Agendamento e nome

1. Clique no relógio do módulo 1 (ou em Every 15 minutes, na barra de baixo) e escolha On
   demand. Durante os testes o cenário só roda quando alguém clica em Run once.
2. Dê o nome `Cadastro e confirmação por e-mail` ao cenário e clique em Save.

## 4. Primeira execução

Antes de rodar, clique com o botão direito no módulo 1 e use a opção de escolher por onde
começar (Choose where to start) para voltar ao início. Carregar os campos durante a
montagem pode ter feito o Make marcar a resposta de teste como lida.

1. Clique em Run once.
2. A resposta de teste tem que sair do módulo 1, passar pelo filtro Pendente, entrar só na
   rota A e terminar com `ENVIADO` na coluna F. O e-mail tem que chegar.
3. Confira na planilha que as colunas D e E continuam com valores e sem `#REF!`.
4. Clique em Run once de novo sem mandar resposta nova. O módulo 1 tem que voltar sem
   nenhum bundle. Se voltar com bundles vazios, não siga para os testes: o Make está
   lendo as linhas em branco das fórmulas, e o ponteiro do gatilho pode avançar até o fim
   da aba e pular as respostas reais.

Se a resposta parar no filtro Pendente, o Does not exist não está tratando célula vazia como
inexistente. Troque a condição por Status, operador de texto Equal to, com o valor vazio.

## 5. Testes

Siga [casos-de-teste.md](casos-de-teste.md) na ordem. Anote o resultado de cada caso na
coluna "Obtido" e tire os prints listados na seção 7.

## 6. Agendamento para uso real

Pelo consumo de créditos, o agendamento de 15 minutos passa do limite do plano gratuito:
cada verificação gasta 1 crédito mesmo sem resposta nova, e são cerca de 2.880
verificações por mês. Para deixar o cenário ligado, use At regular intervals com 60
minutos (cerca de 720 créditos por mês, mais 2 por cadastro válido). Para a apresentação,
basta ligar durante a demonstração e desligar depois.

## 7. Prints e blueprint

Prints para a pasta `evidencias/`, com os endereços de e-mail borrados ou trocados:

| Arquivo | O que mostrar |
|---|---|
| `formulario.png` | o formulário aberto para preenchimento |
| `validacao-formulario.png` | a mensagem de erro do formulário com um e-mail inválido |
| `planilha-colunas.png` | a aba de respostas com as colunas D a H |
| `cenario-make.png` | o cenário inteiro no Make, com as quatro rotas e a rota de erro |
| `filtro-confirmar.png` | a janela do filtro "Confirmar" aberta |
| `email-recebido.png` | o e-mail de confirmação na caixa de entrada |
| `planilha-apos-testes.png` | a planilha com todos os status depois dos testes |
| `historico-execucoes.png` | o histórico de execuções do cenário (History) |
| `erro-envio.png` | a execução do caso de falha forçada, com a rota de erro |

Depois dos testes, exporte o cenário: no menu de três pontos do cenário, Export Blueprint.
Salve como `blueprint/cenario-cadastro.json`. Antes de mandar para o repositório, abra o
arquivo e confira que não tem nenhum endereço de e-mail real nem senha. O blueprint
guarda o número interno da conexão, mas não guarda a senha nem o token.
