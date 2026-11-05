# Leitura orientada e estudo de caso: vibe coding

Disciplina: Tendências em Ciência da Computação

Unidade 2, aula 07 (17/09)

Texto-base: SARKAR, A.; DROSOS, I. Vibe coding: programming through conversation with
artificial intelligence. PPIG 2025.

## Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data da execução | 05/11/2026 |

A atividade foi pensada para discussão em grupo. Este arquivo é o meu registro
individual: os trechos que separei na leitura, minhas respostas às três questões, a
análise do estudo de caso, as três boas práticas e a síntese. Os códigos entre parênteses,
como YT21, são os identificadores que o artigo usa para cada vídeo analisado.

## 1. Trechos que chamaram minha atenção

### 1.1 O resumo do artigo

> "vibe coding does not eliminate the need for programming expertise but rather
> redistributes it toward context management, rapid code evaluation, and decisions about
> when to transition between AI-driven and manual manipulation of code."

Os autores dizem que o conhecimento de programação continua sendo necessário, só que
usado em outras tarefas: gerenciar o que a IA está enxergando, avaliar código depressa e
decidir quando parar de pedir e editar à mão. Isso responde direto à segunda questão
norteadora.

### 1.2 Context momentum (seção 3.2.2)

Num app de câmbio (YT18), a pessoa pediu dados
históricos e o modelo fez um seletor para uma data só, quando ela queria um intervalo. Como
o resultado servia, ela seguiu em frente. Mais tarde pediu o intervalo de forma explícita,
em outra parte do app, e o código novo continuou buscando uma data só. O próprio
programador atribuiu o problema à interpretação aceita lá no início. Os autores chamam isso
de context momentum: as primeiras respostas aceitas puxam o resto do projeto para a mesma
direção. Achei o trecho mais útil do artigo porque mostra um custo de aceitar código "quase
certo" que não aparece na hora.

### 1.3 A revisão de quem trabalha com código grande (seção 3.8)

O programador de TW1 mantém
uma base de "150 thousand lines of good code" e diz que não pode deixar código ruim entrar
nela. Até numa página simples de benefícios do plano VIP ele revisa o pull request antes de
publicar. Um espectador da live reclamou que "code review is not vibe coding". O contraste
com o post do Karpathy, que diz não ler mais os diffs, é direto.

### 1.4 Leitura rápida (seção 3.5.1)

Os programadores quase não leem o código linha por linha.
Olham o tamanho dos trechos verdes e vermelhos do diff, os nomes das funções chamadas e os
comentários do modelo. Num caso, aceitaram vários diffs em dois segundos (YT21). Essa
leitura funciona porque eles já conhecem a estrutura do projeto e sabem o que deveria
aparecer em cada lugar.

## 2. Questões norteadoras

### 2.1 Até que ponto podemos confiar no código produzido pela IA?

Até onde ele foi verificado. O artigo descreve a confiança dos programadores observados
como granular, dinâmica e dependente de revisão (seção 3.8). O de YT21 diz que chega a
"80-90% of the way there with AI", mas revisa as mudanças porque isso o ajuda a "remain in
control". O de YT22 diz que não segue a IA às cegas e que "AI is just a tool".

O mesmo artigo mostra por que essa revisão é necessária. Em YT21 o modelo gerou código com
propriedades que não existiam, e o programador só percebeu pelas mensagens de erro. Em
YT22 a documentação gerada falava de Next.js 14 e JavaScript, mas o projeto era Next.js 15
com TypeScript (seção 3.5.1).

Antes de aceitar código gerado, eu faria estas verificações:

- rodar o código com entradas normais e com entradas ruins, e não só com o exemplo que eu
  mesmo dei no prompt;
- ler o diff e conseguir explicar cada parte;
- conferir na documentação se as funções e bibliotecas usadas existem na versão do
  projeto;
- olhar dependências novas: se são necessárias, se são mantidas e qual a licença;
- procurar problemas de segurança, principalmente entrada sem validação e credencial no
  código;
- rodar os testes que já existiam, para ver se nada quebrou em outro lugar.

Quando o código é aceito sem isso, o risco mais comum é ele funcionar no caso testado e
falhar no resto. Aconteceu comigo na [aula 06](../aula-06-programacao-em-pares-com-ia/):
a minha consulta de CEP funcionava com CEP existente e quebrava com `KeyError` quando o CEP
não existia, porque a API responde 200 mesmo nesse caso. Os outros riscos são código
inseguro, dívida técnica (o programador de TW1 fala de código complicado demais que "lowers
developer velocity") e um projeto que ninguém do time entende direito.

### 2.2 A IA reduz a necessidade de conhecimento em programação ou transforma o tipo de conhecimento necessário?

Pelo que o artigo mostra, transforma. Todos os vídeos analisados eram de pessoas que já
sabiam programar, e os autores avisam que não tinham nenhum caso de quem não sabe (seção
2.4). Então o artigo não mostra o que acontece com um iniciante.

O que ele mostra é onde o conhecimento é usado. Em YT22, diante de uma tela em branco, o
criador abriu o console do navegador e identificou um erro de tRPC na hora. No mesmo vídeo
ele percebeu que a aplicação tentava conectar no PostgreSQL em vez do Supabase e corrigiu o
arquivo de ambiente à mão. Em YT21, o programador formulava hipóteses a partir das
mensagens de erro e inseria prints para rastrear a execução (seção 3.7.1). Nada disso é
escrever código do zero, e tudo depende de saber programar.

As competências que passam a pesar mais, pela seção 3.7.2 e pelo que vi nas atividades da
unidade:

- ler código depressa e perceber quando algo está fora do lugar;
- depurar a partir de hipóteses, sem só colar o erro de volta no chat;
- conhecer a stack o suficiente para notar API inexistente ou versão errada;
- escrever especificação que dê para testar, com entradas, saídas e restrições;
- entender o que o modelo consegue e não consegue fazer;
- saber o que o produto precisa, para recusar funcionalidades que a IA inventou e ninguém
  pediu (YT22 removeu uma caixa de taxa de conclusão que não fazia parte da ideia).

Os autores também falam de "ambient competence", a sensação de conseguir fazer coisas que
antes a pessoa nem tentaria porque a IA está disponível. Eles apontam o risco de a
confiança passar a depender da capacidade de pedir à IA, e não da capacidade de programar
(seção 3.7.2). Eu concordo que esse é o ponto perigoso para estudante.

### 2.3 Quando é melhor usar a IA e quando é melhor assumir o controle manualmente?

A seção 3.7.3 lista quando os programadores largavam a IA: edição pequena em que escrever o
prompt dá mais trabalho do que fazer a mudança (YT21 fez uma alteração de uma linha à mão),
código que chegou perto e só precisa de ajuste (TW1 diz que usa o modelo para "get close to
what you want" e que esperar resultado perfeito é "a mistake"), depuração e momentos em que
o modelo não obedece. TW1 chega a dizer que o autocomplete e a busca do IntelliJ ainda são
mais rápidos que um LLM para achar onde mexer.

Os critérios que eu usaria:

| Situação | Como eu faria |
|---|---|
| Código repetitivo, bem especificado e fácil de testar | delegar para a IA |
| Funcionalidade nova em que sei descrever entrada, saída e casos de erro | gerar com a IA e revisar tudo |
| Resultado da IA chegou perto | ajustar à mão em vez de reescrever o prompt várias vezes |
| Mudança de uma ou duas linhas | fazer à mão |
| Bug com hipótese clara de causa | investigar e corrigir à mão, e usar a IA só para conferir |
| Projeto que começou a ir para um lado que eu não queria (context momentum) | parar, limpar o contexto e reescrever a especificação |
| Autenticação, criptografia, dados pessoais, regra de negócio central | escrever ou revisar linha por linha, com a IA no máximo como revisora |

A última linha vem do gráfico de confiança calibrada dos slides da aula 06, em que
autenticação e escolha de algoritmo de hash ficam com supervisão total.

## 3. Estudo de caso

Situação das orientações: a equipe precisa entregar uma funcionalidade rápido, um
integrante pede a implementação completa para a IA, o código parece funcionar e passa num
teste inicial, mas ninguém revisou a solução, as dependências, a segurança, a manutenção
nem o impacto no resto do sistema.

O que a equipe deveria fazer antes de incorporar o código:

1. Abrir um pull request e pedir revisão de alguém que não gerou o código. É o que o
   programador de TW1 faz mesmo em mudanças simples.
2. Exigir que quem pediu o código consiga explicar cada parte. Se não conseguir, a parte
   volta para estudo ou é reescrita (princípio da transparência dos slides).
3. Conferir cada dependência nova: se existe, se a versão é a do projeto, se é mantida e
   se a licença é compatível. Os slides lembram o risco de código GPL dentro de produto
   fechado.
4. Escrever testes além do teste inicial: casos de borda, entradas inválidas e falhas de
   rede ou de banco. A IA pode ajudar a gerar esses testes, como sugerem os slides, mas
   alguém precisa ler o que eles testam.
5. Rodar a suíte inteira do sistema, para ver se a funcionalidade nova quebrou outra
   coisa.
6. Fazer uma revisão de segurança: validação de entrada, injeção, segredos no código e, se
   a equipe tiver, uma ferramenta de análise estática.
7. Verificar se o código segue os padrões do projeto e não duplica algo que já existe. Uma
   implementação completa gerada de uma vez costuma ignorar os utilitários que o projeto já
   tem.

Depois disso tudo, se o prazo continuar apertado, ainda dá para entregar uma parte menor
que foi revisada em vez da funcionalidade inteira sem revisão.

Ficam com as pessoas: decidir se o código entra ou não, assinar o commit, garantir
segurança e privacidade, conferir a regra de negócio com quem pediu a funcionalidade e
responder por falhas depois da entrega. Os slides citam Lee, Goldberg e Kohane (2024)
sobre isso: legalmente, quem aceita e implementa código gerado por IA responde por ele.

O artigo ajuda a ver por que o teste inicial não basta. Nos vídeos, quem evita confiar
demais são justamente as pessoas que revisam o código, testam com frequência e conferem a
documentação (seção 3.8). A equipe do caso fez só o teste inicial.

## 4. Três boas práticas

1. Escrever os casos de teste, com o resultado esperado, antes de pedir o código, e rodar
   a resposta contra eles.
2. Pedir à IA que diga o que não verificou e o que está supondo, e conferir esses pontos
   primeiro.
3. Nenhum código gerado entra no projeto sem revisão de alguém que consiga explicá-lo e
   sem passar na suíte de testes inteira.

## 5. Síntese

Programar com IA de maneira responsável não significa apenas saber pedir código; significa
também saber dizer o que o código precisa fazer de um jeito que possa ser testado, e depois
testar de verdade. Exige conhecimento suficiente para ler o que a IA entrega e perceber uma
função que não existe ou uma versão errada de biblioteca, como nos vídeos analisados por
Sarkar e Drosos. Também é preciso decidir quando parar de pedir e editar à mão, e notar
quando uma escolha aceita no começo está levando o projeto para o lado errado. Quando o
código entra no repositório, ele passa a ser meu, com as falhas junto.

## 6. Conclusão para a socialização

Se eu tivesse que levar uma conclusão e uma prática para a turma: o artigo mostra que até
os programadores experientes, que estão ali justamente para mostrar o vibe coding,
continuam lendo diffs, abrindo o console e editando à mão. A prática que eu levaria é a
primeira da lista: escrever o teste antes de pedir o código.
