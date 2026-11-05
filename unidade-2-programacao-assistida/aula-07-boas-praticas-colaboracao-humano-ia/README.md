# Aula 07: Boas práticas na colaboração humano-IA

Data: 17/09. Tema do plano de ensino: boas práticas na colaboração humano-IA, com debate
e estudo de caso. Competência: avaliar limites e potencial da colaboração. No plano essa
aula aparece em 01/10, mas os materiais da professora são de 17/09 e chamam o encontro de
"Aula 06". Aqui ela é a aula 07 pela ordem do repositório.

Entrega da leitura orientada: [atividade.md](atividade.md).
Parecer individual da unidade, pedido no fim dos slides:
[../parecer-da-unidade-2.md](../parecer-da-unidade-2.md).

Material da aula:

- [orientacoes-da-aula.pdf](orientacoes-da-aula.pdf), roteiro da leitura, das questões
  norteadoras e do estudo de caso;
- [texto-base-sarkar-drosos-2025.pdf](texto-base-sarkar-drosos-2025.pdf), o artigo
  "Vibe coding: programming through conversation with artificial intelligence";
- [slides-boas-praticas.pdf](slides-boas-praticas.pdf), "Guia de Boas Práticas na
  Colaboração Humano-IA".

## O texto-base

Sarkar e Drosos (2025) apresentam o que dizem ser o primeiro estudo empírico sobre vibe
coding, o jeito de programar em que a pessoa conversa com um modelo que gera o código em
vez de escrever o código ela mesma. O termo veio de um post de Andrej Karpathy em
fevereiro de 2025, em que ele diz que aceita todas as sugestões, não lê mais os diffs e
cola as mensagens de erro de volta no chat sem comentário. Os autores chamam esse post de
"Karpathy canon".

O método foi analisar vídeos do YouTube e da Twitch em que programadores fazem vibe coding
e comentam o que estão fazendo em voz alta. De uma lista inicial de 35 vídeos, cinco
passaram nos critérios de qualidade e foram analisados por inteiro, somando 8 horas e 27
minutos. A análise foi organizada em nove categorias: objetivos, intenções, fluxo de
trabalho, prompts, depuração, desafios, conhecimento especializado, confiança e definição
da prática.

O que mais aparece nas conclusões:

- o trabalho segue ciclos de pedir, avaliar o código com uma leitura rápida e testando a
  aplicação, e editar à mão quando compensa;
- os prompts misturam pedidos vagos com especificação técnica detalhada;
- a depuração continua híbrida, parte com a IA e parte com ferramentas tradicionais, como
  o console do navegador;
- o conhecimento de programação continua necessário, só que usado para gerenciar contexto,
  avaliar código depressa e decidir quando sair da IA e editar à mão;
- a confiança na IA é construída aos poucos, verificando, e muda conforme a tarefa.

Os autores chamam o conjunto de "material disengagement": o programador deixa de mexer
diretamente no código e passa a orquestrar a produção dele pela IA, mas continua
supervisionando de forma seletiva.

## O roteiro da aula

As orientações dividem o encontro em leitura individual, discussão em grupo das três
questões norteadoras, estudo de caso e socialização, em que cada grupo apresenta uma
conclusão e uma boa prática. O entregável do grupo são três boas práticas e uma síntese de
5 a 8 linhas que completa a frase "Programar com IA de maneira responsável não significa
apenas saber pedir código; significa também...".

## O guia de boas práticas

Os slides abrem com dados de mercado atribuídos a McKinsey, PwC, MIT, Stanford, Harvard,
FGV e IBGE: quem usa IA ganharia mais, entregaria mais, cresceria mais rápido na carreira
e chamaria mais atenção de recrutadores. Os slides não trazem os números nem as
referências desses estudos, então não tenho como conferir.

O "workflow sustentável" tem cinco etapas:

1. planejamento: definir o problema e separar o que é arquitetura (humano) do que é código
   repetitivo (IA);
2. implementação guiada por comentários, o "diálogo estruturado" de Murta (2023): o humano
   escreve a intenção, a IA propõe a implementação e o humano refina;
3. revisão com um checklist: faz exatamente o que foi pedido? há casos extremos sem
   tratamento? é eficiente? segue o padrão do projeto? está bem comentado? há
   vulnerabilidade óbvia?
4. teste, usando a IA para tentar quebrar o próprio código com testes de caminho feliz e
   de falha;
5. manutenção, com a IA no papel de quem explica código legado em vez de quem gera código
   novo: explicar linha por linha, apontar onde uma mudança pode quebrar o sistema e gerar
   testes de regressão antes de refatorar.

A "matriz de protagonismo" deixa com o humano a arquitetura, as decisões de trade-off, a
lógica de negócio central e a revisão de segurança e ética. Com a IA ficam código
repetitivo, sugestões de sintaxe e refatoração, testes de cobertura e documentação de
funções.

Os cinco princípios dos slides são transparência (se não entendeu o que a IA gerou, pare e
aprenda), verificação (não aceitar sem testar), progressão (confiança onde já tenho
domínio, cautela onde estou aprendendo), documentação (explicar nos comentários por que a
abordagem foi escolhida) e revisão por pares (tratar código de IA com o mesmo rigor do
código de um colega, ou mais).

## Riscos e responsabilidade

Três riscos aparecem no slide sobre ética e segurança. Vulnerabilidades, porque o modelo
aprendeu com código público, que inclui injeção de SQL, XSS e bibliotecas desatualizadas;
a ação sugerida é usar ferramentas SAST e DAST e sanitizar entradas. Propriedade
intelectual, como código GPL indo parar em produto fechado; a ação é ter política de
auditoria (Mello, 2024). E viés, a reprodução de preconceito histórico em regras de
decisão.

Para sistemas que afetam a vida das pessoas, como crédito, diagnóstico médico e triagem de
RH, os slides citam Córdova (2025): o desenvolvedor precisa conseguir explicar como o
sistema chegou à conclusão, e nesses domínios o código gerado por IA talvez deva ficar
restrito a partes não críticas.

A frase de Lee, Goldberg e Kohane (2024) que fecha essa parte é que ferramentas de IA são
assistentes e que, legalmente, quem aceita e implementa o código gerado assume toda a
responsabilidade por ele. Se uma vulnerabilidade gerada pela IA vazar dados, a culpa não é
da ferramenta.

## Estudo de caso dos slides

O caso é a adoção do Copilot em equipes de desenvolvimento. Do lado dos benefícios: ganho
de velocidade, apoio a desenvolvedores juniores e refatoração. Do lado dos riscos:
dependência cognitiva ("esquecer como programar"), problemas de licença e introdução de
código inseguro. A pergunta para o debate é até que ponto podemos, e devemos, confiar na
IA como parceira de código.

## Missão prática

O último slide pede um parecer individual sobre a Unidade 2, relacionando as práticas
(sugestões, refatoração, automação) com o conteúdo (workflow, ética, Copilot, Replit,
Ghostwriter). Os requisitos são escutar o podcast da unidade, informar as fontes de
pesquisa e dizer qual ferramenta de IA ajudou no texto. O parecer está em
[../parecer-da-unidade-2.md](../parecer-da-unidade-2.md).

## Referência

SARKAR, Advait; DROSOS, Ian. Vibe coding: programming through conversation with artificial
intelligence. In: ANNUAL CONFERENCE OF THE PSYCHOLOGY OF PROGRAMMING INTEREST GROUP, 36.,
2025. Proceedings of PPIG 2025. Disponível em: https://arxiv.org/abs/2506.23253
