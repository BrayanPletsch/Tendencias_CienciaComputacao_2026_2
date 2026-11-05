import contextlib
import io
import tempfile
import unittest
from pathlib import Path

from contar_niveis_log import contar_niveis, formatar_relatorio, main

PASTA_LOGS = Path(__file__).parent / "logs"


def totais(contagem):
    return (
        contagem.por_nivel["INFO"],
        contagem.por_nivel["WARNING"],
        contagem.por_nivel["ERROR"],
        contagem.fora_do_formato,
    )


def executar_main(*argumentos):
    saida, erro = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(saida), contextlib.redirect_stderr(erro):
        codigo = main(list(argumentos))
    return codigo, saida.getvalue(), erro.getvalue()


class TestContagem(unittest.TestCase):
    def test_exemplo_do_enunciado(self):
        linhas = [
            "INFO - usuário autenticado\n",
            "ERROR - conexão perdida\n",
            "INFO - arquivo salvo\n",
            "WARNING - espaço reduzido\n",
            "ERROR - banco indisponível\n",
        ]
        self.assertEqual(totais(contar_niveis(linhas)), (2, 1, 2, 0))

    def test_sem_linhas(self):
        self.assertEqual(totais(contar_niveis([])), (0, 0, 0, 0))

    def test_linhas_em_branco_nao_contam(self):
        linhas = ["INFO - a\n", "\n", "", "   \n", "\t\n", "lixo\n"]
        self.assertEqual(totais(contar_niveis(linhas)), (1, 0, 0, 1))

    def test_nivel_precisa_estar_no_inicio_em_maiusculas_e_com_separador(self):
        fora = [
            "INFORMATION - outro nível\n",
            "info - minúsculo\n",
            "  INFO - espaço antes\n",
            "ERROR: sem o traço\n",
            "ERROR-sem espaços\n",
            "DEBUG - nível não contado\n",
        ]
        self.assertEqual(totais(contar_niveis(fora)), (0, 0, 0, len(fora)))

    def test_nivel_citado_na_mensagem_conta_uma_vez_so(self):
        linhas = ["INFO - a mensagem fala de ERROR e de WARNING\n"]
        self.assertEqual(totais(contar_niveis(linhas)), (1, 0, 0, 0))

    def test_mensagem_vazia_ainda_conta(self):
        self.assertEqual(totais(contar_niveis(["ERROR - \n"])), (0, 0, 1, 0))

    def test_relatorio_na_ordem_do_enunciado(self):
        texto = formatar_relatorio(contar_niveis(["ERROR - x", "INFO - y"]))
        self.assertEqual(
            texto, "INFO: 1\nWARNING: 0\nERROR: 1\nLinhas fora do formato: 0"
        )


class TestArquivos(unittest.TestCase):
    def test_arquivos_de_exemplo(self):
        esperado = {
            "exemplo.log": "INFO: 2\nWARNING: 1\nERROR: 2\nLinhas fora do formato: 0\n",
            "vazio.log": "INFO: 0\nWARNING: 0\nERROR: 0\nLinhas fora do formato: 0\n",
            "misturado.log": "INFO: 2\nWARNING: 1\nERROR: 2\nLinhas fora do formato: 5\n",
        }
        for nome, saida_esperada in esperado.items():
            with self.subTest(arquivo=nome):
                codigo, saida, _ = executar_main(str(PASTA_LOGS / nome))
                self.assertEqual(codigo, 0)
                self.assertEqual(saida, saida_esperada)

    def test_arquivo_inexistente(self):
        codigo, saida, erro = executar_main(str(PASTA_LOGS / "nao_existe.log"))
        self.assertEqual(codigo, 1)
        self.assertEqual(saida, "")
        self.assertIn("arquivo não encontrado", erro)

    def test_diretorio_no_lugar_do_arquivo(self):
        codigo, _, erro = executar_main(str(PASTA_LOGS))
        self.assertEqual(codigo, 1)
        self.assertIn("Erro:", erro)

    def test_arquivo_com_bom_e_outro_com_latin1(self):
        with tempfile.TemporaryDirectory() as pasta:
            com_bom = Path(pasta, "bom.log")
            com_bom.write_bytes("﻿INFO - com BOM\nERROR - x\n".encode("utf-8"))
            latin1 = Path(pasta, "latin1.log")
            latin1.write_bytes("WARNING - espaço reduzido\nINFO - usuário\n".encode("latin-1"))
            for caminho, saida_esperada in (
                (com_bom, "INFO: 1\nWARNING: 0\nERROR: 1\nLinhas fora do formato: 0\n"),
                (latin1, "INFO: 1\nWARNING: 1\nERROR: 0\nLinhas fora do formato: 0\n"),
            ):
                with self.subTest(arquivo=caminho.name):
                    codigo, saida, _ = executar_main(str(caminho))
                    self.assertEqual(codigo, 0)
                    self.assertEqual(saida, saida_esperada)

    def test_arquivo_nao_e_alterado(self):
        caminho = PASTA_LOGS / "misturado.log"
        antes = (caminho.read_bytes(), caminho.stat().st_mtime_ns)
        executar_main(str(caminho))
        depois = (caminho.read_bytes(), caminho.stat().st_mtime_ns)
        self.assertEqual(antes, depois)


if __name__ == "__main__":
    unittest.main()
