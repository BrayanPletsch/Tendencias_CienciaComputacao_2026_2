import logging
import sqlite3
from contextlib import closing
from dataclasses import dataclass
from decimal import Decimal

logger = logging.getLogger(__name__)

USUARIOS_INICIAIS = (
    (1, "ana", "1500.00"),
    (2, "bruno", "320.50"),
    (3, "carla", "89.90"),
)


@dataclass(frozen=True, slots=True)
class Usuario:
    id: int
    nome: str
    saldo: Decimal


def preparar_banco() -> sqlite3.Connection:
    conexao = sqlite3.connect(":memory:")
    with conexao:
        conexao.execute("CREATE TABLE usuarios (id INTEGER, nome TEXT, saldo TEXT)")
        conexao.execute("CREATE TABLE acessos (nome TEXT)")
        conexao.executemany("INSERT INTO usuarios VALUES (?, ?, ?)", USUARIOS_INICIAIS)
    return conexao


def buscar_usuario(conexao: sqlite3.Connection, nome: str) -> Usuario | None:
    consulta = "SELECT id, nome, saldo FROM usuarios WHERE nome = ? LIMIT 1"
    with closing(conexao.cursor()) as cursor:
        cursor.execute(consulta, (nome,))
        linha = cursor.fetchone()
    if linha is None:
        return None
    identificador, nome_encontrado, saldo = linha
    return Usuario(id=identificador, nome=nome_encontrado, saldo=Decimal(saldo))


def buscar_usuarios(conexao: sqlite3.Connection, nomes: tuple[str, ...]) -> list[Usuario]:
    if not nomes:
        return []
    marcadores = ", ".join("?" for _ in nomes)
    consulta = f"SELECT id, nome, saldo FROM usuarios WHERE nome IN ({marcadores})"
    with closing(conexao.cursor()) as cursor:
        cursor.execute(consulta, nomes)
        linhas = cursor.fetchall()
    return [Usuario(id=i, nome=n, saldo=Decimal(s)) for i, n, s in linhas]


def media_saldos(usuarios: list[Usuario]) -> Decimal | None:
    if not usuarios:
        return None
    total = sum((usuario.saldo for usuario in usuarios), start=Decimal("0"))
    return total / len(usuarios)


def registrar_acesso(conexao: sqlite3.Connection, nome: str) -> bool:
    try:
        with conexao:
            conexao.execute("INSERT INTO acessos VALUES (?)", (nome,))
    except sqlite3.DatabaseError:
        logger.exception("falha ao registrar acesso de %s", nome)
        return False
    return True


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    conexao = preparar_banco()
    try:
        print("Consulta parametrizada")
        print("  buscar_usuario('ana'):", buscar_usuario(conexao, "ana"))

        print()
        print("D1 corrigido: a mesma entrada maliciosa nao vaza dados")
        ataque = "x' OR '1'='1"
        print(f"  buscar_usuario({ataque!r}):", buscar_usuario(conexao, ataque))

        print()
        print("D2 corrigido: lista vazia nao levanta excecao")
        print("  media_saldos([]):", media_saldos([]))
        print("  media_saldos(todos):", media_saldos(buscar_usuarios(conexao, ("ana", "bruno", "carla"))))

        print()
        print("D3 corrigido: a falha e registrada antes de virar False")
        conexao.execute("DROP TABLE acessos")
        print("  registrar_acesso('ana'):", registrar_acesso(conexao, "ana"))
    finally:
        conexao.close()


if __name__ == "__main__":
    main()
