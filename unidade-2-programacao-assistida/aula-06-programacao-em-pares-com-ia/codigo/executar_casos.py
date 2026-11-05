"""Roda os mesmos CEPs contra um dos scripts e mostra a saída de cada execução.

Uso: python executar_casos.py cep_base.py
     python executar_casos.py cep.py

Faz consultas reais ao ViaCEP, então precisa de internet.
"""

import subprocess
import sys

CASOS = (
    "70040010",
    "70040-010",
    "78175000",
    "99999999",
    "70040010 ",
    "7004001O",
)


def executar(script: str, entrada: str) -> str:
    resultado = subprocess.run(
        [sys.executable, script],
        input=entrada + "\n",
        capture_output=True,
        text=True,
        timeout=30,
    )
    saida = resultado.stdout + resultado.stderr
    if resultado.returncode != 0 and "Traceback" in saida:
        saida = saida.strip().splitlines()[-1] + "\n"
    return f"{saida.rstrip()}\n(código de saída {resultado.returncode})"


def main() -> None:
    script = sys.argv[1]
    for entrada in CASOS:
        print(f"entrada: {entrada!r}")
        print(executar(script, entrada))
        print()


if __name__ == "__main__":
    main()
