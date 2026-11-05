# Aula 05: contexto e estrutura de prompts

Data: 10/09. Objetivo do plano de ensino: contexto e estrutura de prompts. Atividade
prevista: dinâmica em grupo, criar prompts com papéis e restrições. Competência: aplicar
técnicas avançadas de prompting.

Entrega da atividade: [atividade.md](atividade.md).
Código analisado: [codigo/trecho_analisado.py](codigo/trecho_analisado.py).
Versão corrigida: [codigo/trecho_corrigido.py](codigo/trecho_corrigido.py).

## Contexto e conhecimento do modelo

A informação que aparece numa resposta pode vir de dois lugares.

| Origem | Onde está | Posso alterar? |
|---|---|---|
| Conhecimento paramétrico | codificado nos pesos, vindo do treinamento | não |
| Contexto | o texto enviado nesta requisição | sim, é tudo o que eu controlo |

Quando um modelo "conhece" um framework, ele conhece a versão que estava no material de
treinamento. Se ele precisa avaliar o meu código, só conhece o trecho que eu colei. Se eu
descrevo o código de memória e peço uma revisão, o que ele revisa é a minha descrição.

Por isso a regra prática que mais rende nesta aula é colar o material: o trecho, a
mensagem de erro, o enunciado, a regra de negócio. Isso ajuda mais do que qualquer ajuste
na redação do prompt.

Só que a janela de contexto é finita e cobrada. Então o certo é colar o que a tarefa
precisa, sem despejar tudo.

## Posição das instruções

Instruções colocadas antes e depois de um bloco longo de material são seguidas com mais
confiabilidade do que instruções perdidas no meio dele. Quando o contexto é grande, vale
repetir a tarefa no final:

```text
Considerando o código acima, liste os defeitos de segurança.
```

O motivo é que o modelo processa a sequência inteira com atenção, mas o peso dado a cada
trecho não é uniforme, e as pontas costumam receber mais.

## Delimitadores

Quando o prompt mistura instrução com material, o modelo precisa saber o que é cada
coisa. Delimitar explicitamente resolve:

```text
Revise o código dentro das tags <codigo>.

<codigo>
def media(valores):
    return sum(valores) / len(valores)
</codigo>

Liste apenas defeitos que podem causar erro em execução.
```

Sem delimitador, além da confusão, existe outro risco: se o material colado tiver algo
parecido com uma instrução, o modelo pode seguir. Num sistema que recebe texto de usuário
e insere esse texto em um prompt, isso passa de problema de qualidade para superfície de
ataque, a chamada injeção de prompt.

## Papel

O papel muda o critério do que é relevante na resposta. A capacidade do modelo continua a
mesma.

Diante do mesmo código, um revisor de segurança prioriza entrada não sanitizada, um
revisor de performance prioriza consulta dentro de laço, e um professor prioriza
legibilidade. Os três olham o mesmo texto e produzem listas diferentes porque a palavra
"segurança" ou "performance" no contexto desloca quais continuações são prováveis.

O papel funciona melhor quando descreve a tarefa e o critério de sucesso, e não só um
cargo. Compare:

```text
Você é um especialista em segurança.
```

com:

```text
Você é analista de segurança de aplicações. Seu trabalho é encontrar entradas
que levem a acesso não autorizado. Você não comenta estilo nem legibilidade.
```

A primeira versão só dá um nome. A segunda diz o que procurar e o que ignorar.

## Restrições

Restrições que dizem o que fazer funcionam melhor do que as que dizem o que não fazer.
"Não use jargão" deixa o modelo escolher o substituto. "Explique todo termo técnico na
primeira vez que aparecer" define a ação.

Alguns tipos que costumam ser úteis:

| Tipo | Exemplo |
|---|---|
| Escopo | apenas defeitos que causam erro em execução |
| Tamanho | no máximo cinco itens |
| Técnica | apenas biblioteca padrão do Python |
| Ordenação | do mais grave para o menos grave |
| Formato | tabela com arquivo, linha, gravidade e correção |
| Abstenção | se não houver nenhum, diga isso em vez de preencher a lista |

Sem a abstenção, pedir "liste cinco problemas" quase garante cinco itens, mesmo que
existam dois. O modelo atende ao formato
pedido, e completar a lista é a continuação mais provável de uma instrução que pede cinco.

## Exemplos

Mostrar o formato desejado é mais confiável do que descrever. Dois ou três exemplos de
entrada e saída já fixam estrutura, nível de detalhe e vocabulário.

O problema é que o modelo aprende o padrão inteiro do exemplo, inclusive o que não se
queria ensinar. Se todos os exemplos forem casos negativos, a saída tende a ser negativa.

## Decomposição em etapas

Tarefas que pedem análise antes da conclusão melhoram quando a ordem é imposta:

```text
Execute em três etapas, nesta ordem:
1. Liste os defeitos encontrados, sem propor correção.
2. Classifique cada um por gravidade.
3. Só então proponha a correção dos dois mais graves.
```

Sem essa separação, o modelo tende a propor a correção do primeiro defeito que encontra e
dar a análise por encerrada.

## Estrutura de saída

Quando quem vai ler a resposta é um programa, pedir um formato estruturado com esquema
explícito é mais confiável do que só pedir "responda em JSON".

```text
Responda apenas com um objeto JSON, sem texto antes ou depois, no formato:
{"defeitos": [{"linha": int, "tipo": string, "gravidade": "alta"|"media"|"baixa"}]}
```

As APIs atuais têm mecanismos próprios para isso, como saída estruturada com esquema
declarado, que garantem a forma na própria requisição, sem depender de pedido por texto.
Quando a interface permite, é melhor ir por esse caminho.

## Checklist de estrutura

Considero um prompt bem estruturado quando consigo responder sim a estas perguntas:

- O material necessário está colado, e não só descrito?
- Material e instrução estão separados por delimitador?
- O papel diz o que procurar e o que ignorar?
- As restrições dizem o que fazer, em vez de só proibir?
- A resposta tem permissão explícita para ser "nenhum" ou "não sei"?
- O formato de saída está especificado?
- Existe um critério de sucesso que eu consigo verificar depois?

## Referências

- ANTHROPIC. *Prompt engineering overview* e *Prompting best practices*. Documentação
  oficial, consultada em 10/09/2026.
  Disponível em: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- OPENAI. *Text generation*. Documentação oficial, consultada em 10/09/2026.
  Disponível em: https://developers.openai.com/api/docs/guides/text
- OWASP GEN AI SECURITY PROJECT. *OWASP Top 10 for LLMs and Gen AI Applications 2025*,
  item LLM01 sobre injeção de prompt. Consultado em 10/09/2026.
  Disponível em: https://genai.owasp.org/llm-top-10/
- PYTHON SOFTWARE FOUNDATION. *sqlite3: DB-API 2.0 interface for SQLite databases*.
  Disponível em: https://docs.python.org/3/library/sqlite3.html
