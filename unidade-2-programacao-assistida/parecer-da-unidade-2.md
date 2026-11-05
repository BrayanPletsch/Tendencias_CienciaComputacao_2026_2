# Parecer individual da Unidade 2: Programação Assistida por IA

Disciplina: Tendências em Ciência da Computação

Atividade: Missão Prática, Parecer da Unidade 2 (atividade avaliativa da A2)

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data | 05/11/2026 |

## 1. O que a unidade cobriu

A Unidade 2 tratou da IA como parceira durante a programação: gerar código a partir de uma
intenção, revisar e refatorar código existente, depurar e automatizar tarefas repetitivas
com scripts. As ferramentas citadas nos slides são o GitHub Copilot, o Replit e o
Ghostwriter, o assistente de IA do Replit. O conteúdo teórico girou em torno de três
ideias: o ciclo de colaboração (a IA sugere, o humano avalia, os dois refinam e o humano
decide), o workflow em cinco etapas do guia de boas práticas e a responsabilidade de quem
aceita o código.

Fiz três atividades práticas na unidade, e este parecer se apoia nelas:

- [aula 06](aula-06-programacao-em-pares-com-ia/atividade.md): programação em pares com
  IA, um consultor de CEP no ViaCEP;
- [aula 07](aula-07-boas-praticas-colaboracao-humano-ia/atividade.md): leitura do artigo
  de Sarkar e Drosos sobre vibe coding, com questões e estudo de caso;
- [aula 08](aula-08-automacao-com-ia/atividade.md): automação com IA, um contador de
  níveis de log.

## 2. Sugestões de código

Nas duas atividades de código a IA acertou de primeira o que eu pedi. No caso do CEP, a
versão base que escrevi quebrava em três de seis entradas reais, e a versão sugerida pela
IA resolveu as três. No contador de logs, a primeira versão já passou nos três casos de
teste que coloquei no prompt.

O que fez diferença foi o que estava no prompt. No CEP eu já mandei a mensagem de erro de
cada falha e o corpo real da resposta da API. A IA explicou as quatro causas corretamente
e eu só alterei uma linha do código dela. No contador, a minha especificação dizia que tudo
o que não fosse INFO, WARNING ou ERROR contaria como "fora do formato". A IA seguiu isso à
risca e contou linha em branco como fora do formato. Ela até avisou na resposta. Eu não li
com atenção e só percebi quando o meu arquivo de teste deu 6 em vez de 5.

Isso bate com a citação de Murta (2023) nos slides, de que a qualidade do código gerado
acompanha a qualidade da comunicação. Também bate com o que Sarkar e Drosos chamam de
context momentum: o que eu aceito no começo vira o caminho do resto. No meu caso o efeito
foi pequeno porque eu tinha um teste que pegou o problema.

## 3. Refatoração

A refatoração foi onde a IA mais me ajudou. Usei o prompt de refatoração do material da
professora no contador de logs, e a revisão apontou dois problemas que eu não tinha
visto. A função de leitura era um gerador, então o arquivo só era aberto quando a
contagem começava, o que deixaria o tratamento de erro frágil numa mudança futura. E
erros de sistema como `NotADirectoryError` e nome de arquivo longo demais ainda terminavam
em traceback. Confirmei os dois rodando antes de aceitar.

O exemplo dos slides sobre refatoração do teste de número primo mostrou o outro lado. A
versão "otimizada" ficou mais rápida, mas continua dizendo que 0 e 1 são primos e passou a
quebrar com número negativo. A refatoração melhora o que foi pedido e pode carregar junto
um erro que já existia. Por isso, nas duas atividades, os testes vieram antes de aceitar
qualquer versão.

## 4. Automação

O material lista o que torna uma tarefa boa candidata à automação: repetitiva, frequente,
com regra clara e sujeita a erro manual. Contar níveis de log é exatamente isso. A parte
difícil foi definir a regra, porque o script em si veio pronto. O que é uma linha válida? `info` em
minúsculo conta? E `INFORMATION`, que começa com INFO? E uma mensagem de INFO que cita a
palavra ERROR? Montei um arquivo de log com esses casos antes de ver qualquer código, e foi
esse arquivo que mostrou a falha na minha especificação.

A recomendação do material de desenvolver por etapas e simular antes de executar fez
sentido mesmo num script pequeno. O meu só lê arquivos, então o risco era baixo. Num script
que renomeia ou move arquivos, como o exemplo da pasta de trabalhos do material, eu não
rodaria a versão da IA direto numa pasta real.

## 5. Relação com o workflow e com a matriz de protagonismo

Olhando para trás, as minhas atividades seguiram as cinco etapas do workflow do guia. No
planejamento eu defini problema, entrada, saída e casos de teste. A implementação veio da
IA a partir desse planejamento. Na revisão eu conferi cada afirmação técnica da resposta
que dava para checar: a regex do `http.client`, o comportamento do `\d` com dígitos
Unicode, a hierarquia de exceções. Nos testes usei mock para não depender da rede. A
manutenção ficou de fora porque os scripts são novos.

A divisão da matriz de protagonismo também apareceu. A IA ficou com código repetitivo,
estrutura de exceções, sugestões de refatoração e dicas de teste (a de fazer o patch em
`cep.urlopen` veio dela). Comigo ficaram as decisões: o que conta como linha válida, se a
mensagem sobre CEP geral de cidade afirmava algo que eu não conseguia confirmar, quais
casos deixar sem tratamento.

## 6. Copilot, Replit e Ghostwriter

As atividades da unidade foram feitas com o Claude, pelo chat. Não usei o Replit nem o
Ghostwriter. O Copilot eu uso dentro do VS Code, e comentei isso na atividade da aula 01.

A diferença que noto entre os dois modos é de onde vem o contexto. No Copilot o contexto é
o arquivo aberto e os arquivos vizinhos, e a sugestão aparece enquanto eu digito, o que é
ótimo para código repetitivo e ruim para perceber que estou aceitando algo sem pensar. No
chat eu preciso escrever o contexto inteiro no prompt. Dá mais trabalho, mas me obriga a
fazer o planejamento que o workflow pede.

## 7. Ética e segurança

Nos prompts só entraram dados que não são de ninguém: CEPs públicos, logs inventados e
código escrito para a atividade. Nenhuma credencial, nenhum dado pessoal, como o material
recomenda.

Não acrescentei dependência nenhuma. Tudo usa só a biblioteca padrão do Python, e isso
também elimina a questão de licença de biblioteca de terceiros. O que eu não fiz foi
verificar se algum trecho gerado pela IA se parece com código licenciado de algum projeto
público. Os slides colocam isso como risco de propriedade intelectual, e eu não sei como
faria essa verificação sem uma ferramenta própria para isso.

Sobre responsabilidade, concordo com a frase de Lee, Goldberg e Kohane (2024) citada nos
slides: quem aceita o código responde por ele. Na prática, para mim isso significou não
aceitar nenhuma versão sem rodar, e registrar o que ficou sem tratamento (a resposta da API
em forma de lista e a conexão caindo no meio da leitura, no CEP).

O risco do estudo de caso do Copilot que mais me preocupa é a dependência cognitiva. Os
slides chamam de "esquecer como programar". Em todas as atividades a parte que eu fiz
sozinho (a base do CEP, a regra de linha válida, os testes) foi a que me fez entender o
problema. Se eu tivesse pedido tudo pronto, teria uma suíte passando e não saberia dizer
por quê.

## 8. Parecer

A pergunta do debate da unidade é até que ponto podemos confiar na IA como parceira de
código. A minha resposta, depois das três atividades: dá para confiar no que foi
verificado, e a verificação é trabalho meu. A IA errou pouco nas minhas atividades. Quem
errou mais fui eu, na especificação, e o que me salvou foram testes escritos antes do
código. A ferramenta acelera a parte de escrever código. A parte de decidir o que o código
deve fazer e de conferir se ele faz continua comigo.

## 9. Fontes e uso de IA

Fontes consultadas:

- OLIVEIRA, Kadidja Valéria Reginaldo de. Guia de Boas Práticas na Colaboração
  Humano-IA. Slides de aula, 17 set. 2026.
- OLIVEIRA, Kadidja Valéria Reginaldo de. Programação por Pares com IA: A Nova Era.
  Slides de aula, 2026.
- OLIVEIRA, Kadidja Valéria Reginaldo de. Programação Assistida por Inteligência
  Artificial: atividade prática. Slides de aula, 2026.
- OLIVEIRA, Kadidja Valéria Reginaldo de. Material do Estudante: Programação Assistida
  e Automação com Inteligência Artificial. 2026.
- OLIVEIRA, Kadidja Valéria Reginaldo de. Aula 06: Programação Assistida por
  Inteligência Artificial. Orientações da leitura, 2026.
- SARKAR, A.; DROSOS, I. Vibe coding: programming through conversation with artificial
  intelligence. In: PPIG 2025. Disponível em: https://arxiv.org/abs/2506.23253
- VIACEP. Documentação do webservice. Disponível em: https://viacep.com.br/
- PYTHON SOFTWARE FOUNDATION. Documentação do Python 3.10. Disponível em:
  https://docs.python.org/3.10/

As citações de Murta (2023), Mello (2024), Lee, Goldberg e Kohane (2024) e Córdova (2025)
foram tiradas dos slides da professora. Não consultei as obras originais.

Ferramenta de IA: Claude (Anthropic). Foi a IA usada nas atividades práticas da unidade,
com prompts e respostas registrados em cada atividade, e também apoiou a redação deste
parecer. Os fatos sobre as atividades (resultados, números, testes) vêm das execuções
registradas nas pastas de cada aula.
