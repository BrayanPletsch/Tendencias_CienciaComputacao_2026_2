import re

TAMANHO_CPF = 11
TAMANHO_BASE = 9
NAO_DIGITO = re.compile(r"\D")


def extrair_digitos(cpf: str | None) -> str:
    return NAO_DIGITO.sub("", cpf or "")


def calcular_digito_verificador(base: list[int]) -> int:
    peso_inicial = len(base) + 1
    soma = sum(numero * (peso_inicial - posicao) for posicao, numero in enumerate(base))
    resto = (soma * 10) % 11
    return 0 if resto == 10 else resto


def montar_verificadores(base: list[int]) -> str:
    primeiro = calcular_digito_verificador(base)
    segundo = calcular_digito_verificador(base + [primeiro])
    return f"{primeiro}{segundo}"


def valida_cpf_v1(cpf: str | None) -> bool:
    digitos = extrair_digitos(cpf)
    if len(digitos) != TAMANHO_CPF:
        return False
    base = [int(caractere) for caractere in digitos[:TAMANHO_BASE]]
    return digitos[TAMANHO_BASE:] == montar_verificadores(base)


def valida_cpf(cpf: str | None) -> bool:
    digitos = extrair_digitos(cpf)
    if len(digitos) != TAMANHO_CPF:
        return False
    if len(set(digitos)) == 1:
        return False
    base = [int(caractere) for caractere in digitos[:TAMANHO_BASE]]
    return digitos[TAMANHO_BASE:] == montar_verificadores(base)
