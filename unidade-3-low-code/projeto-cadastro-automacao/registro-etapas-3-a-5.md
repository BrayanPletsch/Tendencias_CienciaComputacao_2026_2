# Registro das etapas 3 a 5

Texto das etapas 3, 4 e 5 do formulário de acompanhamento da professora, continuação do
[registro das etapas 1 e 2](registro-etapas-1-e-2.pdf). O formulário completo, com as cinco
etapas, está em [registro-etapas-1-a-5.pdf](registro-etapas-1-a-5.pdf).

## 03. Integrar vibecode e IA (22/10)

- [x] Escrevi um prompt com objetivo, contexto e restrições.
- [x] Revisei a resposta da IA e solicitei ajustes quando necessário.
- [x] Implementei uma lógica, configuração ou integração compatível com o desafio.
- [x] Registrei os prompts, as alterações e os resultados obtidos.
- [x] Mantive senhas, chaves de API e dados pessoais fora dos prompts e do código público.

Prompts utilizados, integração implementada e ajustes realizados:

> Usamos o Claude (Anthropic) para montar a lógica do cenário no Make. No primeiro prompt
> passamos o problema, o objetivo, os limites do plano gratuito do Make e as restrições:
> usar só módulos do plano grátis, não mandar nenhum dado de cadastro para a IA e não
> inventar nome de módulo, campo ou função.
>
> A IA propôs um Router com rotas para cadastro válido, repetido e inválido, uma coluna de
> status na planilha, duas fórmulas (uma que padroniza o e-mail e outra que conta se ele
> já apareceu antes), uma expressão regular para conferir o e-mail e o texto da
> confirmação.
>
> Antes de aceitar, conferimos a resposta na documentação do Make e do Google e testamos a
> expressão regular no Node. Três pontos não batiam com a documentação atual (a conexão do
> Gmail, o nome do tratamento de erro e a validação do Forms) e achamos duas brechas na
> expressão. Também vimos que agendar a cada 15 minutos gastaria mais que os 1.000
> créditos do mês, então o agendamento passou para 60 minutos. Mandamos essas correções
> num segundo prompt, e a versão final passou em todos os casos que testamos.
>
> Com esse desenho montamos o formulário, a planilha e o cenário no Make. Na montagem
> ainda ajustamos duas coisas: a aba de respostas veio como tabela e não aceitava fórmula
> no cabeçalho, e a data só saiu no formato certo depois que colocamos o formato entre
> aspas.
>
> Os prompts, as respostas da IA sem edição e o que mudamos estão no GitHub. Nenhum dado
> de cadastro, senha ou chave foi para os prompts, e as conexões com o Google ficaram
> guardadas no próprio Make.

## 04. Testar e verificar a segurança (29/10)

- [x] Testei o fluxo principal com dados fictícios.
- [x] Testei campos vazios, dados inválidos e entradas inesperadas.
- [x] Verifiquei mensagens de erro e falhas de integração.
- [x] Conferi permissões de acesso e proteção de credenciais.
- [x] Corrigi problemas e repeti os testes.
- [x] Comparei os resultados com os critérios de sucesso.

Casos de teste, resultados, falhas e correções:

> Testamos com dados fictícios e caixas de e-mail temporárias, seguindo uma lista de casos
> que montamos a partir dos critérios da etapa 1.
>
> No fluxo principal, os cadastros válidos foram gravados na planilha com status ENVIADO
> e o e-mail de confirmação chegou só com o primeiro nome da pessoa, inclusive com acento
> ("Olá, José!") e num e-mail institucional com subdomínio. Um e-mail digitado com letras
> maiúsculas e espaços, como acontece no celular, foi padronizado e também recebeu a
> confirmação. O mesmo e-mail cadastrado de novo e a mesma pessoa mandando o formulário
> duas vezes seguidas ficaram como DUPLICADO, sem segundo e-mail. Um nome com código HTML
> apareceu no e-mail como texto, sem mudar a formatação.
>
> Nas entradas inválidas, o formulário recusou e-mail sem @, sem terminação e começando
> com ponto, e também o envio com o nome em branco. A mensagem de erro aparece na tela, e
> mesmo mandando direto para o servidor do formulário a resposta foi recusada e não chegou
> na planilha. Uma execução do Make sem cadastro novo não processou nenhuma linha.
>
> Na primeira execução achamos uma falha na integração entre o Make e a planilha: a data
> de processamento foi gravada no formato ISO. Corrigimos o formato no Make, repetimos o
> teste e a data saiu certa. O cenário também tem uma rota de erro para quando o Gmail
> falhar, que grava ERRO_ENVIO na planilha, mas não chegamos a forçar uma falha de envio.
>
> A planilha está com acesso restrito, o formulário não pede login nem coleta o e-mail da
> conta Google, e o repositório não tem link do formulário, senha, token nem os e-mails
> usados nos testes. Nos prints, os endereços foram borrados.
>
> Comparando com os critérios de sucesso: rodamos 8 dos 11 envios planejados e todos
> apareceram na planilha sem repetir, todos os cadastros válidos receberam o e-mail e o
> formulário barrou os e-mails inválidos. Ficaram sem teste a conferência do e-mail
> inválido dentro do Make e o agendamento automático, então o critério de funcionar sem
> ninguém intervir ainda não foi comprovado. Os casos e resultados estão no
> casos-de-teste.md do GitHub.

## 05. Documentar a solução

- [x] Descrevi o problema, a solução e a plataforma utilizada.
- [x] Registrei como configurar e utilizar a solução.
- [x] Incluí evidências dos testes e das melhorias.
- [x] Registrei limitações, referências e uso de IA.
- [x] Revisei os registros antes de imprimir ou salvar em PDF.

Link do projeto, evidências, limitações e próximos passos:

> A documentação completa está no GitHub, na pasta
> unidade-3-low-code/projeto-cadastro-automacao do repositório
> https://github.com/BrayanPletsch/Tendencias_CienciaComputacao_2026_2.
>
> Lá estão a descrição do desafio, a justificativa da escolha do Make, o desenho do fluxo,
> o guia de montagem campo a campo, os prompts com as respostas da IA, os casos de teste
> com os resultados, os prints dos testes (com os e-mails borrados) e os slides da
> apresentação. O uso de IA e as fontes consultadas estão no README do projeto.
>
> As principais limitações são o plano gratuito do Make, que obriga a checar a planilha
> só de hora em hora para não passar dos créditos, a dependência de ninguém apagar,
> ordenar ou digitar em cima das fórmulas da planilha e o fato de a expressão regular
> conferir o formato do e-mail, mas não se ele existe.
>
> Como próximos passos, queremos rodar os testes que ficaram de fora (falha do Gmail,
> e-mail inválido chegando ao Make e agendamento automático), confirmar o endereço por um
> link no e-mail, trocar a checagem periódica por um gatilho instantâneo e colocar um
> aviso de privacidade no formulário.
