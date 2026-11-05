import io
import json
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

import cep
from cep import (
    CepInvalidoError,
    CepNaoEncontradoError,
    Endereco,
    ViaCepError,
    consultar_cep,
    formatar_endereco,
    normalizar_cep,
)

RESPOSTA_BRASILIA = {
    "cep": "70040-010",
    "logradouro": "Quadra SBN Quadra 1",
    "complemento": "",
    "bairro": "Asa Norte",
    "localidade": "Brasília",
    "uf": "DF",
}
RESPOSTA_POCONE = {
    "cep": "78175-000",
    "logradouro": "",
    "bairro": "",
    "localidade": "Poconé",
    "uf": "MT",
}


def resposta_json(dados):
    return io.BytesIO(json.dumps(dados).encode("utf-8"))


class TestNormalizarCep(unittest.TestCase):
    def test_aceita_com_e_sem_hifen_e_espacos_nas_pontas(self):
        for entrada in ("70040010", "70040-010", " 70040-010 ", "70040010\n"):
            with self.subTest(entrada=entrada):
                self.assertEqual(normalizar_cep(entrada), "70040010")

    def test_recusa_formatos_invalidos(self):
        entradas = (
            "",
            "7004001O",
            "7004001",
            "700400100",
            "7004-0010",
            "70.040-010",
            "70040 010",
            "７００４００１０",
        )
        for entrada in entradas:
            with self.subTest(entrada=entrada):
                with self.assertRaises(CepInvalidoError):
                    normalizar_cep(entrada)


@patch("cep.urlopen")
class TestConsultarCep(unittest.TestCase):
    def test_cep_existente(self, urlopen):
        urlopen.return_value = resposta_json(RESPOSTA_BRASILIA)
        endereco = consultar_cep("70040-010")
        self.assertEqual(
            endereco, Endereco("Quadra SBN Quadra 1", "Asa Norte", "Brasília", "DF")
        )
        url = urlopen.call_args.args[0]
        self.assertEqual(url, "https://viacep.com.br/ws/70040010/json/")
        self.assertEqual(urlopen.call_args.kwargs["timeout"], cep.TIMEOUT_SEGUNDOS)

    def test_cep_invalido_nao_faz_requisicao(self, urlopen):
        with self.assertRaises(CepInvalidoError):
            consultar_cep("7004001O")
        urlopen.assert_not_called()

    def test_cep_inexistente_com_erro_em_texto(self, urlopen):
        urlopen.return_value = resposta_json({"erro": "true"})
        with self.assertRaises(CepNaoEncontradoError):
            consultar_cep("99999999")

    def test_cep_inexistente_com_erro_booleano(self, urlopen):
        urlopen.return_value = resposta_json({"erro": True})
        with self.assertRaises(CepNaoEncontradoError):
            consultar_cep("99999999")

    def test_cep_geral_de_cidade(self, urlopen):
        urlopen.return_value = resposta_json(RESPOSTA_POCONE)
        endereco = consultar_cep("78175000")
        self.assertEqual(endereco, Endereco("", "", "Poconé", "MT"))

    def test_falhas_de_rede_viram_viacep_error(self, urlopen):
        falhas = (
            HTTPError("https://viacep.com.br", 500, "erro interno", None, None),
            URLError("sem conexão"),
            TimeoutError("tempo esgotado na leitura"),
            ConnectionResetError("conexão reiniciada"),
        )
        for falha in falhas:
            with self.subTest(falha=type(falha).__name__):
                urlopen.side_effect = falha
                with self.assertRaises(ViaCepError):
                    consultar_cep("70040010")

    def test_resposta_que_nao_e_json(self, urlopen):
        urlopen.return_value = io.BytesIO(b"<html>manutencao</html>")
        with self.assertRaises(ViaCepError):
            consultar_cep("70040010")

    def test_resposta_sem_localidade(self, urlopen):
        incompleta = {k: v for k, v in RESPOSTA_BRASILIA.items() if k != "localidade"}
        urlopen.return_value = resposta_json(incompleta)
        with self.assertRaises(ViaCepError):
            consultar_cep("70040010")


class TestFormatarEndereco(unittest.TestCase):
    def test_endereco_completo(self):
        texto = formatar_endereco(Endereco("Quadra SBN Quadra 1", "Asa Norte", "Brasília", "DF"))
        self.assertEqual(
            texto,
            "Logradouro: Quadra SBN Quadra 1\nBairro: Asa Norte\nCidade: Brasília/DF",
        )

    def test_sem_logradouro_e_bairro(self):
        texto = formatar_endereco(Endereco("", "", "Poconé", "MT"))
        self.assertEqual(
            texto, "Logradouro e bairro não informados para este CEP.\nCidade: Poconé/MT"
        )
        self.assertNotIn("Logradouro: ", texto)

    def test_so_bairro_vazio(self):
        texto = formatar_endereco(Endereco("Rua A", "", "Cidade", "UF"))
        self.assertEqual(texto, "Logradouro: Rua A\nCidade: Cidade/UF")


if __name__ == "__main__":
    unittest.main()
