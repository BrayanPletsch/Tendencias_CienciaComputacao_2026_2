# Unidade 4: Aplicações e limitações (agentes e ética)

Os encontros de novembro trataram de agentes de IA, chatbots, viés algorítmico e
responsabilidade social. As tarefas da unidade formam o projeto final da A1, que vale até
5,0 pontos. Fiz o projeto individualmente.

Projeto: [Lia, assistente de reclamação do consumidor](projeto-assistente-consumidor/).

## Entregas da A1

| Data | Tarefa | Valor | Onde está |
|---|---|---|---|
| 05/11 | Criação de agentes de IA | 1,0 | código em [agente/](projeto-assistente-consumidor/agente/) e seções 3 a 6 do [README do projeto](projeto-assistente-consumidor/README.md): modelo generativo ou agente, quatro camadas, prompt dinâmico e memória |
| 12/11 | Chatbot e ferramentas de chatbot, com a especificação | 1,0 | [especificacao-do-chatbot.md](projeto-assistente-consumidor/especificacao-do-chatbot.md), nas 11 etapas do Serpro Bots, a [landing](projeto-assistente-consumidor/agente/index.html) que apresenta o projeto, a interface em [agente/conversa.html](projeto-assistente-consumidor/agente/conversa.html) e o [design system](projeto-assistente-consumidor/agente/design-system.html) |
| 19/11 | Viés algorítmico e responsabilidade social | 1,0 | [etica-e-vies.md](projeto-assistente-consumidor/etica-e-vies.md) e os testes de equidade em [casos-de-teste.md](projeto-assistente-consumidor/casos-de-teste.md) |
| 26/11 | Apresentação do projeto de solução inteligente | 1,0 | [slides/apresentacao.pptx](projeto-assistente-consumidor/slides/apresentacao.pptx) e a demonstração ao vivo em `agente/conversa.html?exemplo=1` até `?exemplo=4` |
| 26/11 | Integrar conceitos em solução aplicada: repositório GitHub | 1,0 | este repositório, com as quatro unidades da disciplina |

## O que o guia da A1 cobra

O guia de estudos da professora ([material/guia-a1-agentes-de-ia-e-etica.pdf](material/guia-a1-agentes-de-ia-e-etica.pdf))
resume a unidade em quatro etapas: fundamentos técnicos, gestão de memória, riscos e
defesas, e ética aplicada.

Um modelo generativo responde a um prompt isolado. Um agente age, mantém o contexto da
conversa e tem autonomia, e por isso exige mais responsabilidade de quem o constrói. O guia
descreve o agente em quatro camadas: a perceptiva recebe o que vem do ambiente, a cognitiva
entende a intenção, a decisória confere regras e elegibilidade, e a executiva age. A confiança
nesse agente depende de dar para explicar por que ele tomou cada decisão.

O prompt de um agente deixa de ser um texto fixo e vira um modelo com campos que se
preenchem durante a conversa. A memória aparece em três níveis (curta, média e longa), com
um aviso: quanto mais o agente lembra, maior o risco de privacidade. A privacidade tem que
nascer no projeto, com coleta mínima, criptografia e controle de acesso, e a LGPD exige
consentimento novo quando conversas antigas são usadas para outra finalidade.

O viés aparece em três formas: nos dados (quem não está representado no treino), no
algoritmo (escolhas de quem desenvolve) e na aplicação (usar o sistema num contexto para o
qual ele não foi feito). Mitigar tem custo, porque às vezes a solução justa sacrifica
eficiência. Para avaliar um agente de impacto social, acurácia e latência não bastam: o guia
pede para olhar confiança, robustez e impacto real, e para fazer testes adversariais e de
estresse.

Para as decisões difíceis, o guia apresenta três frameworks (consequencialista,
deontológico e das virtudes) e a ideia de licença social para operar, apoiada em
accountability, participação e remediação. A documentação de cada escolha técnica funciona
como gestão de risco, dentro de um ciclo de melhoria contínua: coletar, analisar, decidir,
implementar e validar.

No projeto, cada um desses conceitos tem um lugar. A tabela de entregas acima diz onde.

## A aula de chatbots

A aula sobre chatbots indicou o
[fluxo de trabalho do Serpro Bots](https://serprobots.estaleiro.serpro.gov.br/docs/dev/),
que organiza o desenvolvimento em 11 etapas: entender a necessidade, montar a estrutura,
criar a identidade visual e a persona, coletar o acervo, modelar, revisar os textos (UX
Writing), implementar, testar, homologar, implantar e fazer a curadoria. A especificação da
Lia segue essas etapas.

## Material

| Arquivo | O que é |
|---|---|
| [material/guia-a1-agentes-de-ia-e-etica.pdf](material/guia-a1-agentes-de-ia-e-etica.pdf) | Guia de estudos A1 da professora: arquitetura, memória, privacidade, viés e responsabilidade social |

O aviso de 26/11 pediu que cada estudante ou grupo registre seus dados e o link do
repositório na tabela de entrega da professora.
