PAPEL:
Atue como alguém que monta automações no Make (make.com) com Google Sheets e Gmail
e que já viu esse tipo de fluxo dar problema em uso real.

CONTEXTO:
Somos um grupo de três estudantes fazendo um protótipo para a disciplina. O problema
é o cadastro de pessoas feito à mão: alguém anota nome e e-mail, passa para uma
planilha e depois manda o e-mail de confirmação um por um. O protótipo é este:

1. A pessoa preenche um Google Forms com nome completo e e-mail.
2. O Forms grava a resposta numa planilha do Google Sheets.
3. Um cenário no Make lê as linhas novas, confere o e-mail e manda a confirmação
   pelo Gmail.

Plataforma: Make no plano gratuito. Limites que conferimos: 1.000 créditos por mês,
2 cenários ativos e intervalo mínimo de 15 minutos entre execuções agendadas.
Durante os testes vamos rodar o cenário manualmente.

O que já confirmamos na documentação do Make:
- Google Sheets > Watch New Rows lê as linhas novas da aba de respostas. A saída
  traz o número da linha em `__ROW_NUMBER__`. Se houver linha em branco no meio, o
  Make não processa as linhas seguintes.
- Google Sheets > Update a Row atualiza uma linha pelo número.
- O Router divide o fluxo em rotas com filtros. O filtro tem o operador de texto
  "Matches pattern", que aceita expressão regular.
- Gmail > Send an email tem os campos To, Subject, Body type (Raw HTML) e Body
  contents, e o Make tem a função escapeHTML().

Fora do escopo: login com senha, painel de administração, aplicativo, pagamento e
banco de dados próprio.

Critérios de sucesso que definimos antes:
- em 10 cadastros de teste, todos aparecem na planilha sem perder nem repetir nenhum;
- todo cadastro válido recebe o e-mail;
- cadastro com e-mail inválido não é aceito;
- o processo roda do começo ao fim sem ninguém intervir.

O QUE PRECISO:
1. A estrutura do cenário, módulo por módulo, com o filtro de cada rota.
2. As colunas que devemos acrescentar na aba de respostas para o Make registrar o
   que fez com cada linha.
3. Uma expressão regular para o filtro de e-mail, explicada parte por parte.
4. Um jeito de marcar a mesma pessoa se cadastrando duas vezes sem mandar dois
   e-mails e, se possível, sem gastar crédito a mais do Make.
5. Como evitar que a mesma linha seja processada duas vezes.
6. O texto do e-mail de confirmação, curto, em português, usando só o nome.

RESTRIÇÕES:
- Só módulos que existem no plano gratuito do Make. Não use módulo de IA nem HTTP.
- Nenhum dado de cadastro vai para serviço de IA.
- Se sugerir fórmula de planilha, considere o Google Sheets em português do Brasil
  (separador de argumentos é ponto e vírgula).
- Não invente nome de módulo, campo ou função. Se não tiver certeza de que algo
  existe no Make ou no Sheets, diga isso em vez de supor.

FORMATO DA RESPOSTA:
Itens numerados de 1 a 6, na ordem acima. No fim, uma lista do que você não
conseguiu confirmar.
