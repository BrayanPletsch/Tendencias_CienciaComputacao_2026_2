"""Conta os três logs de exemplo com a primeira versão e com a versão final."""

from pathlib import Path

import contar_niveis_log
import contar_niveis_v1

PASTA_LOGS = Path(__file__).parent / "logs"
VERSOES = {
    "primeira versão (IA)": contar_niveis_v1,
    "versão final": contar_niveis_log,
}


def contar_arquivo(modulo, caminho: Path):
    with caminho.open(encoding="utf-8") as arquivo:
        contagem = modulo.contar_niveis(arquivo)
    return contagem.por_nivel, contagem.fora_do_formato


def main() -> None:
    for caminho in sorted(PASTA_LOGS.glob("*.log")):
        print(caminho.name)
        for nome, modulo in VERSOES.items():
            por_nivel, fora = contar_arquivo(modulo, caminho)
            niveis = ", ".join(f"{nivel} {total}" for nivel, total in por_nivel.items())
            print(f"  {nome:<22} {niveis}, fora do formato {fora}")
        print()


if __name__ == "__main__":
    main()
