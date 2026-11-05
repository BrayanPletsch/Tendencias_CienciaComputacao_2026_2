Atue como um desenvolvedor Python sênior revisando o código de um colega.

CONTEXTO:
Sou estudante e estou fazendo um mini-projeto de consulta de CEP na API pública
do ViaCEP (https://viacep.com.br/ws/{cep}/json/). Escrevi a versão base abaixo
sozinho. Ela funciona quando o CEP existe e foi digitado só com números ou com
hífen, mas quebra nos casos que listei em PROBLEMA.

CÓDIGO ATUAL:
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

PROBLEMA:
1. Com o CEP 99999999 recebo `KeyError: 'logradouro'`. Testei a URL no
   navegador e a API devolve HTTP 200 com o corpo `{"erro": "true"}`.
2. Com "70040010 " (espaço no final, como acontece quando copio de algum lugar)
   recebo `http.client.InvalidURL: URL can't contain control characters`.
3. Com "7004001O" (letra O no lugar do zero) recebo `HTTPError 400`.
4. Para CEPs gerais de cidade, como 78175000, logradouro e bairro vêm como
   string vazia e o programa imprime "Logradouro:" sem nada.

TAREFA:
Explique a causa de cada um dos quatro problemas e refatore o código.

RESTRIÇÕES:
- Python 3.10 ou superior, apenas biblioteca padrão (urllib e json). Não use
  requests nem outra dependência.
- Separe a consulta da exibição, para eu conseguir testar a consulta sem
  depender de input() nem de print().
- Valide o CEP antes de fazer a requisição. Não quero gastar requisição com
  entrada que eu já sei que é inválida.
- Defina timeout na requisição.
- Não capture Exception genérica. Trate só os erros que você sabe nomear.
- Mensagens para o usuário em português.
- Comentários: só onde explicam uma decisão que não é óbvia lendo o código.
  Não escreva comentário que repete o que a linha faz, e não use comentário
  com número de issue, ticket ou "TODO" sem contexto.

FORMATO DA RESPOSTA:
1. Causa de cada problema, em uma ou duas frases cada.
2. Código completo refatorado, em um único bloco.
3. Lista curta do que mudou e por quê.
4. O que você não conseguiu verificar ou está supondo sobre a API.
