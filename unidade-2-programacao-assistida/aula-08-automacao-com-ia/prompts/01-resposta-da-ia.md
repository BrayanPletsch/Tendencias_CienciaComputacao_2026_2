Resposta do Claude Opus 5.5 (Anthropic) ao prompt [01-geracao.md](01-geracao.md),
copiada sem edição. O código desta resposta está em
[../codigo/contar_niveis_v1.py](../codigo/contar_niveis_v1.py).

---

## 1. Estratégia

- **Leitura:** `ler_linhas` abre o arquivo só para leitura e entrega uma linha por vez. O arquivo inteiro nunca fica na memória.
- **Contagem:** `contar_niveis` recebe qualquer coleção de linhas, como um arquivo aberto ou uma lista nos testes. Ela não abre arquivos nem imprime nada.
- **Classificação:** os níveis ficam em uma única tupla (`NIVEIS`). Uma função percorre essa tupla e diz qual nível a linha tem, ou `None` se a linha estiver fora do formato. Assim não há código repetido por nível. Para adicionar um nível, basta incluí-lo na tupla.
- **Saída:** `formatar_relatorio` monta o texto e `main` só imprime.
- **Erros:** só são capturadas exceções específicas (`FileNotFoundError`, `IsADirectoryError` e `PermissionError`). Cada uma gera uma mensagem no stderr e código de saída 1. Se faltar o argumento, o `argparse` mostra como usar e sai com código 2.
- **Regra do formato:** a regra é aplicada ao pé da letra. Maiúsculas e minúsculas fazem diferença, então `info - x`, `INFO-x` e linhas em branco contam como fora do formato.

## 2. Código

```python
"""Conta as linhas de cada nível (INFO, WARNING, ERROR) em um arquivo de log."""

import argparse
import sys
from collections.abc import Iterable, Iterator
from dataclasses import dataclass, field
from pathlib import Path

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
        nivel = identificar_nivel(linha)
        if nivel is None:
            contagem.fora_do_formato += 1
        else:
            contagem.por_nivel[nivel] += 1
    return contagem


def ler_linhas(caminho: Path) -> Iterator[str]:
    # utf-8-sig descarta o BOM que alguns editores gravam no início do arquivo;
    # sem isso, a primeira linha nunca casaria com um nível.
    # errors="replace" evita que um byte inválido em uma mensagem interrompa
    # a contagem do arquivo inteiro.
    with caminho.open(encoding="utf-8-sig", errors="replace") as arquivo:
        yield from arquivo


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
    args = parser.parse_args(argv)

    try:
        contagem = contar_niveis(ler_linhas(args.caminho))
    except FileNotFoundError:
        return reportar_erro(f"arquivo não encontrado: {args.caminho}")
    except IsADirectoryError:
        return reportar_erro(f"o caminho é um diretório, não um arquivo: {args.caminho}")
    except PermissionError:
        return reportar_erro(f"sem permissão para ler o arquivo: {args.caminho}")

    print(formatar_relatorio(contagem))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

## 3. Como executar

Salve o código como `contar_niveis_log.py`. No Windows, troque `python3` por `python` nos comandos abaixo.

**Caso 1, o exemplo:**

```bash
printf 'INFO - usuário autenticado\nERROR - conexão perdida\nINFO - arquivo salvo\nWARNING - espaço reduzido\nERROR - banco indisponível\n' > exemplo.log
python3 contar_niveis_log.py exemplo.log
```

Saída:

```
INFO: 2
WARNING: 1
ERROR: 2
Linhas fora do formato: 0
```

**Caso 2, arquivo vazio:**

```bash
: > vazio.log
python3 contar_niveis_log.py vazio.log
```

Saída: os quatro valores com 0.

**Caso 3, arquivo inexistente:**

```bash
python3 contar_niveis_log.py nao_existe.log; echo "código de saída: $?"
```

Saída: `Erro: arquivo não encontrado: nao_existe.log` no stderr, seguido de `código de saída: 1`.

**Testar a contagem sem arquivo**, passando uma lista de linhas:

```python
from contar_niveis_log import contar_niveis

c = contar_niveis(["INFO - a", "ERROR - b", "info - minúsculo", "", "WARNING - c"])
assert c.por_nivel == {"INFO": 1, "WARNING": 1, "ERROR": 1}
assert c.fora_do_formato == 2
```

Rode esse trecho a partir da mesma pasta do script. Ele também funciona dentro de um teste do `pytest` ou do `unittest`.
