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
        linhas.append("Logradouro e bairro não informados para este CEP.")
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
