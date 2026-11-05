Resposta do Claude Opus 5.5 (Anthropic) ao prompt
[01-depuracao-e-refatoracao.md](01-depuracao-e-refatoracao.md), copiada sem edição.
O código desta resposta está em [../codigo/cep_ia.py](../codigo/cep_ia.py).

---

**1. Causa de cada problema**

1. **`KeyError: 'logradouro'`**: o ViaCEP não usa 404 para CEP inexistente. Ele responde HTTP 200 com o corpo `{"erro": "true"}`. O código trata qualquer 200 como sucesso e tenta ler uma chave que não existe nesse corpo.
2. **`InvalidURL` com espaço no final**: `input()` tira só a quebra de linha, então o espaço entra na URL. O `http.client` recusa URL com caracteres de `\x00` a `\x20`. O espaço é `\x20`, e por isso a mensagem fala em "control characters" mesmo ele não sendo um.
3. **`HTTPError 400` com a letra O**: nada valida a entrada antes de enviar. O ViaCEP responde 400 quando o CEP não tem 8 dígitos, e o `urlopen` transforma todo status 4xx ou 5xx em exceção.
4. **"Logradouro:" vazio**: cidades com CEP único têm um CEP só para o município inteiro. As chaves `logradouro` e `bairro` existem, mas vêm vazias. Então não dá erro, e o código imprime sem verificar se há conteúdo.

**2. Código refatorado**

```python
import json
import re
import sys
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

URL_VIACEP = "https://viacep.com.br/ws/{cep}/json/"
TIMEOUT_SEGUNDOS = 5

# [0-9] em vez de \d: \d também aceita dígitos Unicode (ex.: "７", de largura
# total), que passariam na validação e quebrariam na hora de montar a URL.
FORMATO_CEP = re.compile(r"([0-9]{5})-?([0-9]{3})")


class ConsultaCepError(Exception):
    """Base dos erros cuja mensagem já pode ser mostrada ao usuário."""


class CepInvalidoError(ConsultaCepError):
    pass


class CepNaoEncontradoError(ConsultaCepError):
    pass


class ViaCepError(ConsultaCepError):
    pass


@dataclass(frozen=True)
class Endereco:
    logradouro: str
    bairro: str
    localidade: str
    uf: str


def normalizar_cep(entrada: str) -> str:
    texto = entrada.strip()
    correspondencia = FORMATO_CEP.fullmatch(texto)
    if correspondencia is None:
        raise CepInvalidoError(
            f"CEP inválido: '{texto}'. Use 8 dígitos, com ou sem hífen (ex.: 70040-010)."
        )
    return correspondencia[1] + correspondencia[2]


def consultar_cep(entrada: str, timeout: float = TIMEOUT_SEGUNDOS) -> Endereco:
    """Consulta o ViaCEP e devolve o endereço.

    Levanta CepInvalidoError (sem fazer requisição), CepNaoEncontradoError
    ou ViaCepError.
    """
    cep = normalizar_cep(entrada)
    try:
        with urlopen(URL_VIACEP.format(cep=cep), timeout=timeout) as resposta:
            dados = json.load(resposta)
    # HTTPError é subclasse de URLError, então precisa vir antes.
    except HTTPError as erro:
        raise ViaCepError(f"O ViaCEP respondeu com erro HTTP {erro.code}.") from erro
    # Timeout ao conectar chega embrulhado em URLError. Timeout ou queda de
    # conexão durante a leitura da resposta chegam sem embrulho.
    except (URLError, TimeoutError, ConnectionError) as erro:
        raise ViaCepError(
            "Não foi possível consultar o ViaCEP (sem conexão ou tempo esgotado)."
        ) from erro
    except json.JSONDecodeError as erro:
        raise ViaCepError("O ViaCEP devolveu uma resposta que não é JSON.") from erro

    # CEP inexistente vem com HTTP 200 e a chave "erro". Testo a presença da
    # chave, e não o valor, porque o tipo do valor já variou (true e "true").
    if "erro" in dados:
        raise CepNaoEncontradoError(f"CEP {cep[:5]}-{cep[5:]} não encontrado.")

    try:
        return Endereco(
            logradouro=dados.get("logradouro", ""),
            bairro=dados.get("bairro", ""),
            localidade=dados["localidade"],
            uf=dados["uf"],
        )
    except KeyError as erro:
        raise ViaCepError(f"Resposta do ViaCEP sem o campo {erro}.") from erro


def formatar_endereco(endereco: Endereco) -> str:
    linhas: list[str] = []
    if endereco.logradouro:
        linhas.append(f"Logradouro: {endereco.logradouro}")
    if endereco.bairro:
        linhas.append(f"Bairro: {endereco.bairro}")
    if not (endereco.logradouro or endereco.bairro):
        linhas.append("CEP geral da cidade: sem logradouro e bairro específicos.")
    linhas.append(f"Cidade: {endereco.localidade}/{endereco.uf}")
    return "\n".join(linhas)


def main() -> int:
    try:
        endereco = consultar_cep(input("Digite o CEP: "))
    except ConsultaCepError as erro:
        print(erro, file=sys.stderr)
        return 1
    print(formatar_endereco(endereco))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

**3. O que mudou e por quê**

- **`normalizar_cep`**: tira os espaços das pontas (com `strip()`) e aceita só `12345678` ou `12345-678`. Isso resolve os problemas 2 e 3. Ela roda dentro de `consultar_cep`, então nenhuma entrada inválida chega a virar requisição.
- **Teste de `"erro"` no corpo**: resolve o problema 1 e transforma o caso em `CepNaoEncontradoError`.
- **`formatar_endereco`**: devolve uma `str` e pula campos vazios, o que resolve o problema 4. Como só devolve texto, dá para testar sem capturar a saída do `print`.
- **Consulta separada da exibição**: `consultar_cep` não usa `input()` nem `print()`. Ela devolve um `Endereco` ou levanta exceções próprias. Com o `if __name__ == "__main__"`, você pode importar o módulo nos testes sem disparar o `input()`.
- **Como testar sem rede**: faça `unittest.mock.patch("seu_modulo.urlopen")` devolvendo `io.BytesIO(b'{"erro": "true"}')`. O alvo do patch é o seu módulo porque o código usa `from urllib.request import urlopen`.
- **Requisição**: agora tem `timeout=5`, e o `with` fecha a conexão. A versão original nunca fechava.
- **Exceções**: só capturo erros nomeados (`HTTPError`, `URLError`, `TimeoutError`, `ConnectionError`, `JSONDecodeError`, `KeyError`). O `from erro` guarda a causa técnica para você depurar, enquanto o usuário vê só a mensagem em português.
- **Saída do programa**: os erros vão para `stderr` e o programa sai com código 1, o que ajuda se ele for usado em scripts.

**4. O que não verifiquei ou estou supondo**

- **Não testei contra a API.** O que descrevi (200 com `"erro"`, 400 para formato inválido, campos vazios em CEP geral) vem da documentação do ViaCEP e dos seus testes. Rode os quatro casos de novo.
- **O valor de `"erro"`**: você viu `"true"` como texto. Que versões antigas devolviam `true` booleano é lembrança minha, e não conferi. Se um dia uma resposta válida vier com `"erro": false`, o código vai tratar o CEP como não encontrado.
- **Formato da resposta**: suponho que o corpo é sempre um objeto JSON em UTF-8 e que todo CEP encontrado traz `localidade` e `uf`. Uma lista JSON ou bytes fora de UTF-8 gerariam `AttributeError` ou `UnicodeDecodeError`, que não trato.
- **`http.client.IncompleteRead`** (a conexão cai no meio do corpo) não é tratado, porque não herda de `OSError`. Nesse caso aparece o traceback.
- **O timeout de 5 s** foi escolha minha. Ele vale para cada operação de rede, não para a requisição inteira.
- **Bloqueio por excesso de uso**: não sei qual status o ViaCEP devolve nesse caso. Ele vai aparecer como "erro HTTP {código}".
- **Formatos aceitos**: `70.040-010` é recusado. Se quiser aceitar pontos, é só ajustar a regex.
- **Aviso de "CEP geral"**: suponho que logradouro e bairro vazios ao mesmo tempo indicam CEP de cidade. Não confirmei se outros tipos de CEP podem vir assim. Em todo caso, o código só deixa de imprimir os campos vazios.
