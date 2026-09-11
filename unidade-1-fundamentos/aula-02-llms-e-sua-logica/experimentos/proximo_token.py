import random
from collections import Counter, defaultdict

CORPUS = """
o codigo apresentou um erro de sintaxe
o codigo apresentou um erro de indentacao
o codigo apresentou um erro na linha vinte
o codigo apresentou um aviso de depreciacao
o codigo apresentou comportamento inesperado
o teste apresentou um erro de asercao
o teste passou sem nenhum aviso
"""

SEMENTE = 42
TEMPERATURAS = (0.2, 1.0, 2.0)
EXECUCOES = 5
TOKENS_GERADOS = 7

Distribuicao = list[tuple[str, float]]


def tokenizar(texto: str) -> list[str]:
    return texto.split()


def treinar_bigrama(tokens: list[str]) -> dict[str, Counter]:
    contagens: dict[str, Counter] = defaultdict(Counter)
    for anterior, seguinte in zip(tokens, tokens[1:]):
        contagens[anterior][seguinte] += 1
    return contagens


def distribuir(contagens: dict[str, Counter], contexto: str) -> Distribuicao:
    seguintes = contagens.get(contexto)
    if not seguintes:
        return []
    total = sum(seguintes.values())
    itens = [(token, ocorrencias / total) for token, ocorrencias in seguintes.items()]
    return sorted(itens, key=lambda item: item[1], reverse=True)


def aplicar_temperatura(itens: Distribuicao, temperatura: float) -> Distribuicao:
    if temperatura <= 0:
        mais_provavel = max(itens, key=lambda item: item[1])[0]
        return [(token, 1.0 if token == mais_provavel else 0.0) for token, _ in itens]
    ajustados = [(token, probabilidade ** (1 / temperatura)) for token, probabilidade in itens]
    total = sum(probabilidade for _, probabilidade in ajustados)
    return [(token, probabilidade / total) for token, probabilidade in ajustados]


def amostrar(itens: Distribuicao, sorteador: random.Random) -> str:
    limite = sorteador.random()
    acumulado = 0.0
    for token, probabilidade in itens:
        acumulado += probabilidade
        if limite <= acumulado:
            return token
    return itens[-1][0]


def gerar(
    contagens: dict[str, Counter],
    inicio: str,
    quantidade: int,
    temperatura: float,
    sorteador: random.Random,
) -> str:
    sequencia = [inicio]
    atual = inicio
    for _ in range(quantidade):
        itens = distribuir(contagens, atual)
        if not itens:
            break
        atual = amostrar(aplicar_temperatura(itens, temperatura), sorteador)
        sequencia.append(atual)
    return " ".join(sequencia)


def secao(titulo: str) -> None:
    print()
    print(titulo)
    print("-" * len(titulo))


def exibir_distribuicao(itens: Distribuicao) -> None:
    for token, probabilidade in itens:
        print(f"   {token:<16} {probabilidade:6.1%}")


def exibir_efeito_da_temperatura(itens: Distribuicao) -> None:
    colunas = {t: dict(aplicar_temperatura(itens, t)) for t in TEMPERATURAS}
    cabecalho = "   " + f"{'token':<16}" + "".join(f"{f'T={t}':>8}" for t in TEMPERATURAS)
    print(cabecalho)
    for token, _ in itens:
        valores = "".join(f"{colunas[t][token]:8.1%}" for t in TEMPERATURAS)
        print(f"   {token:<16}{valores}")


def exibir_execucoes(contagens: dict[str, Counter], temperatura: float) -> None:
    sorteador = random.Random(SEMENTE)
    for numero in range(1, EXECUCOES + 1):
        texto = gerar(contagens, "o", TOKENS_GERADOS, temperatura, sorteador)
        print(f"   execucao {numero}: {texto}")


def main() -> None:
    tokens = tokenizar(CORPUS)
    contagens = treinar_bigrama(tokens)

    print("Tokens no corpus:", len(tokens))
    print("Tokens distintos:", len(set(tokens)))

    contexto = "um"
    itens = distribuir(contagens, contexto)

    secao(f'1. Distribuicao do proximo token depois de "{contexto}"')
    exibir_distribuicao(itens)

    secao(f'2. Efeito da temperatura sobre o contexto "{contexto}"')
    exibir_efeito_da_temperatura(itens)

    for temperatura in (1.0, 0.2):
        secao(f"{3 if temperatura == 1.0 else 4}. {EXECUCOES} execucoes do mesmo prompt com temperatura {temperatura}")
        exibir_execucoes(contagens, temperatura)

    secao("5. Contexto ausente do corpus")
    for ausente in ("banco", "kubernetes"):
        resultado = distribuir(contagens, ausente) or "sem continuacao possivel"
        print(f'   contexto "{ausente}": {resultado}')

    secao("6. Por que o modelo nao sabe contar letras")
    palavra = "indentacao"
    print(f'   a palavra "{palavra}" e um unico token para este modelo')
    print(f"   o modelo enxerga 1 unidade, nao {len(palavra)} caracteres")


if __name__ == "__main__":
    main()
