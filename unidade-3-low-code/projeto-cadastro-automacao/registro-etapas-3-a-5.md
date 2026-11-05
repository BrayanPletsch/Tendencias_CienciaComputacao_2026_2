# Registro das etapas 3 a 5

Texto das etapas 3, 4 e 5 do formulário de acompanhamento da professora, continuação do
[registro das etapas 1 e 2](registro-etapas-1-e-2.pdf).

## 03. Integrar vibecode e IA (22/10)

- [x] Escrevi um prompt com objetivo, contexto e restrições.
- [x] Revisei a resposta da IA e solicitei ajustes quando necessário.
- [x] Implementei uma lógica, configuração ou integração compatível com o desafio.
- [x] Registrei os prompts, as alterações e os resultados obtidos.
- [x] Mantive senhas, chaves de API e dados pessoais fora dos prompts e do código público.

Prompts utilizados, integração implementada e ajustes realizados:

> Usamos o Claude para montar a lógica do cenário. No primeiro prompt passamos o problema,
> os limites do plano grátis do Make e as restrições: só módulos do plano grátis, nenhum
> dado de cadastro indo para IA e nada de inventar nome de módulo ou função. A IA propôs um
> Router com rotas para cadastro válido, repetido e inválido, uma coluna de status na
> planilha, duas fórmulas (e-mail normalizado e contagem de repetição), uma expressão
> regular para conferir o e-mail e o texto da confirmação. Conferimos na documentação e
> testamos a expressão no Node. Três pontos não batiam com a documentação atual (conexão
> do Gmail, nome do tratamento de erro e validação do Forms) e achamos duas brechas na expressão. No
> segundo prompt mandamos as correções. A versão final passou em todos os casos que
> testamos. Também vimos que agendar a cada 15 minutos estouraria os 1.000 créditos, então
> o agendamento passou para 60 minutos. Os prompts e as respostas estão no GitHub. Com
> esse desenho montamos o formulário, a planilha e o cenário no Make.

## 04. Testar e verificar a segurança (29/10)

- [x] Testei o fluxo principal com dados fictícios.
- [x] Testei campos vazios, dados inválidos e entradas inesperadas.
- [ ] Verifiquei mensagens de erro e falhas de integração.
- [x] Conferi permissões de acesso e proteção de credenciais.
- [x] Corrigi problemas e repeti os testes.
- [x] Comparei os resultados com os critérios de sucesso.

Casos de teste, resultados, falhas e correções:

> Testamos com dados fictícios e caixas de e-mail temporárias. Rodamos 8 dos 11 envios
> planejados e todos apareceram na planilha. Os cadastros válidos ficaram com status
> ENVIADO e o e-mail chegou só com o primeiro nome, inclusive com acento ("Olá, José!") e
> num domínio com subdomínio. Um e-mail digitado com maiúsculas e espaços foi
> normalizado e recebeu a confirmação. O e-mail repetido e o envio duplicado da mesma
> pessoa ficaram como DUPLICADO, sem segundo e-mail. Um nome com HTML apareceu no e-mail
> como texto. O formulário recusou e-mail sem @, sem terminação, começando com ponto e o
> envio com nome em branco, e nenhum deles chegou na planilha. Uma execução sem resposta
> nova não devolveu nenhuma linha. Na primeira execução a data de processamento saiu em
> formato ISO porque o formato tinha sido digitado sem aspas no Make; corrigimos e o
> teste seguinte já saiu certo. A planilha está restrita à conta dona e o formulário não
> pede login. Não rodamos o teste de e-mail inválido chegando ao Make por outro caminho,
> o de falha forçada no Gmail e o de agendamento automático, então o critério de
> funcionar sem ninguém intervir ainda não foi verificado. Os casos e resultados estão em
> casos-de-teste.md.

## 05. Documentar a solução

- [x] Descrevi o problema, a solução e a plataforma utilizada.
- [x] Registrei como configurar e utilizar a solução.
- [x] Incluí evidências dos testes e das melhorias.
- [x] Registrei limitações, referências e uso de IA.
- [ ] Revisei os registros antes de imprimir ou salvar em PDF.

Link do projeto, evidências, limitações e próximos passos:

> A documentação está no GitHub, na pasta unidade-3-low-code/projeto-cadastro-automacao
> do repositório
> https://github.com/BrayanPletsch/Tendencias_CienciaComputacao_2026_2. Lá estão o
> desafio, a justificativa do Make, o desenho do fluxo, o guia de montagem campo a campo,
> os prompts com as respostas da IA, os casos de teste com os resultados, os prints dos
> testes e os slides. As principais
> limitações são o plano grátis, que obriga a checar a planilha só de hora em hora, a
> dependência de ninguém apagar ou ordenar linhas da planilha e o fato de a expressão
> regular conferir o formato do e-mail mas não se ele existe. Como próximos passos,
> pensamos em confirmar o e-mail por um link, trocar a checagem periódica por um gatilho
> instantâneo e colocar aviso de privacidade no formulário.
