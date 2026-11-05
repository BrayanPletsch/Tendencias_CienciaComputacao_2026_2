import json
from urllib.request import urlopen


def buscar_cep(cep):
    url = f"https://viacep.com.br/ws/{cep}/json/"
    resposta = urlopen(url)
    dados = json.loads(resposta.read())
    print("Logradouro:", dados["logradouro"])
    print("Bairro:", dados["bairro"])
    print("Cidade:", dados["localidade"] + "/" + dados["uf"])


cep = input("Digite o CEP: ")
buscar_cep(cep)
