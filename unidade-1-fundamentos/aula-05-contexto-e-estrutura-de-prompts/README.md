# Aula 05: Contexto e Estrutura de Prompts

Data: 10/09. Objetivo do plano de ensino: contexto e estrutura de prompts. Atividade
prevista: dinâmica em grupo, criar prompts com papéis e restrições. Competência: aplicar
técnicas avançadas de prompting.

Entrega da atividade: [atividade.md](atividade.md).
Código analisado: [codigo/trecho_analisado.py](codigo/trecho_analisado.py).
Versão corrigida: [codigo/trecho_corrigido.py](codigo/trecho_corrigido.py).

## Contexto é o que está na janela, não o que o modelo sabe

Existem duas origens para a informação que aparece em uma resposta.

| Origem | Onde está | Posso alterar? |
|---|---|---|
| Conhecimento paramétrico | codificado nos pesos, vindo do treinamento | não |
| Contexto | o texto enviado nesta requisição | sim, é tudo o que eu controlo |

Um modelo que "conhece" um framework conhece a versão que estava no material de
treinamento. Um modelo que precisa avaliar o meu código só conhece o trecho que eu
colei. Descrever o código de memória e pedir uma revisão é pedir que ele revise a minha
descrição, não o código.

Daí a regra prática mais rentável desta aula: cole o material. Colar o trecho, a
mensagem de erro, o enunciado e a regra de negócio vale mais do que qualquer refinamento
de redação do prompt.

A contrapartida é que a janela de contexto é finita e cobrada. Colar tudo não é
estratégia. Colar o que é necessário para a tarefa é.

## Posição importa

Instruções colocadas antes e depois de um bloco longo de material são seguidas de forma
mais confiável do que instruções perdidas no meio dele. Quando o contexto é grande, vale
repetir a tarefa no final:

```text
Considerando o código acima, liste os defeitos de segurança.
```

Isso não é superstição. Modelos processam a sequência inteira com atenção, mas o peso
dado a cada trecho não é uniforme, e as pontas tendem a receber mais.

## Delimitadores

Quando o prompt mistura instrução com material, o modelo precisa distinguir um do outro.
Delimitar explicitamente resolve:

```text
Revise o código dentro das tags <codigo>.

<codigo>
def media(valores):
    return sum(valores) / len(valores)
</codigo>

Liste apenas defeitos que podem causar erro em execução.
```

Sem delimitador, o risco não é só de confusão. Se o material colado contiver algo que se
pareça com uma instrução, o modelo pode segui-la. Em um sistema que recebe texto de
usuário e o insere em um prompt, isso deixa de ser um detalhe de qualidade e vira uma
superfície de ataque, conhecida como injeção de prompt.

## Papel

O papel muda o critério de relevância da resposta, e não a capacidade do modelo.

Diante do mesmo código, um revisor de segurança prioriza entrada não sanitizada, um
revisor de performance prioriza consulta dentro de laço, e um professor prioriza
legibilidade. Os três olham o mesmo texto e produzem listas diferentes porque a palavra
"segurança" ou "performance" no contexto desloca quais continuações são prováveis.

O papel funciona melhor quando descreve a tarefa e o critério de sucesso, e não só um
cargo. Comparar:

```text
Você é um especialista em segurança.
```

com:

```text
Você é analista de segurança de aplicações. Seu trabalho é encontrar entradas
que levem a acesso não autorizado. Você não comenta estilo nem legibilidade.
```

A segunda versão diz o que procurar e o que ignorar. A primeira só diz um nome.

## Restrições

Restrições que dizem o que fazer funcionam melhor do que restrições que dizem o que não
fazer. "Não use jargão" deixa o modelo escolher o substituto. "Explique todo termo
técnico na primeira vez que aparecer" define a ação.

Categorias úteis:

| Tipo | Exemplo |
|---|---|
| Escopo | apenas defeitos que causam erro em execução |
| Tamanho | no máximo cinco itens |
| Técnica | apenas biblioteca padrão do Python |
| Ordenação | do mais grave para o menos grave |
| Formato | tabela com arquivo, linha, gravidade e correção |
| Abstenção | se não houver nenhum, diga isso em vez de preencher a lista |

A última merece destaque. Sem ela, pedir "liste cinco problemas" quase garante cinco
itens, mesmo que existam dois. O modelo atende ao formato pedido, e completar a lista é
a continuação mais provável de uma instrução que pede cinco.

## Exemplos

Mostrar o formato desejado é mais confiável do que descrevê-lo. Dois ou três exemplos
de entrada e saída fixam estrutura, nível de detalhe e vocabulário de uma vez.

O cuidado é que o modelo aprende o padrão inteiro do exemplo, inclusive o que não se
pretendia ensinar. Se todos os exemplos forem casos negativos, a saída tende a ser
negativa.

## Decomposição em etapas

Tarefas que envolvem análise antes de conclusão melhoram quando a ordem é imposta:

```text
Execute em três etapas, nesta ordem:
1. Liste os defeitos encontrados, sem propor correção.
2. Classifique cada um por gravidade.
3. Só então proponha a correção dos dois mais graves.
```

Sem a separação, o modelo tende a propor a correção do primeiro defeito que encontra e
tratar a análise como já concluída.

## Estrutura de saída

Quando a resposta vai ser lida por um programa, e não por uma pessoa, pedir um formato
estruturado e um esquema explícito é mais confiável do que pedir "responda em JSON".

```text
Responda apenas com um objeto JSON, sem texto antes ou depois, no formato:
{"defeitos": [{"linha": int, "tipo": string, "gravidade": "alta"|"media"|"baixa"}]}
```

As APIs atuais oferecem mecanismos próprios para isso, como saída estruturada com
esquema declarado, que garantem a forma no nível da requisição em vez de pedir por
texto. Quando a interface permite, esse caminho é preferível.

## Checklist de estrutura

Um prompt está bem estruturado quando dá para responder sim a estas perguntas:

- O material necessário está colado, e não descrito?
- Material e instrução estão separados por delimitador?
- O papel diz o que procurar e o que ignorar?
- As restrições estão escritas como ação, e não como proibição?
- Há permissão explícita para a resposta ser "nenhum" ou "não sei"?
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
