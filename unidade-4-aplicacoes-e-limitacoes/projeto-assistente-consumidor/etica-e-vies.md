# Privacidade, viés e responsabilidade social

Entrega de 19/11 da Unidade 4 (viés algorítmico e responsabilidade social: analisar
impactos éticos da IA). A análise segue os conceitos do guia de estudos A1 e usa os
resultados dos testes da Lia, que estão em [casos-de-teste.md](casos-de-teste.md).

## 1. Privacidade desde o projeto

O guia trata a privacidade como princípio de arquitetura, com três camadas: coleta mínima,
criptografia e controle de acesso.

| Princípio | Como está na Lia |
|---|---|
| Coleta mínima | A Lia não pede nenhum dado pessoal. Se a pessoa digitar CPF, telefone, e-mail ou número de cartão, a camada perceptiva apaga o dado antes de qualquer análise e avisa que ele não era necessário |
| Criptografia | Não existe transmissão nem armazenamento: a conversa fica no navegador e some quando a página é fechada. Se a página for publicada no GitHub Pages, ela é servida por HTTPS |
| Controle de acesso | Não há o que controlar, porque nada é guardado. A ficha do caso é apagada quando a orientação sai |

O guia também cita o dilema do uso secundário: usar conversas antigas para outra finalidade
exige consentimento novo pela LGPD. O registro de curadoria da Lia guarda só o tipo de cada
resposta, o caso e a avaliação, sem nenhum texto digitado. Se um dia as conversas fossem
usadas para melhorar os gatilhos, seria preciso pedir esse consentimento antes.

Uma limitação que achei testando: a máscara funciona por padrão de número e de e-mail.
Um nome próprio ou um endereço digitado no relato não é apagado. Como nada sai do navegador,
o risco é pequeno, mas a promessa de "não guardo dado pessoal" vale para o que é guardado, e
não para o que aparece na tela.

## 2. Viés algorítmico

O guia divide o viés em três tipos. Os três apareceram na Lia, e dois deles só apareceram
porque os testes foram montados para procurar.

### Viés de dados

Na Lia, a base de treino são os gatilhos, e eu os escrevi a partir do meu próprio jeito de
falar. Para medir o efeito disso, escrevi o mesmo relato de cada caso em quatro registros de
linguagem. Na primeira rodada:

| Registro | Casos identificados |
|---|---|
| Formal ("Adquiri um refrigerador que apresentou defeito...") | 6 de 6 |
| Informal ("comprei uma geladeira e ela pifou") | 5 de 6 |
| Com erro de digitação ("veio com defeto, a tela ta quebarda") | 6 de 6 |
| Com expressão regional ("a máquina arriou, deu prego de vez") | 3 de 6 |

A Lia entendia melhor quem escreve como num documento do que quem escreve como fala. A
forma de escrever não é um dado demográfico, mas funciona como substituto: ela costuma
acompanhar a região, a idade e a escolaridade. É o exemplo do guia, do chatbot treinado só
com a linguagem urbana que falha com os dialetos regionais.

A correção foi acrescentar as expressões que faltaram ("arriou", "deu prego", "deu pane",
"não veio", "serviço porco" e outras). Na segunda rodada, os quatro registros ficaram em 6 de
6. Mas a validação com 12 frases novas mostrou que acrescentar expressão por expressão não
resolve o problema estrutural: a Lia acertou só 4 delas. A mitigação de verdade depende de
testar com pessoas de outras regiões e idades, o que ainda não fiz.

### Viés de algoritmo

Este foi causado por uma escolha minha. Para ajudar quem digita com erro, a Lia aceita uma
ou duas letras de diferença entre a palavra digitada e o gatilho. Isso funcionou para o grupo
"com erro de digitação", mas criou dois falsos positivos:

- "colocaram" ficou a duas letras de "clonaram", que é gatilho de golpe. Quem dizia
  "colocaram um seguro que eu nunca pedi" era mandado para o tratamento de golpe e não
  recebia orientação nenhuma;
- "feita" ficou a uma letra de "festa", que está na lista de coisas que acabam rápido. Uma
  reforma "mal feita" ficava sem durabilidade definida, e a Lia perguntava algo que já
  sabia.

Os dois erros prejudicavam quem não tinha errado nada. Corrigi de três formas: a aproximação
agora exige as duas primeiras letras iguais; produtos e canais de compra só casam com a
palavra exata; e os assuntos fora do escopo também só casam com a palavra exata. A bateria
ganhou dois testes de regressão para esses casos.

A última correção tem um custo, o que o guia chama de custo da equidade. Alguém que digita
"golpi" em vez de "golpe" não é mais encaminhado ao banco e à polícia, e recebe "não
entendi". Aceitei a troca porque o erro contrário é pior: um encaminhamento indevido nega
ajuda a quem tem direito, e o "não entendi" pelo menos pede para a pessoa contar de novo.

A regra de precedência é outra escolha de projeto com efeito parecido. Quando "não pedi" e
"cobrança" aparecem juntos, o caso de produto não pedido ganha, porque traz o direito mais
forte. Se um dia essa regra estiver errada para um tipo de relato, o erro vai se repetir em
todos eles, e não em um só.

### Viés de aplicação

O CDC vale para relações de consumo. Usar as regras dele num problema de trabalho, de
aluguel ou de compra entre duas pessoas daria uma orientação errada com cara de certa. Por
isso a Lia reconhece esses assuntos e encaminha, em vez de orientar. Os cinco testes de fora
do escopo passam.

Também seria viés de aplicação usar a Lia para compras de empresa (entre duas empresas a
relação nem sempre é de consumo) ou fora do Brasil. A página diz que a orientação segue o
CDC, e o aviso no fim de cada orientação lembra que ela não substitui advogado nem a
Defensoria.

## 3. Dilemas e frameworks de decisão

O guia apresenta três frameworks: consequencialista (qual ação causa o menor dano total),
deontológico (quais regras devem ser protegidas a qualquer custo) e das virtudes (qual ação
reflete responsabilidade e transparência). Três decisões da Lia passaram por eles.

### Gerar ou não a reclamação quando o direito não se aplica

Situação: a pessoa comprou numa loja física e quer devolver porque não gostou, ou comprou
pela internet mas já passaram os 7 dias.

- Consequencialista: gerar a reclamação às vezes funcionaria, porque algumas lojas aceitam a
  troca por política comercial. Na maioria dos casos, porém, a pessoa gastaria tempo,
  criaria expectativa e talvez desistisse de um direito que ela tem de fato, como o de um
  produto com defeito.
- Deontológico: a Lia não pode escrever "conforme o art. 49" num caso em que o art. 49 não se
  aplica. Afirmar um direito que a lei não dá é dizer algo falso em nome da pessoa.
- Virtudes: a resposta transparente explica a regra, diz por que não há reclamação e aponta o
  caminho que existe (pedir a política da loja por escrito, ou contar o defeito, se houver).

Decisão: a Lia não gera a reclamação e explica o motivo. O botão "Por que recebi esta
resposta?" registra a regra: "Sem direito aplicável pelo art. 49: não gerei reclamação para
não induzir um pedido sem base."

### Dizer ou não quanto a pessoa vai receber de indenização

- Consequencialista: um número animaria a pessoa a reclamar, mas criaria uma expectativa que
  pode levar a recusar um acordo razoável.
- Deontológico: só um juiz define o valor de dano moral. Estimar seria afirmar algo que a Lia
  não tem como saber.
- Virtudes: ser honesta sobre o próprio limite.

Decisão: a Lia recusa calcular e mostra o que a lei garante no caso.

### Escrever a reclamação no tom que a pessoa pediu

Quando a pessoa xinga ou pede uma reclamação com ameaça, existe uma tensão entre respeitar a
vontade dela e evitar um texto que atrapalhe o próprio caso. A Lia mantém o texto educado e
explica que ameaça e xingamento costumam atrasar a solução. A autonomia continua com a
pessoa, porque o texto é dela para editar antes de enviar.

## 4. Responsabilidade social e licença para operar

O guia apoia a licença social para operar em três pilares.

| Pilar | O que a Lia tem | O que falta |
|---|---|---|
| Accountability | Cada resposta cita o artigo usado e mostra a regra aplicada; o código é público; o aviso deixa claro que ela não é advogada | Como projeto de estudante, não há uma instituição respondendo por ela. Para operar de verdade, um Procon, uma Defensoria ou um núcleo de prática jurídica precisaria assumir o conteúdo |
| Participação | Nenhuma: os relatos de teste foram escritos por mim | Consumidores de várias regiões e idades e alguém do Procon deveriam participar do desenho, e não só testar no fim |
| Remediação | Avaliação em cada resposta, explicação de cada decisão, encaminhamento ao Procon quando ela não entende, reclamação editável | Não há um canal para contestar uma orientação depois que a conversa acaba |

O pilar mais fraco é a participação. O viés de linguagem que encontrei teria aparecido mais
cedo se outras pessoas tivessem escrito os relatos.

## 5. Avaliação além da acurácia

O guia diz que acurácia e latência não bastam para um agente de impacto social e propõe
olhar confiança, robustez e impacto.

- Confiança: a pessoa sente que foi tratada de forma justa? A Lia explica cada resposta e não
  muda de tom diante de xingamento. Não medi isso com usuários.
- Robustez: é a maior fraqueza. Fora das frases conhecidas, a Lia acertou 4 de 12. Ela
  falha de um jeito seguro, pedindo para a pessoa contar de novo e depois indicando o Procon,
  mas falha.
- Impacto: o risco mais sério é dizer a alguém que o prazo passou e a pessoa desistir de uma
  reclamação que ainda valia, por exemplo por causa da garantia do fabricante. Por isso o
  texto de prazo vencido diz "mesmo assim vale tentar" e indica o Procon.

O painel de testes do guia também pede testes adversariais e de estresse. A bateria tem
cinco adversariais (pedido para ignorar as regras, pedido de valor de indenização,
xingamento com pedido de ameaça, mensagem vazia e respostas sem sentido) e dois de estresse
(mensagem de 5.000 caracteres e 1.000 conversas seguidas). Os sete passam.
