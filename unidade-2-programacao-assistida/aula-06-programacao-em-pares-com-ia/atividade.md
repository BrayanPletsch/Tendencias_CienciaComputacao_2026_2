# Atividade prática: programação em pares com IA

Disciplina: Tendências em Ciência da Computação

Unidade 2, aula 06 (10/09)

## 1. Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data da execução | 05/11/2026 |
| Mini-projeto | API de Consulta de CEP (nível avançado) |
| Par | Claude Opus 5.5 (Anthropic), pelo chat |
| Ambiente | Python 3.10, só biblioteca padrão |

## 2. Por que o projeto de CEP

Os slides ofereciam três projetos: calculadora, jogo da forca e consulta de CEP. Escolhi
o de CEP porque é o único dos três que depende de algo fora do meu código. A calculadora
e a forca só erram onde eu errei. Uma API externa responde do jeito dela, e parte dos
problemas aparece justamente aí.

Também queria ver se o erro usado de exemplo na "cheat sheet" de prompts, o
`KeyError: 'logradouro'`, aparecia de verdade. Apareceu, logo no primeiro CEP inexistente
que testei.

## 3. A base, escrita por mim

O desafio pede para construir a base e depois deixar a IA refatorar. Escrevi a primeira
versão sozinho, do jeito mais direto que consegui, em
[codigo/cep_base.py](codigo/cep_base.py):

```python
import json
from urllib.request import urlopen


def buscar_cep(cep):
    url = f"https://viacep.com.br/ws/{cep}/json/"
    resposta = urlopen(url)
    dados = json.loads(resposta.read())
    print("Logradouro:", dados["logradouro"])
    print("Bairro:", dados["bairro"])
    print("Cidade:", dados["localidade"] + "/" + dados["uf"])


cep = input("Digite o CEP: ")
buscar_cep(cep)
```

Rodei com seis entradas, consultando o ViaCEP de verdade. A saída completa está em
[codigo/saida-base.txt](codigo/saida-base.txt).

| Entrada | O que aconteceu |
|---|---|
| `70040010` | endereço completo (Quadra SBN Quadra 1, Asa Norte, Brasília/DF) |
| `70040-010` | mesmo resultado, o ViaCEP aceita o hífen |
| `78175000` | imprime `Logradouro:` e `Bairro:` vazios e depois Poconé/MT |
| `99999999` | `KeyError: 'logradouro'` |
| `"70040010 "` (espaço no fim) | `http.client.InvalidURL: URL can't contain control characters` |
| `7004001O` (letra O) | `urllib.error.HTTPError: HTTP Error 400: Bad Request` |

Para entender o `KeyError`, abri a URL do CEP 99999999 direto. O ViaCEP responde HTTP 200
com o corpo `{"erro": "true"}`, e a documentação do serviço descreve exatamente isso. O
código trata qualquer 200 como sucesso e procura uma chave que não veio.

Lendo a base de novo, anotei mais três problemas que a execução não mostra: não existe
timeout, a resposta nunca é fechada, e a consulta está misturada com `input()` e
`print()`, então não tem como testar sem rede e sem digitar.

## 4. Contextualizar e sugerir (IA)

Prompt completo: [prompts/01-depuracao-e-refatoracao.md](prompts/01-depuracao-e-refatoracao.md).

Montei o prompt no formato da "cheat sheet" dos slides, com papel, contexto, código,
problema, tarefa, restrições e formato da resposta. As decisões que mais pesaram:

- Em vez de "tá dando erro", passei os quatro problemas com a mensagem exata e, no caso
  do `KeyError`, o corpo real que a API devolve.
- Restringi a solução à biblioteca padrão. O README do repositório promete que todo
  código roda só com Python instalado, e `requests` quebraria isso.
- Pedi para separar consulta de exibição e validar o CEP antes de fazer a requisição.
- Escrevi uma regra explícita sobre comentários: só onde explicam uma decisão que não dá
  para ver no código, nada de comentário que repete a linha e nada de comentário com
  número de issue ou ticket. Coloquei isso porque, quando não peço, a IA costuma comentar
  quase toda linha.
- Pedi que a resposta terminasse dizendo o que ela não conseguiu verificar.

A resposta completa está em [prompts/01-resposta-da-ia.md](prompts/01-resposta-da-ia.md) e
o código, sem nenhuma alteração, em [codigo/cep_ia.py](codigo/cep_ia.py).

Resumo do que veio: as quatro causas explicadas corretamente; uma função
`normalizar_cep` que tira espaços das pontas e só aceita `12345678` ou `12345-678`; uma
exceção base `ConsultaCepError` com três filhas (CEP inválido, CEP não encontrado e falha
do ViaCEP); um `Endereco` em dataclass; `consultar_cep` com timeout de 5 segundos e `with`
para fechar a resposta; `formatar_endereco` que pula campos vazios; e um `main` que manda
erro para o stderr e devolve código de saída 1. No fim, oito itens que ela disse não ter
verificado.

## 5. Avaliar criticamente (eu)

### Os mesmos seis casos

Rodei o código da IA com as mesmas entradas da base. As seis se comportaram como eu
esperava. O espaço no fim deixou de quebrar, a letra O virou mensagem de CEP inválido sem
fazer requisição, e o 99999999 virou "CEP 99999-999 não encontrado." com código de saída 1.

Testei também algumas entradas que não estavam no prompt: vazio, `70.040-010`,
`70040 010` e o CEP escrito com dígitos de largura total (`７００４００１０`). Todas foram
recusadas como inválidas antes de chegar na API.

### Conferindo o que a IA afirmou

Depois chequei cada afirmação técnica da resposta que dava para conferir:

| Afirmação da IA | Como conferi | Resultado |
|---|---|---|
| CEP inexistente volta com HTTP 200 e `{"erro": "true"}` | requisição direta e documentação do ViaCEP | confere |
| o `http.client` recusa caracteres de `\x00` a `\x20` na URL | li a expressão regular do `http.client` no Python 3.10 | confere; a regex também recusa `\x7f`, que a resposta não citou |
| `\d` aceita dígito Unicode de largura total, e isso quebraria a URL | `re.fullmatch(r"\d{8}", "７００４００１０")` e `urlopen` com esse texto | confere: o `\d` aceita e o `urlopen` levanta `UnicodeEncodeError` |
| `HTTPError` é subclasse de `URLError`, por isso precisa vir antes no `except` | `issubclass(HTTPError, URLError)` | confere |
| timeout durante a leitura chega como `TimeoutError` | no 3.10, `socket.timeout` é o próprio `TimeoutError` | confere |
| `http.client.IncompleteRead` não herda de `OSError` | `issubclass(IncompleteRead, OSError)` | confere, e esse caso continua sem tratamento |
| versões antigas da API mandavam `"erro": true` booleano | a documentação só diz que o retorno traz `erro` igual a `true` | não consegui confirmar |

O último item é a própria IA dizendo que era lembrança dela. Como o código testa se a
chave `erro` existe, e não o valor, ele funciona com texto e com booleano. Deixei um teste
para cada formato.

### O que aceitei e o que mudei

A validação antes da requisição resolve dois dos meus quatro problemas e eu não tinha
pensado nela desse jeito. Aceitei. Tem um teste que garante que, com CEP inválido, o
`urlopen` nem é chamado.

Revisei os quatro comentários com a regra que coloquei no prompt. Um explica por que
`[0-9]` em vez de `\d`, outro por que `HTTPError` vem antes de `URLError`, outro de onde
vêm os timeouts e o último por que o teste é pela presença da chave `erro`. Nenhum repete
o código, então ficaram.

Achei exagerado, no começo, ter quatro classes de exceção num script desse tamanho. Mudei
de ideia quando fui escrever os testes. O `main` só captura a classe base, e são as três
filhas que me deixam testar separadamente "CEP inválido", "CEP não encontrado" e "o
serviço falhou". Com uma classe só, os testes não teriam como diferenciar esses casos.

Mudei uma coisa. Para logradouro e bairro vazios, a IA imprimia "CEP geral da cidade: sem
logradouro e bairro específicos." Ela mesma listou isso como suposição. Eu testei cinco
CEPs que voltam com os dois campos vazios (Poconé/MT, Barra do Corda/MA, Minaçu/GO,
Oriximiná/PA e Porto Seguro/BA) e todos são CEP geral de cidade, mas isso não prova que
todo CEP com os dois campos vazios seja geral. Troquei a mensagem por "Logradouro e bairro
não informados para este CEP.", que diz só o que a resposta da API mostra.

Ficaram sem tratamento, por decisão minha, dois casos que a IA apontou: uma resposta JSON
em forma de lista (daria `AttributeError`) e a conexão caindo no meio do corpo
(`IncompleteRead`). Em todos os testes o endpoint `/json/` devolveu objeto, e não achei
que valesse escrever código para um cenário que eu não consigo reproduzir. Fica
registrado aqui como limite conhecido.

## 6. Refatorar e ajustar

Os testes estão em [codigo/test_cep.py](codigo/test_cep.py). Escrevi treze, todos sem
rede, trocando o `urlopen` por um mock. A dica de fazer o patch em `cep.urlopen`, e não em
`urllib.request.urlopen`, veio da resposta da IA. Conferi que funciona: como o módulo faz
`from urllib.request import urlopen`, o nome que precisa ser trocado é o que ficou dentro
do módulo.

O que os testes cobrem:

- normalização: quatro formas aceitas (com e sem hífen, com espaço, com quebra de linha) e
  oito recusadas, inclusive dígitos de largura total;
- consulta: CEP existente (conferindo a URL montada e o timeout), CEP inválido sem
  requisição, CEP inexistente com `"erro"` em texto e em booleano, CEP geral de cidade,
  quatro falhas de rede (HTTP 500, sem conexão, timeout na leitura, conexão reiniciada),
  resposta que não é JSON e resposta sem o campo `localidade`;
- exibição: endereço completo, sem logradouro e bairro, e só com bairro vazio.

```
Ran 13 tests in 0.005s

OK
```

## 7. Decidir e integrar

A versão final é [codigo/cep.py](codigo/cep.py). Ela difere do código da IA em uma linha,
a da mensagem de campos vazios. Com as mesmas seis entradas da base
([codigo/saida-final.txt](codigo/saida-final.txt)):

| Entrada | Base | Final |
|---|---|---|
| `70040010` | endereço completo | endereço completo |
| `70040-010` | endereço completo | endereço completo |
| `78175000` | campos vazios impressos | "Logradouro e bairro não informados para este CEP." e a cidade |
| `99999999` | `KeyError` | "CEP 99999-999 não encontrado.", saída 1 |
| `"70040010 "` | `InvalidURL` | endereço completo |
| `7004001O` | `HTTPError 400` | "CEP inválido", saída 1, sem requisição |

## 8. O que foi da IA e o que foi meu

A maior parte do código final foi escrita pela IA, e declaro isso. Foram meus: a versão
base, a escolha dos casos de teste da base, o diagnóstico dos quatro erros que entrou no
prompt, o próprio prompt, a conferência das afirmações da resposta, os treze testes, a
troca da mensagem e a decisão sobre o que ficou sem tratamento. Consigo explicar cada
função do `cep.py` e por que cada `except` está na ordem em que está.

## 9. Reflexão

O `KeyError` do slide aconteceu igualzinho, e a correção dele na versão da IA é um `if`
de duas linhas. O que mais melhorou o programa foi a validação antes da requisição, que
resolveu outros dois problemas e que eu não tinha planejado.

Acho que a resposta veio certa logo na primeira tentativa porque o prompt já trazia o
diagnóstico pronto: mensagem de erro exata, corpo da resposta e entrada que causou cada
falha. A parte do prompt que mais me ajudou depois foi pedir a lista do que a IA não tinha
verificado. Ela virou meu roteiro de conferência na seção 5, e foi nela que apareceu a
única coisa que mudei no código.

## 10. Como executar

```bash
cd unidade-2-programacao-assistida/aula-06-programacao-em-pares-com-ia/codigo
python cep.py                         # pede o CEP no terminal
python -m unittest test_cep -v        # não precisa de internet
python executar_casos.py cep_base.py  # seis CEPs reais contra a base
python executar_casos.py cep.py       # os mesmos contra a versão final
```

Os dois últimos comandos consultam o ViaCEP e precisam de internet.
