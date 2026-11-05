"""Conta as linhas de cada nível (INFO, WARNING, ERROR) em um arquivo de log."""

import argparse
import sys
from collections.abc import Iterable
from dataclasses import dataclass, field
from pathlib import Path
from typing import TextIO

NIVEIS = ("INFO", "WARNING", "ERROR")
SEPARADOR = " - "


@dataclass
class Contagem:
    por_nivel: dict[str, int] = field(default_factory=lambda: dict.fromkeys(NIVEIS, 0))
    fora_do_formato: int = 0


def identificar_nivel(linha: str) -> str | None:
    for nivel in NIVEIS:
        if linha.startswith(nivel + SEPARADOR):
            return nivel
    return None


def contar_niveis(linhas: Iterable[str]) -> Contagem:
    contagem = Contagem()
    for linha in linhas:
        if not linha.strip():
            continue
        nivel = identificar_nivel(linha)
        if nivel is None:
            contagem.fora_do_formato += 1
        else:
            contagem.por_nivel[nivel] += 1
    return contagem


def abrir_log(caminho: Path) -> TextIO:
    # utf-8-sig descarta o BOM que alguns editores gravam no início do arquivo;
    # sem isso, a primeira linha nunca casaria com um nível.
    # errors="replace" evita que um byte inválido em uma mensagem interrompa
    # a contagem do arquivo inteiro.
    return caminho.open(encoding="utf-8-sig", errors="replace")


def formatar_relatorio(contagem: Contagem) -> str:
    linhas = [f"{nivel}: {total}" for nivel, total in contagem.por_nivel.items()]
    linhas.append(f"Linhas fora do formato: {contagem.fora_do_formato}")
    return "\n".join(linhas)


def reportar_erro(mensagem: str) -> int:
    print(f"Erro: {mensagem}", file=sys.stderr)
    return 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Conta as linhas de cada nível em um arquivo de log."
    )
    parser.add_argument("caminho", type=Path, help="arquivo .log a ser lido")
    caminho = parser.parse_args(argv).caminho

    try:
        with abrir_log(caminho) as arquivo:
            contagem = contar_niveis(arquivo)
    except FileNotFoundError:
        return reportar_erro(f"arquivo não encontrado: {caminho}")
    except IsADirectoryError:
        return reportar_erro(f"o caminho é um diretório, não um arquivo: {caminho}")
    except PermissionError:
        return reportar_erro(f"sem permissão para ler o arquivo: {caminho}")
    except OSError as erro:
        return reportar_erro(f"falha ao ler o arquivo ({erro.strerror}): {caminho}")

    print(formatar_relatorio(contagem))
    return 0


if __name__ == "__main__":
    sys.exit(main())
