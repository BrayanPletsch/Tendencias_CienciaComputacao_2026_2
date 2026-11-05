# Aula 08: Programação assistida e automação com IA

Data: 24/09. Objetivo do plano de ensino: automação com IA. Atividade prevista: exercício
prático de scripts automatizados com IA. Competência: criar soluções automatizadas com
suporte de IA.

O material da professora junta o conteúdo de 17/09 e de 24/09 em um documento só, e o
desafio prático dele vale 0,5 ponto. Ela publicou o material no repositório da disciplina
em 11/09.

Enunciado original: [enunciado-da-professora.md](enunciado-da-professora.md).
Entrega da atividade: [atividade.md](atividade.md).
Código: [codigo/](codigo/).

## A pergunta da aula

O material abre com esta questão: como usar IA para desenvolver, melhorar e automatizar
soluções sem abrir mão da compreensão, da validação e da responsabilidade sobre o código.
A aula tem duas partes, programação assistida e automação, e as duas terminam no mesmo
lugar: testar, validar e melhorar antes de usar.

## Programação assistida

É usar a IA durante o desenvolvimento para gerar, explicar, corrigir, depurar, testar,
refatorar e documentar código. O material compara dois fluxos. No uso assistido, o
programador define o problema, a IA sugere e o programador analisa, testa, modifica e
valida. No uso passivo, o pedido vai para a IA, o código volta, é copiado e executado.
Segundo o material, o primeiro favorece aprendizagem e responsabilidade, e o segundo
aumenta o risco de erro e de uso indevido.

Cada tarefa tem um jeito de pedir:

- Geração: o prompt "faça um programa em Python para números pares" deixa quase tudo em
  aberto. A versão estruturada diz a entrada (lista de inteiros), a saída (só os pares),
  o que incluir (type hints, docstring, exemplo de uso) e o que não usar (bibliotecas
  externas).
- Explicação: pedir para explicar linha por linha para um iniciante e, depois, tentar
  responder sozinho qual é a entrada, o processamento, a saída e o que ainda não entendi.
- Correção: em vez de "corrija meu código", pedir para identificar o erro, explicar por que
  ocorre e qual conceito está envolvido, e só no fim mostrar o código corrigido.
- Depuração: o exemplo da função `media` que divide por `len(nota)` em vez de
  `len(notas)`. O prompt sugerido começa com "Não corrija imediatamente".
- Refatoração: melhorar a estrutura sem mudar o comportamento. O material lembra que a
  versão mais curta nem sempre é melhor. Depende de quem vai ler e manter o código.

## Automação

Automação é deixar o software fazer uma tarefa com pouca ou nenhuma intervenção manual:
organizar e renomear arquivos, processar planilhas, validar dados, gerar relatórios,
analisar logs. Uma tarefa é boa candidata quando é repetitiva, frequente, previsível,
baseada em regras claras, sujeita a erro manual ou feita sobre muitos dados.

O material pergunta se automatizar é sempre a melhor opção, e a resposta é não. Tarefa
rara, pouco previsível ou que depende de julgamento humano pode custar mais para
automatizar do que para fazer à mão, e ainda aumentar o risco.

O exemplo da pasta de trabalhos com nomes bagunçados (`Relatorio João FINAL.pdf`,
`relatorio_maria.PDF`) mostra o que precisa ser decidido antes de escrever o script:
quais arquivos mudam, qual a regra de nome, como não sobrescrever nada, o que fazer com
nome inesperado e se deve existir uma simulação antes da alteração real.

## Prompt para programação

A estrutura proposta tem papel, problema, entrada, saída esperada, tecnologia,
restrições, casos de teste e critérios de qualidade. Comparado com o que vimos na Unidade
1, a diferença está nos casos de teste. Eles entram no prompt antes do código existir, e
por isso servem para conferir a resposta depois.

O material também recomenda desenvolver por etapas: identificar arquivos, validar regras,
simular, executar, tratar erros e registrar resultados. Pedir tudo de uma vez dificulta
revisar e achar onde está o erro.

## Responsabilidade e segurança

A pergunta que importa, segundo o material, é se você entende, testou e consegue
defender o código que está usando. Quem escreveu é secundário. A IA pode sugerir código
incorreto, biblioteca inadequada, API que não existe, solução insegura ou desatualizada,
ou algo mais complicado do que o necessário.

A "regra do desenvolvedor" é uma sequência: a IA sugere, eu analiso, testo, modifico,
valido e assumo a responsabilidade.

Sobre o que colocar no prompt: nada de senha, chave de API, token, dado pessoal, dado
confidencial, credencial de banco ou código proprietário. Quando precisar de um exemplo,
usar valores fictícios como `API_KEY = "<SUA_CHAVE>"`.

## Material de apoio

- Material do estudante da professora Kadidja Valéria, em
  [enunciado-da-professora.md](enunciado-da-professora.md).
- PYTHON SOFTWARE FOUNDATION. *argparse: Parser for command-line options, arguments and
  subcommands*. Disponível em: https://docs.python.org/3.10/library/argparse.html
- PYTHON SOFTWARE FOUNDATION. *Built-in Exceptions: OS exceptions*. Disponível em:
  https://docs.python.org/3.10/library/exceptions.html#os-exceptions
- PYTHON SOFTWARE FOUNDATION. *codecs: Standard Encodings* (utf-8-sig). Disponível em:
  https://docs.python.org/3.10/library/codecs.html#standard-encodings
