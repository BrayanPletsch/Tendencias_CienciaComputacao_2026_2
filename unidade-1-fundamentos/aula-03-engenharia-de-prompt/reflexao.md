# Reflexão individual

O enunciado da atividade A2 pede este arquivo, com duas questões obrigatórias: uma
cognitiva e uma ética.

- Estudante: Brayan A. Pletsch
- RGM: 38473585
- Data: 10/09/2026

## Questão cognitiva

> O que mudou na minha compreensão sobre o uso de IA depois de aprender a estruturar um
> prompt iterativo?

A principal mudança foi o lugar onde eu procuro o erro quando a resposta vem ruim.

Antes desta atividade, quando isso acontecia, eu concluía que o modelo era limitado
para aquela tarefa e ou tentava outra ferramenta ou desistia e fazia à mão. Eu tratava
a resposta como o resultado de uma consulta, em que o sistema tem a informação ou não
tem.

Nesta atividade o prompt inicial produziu quatro casos de teste inofensivos, e o
refinado, com a mesma ferramenta e no mesmo dia, encontrou um defeito real no meu
código. Entre uma execução e outra, a única coisa que mudou foi a informação que eu
coloquei no contexto.

Eu não tinha percebido a consequência disso: uma resposta ruim é principalmente um
diagnóstico do meu prompt. A pergunta útil passa a ser "o que eu deixei o modelo supor
sozinho", e não "por que a IA errou".

Outra coisa veio da variação com troca de persona. Alterar dois blocos de texto,
com a tarefa idêntica, mudou completamente a ordem de prioridade da resposta. Juntando
isso com o que eu tinha visto no experimento da aula 02, deu para entender o motivo: o
texto do papel entra no contexto e desloca qual continuação é mais provável. O prompt
deixou de parecer uma fórmula que se acerta por tentativa. Ele é a entrada de um sistema
cujo comportamento tem explicação mecânica.

O que eu acho que vai ficar por mais tempo tem a ver com o critério de qualidade. Foi a parte do prompt
que mais mudou o resultado, e funcionou porque era verificável. Pedir uma suíte
"completa" não muda nada, mas dizer que a suíte falha se todos os testes passarem muda
bastante, porque essa é uma condição que eu consigo executar. Escrever esse critério me
obrigou a definir, antes de perguntar, o que eu consideraria sucesso, e boa parte do
ganho veio desse momento, antes de a IA responder qualquer coisa.

## Questão ética

> Qual é a principal responsabilidade de um profissional de tecnologia que utiliza IA
> generativa para tomar decisões ou produzir conhecimento?

Garantir que exista, em algum ponto do processo, uma verificação que não dependa da IA.

Falo em verificação porque só "revisar a resposta" não teria bastado nesta atividade. A
suíte de testes do prompt inicial estava correta: os quatro testes eram válidos,
passavam e não apontavam problema nenhum. Uma revisão atenta não teria encontrado erro,
porque não havia erro. O problema estava no que faltava na suíte, e uma revisão não
enxerga o que não está escrito.

O defeito apareceu com outro tipo de verificação. Escrevi um segundo prompt com a
hipótese oposta, gerei uma suíte adversarial e rodei as duas contra o mesmo código.
Quatro casos falharam, e quem mostrou isso foi a execução, sem depender da minha
avaliação da resposta.

Por isso, para mim, a responsabilidade principal é definir, antes de perguntar, como a
resposta vai ser conferida por um meio independente: executar o código, refazer a
conta, procurar a fonte primária, comparar com o material da disciplina. Quando não há
como verificar, cabe reconhecer isso e tratar a resposta como hipótese. Tem um caso
assim registrado na entrega: não confirmei em fonte primária que a Receita Federal não
emite CPFs com dígitos repetidos, e por isso essa afirmação está marcada como pendente.

A professora também disse em aula, de forma direta, que usar IA não transfere a
autoria. Se o código quebrar em produção, dizer que a sugestão veio de um modelo não
muda em nada a responsabilidade profissional de quem entregou.

E o experimento da aula 02 deixou claro mais um ponto. Modelos não têm um estado
interno de "não sei". A softmax sempre produz um token vencedor, então sempre existe uma
resposta, inclusive quando não deveria existir. Um profissional que espera o sistema
avisar quando está inseguro está esperando um sinal que a arquitetura não emite. A
confiança aparente da resposta não informa nada sobre se ela está correta, e tratar
fluência como evidência de qualidade é o erro que a ferramenta mais induz.
