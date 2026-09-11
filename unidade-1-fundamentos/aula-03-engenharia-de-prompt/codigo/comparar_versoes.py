from valida_cpf import valida_cpf, valida_cpf_v1

INICIAL = "prompt inicial"
REFINADO = "prompt refinado"

CASOS = (
    ("529.982.247-25", True, INICIAL),
    ("529.982.247-26", False, INICIAL),
    ("529.982.247-2", False, INICIAL),
    ("abcdefghijk", False, INICIAL),
    ("123.456.789-09", True, REFINADO),
    ("111.444.777-35", True, REFINADO),
    ("045.123.745-58", True, REFINADO),
    ("52998224725", True, REFINADO),
    ("529 982 247 25", True, REFINADO),
    ("00000000000", False, REFINADO),
    ("11111111111", False, REFINADO),
    ("22222222222", False, REFINADO),
    ("99999999999", False, REFINADO),
    ("529.982.247-24", False, REFINADO),
    ("5299822472", False, REFINADO),
    ("529982247250", False, REFINADO),
    ("", False, REFINADO),
    (None, False, REFINADO),
    ("           ", False, REFINADO),
    ("529.982.24A-25", False, REFINADO),
)

VERSOES = (
    ("v1 sem a guarda", valida_cpf_v1),
    ("final", valida_cpf),
)


def formatar_resultado(correto: bool) -> str:
    return "ok" if correto else "FALHA"


def main() -> None:
    largura = max(len(repr(entrada)) for entrada, _, _ in CASOS)
    cabecalho = f"{'entrada':<{largura}}  {'esperado':>8}  {'v1':>6}  {'final':>6}  origem"
    print(cabecalho)
    print("-" * len(cabecalho))

    falhas = {nome: [] for nome, _ in VERSOES}

    for entrada, esperado, origem in CASOS:
        acertos = {}
        for nome, validar in VERSOES:
            acertou = validar(entrada) == esperado
            acertos[nome] = acertou
            if not acertou:
                falhas[nome].append((entrada, origem))
        print(
            f"{entrada!r:<{largura}}  {str(esperado):>8}  "
            f"{formatar_resultado(acertos['v1 sem a guarda']):>6}  "
            f"{formatar_resultado(acertos['final']):>6}  {origem}"
        )

    print()
    print(f"total de casos: {len(CASOS)}")
    for nome, _ in VERSOES:
        print(f"{nome}: {len(falhas[nome])} falha(s)")
        for entrada, origem in falhas[nome]:
            print(f"    {entrada!r} (caso vindo do {origem})")


if __name__ == "__main__":
    main()
