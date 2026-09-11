# Tendências em Ciência da Computação (2026/2)

Repositório de estudo e entrega das atividades da disciplina Tendências em Ciência da
Computação, do Centro Universitário UDF, no segundo semestre de 2026.

A disciplina trata de Engenharia de Prompt e aplicações de Inteligência Artificial.
O eixo do semestre não é aprender a operar uma ferramenta específica, e sim entender
como modelos generativos funcionam, como se comunica com eles de forma controlada e
onde estão os limites que exigem verificação humana.

- Professora: Kadidja Valéria (kadidja.oliveira@udf.edu.br)
- Estudante: Brayan A. Pletsch
- Avaliação prática: cinco atividades de 0,5 ponto, totalizando 5,0 pontos na A2

## Como o repositório está organizado

```
.
├── docs/                        plano de aulas e material da disciplina
├── aula-inaugural/              missão de decolagem
├── unidade-1-fundamentos/       IA, LLMs e Engenharia de Prompt
└── LICENSE
```

Cada aula tem uma pasta própria com dois arquivos fixos:

- `README.md` reúne a síntese teórica da aula, escrita com as minhas palavras a partir
  dos slides e da bibliografia.
- `atividade.md` é a entrega avaliada, com o registro do que foi feito, os resultados
  obtidos e a análise crítica.

Quando a atividade envolve código, ele fica em uma subpasta (`codigo/` ou
`experimentos/`) e pode ser executado sem instalar nada além do Python 3. Todo
resultado citado nos textos veio de uma execução real desses arquivos, e não de uma
descrição aproximada.

## Unidades

| Unidade | Tema | Situação |
|---|---|---|
| [Unidade 1](unidade-1-fundamentos/) | Fundamentos de IA e Engenharia de Prompt | concluída |
| Unidade 2 | Programação assistida por IA | a partir de 17/09 |
| Unidade 3 | Low Code e No Code | a partir de 08/10 |
| Unidade 4 | Agentes de IA e ética | a partir de 05/11 |

## Como executar o código

Todos os scripts usam apenas a biblioteca padrão do Python.

```bash
python --version                 # 3.10 ou superior
cd unidade-1-fundamentos/aula-02-llms-e-sua-logica/experimentos
python proximo_token.py
```

Para a suíte de testes da aula 03:

```bash
cd unidade-1-fundamentos/aula-03-engenharia-de-prompt/codigo
python -m unittest test_valida_cpf -v
python comparar_versoes.py
```

## Uso de IA neste repositório

As atividades da disciplina consistem justamente em usar IA generativa, então o uso
está declarado em cada entrega: qual ferramenta, qual prompt, qual resposta veio dela
e o que eu fiz com essa resposta depois.

O critério que segui é o mesmo que a professora estabeleceu em aula: a IA é assistente,
não autora. Nenhuma afirmação técnica entrou nos textos sem eu conseguir explicá-la, e
onde havia como verificar por execução eu escrevi o código e executei.
