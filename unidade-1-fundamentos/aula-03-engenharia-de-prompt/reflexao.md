# Reflexão individual

Arquivo exigido pelo enunciado da atividade A2. Duas questões obrigatórias, uma
cognitiva e uma ética.

Estudante: Brayan A. Pletsch
Data: 10/09/2026

## Questão cognitiva

**O que mudou na minha compreensão sobre o uso de IA depois de aprender a estruturar um
prompt iterativo?**

Mudou o lugar onde eu procuro o erro.

Antes desta atividade, quando a resposta vinha ruim, eu concluía que o modelo era
limitado para aquela tarefa e ou tentava outra ferramenta ou desistia e fazia à mão.
Tratava a resposta como a saída de uma consulta: ou o sistema tem a informação, ou não
tem.

O que aconteceu aqui foi diferente. O prompt inicial produziu quatro casos de teste
inofensivos, e o refinado, com a mesma ferramenta e no mesmo dia, encontrou um defeito
real no meu código. O modelo não ficou melhor entre uma execução e outra. O que mudou
foi a informação que eu coloquei no contexto.

Isso tem uma consequência que eu não tinha percebido: uma resposta ruim é
principalmente um diagnóstico do meu prompt. A pergunta útil deixa de ser "por que a IA
errou" e passa a ser "o que eu deixei o modelo supor sozinho".

O segundo ponto veio da variação com troca de persona. Alterar dois blocos de texto,
mantendo a tarefa idêntica, mudou completamente a ordem de prioridade da resposta.
Ligando isso ao que eu tinha visto no experimento da aula 02, a explicação parou de ser
misteriosa: o texto do papel entra no contexto e desloca qual continuação é mais
provável. Prompt não é uma fórmula mágica que se acerta por tentativa, é a variável de
entrada de um sistema cujo comportamento tem uma explicação mecânica.

O terceiro ponto é o que eu considero mais duradouro. A parte do prompt que mais mudou
o resultado foi o critério de qualidade, e ele funcionou porque era verificável. Pedir
uma suíte "completa" não muda nada. Dizer que a suíte falha se todos os testes passarem
muda tudo, porque isso é uma condição que eu consigo executar. Escrever esse critério me
obrigou a definir, antes de perguntar, o que eu consideraria sucesso. Boa parte do
ganho aconteceu nesse momento, antes de a IA responder qualquer coisa.

## Questão ética

**Qual é a principal responsabilidade de um profissional de tecnologia que utiliza IA
generativa para tomar decisões ou produzir conhecimento?**

Garantir que exista, em algum ponto do processo, uma verificação que não dependa da IA.

Formulo assim de propósito, porque "revisar a resposta" não basta. Nesta atividade, a
suíte de testes do prompt inicial estava correta. Não havia nada para revisar: os quatro
testes eram válidos, passavam, e não apontavam problema nenhum. Uma revisão atenta não
teria encontrado erro, porque não havia erro. Havia ausência, e ausência é justamente o
que a revisão não enxerga.

O que expôs o problema foi uma verificação de natureza diferente: eu escrevi um segundo
prompt com a hipótese oposta, gerei uma suíte adversarial e rodei as duas contra o mesmo
código. Quatro casos falharam. Esse resultado não veio da minha avaliação da resposta,
veio da execução.

Daí a responsabilidade central: definir, antes de perguntar, como a resposta será
conferida por um meio independente. Executar o código, refazer a conta, procurar a
fonte primária, comparar com o material da disciplina. Se não existe forma de verificar,
a responsabilidade é reconhecer isso e tratar a resposta como hipótese, não como
conclusão. Deixei um caso assim registrado na entrega: a afirmação de que a Receita
Federal não emite CPFs com dígitos repetidos eu não confirmei em fonte primária, e por
isso ela está marcada como pendente.

Há um segundo aspecto, que a professora colocou de forma direta em aula: usar IA não
transfere a autoria. Se o código quebrar em produção, a explicação de que a sugestão
veio de um modelo não muda nada em termos de responsabilidade profissional. A assinatura
é de quem entrega.

E há um terceiro, que só ficou claro depois do experimento da aula 02. Modelos não têm
um estado interno de "não sei". A softmax sempre produz um token vencedor, então sempre
existe uma resposta, inclusive quando não deveria existir. Um profissional que espera o
sistema avisar quando está inseguro está esperando um sinal que a arquitetura não emite.
A confiança aparente da resposta não carrega nenhuma informação sobre a sua correção, e
tratar fluência como evidência de qualidade é o erro que a ferramenta mais induz.
