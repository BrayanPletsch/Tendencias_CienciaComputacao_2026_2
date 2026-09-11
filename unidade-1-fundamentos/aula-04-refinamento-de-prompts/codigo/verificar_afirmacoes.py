import random
import sys
import timeit

TAMANHOS = (1_000, 10_000, 100_000, 1_000_000)
REPETICOES = 200_000
SEMENTE = 7


def montar_dicionario(tamanho: int) -> dict[str, int]:
    return {f"chave-{indice}": indice for indice in range(tamanho)}


def medir_busca_em_dicionario(tamanho: int) -> float:
    dados = montar_dicionario(tamanho)
    sorteador = random.Random(SEMENTE)
    chaves = [f"chave-{sorteador.randrange(tamanho)}" for _ in range(1000)]
    tempo = timeit.timeit(
        lambda: [dados[chave] for chave in chaves],
        number=REPETICOES // 1000,
    )
    return tempo / (REPETICOES // 1000 * len(chaves)) * 1e9


def medir_busca_em_lista(tamanho: int) -> float:
    dados = [f"chave-{indice}" for indice in range(tamanho)]
    alvo = f"chave-{tamanho - 1}"
    tempo = timeit.timeit(lambda: alvo in dados, number=100)
    return tempo / 100 * 1e9


def afirmacao_1_custo_constante() -> None:
    print("Afirmacao 1: a busca em dict nao depende do tamanho da estrutura")
    print(f"   {'tamanho':>10}  {'ns por busca':>14}")
    for tamanho in TAMANHOS:
        print(f"   {tamanho:>10,}  {medir_busca_em_dicionario(tamanho):>14.1f}")


def afirmacao_2_dict_versus_lista() -> None:
    print()
    print("Afirmacao 2: em lista o custo cresce com o tamanho")
    print(f"   {'tamanho':>10}  {'dict (ns)':>12}  {'lista (ns)':>14}")
    for tamanho in TAMANHOS:
        print(
            f"   {tamanho:>10,}  {medir_busca_em_dicionario(tamanho):>12.1f}  "
            f"{medir_busca_em_lista(tamanho):>14.1f}"
        )


def afirmacao_3_ordem_de_insercao() -> None:
    print()
    print("Afirmacao 3: o dict do Python nao preserva a ordem de insercao")
    inseridas = ["zulu", "alfa", "mike", "bravo"]
    dados = {chave: posicao for posicao, chave in enumerate(inseridas)}
    print(f"   versao do Python: {sys.version.split()[0]}")
    print(f"   ordem de insercao: {inseridas}")
    print(f"   ordem ao iterar:   {list(dados)}")
    print(f"   preserva a ordem:  {list(dados) == inseridas}")


def afirmacao_4_colisao() -> None:
    print()
    print("Afirmacao 4: chaves diferentes nunca produzem o mesmo hash")
    print(f"   hash(1)    = {hash(1)}")
    print(f"   hash(1.0)  = {hash(1.0)}")
    print(f"   hash(True) = {hash(True)}")
    print(f"   os tres sao iguais: {hash(1) == hash(1.0) == hash(True)}")
    dados = {1: "inteiro"}
    dados[1.0] = "float"
    dados[True] = "booleano"
    print(f"   dict apos inserir as tres chaves: {dados}")
    print(f"   quantidade de itens: {len(dados)}")


def main() -> None:
    afirmacao_1_custo_constante()
    afirmacao_2_dict_versus_lista()
    afirmacao_3_ordem_de_insercao()
    afirmacao_4_colisao()


if __name__ == "__main__":
    main()
