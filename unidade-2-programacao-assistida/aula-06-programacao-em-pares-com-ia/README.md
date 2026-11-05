# Aula 06: Programação em pares com IA

Data: 10/09. A professora publicou a atividade no repositório da disciplina nesse dia,
com o título "Programming in Pairs - 10/09". Pelo plano de ensino a Unidade 2 só começaria
em 17/09, mas o conteúdo é o da primeira semana dela: programação assistida por IA, com
demonstração de sugestões de código e refatoração. Competência do plano: utilizar IA como
apoio à programação.

No material da professora o notebook desta aula se chama `aula07`. Mantive a numeração
cronológica do repositório, como fiz na Unidade 1.

Entrega da atividade: [atividade.md](atividade.md).
Código: [codigo/](codigo/).

Material da aula:

- [slides-programacao-por-pares.pdf](slides-programacao-por-pares.pdf), "Programação por
  Pares com IA: A Nova Era";
- [slides-atividade-pratica.pdf](slides-atividade-pratica.pdf), "Programação Assistida por
  Inteligência Artificial", com o desafio prático;
- [notebook-da-professora.ipynb](notebook-da-professora.ipynb), os exemplos feitos em aula
  (soma de lista, número primo, inversão de texto e consulta de CEP). Também está no
  [Colab](https://colab.research.google.com/drive/1WZ2Ub5imnynYOrpi2fbqSkhXkM2wcRVr).

## Do par de pessoas ao par com IA

Na programação em pares tradicional duas pessoas dividem um computador. Uma digita (o
piloto) e a outra acompanha, revisa e pensa no próximo passo (o navegador). Os slides
trocam a segunda pessoa pela IA e invertem os papéis: a IA vira o piloto e o
desenvolvedor fica como navegador.

A divisão proposta é esta:

| Navegador (desenvolvedor) | Piloto (IA) |
|---|---|
| entender e definir os requisitos do negócio | traduzir a intenção em sintaxe |
| arquitetar a solução | sugerir implementações a partir de padrões conhecidos |
| decidir trade-offs, como desempenho contra legibilidade | apontar erros e inconsistências enquanto o código é escrito |
| cuidar de segurança, ética e privacidade | trazer documentação e exemplos |
| validar se o problema foi resolvido | adiantar o código repetitivo |

A frase dos slides para isso é que o desenvolvedor passa a ser o "tech lead de um parceiro
incansável, porém júnior". Achei a comparação boa por causa do "júnior": ninguém faz merge
do código de um estagiário sem ler.

## O ciclo de colaboração

Os dois conjuntos de slides descrevem o mesmo ciclo com nomes um pouco diferentes:

1. contextualizar e sugerir: a IA lê o prompt e o código existente e propõe algo;
2. avaliar criticamente: o desenvolvedor confere lógica, segurança e aderência ao problema;
3. refatorar e ajustar: humano e IA trocam prompts até o código ficar bom;
4. decidir e integrar: o desenvolvedor aceita, e a responsabilidade pelo código é dele.

Só a primeira etapa é da IA sozinha. As outras três dependem de alguém que entenda o
código, e foi assim que organizei a atividade.

## O que a IA faz bem no dia a dia

O slide do "toolkit" lista cinco papéis: tradutor de intenção (comentário vira código),
autocompletar com contexto do projeto, revisor em tempo real, consultor de sintaxe e boas
práticas, e gerador de código repetitivo. Duas citações dos slides resumem o argumento de
produtividade. Lee, Goldberg e Kohane (2024) falam em até 55% de ganho na velocidade de
codificação, mas dizem que o ganho real está na redução da carga cognitiva. Mello (2024)
diz que tirar as tarefas mecânicas do desenvolvedor libera tempo para arquitetura.

Os slides também mostram a linha do tempo dessas ferramentas: autocomplete por dicionário
nos anos 2000, análise estática nos anos 2010, Copilot e os primeiros LLMs de código em
2020 e 2021, e a partir de 2023 modelos como GPT e Claude, que já conversam sobre
arquitetura.

## Confiança calibrada

Um gráfico dos slides cruza o risco da tarefa com o nível de supervisão. Criar a estrutura
de pastas de um projeto pode ser delegado quase todo. Funções isoladas e testes unitários
pedem revisão. Autenticação de usuários e escolha de algoritmo de hash, como bcrypt, pedem
supervisão total. As citações que acompanham são de Barcaui (2025), sobre saber quando
confiar, adaptar ou ignorar a sugestão, e de Eysenck e Eysenck (2023), sobre a confiança
que se constrói em ciclos de uso, validação e feedback.

## Prompt como especificação

O slide sobre comunicação compara `def validar_cpf(cpf):` sozinho com a mesma assinatura
precedida de comentários que dizem o contexto, a entrada, a saída e as restrições. É o
mesmo problema que usei na atividade da [aula 03](../../unidade-1-fundamentos/aula-03-engenharia-de-prompt/),
só que do lado do código: a assinatura nua gera uma validação genérica, e a especificação
reduz o que o modelo precisa adivinhar. A citação é de Murta (2023): a qualidade do código
gerado é proporcional à qualidade da comunicação.

A "cheat sheet" de prompts tem três linhas. Para contexto, "Faça um jogo da forca" contra
um pedido com papel e estrutura modular. Para refatoração, "Melhore esse código" contra
um pedido que diz o que melhorar e que pede para comentar as alterações. Para depuração,
"Tá dando erro na linha 4" contra um pedido com o erro exato, `KeyError: 'logradouro'`, e o
payload da API de CEP. Esse último exemplo foi o que me fez escolher o projeto de CEP.

## Os exemplos de refatoração

Os slides mostram três antes e depois: soma com `while` trocada por `sum()`, inversão de
texto com laço trocada por fatiamento `[::-1]`, e teste de primalidade que deixa de ir até
`n` e passa a ir até a raiz de `n`.

O exemplo do número primo tem um problema que eu só vi rodando. As duas versões do slide
devolvem `True` para 0 e para 1, e a versão "otimizada" levanta `ValueError: math domain
error` com número negativo, por causa do `math.sqrt`. A função do notebook da professora
não tem esse defeito, porque começa com `if n < 2: return False`. Para mim isso mostra bem
o assunto da aula: a refatoração melhorou o desempenho e manteve um erro de borda que já
existia, e nenhum dos dois quadros do slide chama atenção para isso.

## Limites

O último bloco dos slides separa o que a máquina entrega (velocidade, padrões repetitivos,
lembrar documentação, algoritmos conhecidos) do que ela não entrega: entender a regra de
negócio do cliente, perceber uma vulnerabilidade escondida em código que parece certo e
responder pelo resultado. A frase do slide é "A IA escreve o código, mas é o seu nome no
Commit."

## Material de apoio

- Slides da professora Kadidja Valéria citados acima.
- VIACEP. Documentação do webservice. Disponível em: https://viacep.com.br/
- PYTHON SOFTWARE FOUNDATION. *urllib.request: Extensible library for opening URLs*.
  Disponível em: https://docs.python.org/3.10/library/urllib.request.html
- PYTHON SOFTWARE FOUNDATION. *unittest.mock: mock object library*.
  Disponível em: https://docs.python.org/3.10/library/unittest.mock.html
