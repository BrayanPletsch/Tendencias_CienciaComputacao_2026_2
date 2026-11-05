# Atividade prática: identificando a IA

Disciplina: Tendências em Ciência da Computação

Unidade 1, aula 01 (13/08)

- Estudante: Brayan A. Pletsch
- RGM: 38473585
- Turma: Engenharia de Software, N1, noturno (disciplina optativa)

## Enunciado

Escolher cinco tecnologias ou aplicativos usados no cotidiano e, para cada um,
responder:

1. Onde a IA está presente neste app?
2. Qual problema ela procura resolver?
3. Quais dados provavelmente são utilizados?
4. Qual é o benefício direto para o usuário?
5. Existe algum risco ou limitação observável?

## Critério de escolha dos cinco aplicativos

Escolhi cinco apps que usam IA de maneiras diferentes, para que a comparação no final
servisse para alguma coisa. Ficaram assim:

| Aplicativo | Tipo de problema | Camada predominante |
|---|---|---|
| Spotify | recomendação | Machine Learning |
| Waze | previsão e otimização | Machine Learning |
| Nubank | detecção de anomalia | Machine Learning |
| GitHub Copilot | geração de conteúdo | IA Generativa |
| Google Fotos | visão computacional | Deep Learning |

Nenhum desses sistemas é aberto. Parte do que escrevi abaixo é inferência minha, feita
a partir do comportamento que dá para observar no app e da documentação pública de cada
empresa. Tudo o que não consigo confirmar está marcado com "provavelmente".

## 1. Spotify

### Onde a IA está presente

No sistema de recomendação. As playlists geradas automaticamente, o rádio de uma música
e a fila que continua tocando depois que o álbum acaba saem de modelos de recomendação.
Ninguém monta essas listas à mão. A busca também usa correspondência aproximada, por
isso dá para achar uma música mesmo digitando o nome errado.

### Qual problema ela procura resolver

O catálogo tem dezenas de milhões de faixas e o usuário conhece uma fração mínima disso.
Sem recomendação, o produto vira um buscador, em que só se encontra o que já se sabe
procurar. O problema é de descoberta, e ele é central para a plataforma do ponto de
vista econômico, porque o tempo de escuta é o que sustenta o modelo de assinatura.

### Quais dados provavelmente são utilizados

Histórico de reprodução, faixas puladas nos primeiros segundos, o que foi salvo na
biblioteca, playlists criadas pelo próprio usuário, horário e dia da semana, e o
comportamento agregado de outros usuários com gosto parecido. Esse último é o que
caracteriza a filtragem colaborativa: a recomendação vem do meu histórico e também de
quem se comporta como eu. Provavelmente há ainda análise de características do áudio,
o que explicaria recomendações de artistas obscuros que quase ninguém ouviu.

### Benefício direto

Descobrir música nova sem ter que procurar. Na prática, é o que faz o serviço parecer
maior do que a minha própria biblioteca.

### Risco ou limitação observável

O efeito bolha. Quanto mais o sistema acerta o meu gosto atual, menos ele arrisca, e a
recomendação vai ficando estreita. Depois de um tempo as playlists começam a se repetir
e parecem variações do mesmo grupo de artistas. Outro problema é que o modelo mede
sucesso por tempo de escuta, e tempo de escuta é diferente de qualidade da
recomendação: uma música que eu deixo tocando de fundo conta como acerto mesmo que eu
nem tenha reparado nela.

## 2. Waze

### Onde a IA está presente

No cálculo de rota, na estimativa de tempo de chegada e na previsão de
congestionamento. O roteamento em si é um algoritmo clássico de menor caminho em grafo,
que não é IA. A IA entra na hora de estimar o peso de cada aresta desse grafo, isto é,
quanto tempo cada trecho vai levar daqui a vinte minutos, quando eu chegar nele.

### Qual problema ela procura resolver

O menor caminho em distância raramente é o mais rápido, e o trânsito muda enquanto a
viagem acontece. Por isso não basta descrever como a via está agora: o app precisa
prever como ela vai estar quando eu passar por lá.

### Quais dados provavelmente são utilizados

GPS e velocidade dos aparelhos que estão na via naquele momento, histórico de fluxo por
horário e dia da semana, alertas enviados pelos usuários, dados de vias e limites de
velocidade e, provavelmente, eventos externos como chuva e obras.

### Benefício direto

Saber com uma antecedência razoável a que horas vou chegar e receber o desvio antes de
entrar no congestionamento.

### Risco ou limitação observável

A previsão piora justamente quando faz mais falta, porque acidentes e alagamentos são
eventos raros e o modelo tem poucos exemplos deles. Já vi a estimativa aumentar quinze
minutos depois que eu já estava parado, ou seja, o sistema reagiu ao evento sem
conseguir antecipá-lo. Tem também um efeito colateral bem documentado: quando o app
desvia muitos carros para uma rua residencial estreita, resolve o problema do motorista
e cria outro para quem mora ali. Isso acontece porque a otimização é feita por trajeto,
sem olhar a cidade como um todo.

## 3. Nubank

### Onde a IA está presente

Na análise antifraude de cada transação, na análise de crédito e no atendimento
automatizado do chat. O caso mais claro é o antifraude, um classificador que roda em
tempo real: cada compra recebe um escore de risco antes de ser aprovada.

### Qual problema ela procura resolver

Identificar a transação fraudulenta no meio de milhões de transações legítimas, em
milissegundos, sem que o usuário perceba a verificação. É um problema de detecção de
anomalia com classes extremamente desbalanceadas, já que a fraude é uma fração muito
pequena do total.

### Quais dados provavelmente são utilizados

Histórico de transações da conta, valor, horário, estabelecimento e categoria,
localização aproximada, aparelho usado e o comportamento típico do perfil. Uma compra
de valor alto, em outro estado, em horário incomum e num aparelho novo junta quatro
sinais de uma vez.

### Benefício direto

Bloqueio de compras que eu não fiz, sem depender de eu conferir a fatura no fim do mês.

### Risco ou limitação observável

O falso positivo, que é o erro que o usuário sente. O exemplo clássico é a compra
legítima recusada durante uma viagem. Por trás disso existe um ajuste de sensibilidade:
apertar o modelo reduz fraude e aumenta a recusa indevida, afrouxar faz o contrário, e
nenhuma configuração zera os dois.

O risco mais sério, porém, está na análise de crédito. Um modelo treinado com decisões
históricas de crédito aprende junto os padrões de exclusão que existiam nesses dados,
que é exatamente o caso de garbage in, garbage out visto em aula. E aqui o usuário
recebe a negativa sem receber a explicação.

## 4. GitHub Copilot (usado dentro do VS Code)

### Onde a IA está presente

Na sugestão de código enquanto eu digito, na geração de uma função inteira a partir de
um comentário e no chat que explica um trecho selecionado. Dos cinco casos, é o único em
que a IA é o próprio produto. Nos outros ela é um componente escondido.

### Qual problema ela procura resolver

Reduzir o tempo gasto com código repetitivo e consulta de sintaxe, como escrever a mesma
estrutura de teste pela vigésima vez, lembrar a assinatura exata de um método ou
converter um formato de data. É um trabalho que consome tempo e não traz aprendizado.

### Quais dados provavelmente são utilizados

O arquivo aberto, os arquivos próximos do projeto, os nomes de variáveis e funções que
eu escolhi, os comentários e o modelo treinado em código público. A qualidade da
sugestão cai bastante quando o arquivo é novo e não tem contexto em volta, o que já dá
uma pista direta de como ele funciona.

### Benefício direto

Ganho real de velocidade na parte mecânica da programação, e uma segunda opinião na
hora sobre um trecho que eu não entendi.

### Risco ou limitação observável

A sugestão vem com cara de código revisado mesmo quando está errada. Já aceitei uma
sugestão que compilava, rodava e tratava o caso de borda errado, e o problema só
apareceu no teste. Há ainda dois riscos que não são técnicos: aceitar código que
reproduz uma vulnerabilidade conhecida e não aprender o que se está entregando. Para
mim, como estudante, o segundo é o que mais pesa, e foi o que a professora colocou em
aula: se eu não consigo explicar o que escrevi, não houve aprendizagem.

## 5. Google Fotos

### Onde a IA está presente

Na busca pelo conteúdo da imagem, no agrupamento de rostos, na criação automática de
álbuns por evento e nas ferramentas de edição que removem objetos. Quando eu digito
"praia" e recebo fotos de praia sem ter marcado nenhuma delas, é o reconhecimento de
imagem rodando sobre o acervo inteiro.

### Qual problema ela procura resolver

Acervos pessoais chegam a dezenas de milhares de fotos e ninguém organiza isso à mão.
Sem classificação automática, a única forma de achar uma foto é rolar por data, o que só
funciona se eu lembrar quando ela foi tirada.

### Quais dados provavelmente são utilizados

O conteúdo em pixels das imagens, os metadados EXIF (data, hora, coordenada, modelo da
câmera) e os agrupamentos de rostos que eu confirmei ou corrigi. As correções do
usuário realimentam o sistema, então, usando o produto, eu mesmo estou rotulando os
dados de treino.

### Benefício direto

Encontrar uma foto específica em segundos, com uma busca em texto, sem ter organizado
nada antes.

### Risco ou limitação observável

Em privacidade, é o caso mais sensível dos cinco, porque o dado processado é
biométrico. O reconhecimento facial liga rostos ao longo de anos, inclusive de pessoas
que nunca usaram o serviço e nunca consentiram com nada. No lado técnico, a
classificação erra de formas esquisitas e nem sempre explicáveis: já recebi resultados
de "cachorro" para um sofá marrom. Erros assim mostram que o modelo aprendeu
correlações de textura e cor que não correspondem ao conceito que o rótulo sugere.

## Quadro comparativo

| Aplicativo | Aplicação da IA | Tipo | Objetivo | Principal limitação |
|---|---|---|---|---|
| Spotify | recomendação de faixas | preditiva | descoberta de conteúdo | bolha de recomendação |
| Waze | previsão de tempo e rota | preditiva | eficiência no deslocamento | erra em eventos raros |
| Nubank | detecção de fraude e crédito | preditiva | segurança da conta | falso positivo e viés no crédito |
| GitHub Copilot | geração de código | generativa | produtividade | código plausível e incorreto |
| Google Fotos | reconhecimento de imagem | preditiva | organização do acervo | dado biométrico e erro de rótulo |

Quatro dos cinco casos são de IA preditiva. Não escolhi assim de propósito, e acho que
isso diz algo sobre a proporção real: a IA generativa domina a conversa pública, mas a
IA que roda em segundo plano nos aplicativos que uso todo dia é, na maior parte,
classificação e previsão.

## Conclusão

Montando esse levantamento, percebi que a IA quase nunca aparece como um recurso
anunciado. Em quatro dos cinco casos ela é infraestrutura invisível, e o usuário só
nota que existe um modelo ali quando ele erra. O Copilot é a exceção, porque nele a IA
é a própria interface.

O tipo de erro também muda conforme o tipo de modelo, e com ele muda o que significa
"verificar" a saída. Num classificador, o erro é uma decisão binária errada e dá para
recorrer: contestar a recusa, corrigir o rosto marcado errado. Num modelo generativo, o
erro vem como texto bem escrito, sem nenhum sinal de que está errado. A sugestão do
Copilot, por exemplo, não vem com barra de confiança.

E a limitação mais séria de cada sistema raramente é técnica. A bolha do Spotify, o
desvio de tráfego do Waze para ruas residenciais, o viés no crédito e o dado biométrico
do Google Fotos vêm de escolhas de projeto sobre o que otimizar, então não dá para
tratá-los como bugs que uma próxima versão vai corrigir.

## Checkpoint de compreensão

### Qual a diferença entre IA e Machine Learning?

IA é o campo inteiro, que inclui abordagens baseadas em regras escritas à mão. Machine
Learning é o subconjunto em que o sistema tira as regras dos dados. Todo ML é IA, mas
nem toda IA é ML.

### O que caracteriza o Deep Learning?

O uso de redes neurais artificiais com várias camadas ocultas. Com essa profundidade, o
sistema aprende representações em níveis crescentes de abstração, e é isso que torna
possíveis tarefas como reconhecimento de imagem e processamento de linguagem, em que
seria inviável descrever à mão a característica a procurar.

### Qual a função dos dados no aprendizado de máquina?

Os dados ficam no lugar que, na programação tradicional, era das regras. O algoritmo
recebe exemplos com respostas conhecidas e constrói o modelo a partir deles. Por isso a
qualidade dos dados limita a qualidade do sistema, e nenhum ajuste no algoritmo
compensa um conjunto de dados enviesado.

### O que diferencia a IA preditiva da generativa?

O objetivo e o tipo de saída. A preditiva analisa o que existe e devolve uma
classificação ou uma probabilidade. A generativa recebe um prompt e constrói uma
sequência nova para atendê-lo. O antifraude do Nubank responde "esta transação é
suspeita"; o Copilot responde com um bloco de código que não existia antes.

### Por que um prompt detalhado gera resultados melhores?

O modelo só tem o texto que recebeu, e não sabe qual era a minha intenção. Com uma
instrução vaga, ele precisa supor público, profundidade, formato e extensão, e escolhe
a suposição mais provável, que nem sempre é a minha. Cada informação acrescentada ao
prompt elimina uma dessas suposições. Já os adjetivos vagos deixam o prompt maior sem
eliminar suposição nenhuma.

### Por que é necessário verificar as respostas de uma IA?

Porque o modelo prevê a continuação provável do texto, sem consultar uma base de fatos.
Uma frase falsa pode ser tão provável quanto uma verdadeira, e nada no formato da
resposta mostra qual é qual. Como a saída vem fluente e organizada, ela parece boa até
quando está errada, e isso atrapalha quem lê. A responsabilidade pelo que é entregue
continua sendo de quem usa a ferramenta.
