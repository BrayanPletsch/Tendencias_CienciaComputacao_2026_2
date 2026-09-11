import sqlite3

USUARIOS_INICIAIS = (
    (1, "ana", 1500.0),
    (2, "bruno", 320.5),
    (3, "carla", 89.9),
)


def preparar_banco() -> sqlite3.Connection:
    conexao = sqlite3.connect(":memory:")
    conexao.execute("CREATE TABLE usuarios (id INTEGER, nome TEXT, saldo REAL)")
    conexao.execute("CREATE TABLE acessos (nome TEXT)")
    conexao.executemany("INSERT INTO usuarios VALUES (?, ?, ?)", USUARIOS_INICIAIS)
    conexao.commit()
    return conexao


def buscar_usuario(conexao, nome):
    cursor = conexao.cursor()
    cursor.execute("SELECT id, nome, saldo FROM usuarios WHERE nome = '" + nome + "'")
    return cursor.fetchall()


def media_saldos(usuarios):
    total = 0
    for usuario in usuarios:
        total += usuario[2]
    return total / len(usuarios)


def registrar_acesso(conexao, nome):
    try:
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO acessos VALUES (?)", (nome,))
        conexao.commit()
        return True
    except Exception:
        return False


def demonstrar_caso_normal(conexao: sqlite3.Connection) -> None:
    print("Caso normal")
    encontrados = buscar_usuario(conexao, "ana")
    print("  buscar_usuario('ana'):", encontrados)
    print("  media_saldos:", media_saldos(encontrados))


def demonstrar_injecao_de_sql(conexao: sqlite3.Connection) -> None:
    print()
    print("D1: injecao de SQL")
    ataque = "x' OR '1'='1"
    vazados = buscar_usuario(conexao, ataque)
    print(f"  buscar_usuario({ataque!r}) devolveu {len(vazados)} registros")
    for registro in vazados:
        print("   ", registro)


def demonstrar_divisao_por_zero(conexao: sqlite3.Connection) -> None:
    print()
    print("D2: divisao por zero")
    vazio = buscar_usuario(conexao, "nao_existe")
    print(f"  buscar_usuario('nao_existe') devolveu {len(vazio)} registros")
    try:
        media_saldos(vazio)
    except ZeroDivisionError as erro:
        print(f"  media_saldos(lista vazia) levantou {type(erro).__name__}: {erro}")


def demonstrar_except_generico(conexao: sqlite3.Connection) -> None:
    print()
    print("D3: except generico esconde o erro")
    conexao.execute("DROP TABLE acessos")
    resultado = registrar_acesso(conexao, "ana")
    print(f"  registrar_acesso apos remover a tabela devolveu {resultado}")
    print("  nenhuma mensagem de erro chegou a quem chamou a funcao")


def main() -> None:
    conexao = preparar_banco()
    try:
        demonstrar_caso_normal(conexao)
        demonstrar_injecao_de_sql(conexao)
        demonstrar_divisao_por_zero(conexao)
        demonstrar_except_generico(conexao)
    finally:
        conexao.close()


if __name__ == "__main__":
    main()
