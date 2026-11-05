PAPEL:
Atue como desenvolvedor Python.

CONTEXTO:
Tenho arquivos de log em texto, com uma ocorrência por linha, no formato
`NIVEL - mensagem`. Hoje eu conto as ocorrências de cada nível abrindo o
arquivo e procurando à mão, o que demora e erra quando o arquivo é grande.

PROBLEMA:
Contar quantas linhas de cada nível (INFO, WARNING e ERROR) existem em um
arquivo de log.

ENTRADA:
O caminho de um arquivo .log, passado na linha de comando. Exemplo de conteúdo:

INFO - usuário autenticado
ERROR - conexão perdida
INFO - arquivo salvo
WARNING - espaço reduzido
ERROR - banco indisponível

SAÍDA ESPERADA:
INFO: 2
WARNING: 1
ERROR: 2
Linhas fora do formato: 0

Uma linha só conta se começar com um dos três níveis seguido de " - ". O
resto não entra em nenhum nível e aparece na última linha da saída.

LINGUAGEM:
Python 3.10 ou superior.

RESTRIÇÕES:
- Somente biblioteca padrão.
- O script só lê o arquivo. Não pode alterar, mover nem apagar nada.
- Ler o arquivo linha a linha, porque o log pode ser grande.
- Separar a contagem da leitura do arquivo e da impressão, para eu conseguir
  testar a contagem passando uma lista de linhas.
- Não capturar Exception genérica.
- Comentários só onde explicam uma decisão que não é óbvia. Nada de
  comentário que repete o código, e nada de comentário com número de issue
  ou ticket.

CRITÉRIOS DE QUALIDADE:
- Funções pequenas, com nomes que digam o que fazem.
- Sem trecho repetido para cada nível.
- Se o arquivo não existir, mensagem clara e código de saída diferente de zero.

CASOS DE TESTE:
1. O exemplo acima: INFO 2, WARNING 1, ERROR 2, fora do formato 0.
2. Arquivo vazio: tudo zero.
3. Arquivo inexistente: mensagem de erro e saída diferente de zero.

FORMATO DA RESPOSTA:
1. Estratégia em poucas linhas.
2. Código completo em um único bloco.
3. Como executar.
