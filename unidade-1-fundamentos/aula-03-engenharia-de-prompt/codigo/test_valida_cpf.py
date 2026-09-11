import unittest

from valida_cpf import valida_cpf

CPFS_VALIDOS = (
    "529.982.247-25",
    "123.456.789-09",
    "111.444.777-35",
    "045.123.745-58",
)


class TestesDoPromptInicial(unittest.TestCase):
    def test_aceita_cpf_valido_formatado(self):
        self.assertTrue(valida_cpf("529.982.247-25"))

    def test_rejeita_primeiro_digito_verificador_errado(self):
        self.assertFalse(valida_cpf("529.982.247-26"))

    def test_rejeita_cpf_curto(self):
        self.assertFalse(valida_cpf("529.982.247-2"))

    def test_rejeita_texto_sem_digitos(self):
        self.assertFalse(valida_cpf("abcdefghijk"))


class TestesDoPromptRefinado(unittest.TestCase):
    def test_aceita_lista_de_cpfs_validos(self):
        for cpf in CPFS_VALIDOS:
            with self.subTest(cpf=cpf):
                self.assertTrue(valida_cpf(cpf))

    def test_aceita_cpf_valido_sem_mascara(self):
        self.assertTrue(valida_cpf("52998224725"))

    def test_aceita_mascara_alternativa(self):
        self.assertTrue(valida_cpf("529 982 247 25"))

    def test_rejeita_sequencias_de_digitos_repetidos(self):
        for digito in "0123456789":
            with self.subTest(cpf=digito * 11):
                self.assertFalse(valida_cpf(digito * 11))

    def test_rejeita_segundo_digito_verificador_errado(self):
        self.assertFalse(valida_cpf("529.982.247-24"))

    def test_rejeita_dez_digitos(self):
        self.assertFalse(valida_cpf("5299822472"))

    def test_rejeita_doze_digitos(self):
        self.assertFalse(valida_cpf("529982247250"))

    def test_rejeita_string_vazia(self):
        self.assertFalse(valida_cpf(""))

    def test_rejeita_none(self):
        self.assertFalse(valida_cpf(None))

    def test_rejeita_apenas_espacos(self):
        self.assertFalse(valida_cpf("           "))

    def test_rejeita_letra_no_meio_dos_digitos(self):
        self.assertFalse(valida_cpf("529.982.24A-25"))

    def test_nao_altera_a_entrada(self):
        entrada = "529.982.247-25"
        valida_cpf(entrada)
        self.assertEqual(entrada, "529.982.247-25")


if __name__ == "__main__":
    unittest.main(verbosity=2)
