Conferimos a sua resposta na documentação do Make e do Google e testamos a regex.
Algumas coisas mudaram e queremos ajustar antes de montar.

O QUE CONFIRMAMOS:
- Gatilho gasta 1 crédito por execução mesmo sem dado novo. Router, filtros e
  manipuladores de erro não gastam crédito. Então a sua conta do agendamento de
  15 minutos está certa.
- O Router tem rota de fallback, que roda por último e pega o que não entrou nas
  outras rotas.
- O filtro "Matches pattern" usa expressão regular no padrão do JavaScript. Testamos a
  sua regex no Node e os 9 exemplos que você deu se comportaram como você disse.
- Os operadores básicos do filtro se chamam "Exists" e "Not exists".

O QUE ESTAVA DIFERENTE:
- Gmail: a documentação atual (Gmail versão 4 no Make) diz que a conexão é feita com
  "Sign in with Google" e que o cliente OAuth próprio é opcional, em configurações
  avançadas. Conta pessoal @gmail.com só precisa ser reautorizada a cada seis meses.
- O manipulador que você chamou de Ignore aparece na documentação atual como "Skip".
- No Forms em português, a ajuda do Google mostra a validação por "Expressão regular"
  com a opção "Corresponde". Não achamos a opção "Endereço de e-mail" na ajuda.

O QUE ACHAMOS NA REGEX:
A expressão aceita `.ana@gmail.com` (começa com ponto) e `ana@-gmail.com` (domínio
começa com hífen).

PEDIDOS:
1. Vale a pena corrigir essas duas brechas sem deixar a regex ilegível para quem vai
   apresentar? Se valer, mande a versão corrigida. Se não valer, diga por quê.
2. A regex para colocar na validação do Forms (que usa RE2), aceitando espaço antes e
   depois do e-mail, porque o celular costuma colocar um espaço no fim.
3. Troque a rota D por uma rota de fallback e mande a lista final dos módulos, com o
   valor de cada campo, na ordem em que vamos montar.
4. As duas fórmulas também com os nomes em inglês, para o caso de a planilha estar com
   outra localidade.
5. O e-mail final assinado como "Equipe do Sistema de Cadastro".

Mantenha as mesmas restrições de antes e continue dizendo o que você não tem certeza.
