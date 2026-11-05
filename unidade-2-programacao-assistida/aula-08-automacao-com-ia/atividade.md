# Programação Assistida e Automação com IA

Disciplina: Tendências em Ciência da Computação

Unidade 2, aula 08 (24/09)

Valor: 0,5 ponto

## Identificação

| Campo | Informação |
|---|---|
| Estudante | Brayan A. Pletsch |
| RGM | 38473585 |
| Turma | Engenharia de Software, N1, noturno (disciplina optativa) |
| Data da execução | 05/11/2026 |
| Ferramenta de IA | Claude Opus 5.5 (Anthropic), pelo chat |
| Problema escolhido | Opção C, análise de logs |
| Ambiente | Python 3.10, só biblioteca padrão |

Escrevi as seções 1 a 4 e os arquivos de log de teste antes de mandar qualquer prompt,
como a Etapa 1 do enunciado pede.

## 1. Problema

Contar quantas linhas de cada nível (INFO, WARNING e ERROR) existem em um arquivo de log.
Fazer isso à mão é procurar no editor nível por nível, e com arquivo grande eu perco a
conta.

## 2. Entrada

O caminho de um arquivo de texto, passado na linha de comando. Cada linha segue o formato
`NIVEL - mensagem`, como no exemplo do enunciado:

```text
INFO - usuário autenticado
ERROR - conexão perdida
INFO - arquivo salvo
WARNING - espaço reduzido
ERROR - banco indisponível
```

## 3. Processamento

Ler o arquivo linha por linha, sem carregar tudo na memória, e decidir o nível de cada
linha. A regra que defini: a linha conta para um nível se começar exatamente com `INFO`,
`WARNING` ou `ERROR` seguido de `" - "`. O que não seguir isso conta como "fora do
formato". O script só lê o arquivo e não pode alterar nada.

## 4. Saída esperada

```text
INFO: 2
WARNING: 1
ERROR: 2
Linhas fora do formato: 0
```

Para arquivo inexistente: mensagem de erro e código de saída diferente de zero.

Antes de ver qualquer código, montei três arquivos em [codigo/logs/](codigo/logs/):
`exemplo.log` (o do enunciado), `vazio.log` e `misturado.log`. O último tem os casos que
eu imaginei que poderiam enganar um contador: `INFORMATION` (começa com INFO), `info` em
minúsculo, `ERROR:` sem o traço, uma linha em branco, `INFO` com espaços antes, uma linha
INFO cuja mensagem cita a palavra ERROR, um `ERROR - ` com mensagem vazia e um nível
`DEBUG`. Pela minha regra, o resultado esperado era INFO 2, WARNING 1, ERROR 2 e 5 linhas
fora do formato, com a linha em branco ignorada.

## 5. Prompt utilizado

Arquivo: [prompts/01-geracao.md](prompts/01-geracao.md).

Segui a estrutura do enunciado (papel, contexto, problema, entrada, saída esperada,
linguagem, restrições, critérios de qualidade e casos de teste). Duas restrições eu
acrescentei por conta própria. A primeira foi separar a contagem da leitura do arquivo,
para poder testar a contagem com uma lista de linhas. A segunda foi sobre comentários:
só onde explicam uma decisão que não é óbvia, sem repetir o código e sem número de issue
ou ticket.

A resposta completa está em [prompts/01-resposta-da-ia.md](prompts/01-resposta-da-ia.md).

## 6. Código inicial

Gerado pela IA, sem alteração: [codigo/contar_niveis_v1.py](codigo/contar_niveis_v1.py).

```python
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
```

O trecho acima é o núcleo. O arquivo completo tem ainda `formatar_relatorio`,
`reportar_erro` e um `main` com `argparse` que trata `FileNotFoundError`,
`IsADirectoryError` e `PermissionError`.

## 7. Análise crítica

Passei pela lista da Etapa 3 antes de executar:

| Pergunta | Resposta |
|---|---|
| Eu compreendo o código? | Sim. O único ponto que precisei pensar foi o `yield from` dentro do `with`. |
| O código atende ao problema definido? | Atende ao que escrevi no prompt. |
| Há bibliotecas que eu não conheço? | Não. Tudo é biblioteca padrão: `argparse`, `dataclasses`, `pathlib`. |
| Há operações que podem apagar ou sobrescrever dados? | Não. O arquivo é aberto só para leitura (modo padrão `r`). |
| O código utiliza dados sensíveis? | Não. Os logs são fictícios. |
| Há tratamento de erros? | Sim, para arquivo inexistente, diretório e falta de permissão. |
| Consigo explicar cada função? | Sim. |
| Existem casos que o código não considera? | Achei que não. Os testes mostraram um (seção 9). |

Duas escolhas da IA eu não tinha pedido e achei boas. Abrir com `utf-8-sig` faz o BOM que
alguns editores do Windows gravam não estragar a primeira linha. E `errors="replace"`
evita que um arquivo salvo em outra codificação derrube a contagem inteira. Eu tinha
planejado um teste de codificação justamente porque uso Windows, e esse problema já veio
resolvido.

Achei exagerado usar dataclass e `argparse` para um script desse tamanho. Na revisão
(seção 10) a própria IA comentou os dois pontos e explicou por que manteria. Concordei
com o `argparse`, porque ele dá `--help` e mensagem de uso sem eu escrever nada.

## 8. Casos de teste

Rodei a primeira versão com os três arquivos de log e com um caminho que não existe.

### Teste 1: caso normal

```text
python contar_niveis_v1.py logs/exemplo.log
→ INFO: 2 / WARNING: 1 / ERROR: 2 / Linhas fora do formato: 0
```

Resultado igual ao esperado.

### Teste 2: caso limite

```text
python contar_niveis_v1.py logs/vazio.log
→ tudo zero

python contar_niveis_v1.py logs/misturado.log
→ INFO: 2 / WARNING: 1 / ERROR: 2 / Linhas fora do formato: 6
```

O vazio deu certo. No misturado eu esperava 5 linhas fora do formato e vieram 6. A
diferença é a linha em branco.

Também testei, com arquivos temporários: um arquivo com BOM (contou certo), um arquivo
sem quebra de linha no final (contou certo) e um com fim de linha do Windows, `\r\n`
(contou certo).

### Teste 3: caso de erro

```text
python contar_niveis_v1.py logs/nao_existe.log
→ Erro: arquivo não encontrado: logs/nao_existe.log   (saída 1)

python contar_niveis_v1.py logs
→ Erro: o caminho é um diretório, não um arquivo: logs   (saída 1)

python contar_niveis_v1.py
→ mensagem de uso do argparse   (saída 2)
```

## 9. Problemas encontrados

O primeiro problema foi meu. A IA contou a linha em branco como "fora do formato", e
fez isso porque era o que estava escrito no prompt: "O resto não entra em nenhum nível e
aparece na última linha da saída." Ela até avisou na estratégia da resposta que linhas em
branco iam contar como fora do formato. Eu li e não prestei atenção. Só percebi quando o
`misturado.log` deu 6 em vez de 5. Linha em branco não é ocorrência de log, então decidi
ignorá-la e acrescentei duas linhas no começo do laço de `contar_niveis`:

```python
if not linha.strip():
    continue
```

Os outros problemas apareceram na revisão da IA (seção 10) e eu confirmei rodando:

- Com `logs/exemplo.log/x` a primeira versão terminava com traceback de
  `NotADirectoryError`. Com um nome de arquivo de 300 caracteres, traceback de
  `OSError: File name too long`. Os dois casos escapavam dos três `except`.
- `ler_linhas` é um gerador, e o `open` só roda quando a contagem começa a percorrer as
  linhas. Confirmei criando o gerador com um arquivo inexistente: nenhum erro na criação,
  `FileNotFoundError` só no primeiro `next()`. Hoje funciona porque o `try` envolve a
  chamada inteira, mas uma mudança inocente no `main` tiraria a abertura de dentro do
  `try`.

E um problema pequeno que deixei como está: a mensagem de uso do `argparse` sai em
inglês ("the following arguments are required").

## 10. Prompt de refatoração

Arquivo: [prompts/02-refatoracao.md](prompts/02-refatoracao.md). É o prompt do enunciado,
com três acréscimos: avisei da minha mudança nas linhas em branco e pedi para mantê-la,
repeti a regra dos comentários e pedi que a IA dissesse se alguma parte estava mais
complicada do que o problema pede.

Resposta: [prompts/02-resposta-da-ia.md](prompts/02-resposta-da-ia.md). A IA propôs três
mudanças:

1. trocar o gerador `ler_linhas` por uma função `abrir_log` que só abre o arquivo, com o
   `with` dentro do `try` do `main`;
2. acrescentar um `except OSError` no fim, para os erros de sistema que ainda davam
   traceback;
3. guardar `caminho` direto em vez de `args.caminho`.

Sobre o que estava complicado demais, defendeu a dataclass (com `Counter`, o "fora do
formato" viraria uma chave artificial) e o `argparse`. Também sugeriu um teste para linhas
só com espaços ou tabulação, que o `strip()` trata como em branco. Aceitei a sugestão e
o teste está na suíte.

## 11. Código refatorado

[codigo/contar_niveis_log.py](codigo/contar_niveis_log.py), aceito do jeito que a IA
mandou. As partes que mudaram:

```python
def abrir_log(caminho: Path) -> TextIO:
    # utf-8-sig descarta o BOM que alguns editores gravam no início do arquivo;
    # sem isso, a primeira linha nunca casaria com um nível.
    # errors="replace" evita que um byte inválido em uma mensagem interrompa
    # a contagem do arquivo inteiro.
    return caminho.open(encoding="utf-8-sig", errors="replace")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Conta as linhas de cada nível em um arquivo de log."
    )
    parser.add_argument("caminho", type=Path, help="arquivo .log a ser lido")
    caminho = parser.parse_args(argv).caminho

    try:
        with abrir_log(caminho) as arquivo:
            contagem = contar_niveis(arquivo)
    except FileNotFoundError:
        return reportar_erro(f"arquivo não encontrado: {caminho}")
    except IsADirectoryError:
        return reportar_erro(f"o caminho é um diretório, não um arquivo: {caminho}")
    except PermissionError:
        return reportar_erro(f"sem permissão para ler o arquivo: {caminho}")
    except OSError as erro:
        return reportar_erro(f"falha ao ler o arquivo ({erro.strerror}): {caminho}")

    print(formatar_relatorio(contagem))
    return 0
```

Conferi se o `except OSError` contrariava a minha restrição de não capturar exceção
genérica. Não contraria: `OSError` só pega falhas de sistema e de entrada e saída, e um
`ValueError` ou erro de lógica continuam aparecendo. Com ele, os dois casos que davam
traceback viraram mensagem:

```text
Erro: falha ao ler o arquivo (Not a directory): logs/exemplo.log/x
Erro: falha ao ler o arquivo (File name too long): aaaa...a.log
```

O texto entre parênteses vem do sistema operacional e fica em inglês. Achei aceitável para
um caso que quase não acontece.

### Testes da versão final

Escrevi a suíte em [codigo/test_contar_niveis_log.py](codigo/test_contar_niveis_log.py)
depois da refatoração. São doze testes: o exemplo do enunciado, lista vazia, linhas em
branco e só com espaços, linhas fora do formato (as cinco do `misturado.log` e mais
`ERROR-sem espaços`), nível citado no meio da mensagem, mensagem vazia, ordem da saída, os três arquivos de exemplo
pela linha de comando, arquivo inexistente, diretório, arquivo com BOM, arquivo salvo em
Latin-1 e a garantia de que o arquivo lido não muda (conteúdo e data de modificação).

```
Ran 12 tests in 0.007s

OK
```

Para ver se a suíte pegaria o problema da linha em branco, troquei por um momento o import
para a primeira versão. Falharam exatamente os dois testes que envolvem linha em branco.

O script [codigo/comparar_versoes.py](codigo/comparar_versoes.py) conta os três logs com as
duas versões ([saída](codigo/saida-comparacao.txt)):

```text
misturado.log
  primeira versão (IA)   INFO 2, WARNING 1, ERROR 2, fora do formato 6
  versão final           INFO 2, WARNING 1, ERROR 2, fora do formato 5
```

Nos outros dois arquivos as versões dão o mesmo resultado.

## 12. Comparação

Notas de 1 a 5, dadas por mim.

| Critério | Versão inicial | Versão refatorada |
|---|---:|---:|
| Funcionamento correto | 4 | 5 |
| Clareza | 4 | 5 |
| Organização | 5 | 5 |
| Legibilidade | 4 | 5 |
| Tratamento de erros | 3 | 4 |
| Facilidade de manutenção | 4 | 5 |

A inicial perdeu ponto em funcionamento pela linha em branco, mesmo sendo culpa da minha
especificação, porque o que importa é o comportamento que eu queria. Em clareza e
manutenção perdeu pelo gerador, que esconde onde o arquivo é aberto. O tratamento de
erros da refatorada não levou 5 por causa das mensagens metade em português, metade em
inglês.

## 13. Reflexão

Em qual etapa a IA foi mais útil? Na revisão. Gerar o contador era a parte fácil e eu
faria algo parecido sozinho. Já o problema do gerador e os `OSError` que escapavam eu não
tinha visto, e foi a revisão que mostrou.

Qual parte exigiu mais raciocínio humano? Decidir o que conta como linha válida e montar o
`misturado.log` antes de ver o código. Foi esse arquivo que mostrou o problema da linha em
branco.

A primeira solução funcionou? Funcionou nos três casos que coloquei no prompt. Ela só não
fez o que eu queria com a linha em branco, porque eu não disse o que queria.

O que mudou após a refatoração? O arquivo passou a ser aberto num `with` visível dentro do
`try`, todo erro de sistema virou mensagem e `args.caminho` virou `caminho`. Nos casos
que eu já testava, a saída ficou a mesma.

Consigo explicar o programa sem consultar a resposta da IA? Sim. O `main` lê o caminho,
abre o arquivo para leitura e passa o arquivo, que é iterável linha a linha, para
`contar_niveis`. Ela pula linha em branco e pergunta a `identificar_nivel` qual nível a
linha tem. Essa função testa o início da linha contra cada nível da tupla mais o
separador e devolve o nível ou `None`. No fim, `formatar_relatorio` monta o texto na ordem
da tupla.

Qual foi o principal risco? Aceitar minha própria especificação como completa. A IA fez
exatamente o que eu escrevi. Se eu não tivesse criado o arquivo misturado, teria entregue
um contador que infla o "fora do formato" toda vez que o log tiver linha em branco, com
todos os testes do prompt passando. Outro ponto que anoto: o `errors="replace"` é bom
aqui, mas em outro contexto ele esconderia um arquivo corrompido sem avisar ninguém.

## 14. Take Away

Programar com IA não significa deixar a IA programar por mim. Significa continuar
responsável por dizer o que o programa deve fazer de um jeito que dê para testar, e por
conferir se o que voltou faz isso mesmo.

Cinco regras que eu sigo a partir desta atividade:

1. Escrever os casos de teste, com o resultado esperado, antes de ver o código gerado.
2. Ler a resposta inteira, inclusive a parte em que a IA explica as decisões dela. O aviso
   sobre a linha em branco estava lá.
3. Rodar tudo o que a IA afirma e que dá para rodar, em vez de acreditar na explicação.
4. Não colocar log real, senha, chave ou dado pessoal no prompt. Aqui usei só logs
   inventados.
5. Não aceitar código que eu não consiga explicar sem a resposta da IA aberta do lado.

## Checklist de entrega

- [x] Defini o problema.
- [x] Identifiquei entrada, processamento e saída.
- [x] Registrei o prompt utilizado.
- [x] Registrei a primeira versão do código.
- [x] Analisei criticamente a solução.
- [x] Executei pelo menos três testes.
- [x] Registrei os resultados.
- [x] Solicitei e analisei uma refatoração.
- [x] Comparei as versões.
- [x] Respondi à reflexão final.
- [x] Organizei o arquivo no GitHub.

## Como executar

```bash
cd unidade-2-programacao-assistida/aula-08-automacao-com-ia/codigo
python contar_niveis_log.py logs/exemplo.log
python -m unittest test_contar_niveis_log -v
python comparar_versoes.py
```
