# Atividade prática: Identificando a IA

Disciplina: Tendências em Ciência da Computação
Unidade 1, aula 01 (13/08)
Estudante: Brayan A. Pletsch

## Enunciado

Escolher cinco tecnologias ou aplicativos usados no cotidiano e, para cada um,
responder:

1. Onde a IA está presente neste app?
2. Qual problema ela procura resolver?
3. Quais dados provavelmente são utilizados?
4. Qual é o benefício direto para o usuário?
5. Existe algum risco ou limitação observável?

## Critério de escolha dos cinco aplicativos

Em vez de listar cinco apps parecidos, escolhi cinco que usam a IA de maneiras
diferentes, para que a comparação final tivesse alguma utilidade. A distribuição
ficou assim:

| Aplicativo | Tipo de problema | Camada predominante |
|---|---|---|
| Spotify | recomendação | Machine Learning |
| Waze | previsão e otimização | Machine Learning |
| Nubank | detecção de anomalia | Machine Learning |
| GitHub Copilot | geração de conteúdo | IA Generativa |
| Google Fotos | visão computacional | Deep Learning |

Uma observação sobre o método: nenhum desses sistemas é aberto, então parte do que
está escrito abaixo é inferência a partir do comportamento observável e da
documentação pública de cada empresa. Marquei com "provavelmente" tudo o que não
consigo confirmar.

## 1. Spotify

**Onde a IA está presente.** No sistema de recomendação. As playlists geradas
automaticamente, o rádio de uma música e a fila que continua tocando depois que o
álbum acaba são todas saídas de modelos de recomendação, não de listas curadas
manualmente. A busca também usa correspondência aproximada, o que permite achar uma
música com o nome digitado errado.

**Qual problema ela procura resolver.** O catálogo tem dezenas de milhões de faixas e
o usuário conhece uma fração mínima disso. Sem recomendação, o produto vira um
buscador: só se encontra o que já se sabe procurar. O problema real é de descoberta,
e ele é economicamente central para a plataforma, porque tempo de escuta é o que
sustenta o modelo de assinatura.

**Quais dados provavelmente são utilizados.** Histórico de reprodução, faixas puladas
nos primeiros segundos, o que foi salvo na biblioteca, playlists criadas pelo próprio
usuário, horário e dia da semana, e o comportamento agregado de outros usuários com
gosto parecido. Esse último ponto é o que caracteriza filtragem colaborativa: a
recomendação não vem só do meu histórico, vem de quem se comporta como eu.
Provavelmente também há análise de características do áudio, o que explica
recomendações de artistas obscuros que quase ninguém ouviu.

**Benefício direto.** Descobrir música nova sem esforço de busca. Na prática, é o
recurso que faz o serviço parecer maior do que a minha própria biblioteca.

**Risco ou limitação observável.** O efeito bolha. Quanto mais o sistema acerta o meu
gosto atual, menos ele arrisca, e a recomendação vai estreitando. Depois de um tempo
as playlists começam a se repetir e passam a soar como variações do mesmo bloco de
artistas. Há também a questão de que o critério de sucesso do modelo é tempo de
escuta, que não é a mesma coisa que qualidade da recomendação. Uma música que eu
deixo tocando de fundo conta como acerto mesmo que eu nem tenha reparado nela.

## 2. Waze

**Onde a IA está presente.** No cálculo de rota, na estimativa de tempo de chegada e
na previsão de congestionamento. O roteamento em si é um algoritmo clássico de menor
caminho em grafo, o que não é IA. A parte de IA está em estimar o peso de cada aresta
desse grafo, ou seja, quanto tempo cada trecho vai levar daqui a vinte minutos, quando
eu chegar nele.

**Qual problema ela procura resolver.** O menor caminho em distância raramente é o
mais rápido, e a condição de trânsito muda enquanto a viagem acontece. O problema é
prever o estado futuro da via, não descrever o estado atual.

**Quais dados provavelmente são utilizados.** GPS e velocidade dos aparelhos que estão
na via naquele momento, histórico de fluxo por horário e dia da semana, alertas
enviados pelos usuários, dados de vias e limites de velocidade, e provavelmente eventos
externos como chuva e obras.

**Benefício direto.** Saber com antecedência razoável a que horas vou chegar, e receber
um desvio antes de entrar no congestionamento em vez de depois.

**Risco ou limitação observável.** A previsão degrada exatamente quando é mais
necessária, porque acidentes e alagamentos são eventos raros e o modelo tem poucos
exemplos deles. Já vi a estimativa aumentar em quinze minutos depois que eu já estava
parado, o que significa que o sistema reagiu ao evento em vez de antecipá-lo. Existe
ainda um efeito colateral bem documentado: quando o app desvia muitos carros para uma
rua residencial estreita, ele resolve o problema do motorista individual e cria um
problema para quem mora ali. A otimização é feita por trajeto, não por cidade.

## 3. Nubank

**Onde a IA está presente.** Na análise antifraude de cada transação, na análise de
crédito e no atendimento automatizado do chat. O caso mais claro é o antifraude, que é
um classificador rodando em tempo real: cada compra recebe um escore de risco antes de
ser aprovada.

**Qual problema ela procura resolver.** Identificar a transação fraudulenta no meio de
milhões de transações legítimas, em milissegundos, sem que o usuário perceba a
verificação. É um problema de detecção de anomalia com classes extremamente
desbalanceadas: a fraude é uma fração muito pequena do total.

**Quais dados provavelmente são utilizados.** Histórico de transações da conta, valor,
horário, estabelecimento e categoria, localização aproximada, aparelho usado, e o
comportamento típico do perfil. Uma compra de valor alto, em outro estado, em um
horário incomum e em um aparelho novo combina quatro sinais de uma vez.

**Benefício direto.** Bloqueio de compras que eu não fiz, sem depender de eu conferir a
fatura no fim do mês.

**Risco ou limitação observável.** O falso positivo, que é o erro que o usuário sente.
Compra legítima recusada em viagem é o exemplo clássico. Há um ajuste de sensibilidade
por trás disso: apertar o modelo reduz fraude e aumenta recusa indevida, afrouxar faz o
contrário, e não existe configuração que zere os dois. O risco mais sério, porém, está
na análise de crédito, e não no antifraude. Um modelo treinado em decisões históricas
de crédito aprende também os padrões de exclusão que existiam nesses dados, o que se
enquadra exatamente no caso de garbage in, garbage out discutido em aula. A diferença é
que o usuário recebe uma negativa e não recebe a explicação.

## 4. GitHub Copilot (usado dentro do VS Code)

**Onde a IA está presente.** Na sugestão de código enquanto eu digito, na geração de
função inteira a partir de um comentário e no chat que explica um trecho selecionado.
É o único dos cinco casos em que a IA é o produto, e não um componente escondido.

**Qual problema ela procura resolver.** Reduzir o tempo gasto em código repetitivo e
em consulta de sintaxe. Escrever a mesma estrutura de teste pela vigésima vez, lembrar
a assinatura exata de um método, converter um formato de data. É trabalho que consome
tempo e não produz aprendizado.

**Quais dados provavelmente são utilizados.** O arquivo aberto, os arquivos próximos
do projeto, o nome das variáveis e funções que eu escolhi, comentários, e o modelo
treinado em código público. A qualidade da sugestão cai bastante quando o arquivo é
novo e não há contexto ao redor, o que é uma pista direta de como ele funciona.

**Benefício direto.** Ganho de velocidade real na parte mecânica da programação, e uma
segunda opinião imediata sobre um trecho que eu não entendi.

**Risco ou limitação observável.** A sugestão sai com aparência de código revisado,
mesmo quando está errada. Já aceitei sugestão que compilava, rodava e tratava o caso
errado de borda, e o problema só apareceu no teste. Existem ainda dois riscos que não
são técnicos: o de aceitar código que reproduz uma vulnerabilidade conhecida, e o de
não aprender o que se está entregando. Este segundo é o mais relevante para mim como
estudante, e é o ponto que a professora colocou em aula: se eu não consigo explicar o
que escrevi, não houve aprendizagem.

## 5. Google Fotos

**Onde a IA está presente.** Na busca por conteúdo da imagem, no agrupamento de rostos,
na criação automática de álbuns por evento e nas ferramentas de edição que removem
objetos. Digitar "praia" e receber fotos de praia sem que nenhuma delas tenha sido
marcada manualmente é reconhecimento de imagem operando sobre o acervo inteiro.

**Qual problema ela procura resolver.** Acervos pessoais chegam a dezenas de milhares
de fotos e ninguém organiza isso à mão. Sem classificação automática, a única forma de
achar uma foto é rolar por data, o que só funciona se eu lembrar quando ela foi tirada.

**Quais dados provavelmente são utilizados.** O conteúdo em pixels das imagens, os
metadados EXIF (data, hora, coordenada, modelo da câmera), e os agrupamentos de rostos
que eu confirmei ou corrigi. As correções do usuário realimentam o sistema, o que
significa que eu estou rotulando os dados de treino ao usar o produto.

**Benefício direto.** Encontrar uma foto específica em segundos, com uma busca textual,
sem ter organizado nada antes.

**Risco ou limitação observável.** É o caso mais sensível dos cinco em termos de
privacidade, porque o dado processado é biométrico. O reconhecimento facial cria um
vínculo entre rostos ao longo de anos, inclusive de pessoas que nunca usaram o serviço
e nunca consentiram com nada. Do lado técnico, a classificação erra de formas
esquisitas e nem sempre explicáveis: já recebi resultados de "cachorro" para um sofá
marrom. Erros desse tipo mostram que o modelo aprendeu correlações de textura e cor que
não correspondem ao conceito que o rótulo sugere.

## Quadro comparativo

| Aplicativo | Aplicação da IA | Tipo | Objetivo | Principal limitação |
|---|---|---|---|---|
| Spotify | recomendação de faixas | preditiva | descoberta de conteúdo | bolha de recomendação |
| Waze | previsão de tempo e rota | preditiva | eficiência no deslocamento | erra em eventos raros |
| Nubank | detecção de fraude e crédito | preditiva | segurança da conta | falso positivo e viés no crédito |
| GitHub Copilot | geração de código | generativa | produtividade | código plausível e incorreto |
| Google Fotos | reconhecimento de imagem | preditiva | organização do acervo | dado biométrico e erro de rótulo |

Quatro dos cinco casos são de IA preditiva. Isso não foi intencional na escolha, e acho
que diz algo sobre a proporção real: a IA generativa domina a conversa pública, mas a
IA que roda em segundo plano nos aplicativos que uso todo dia é majoritariamente
classificação e previsão.

## Conclusão

Três coisas ficaram claras ao montar esse levantamento.

A primeira é que a IA quase nunca aparece como um recurso anunciado. Em quatro dos
cinco casos ela é infraestrutura invisível, e o usuário só percebe que existe um modelo
ali quando ele erra. O único caso em que a IA é a interface é o Copilot.

A segunda é que o tipo de erro muda conforme o tipo de modelo, e isso muda o que
significa "verificar" a saída. Em um classificador, o erro é uma decisão binária errada
e existe um caminho de recurso: contestar a recusa, corrigir o rosto marcado errado. Em
um modelo generativo, o erro vem em forma de texto bem escrito, sem nenhum sinal de que
é erro. Não existe barra de confiança na sugestão do Copilot.

A terceira é que a limitação mais séria de cada sistema raramente é técnica. A bolha do
Spotify, o desvio de tráfego para rua residencial do Waze, o viés de crédito e o dado
biométrico do Google Fotos são todos consequências de escolhas de projeto sobre o que
otimizar, e não bugs a serem corrigidos em uma próxima versão.

## Checkpoint de compreensão

**Qual a diferença entre IA e Machine Learning?**
IA é o campo inteiro, que inclui abordagens baseadas em regras escritas à mão. Machine
Learning é o subconjunto em que o sistema deriva as regras a partir de dados. Todo ML é
IA, mas nem toda IA é ML.

**O que caracteriza o Deep Learning?**
O uso de redes neurais artificiais com várias camadas ocultas. A profundidade permite
que o sistema aprenda representações em níveis crescentes de abstração, o que é o que
viabiliza tarefas como reconhecimento de imagem e processamento de linguagem, onde
seria inviável descrever manualmente a característica a procurar.

**Qual a função dos dados no aprendizado de máquina?**
Os dados ocupam o lugar que, na programação tradicional, era ocupado pelas regras. O
algoritmo recebe exemplos com respostas conhecidas e constrói o modelo a partir deles.
Por isso a qualidade dos dados limita a qualidade do sistema, e nenhum ajuste de
algoritmo compensa um conjunto de dados enviesado.

**O que diferencia a IA preditiva da generativa?**
O objetivo e o tipo de saída. A preditiva analisa o que existe e devolve uma
classificação ou uma probabilidade. A generativa recebe um prompt e constrói uma
sequência nova para atendê-lo. O antifraude do Nubank responde "esta transação é
suspeita"; o Copilot responde com um bloco de código que não existia antes.

**Por que um prompt detalhado gera resultados melhores?**
Porque o modelo não tem acesso à intenção, só ao texto que recebeu. Diante de uma
instrução vaga, ele precisa supor público, profundidade, formato e extensão, e vai
escolher a suposição mais provável, que não é necessariamente a minha. Cada informação
acrescentada ao prompt elimina uma suposição. Vale notar que isso não é o mesmo que
escrever mais: acrescentar adjetivos vagos não elimina suposição nenhuma.

**Por que é necessário verificar as respostas de uma IA?**
Porque o modelo prevê a continuação provável, e não consulta uma base de fatos. Uma
frase falsa pode ser tão provável quanto uma verdadeira, e nada no formato da resposta
distingue as duas. Como a saída sai fluente e organizada, a aparência de qualidade
funciona contra o leitor. A responsabilidade sobre o que é entregue continua sendo de
quem usa a ferramenta.
