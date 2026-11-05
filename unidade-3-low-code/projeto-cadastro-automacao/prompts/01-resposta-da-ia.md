Resposta do Claude Opus 5.5 (Anthropic) ao prompt
[01-estrutura-do-cenario.md](01-estrutura-do-cenario.md), copiada sem edição.
O que conferimos e corrigimos depois está em [02-ajustes.md](02-ajustes.md).

---

## 1. Estrutura do cenário

```
[1] Google Sheets > Watch New Rows
     │  filtro "Pendente"
[2] Router
     ├─ Rota A "Confirmar" → [3] Gmail > Send an email → [4] Google Sheets > Update a Row (ENVIADO)
     │                        [3] com tratamento de erro → [5] Update a Row (ERRO_ENVIO) → Ignore
     ├─ Rota B "Duplicado" → [6] Google Sheets > Update a Row (DUPLICADO)
     ├─ Rota C "Inválido"  → [7] Google Sheets > Update a Row (EMAIL_INVALIDO)
     └─ Rota D "Revisar"   → [8] Google Sheets > Update a Row (REVISAR)
```

As letras de coluna abaixo seguem o layout do item 2 (D = e-mail normalizado, E = ocorrência, F = status).

**[1] Watch New Rows**
- Planilha e aba de respostas do Forms.
- Table contains headers: Yes.
- Limit: 20. É o máximo de linhas por execução. O que passar disso fica para a execução seguinte.
- Na primeira execução o Make pergunta por onde começar. Nos testes, escolham a primeira linha de dados.
- Se o módulo tiver opção de intervalo de colunas, confiram que ele lê até a coluna H. Se não ler, o filtro de Status não enxerga a coluna F.

**Filtro entre [1] e [2] ("Pendente")**
- Status (F), operador básico *Does not exist*.

**[2] Router**
Não precisa de configuração. Um detalhe que pega muita gente: o bundle passa por **todas** as rotas cujo filtro ele satisfaz, não só pela primeira. Por isso os filtros abaixo não se sobrepõem.

**Rota A "Confirmar"**. Filtro:
- E-mail normalizado (D) *Matches pattern* com a regex do item 3
- **e** Ocorrência (E), operador numérico *Equal to* `1`

[3] Gmail > Send an email
- To: E-mail normalizado (D)
- Subject, Body type (Raw HTML) e Body contents: ver item 6

[4] Google Sheets > Update a Row
- Row number: `__ROW_NUMBER__` do módulo 1
- Status: `ENVIADO`
- Processado em: `{{formatDate(now; "DD/MM/YYYY HH:mm"; "America/Sao_Paulo")}}`
- Todos os outros campos vazios, principalmente D e E

Tratamento de erro no [3] (botão direito no módulo > Add error handler):
- [5] Update a Row na mesma linha, com Status `ERRO_ENVIO` e Detalhe = mensagem de erro do módulo 3, terminando na diretiva *Ignore*.
- Sem isso, um único envio que falhe interrompe a execução, e as linhas seguintes do mesmo lote ficam sem tratamento.

**Rota B "Duplicado"**. Filtro: D *Matches pattern* regex **e** E numérico *Greater than* `1`.
[6] Update a Row: Status `DUPLICADO` e Processado em.

**Rota C "Inválido"**. Filtro: D *Does not match pattern* regex.
[7] Update a Row: Status `EMAIL_INVALIDO` e Processado em.

**Rota D "Revisar"**. Filtro: D *Matches pattern* regex **e** Ocorrência (E) *Does not exist*. Se o Router de vocês tiver a opção de rota fallback, ela também serve.
[8] Update a Row: Status `REVISAR`. Na prática só pega linha em que a fórmula de ocorrência veio vazia. Ela existe para que nenhuma linha fique sem status.

**Créditos**
- Pelo que sei, o gatilho gasta 1 crédito por execução, tendo ou não linha nova. Router e filtros não gastam.
- Por linha: válida gasta 2 (Gmail + Update). Duplicada ou inválida gasta 1.
- 10 testes em 3 execuções manuais ficam em torno de 20 a 25 créditos.
- O problema está no agendamento. A cada 15 minutos são 96 execuções por dia, cerca de 2.880 por mês só para olhar a planilha, o que estoura os 1.000 créditos. Para cumprir o critério "sem ninguém intervir", usem intervalo de 60 minutos (cerca de 720 por mês, mais 2 por cadastro) ou deixem o agendamento ligado só durante o período de demonstração.

## 2. Colunas a acrescentar

| Coluna | Cabeçalho | Quem preenche | Conteúdo |
|---|---|---|---|
| A | Carimbo de data/hora | Forms | |
| B | Nome completo | Forms | |
| C | E-mail | Forms | como a pessoa digitou |
| D | E-mail normalizado | fórmula em D1 | e-mail em minúsculas, sem espaços nas pontas |
| E | Ocorrencia | fórmula em E1 | 1 na primeira vez, 2 ou mais quando repete (item 4) |
| F | Status | Make | ENVIADO, DUPLICADO, EMAIL_INVALIDO, ERRO_ENVIO ou REVISAR |
| G | Processado em | Make | data e hora em que o Make tratou a linha |
| H | Detalhe | Make | mensagem de erro, quando houver |

Fórmula de D1:
```
=ARRAYFORMULA(SE(LIN(C:C)=1;"E-mail normalizado";SE(C:C="";;MINÚSCULA(ARRUMAR(C:C)))))
```
- A fórmula fica na linha 1 porque o Forms insere a linha nova sem copiar fórmula. Uma fórmula digitada linha a linha não aparece nas respostas novas.
- O `;;` (argumento vazio) devolve célula realmente vazia em vez de `""`. A ideia é o Make não enxergar as linhas sem resposta como preenchidas (ver a lista no fim).
- Por que normalizar: teclado de celular costuma pôr um espaço depois do e-mail sugerido, e tem gente que digita com maiúscula. Sem isso, " Ana@Gmail.com " falharia na regex e não seria reconhecido como repetição de "ana@gmail.com".

Regras para essa aba:
- A a C só o Forms escreve. D e E só as fórmulas. F a H só o Make.
- Qualquer coisa digitada em D ou E quebra a ARRAYFORMULA (#REF!). Vale proteger D:H com "Proteger intervalo" no modo de aviso.
- Ninguém apaga, limpa ou ordena linhas nessa aba (item 5).

## 3. Expressão regular do e-mail

```
^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$
```

| Parte | O que faz |
|---|---|
| `^` | início do texto. Impede qualquer coisa antes do e-mail |
| `[A-Za-z0-9._%+-]+` | parte antes do @: uma ou mais letras sem acento, dígitos ou `. _ % + -`. O `-` fica no fim do grupo para valer como hífen, não como intervalo |
| `@` | exatamente um @. Como o @ não está em nenhum grupo, um segundo @ faz a expressão falhar |
| `[A-Za-z0-9-]+` | primeiro pedaço do domínio (`gmail`, `unifil`) |
| `(\.[A-Za-z0-9-]+)*` | zero ou mais pedaços intermediários (o `.com` de `.com.br`, o `.alunos` de `alunos.x.br`). `\.` é o ponto literal |
| `\.[A-Za-z]{2,}` | ponto e terminação com 2 ou mais letras (`br`, `com`) |
| `$` | fim do texto. Impede qualquer coisa depois |

Passa: `joao.silva@gmail.com`, `ana+teste@alunos.exemplo.edu.br`.
Barra: `joao@gmail` (sem terminação), `joao@@gmail.com`, `joao silva@gmail.com`, `joao@gmail.com.` (ponto no fim), `joaogmail.com`.

Limites:
- Ainda aceita coisas erradas, como `joao..silva@gmail.com` ou `joao@gmial.com`. A regex confere o formato, não se a caixa existe.
- Recusa domínios com acento, que são raros.
- Um e-mail com formato certo mas inexistente gera um aviso de não entrega na caixa do Gmail que enviou. O Make não fica sabendo disso, então olhem essa caixa depois dos testes.

A regex é aplicada na coluna D, que já vem normalizada. Se não usarem a coluna D, ponham `trim()` em volta do e-mail no lado esquerdo do filtro.

Barreira extra no próprio Forms: na pergunta de e-mail, use Validação de resposta > Texto > Endereço de e-mail. Assim a pessoa vê o erro antes de enviar e corrige na hora, e a rota C continua como segunda barreira. Para testar a rota C, desliguem essa validação durante um dos testes.

## 4. Mesma pessoa se cadastrando duas vezes

Fórmula de E1:
```
=ARRAYFORMULA(SE(LIN(D:D)=1;"Ocorrencia";SE(D:D="";;CONT.SES(D:D;D:D;LIN(D:D);"<="&LIN(D:D)))))
```
Para cada linha, a fórmula conta quantas linhas, daquela para cima, têm o mesmo e-mail normalizado. A primeira vez dá 1, a segunda dá 2 e assim por diante. O Router usa esse número nas rotas A e B.

Por que fazer na planilha e não no Make:
- Não gasta crédito. A alternativa no Make seria um Search Rows por linha, com 1 crédito a mais por cadastro.
- Funciona mesmo quando as duas inscrições caem na mesma execução. Um Search Rows que procurasse "já tem Status ENVIADO" não acharia nada nesse caso, porque nenhuma das duas linhas foi marcada ainda, e as duas receberiam e-mail. Isso acontece bastante: a pessoa clica em enviar, acha que não foi e manda de novo.

Critério: mesma pessoa = mesmo e-mail. O nome não serve, por causa de homônimos e porque a mesma pessoa escreve o nome de jeitos diferentes.

Custo: a linha duplicada gasta 1 crédito (o Update que marca DUPLICADO), menos que uma válida. Dá para zerar tirando o módulo [6], mas aí a linha fica sem Status e vocês perdem a conferência de que toda linha tem status. Eu manteria o módulo.

Caso de borda: se o primeiro cadastro terminou em ERRO_ENVIO, o segundo vira DUPLICADO e também não recebe e-mail. As linhas com ERRO_ENVIO precisam ser olhadas à mão.

## 5. Evitar que a mesma linha seja processada duas vezes

São três camadas:

1. **O ponteiro do gatilho.** Pelo que sei, o Watch New Rows guarda o número da última linha lida. Se alguém apagar uma linha já processada, as de baixo sobem, a próxima resposta cai num número que o Make já considera lido e é pulada. Ordenar a aba ou inserir linha no meio causa o mesmo problema e ainda faz o Update a Row escrever na linha errada. Então: não apagar, não limpar (isso cria a linha em branco que trava o gatilho) e não ordenar. Quem quiser ver os dados ordenados usa outra aba.
2. **O filtro "Status não existe"** logo depois do gatilho. Se uma linha for lida de novo (porque alguém mudou o ponto de partida, por exemplo), ela para no filtro sem gastar crédito.
3. **Marcar na mesma execução, pelo número da própria linha.** Todo Update a Row usa o `__ROW_NUMBER__` do bundle. Nunca procurem a linha por nome ou e-mail.

Ordem na rota A: coloquei o Gmail antes do Update porque, se o Sheets falhar na hora de marcar, a pessoa já recebeu o e-mail, que é o critério principal. O preço é que essa linha fica sem Status e, se for lida de novo, recebe um segundo e-mail. É raro. Se o grupo preferir nunca repetir envio, invertam a ordem: custa o mesmo, mas aí uma falha do Sheets deixa a pessoa sem e-mail.

Cuidados de operação:
- Deixem só um cenário ativo com esse gatilho. Se clonarem o cenário para testar algo, desativem o clone. Cada cópia tem o próprio ponteiro, e as duas mandariam e-mail para as mesmas linhas.
- Nos testes, deixem o agendamento desligado e usem só "Run once". Na hora de ir para uso real, liguem o agendamento e parem de usar o Run once.
- Não apaguem as linhas de teste. Elas já têm Status, e o Make não volta nelas.

## 6. Texto do e-mail

Subject:
```
Cadastro confirmado
```

Body contents (Body type: Raw HTML):
```html
<p>Olá, {{nome}}!</p>
<p>Recebemos o seu cadastro e ele está confirmado. Não é preciso fazer mais nada.</p>
<p>Se não foi você quem se cadastrou, responda a este e-mail para nos avisar.</p>
<p>Equipe [nome do projeto]</p>
```

No lugar de `{{nome}}`, para usar só o primeiro nome:
```
{{escapeHTML(first(split(trim(Nome completo); " ")))}}
```
Para o nome completo: `{{escapeHTML(trim(Nome completo))}}`. Nos dois casos, "Nome completo" é o campo mapeado do módulo 1.

O escapeHTML evita que um nome com `<` ou `&` quebre o HTML. O texto não repete o e-mail nem qualquer outro dado do cadastro.

## O que não consegui confirmar

- O consumo de créditos: que o gatilho gasta 1 crédito por execução mesmo sem linha nova (e não 1 por linha), e que Router e filtros não gastam. Confiram no histórico do cenário depois do primeiro Run once.
- Que o Watch New Rows controla o progresso pelo número da linha. É isso que justifica o cuidado de não apagar nem ordenar.
- Se o Make enxerga como vazias as linhas em que a ARRAYFORMULA devolve vazio com `;;`. Para testar, criem as colunas D e E e rodem o cenário sem resposta nova: o gatilho tem que voltar sem nenhum bundle. Se vierem bundles vazios, parem antes de seguir, porque o ponteiro pode avançar até o fim da aba e pular as respostas reais.
- Se o Watch New Rows tem opção de intervalo de colunas e qual é o padrão.
- Os nomes exatos dos operadores *Does not match pattern* e *Does not exist*, se *Does not exist* trata célula vazia como inexistente e se o Router tem rota fallback. Acredito que existam. Confiram no menu do filtro. Se *Does not exist* não pegar a célula vazia, usem o operador de texto *Equal to* com o valor em branco.
- Qual tipo de regex o *Matches pattern* usa (imagino que o do JavaScript, em que a expressão acima funciona) e se a expressão vai com ou sem as barras `/.../`. Acredito que vá sem.
- Que o Update a Row deixa intocadas as colunas cujo campo fica vazio. Se ele apagar essas colunas, a ARRAYFORMULA quebra. No primeiro teste, confiram que D e E continuam sem #REF!.
- Como mapear a mensagem de erro dentro do tratamento de erro e se a diretiva Ignore está disponível no plano gratuito.
- A conexão do Gmail com conta pessoal @gmail.com. Lembro que o Make exigia criar um cliente OAuth próprio no Google Cloud para usar o Gmail com conta pessoal. Verifiquem isso antes de tudo, porque pode levar mais tempo que o resto da montagem.
- Os nomes das funções em pt-BR (SE, LIN, MINÚSCULA, ARRUMAR, CONT.SES) e se o CONT.SES ignora maiúsculas. Se der erro de nome, testem os nomes em inglês (IF, ROW, LOWER, TRIM, COUNTIFS).
- O caminho exato da validação de e-mail no Forms em português e se o Forms tira os espaços antes de validar.
- O que o Forms faz com as colunas D a H se vocês acrescentarem uma pergunta depois. Evitem mexer nas perguntas depois de montar o cenário. Se precisarem, conferiram as colunas e o mapeamento de novo.
- As funções do Make que usei além do escapeHTML: trim, split, first, now e formatDate com o fuso como terceiro argumento. Tenho bastante segurança, mas confirmem no painel de funções.
