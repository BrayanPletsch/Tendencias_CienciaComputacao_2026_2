(function (raiz) {
  // Gatilhos ficam normalizados (minúsculas, sem acento). Um "*" no fim casa com qualquer continuação da palavra.
  const CASOS = {
    defeito_produto: {
      titulo: "Produto com defeito",
      gatilhos: [
        ["defeito", 3], ["defeituos*", 3], ["com problema", 1], ["quebr*", 3], ["parou de funcionar", 4],
        ["nao funciona", 3], ["nao liga", 3], ["nao carrega", 3], ["pifou", 3], ["estrag*", 2], ["deu pau", 3],
        ["rachad*", 3], ["trincad*", 3], ["vazando", 2], ["nao gela", 3], ["nao esquenta", 3],
        ["assistencia tecnica", 2], ["conserto", 1], ["garantia", 1], ["veio com defeito", 2],
        ["arriou", 3], ["deu prego", 3], ["deu pane", 3], ["deu tilt", 3], ["deu xabu", 3], ["entregou os pontos", 3],
      ],
      artigos: [
        { ref: "art. 18", texto: "loja e fabricante respondem juntos pelos defeitos que tornam o produto impróprio para uso." },
        { ref: "art. 18, § 1º", texto: "se o defeito não for consertado em até 30 dias, você escolhe entre trocar o produto, receber o dinheiro de volta corrigido ou pedir abatimento no preço." },
        { ref: "art. 18, § 3º", texto: "se o conserto puder comprometer o produto ou se ele for essencial, você pode pedir a troca ou o dinheiro de volta na hora." },
        { ref: "art. 26", texto: "o prazo para reclamar é de 30 dias para produto que acaba rápido e 90 dias para produto que dura. Conta da entrega ou, se o defeito estava escondido, de quando ele apareceu." },
      ],
      pedido: "o conserto do produto em até 30 dias, como prevê o art. 18, § 1º, do Código de Defesa do Consumidor. Se o defeito não for resolvido nesse prazo, peço a troca por um produto igual em perfeito estado ou a devolução do valor pago, corrigido",
      documentos: ["nota fiscal ou comprovante de compra", "fotos ou vídeo mostrando o defeito", "protocolos de atendimento e conversas com a loja ou a assistência técnica"],
    },
    arrependimento: {
      titulo: "Arrependimento de compra",
      gatilhos: [
        ["arrepend*", 4], ["desist*", 3], ["nao quero mais", 4], ["mudei de ideia", 4], ["devolver", 2],
        ["devolucao", 2], ["cancelar a compra", 3], ["nao gostei", 2], ["nao serviu", 2], ["ficou pequen*", 2],
        ["ficou grand*", 2], ["nao era o que eu esperava", 3],
      ],
      artigos: [
        { ref: "art. 49", texto: "quem compra fora da loja (internet, telefone, em casa) pode desistir em até 7 dias, contados da compra ou do recebimento." },
        { ref: "art. 49, parágrafo único", texto: "se você desistir dentro desse prazo, o que pagou volta de imediato, com correção." },
      ],
      pedido: "o cancelamento da compra e a devolução imediata do valor pago, corrigido, conforme o art. 49 do Código de Defesa do Consumidor. Estou desistindo dentro do prazo de 7 dias",
      documentos: ["comprovante do pedido e do pagamento", "data em que o produto chegou (e-mail de entrega ou rastreio)", "protocolo do pedido de cancelamento, se já fez"],
    },
    cobranca_indevida: {
      titulo: "Cobrança indevida",
      gatilhos: [
        ["cobranca indevida", 4], ["cobrado indevidamente", 4], ["cobraram", 2], ["cobranc*", 1], ["cobrando", 2],
        ["duas vezes", 2], ["em dobro", 2], ["duplicad*", 2], ["valor errado", 3], ["nao reconheco", 3],
        ["fatura", 1], ["debitad*", 1], ["descontaram", 2], ["tarifa", 1], ["taxa", 1], ["cobrou a mais", 4],
        ["cobraram a mais", 4], ["valor a mais", 3], ["conta veio alta", 3], ["continuam cobrando", 4],
      ],
      artigos: [
        { ref: "art. 42", texto: "a empresa não pode cobrar uma dívida expondo você ao ridículo nem fazendo ameaça." },
        { ref: "art. 42, parágrafo único", texto: "quem pagou uma cobrança indevida tem direito a receber em dobro o que pagou a mais, com correção e juros, a não ser que a empresa prove um engano justificável." },
      ],
      pedido: "a correção da cobrança indevida e, para o valor que já paguei, a devolução em dobro, com correção e juros, conforme o art. 42, parágrafo único, do Código de Defesa do Consumidor",
      documentos: ["fatura ou extrato com a cobrança", "comprovante de pagamento, se já pagou", "contrato ou print do que foi combinado", "protocolos de atendimento"],
    },
    nao_solicitado: {
      titulo: "Produto ou serviço que você não pediu",
      gatilhos: [
        ["nao contratei", 4], ["nao pedi", 3], ["nao solicitei", 4], ["nunca contratei", 4], ["nunca pedi", 4],
        ["sem autorizacao", 3], ["sem eu pedir", 4], ["sem pedir", 3], ["sem minha autorizacao", 4],
        ["nao assinei", 3], ["colocaram um seguro", 4], ["seguro que", 2], ["incluiram", 2], ["enviaram sem", 3],
      ],
      artigos: [
        { ref: "art. 39, III", texto: "a empresa não pode enviar produto nem prestar serviço que você não pediu." },
        { ref: "art. 39, parágrafo único", texto: "o que foi enviado ou prestado sem pedido vale como amostra grátis: você não precisa pagar." },
        { ref: "art. 42, parágrafo único", texto: "se você já pagou por isso, pode pedir a devolução em dobro, com correção e juros." },
      ],
      pedido: "o cancelamento imediato do que não contratei e a retirada de qualquer cobrança. Pelo art. 39, parágrafo único, do Código de Defesa do Consumidor, o que foi enviado ou prestado sem pedido equivale a amostra grátis. Para o que já foi pago, peço a devolução em dobro, conforme o art. 42, parágrafo único",
      documentos: ["fatura ou extrato com a cobrança", "comprovante de pagamento, se pagou", "protocolos de atendimento em que você pediu o cancelamento"],
    },
    oferta_descumprida: {
      titulo: "Atraso na entrega ou oferta não cumprida",
      gatilhos: [
        ["nao chegou", 4], ["nao entregaram", 4], ["nao foi entregue", 4], ["ainda nao chegou", 4], ["atrasou", 3],
        ["atrasad*", 3], ["entrega atrasada", 4], ["prazo de entrega", 2], ["passou do prazo", 3], ["data de entrega", 2],
        ["diferente do anunciado", 4], ["diferente da foto", 4], ["veio errado", 3], ["produto errado", 3],
        ["propaganda", 2], ["anuncio", 2], ["anunciad*", 2], ["preco anunciado", 3], ["prometeram", 2], ["oferta", 2],
        ["cancelaram meu pedido", 3], ["nao cumpriram", 2], ["nao veio", 3], ["nunca chegou", 4],
      ],
      artigos: [
        { ref: "art. 30", texto: "a oferta e a propaganda com informação precisa obrigam a empresa e passam a fazer parte do contrato." },
        { ref: "art. 35", texto: "se a empresa não cumpre a oferta, você escolhe entre exigir o cumprimento, aceitar outro produto equivalente ou cancelar com o dinheiro de volta corrigido, mais perdas e danos." },
      ],
      pedido: "o cumprimento da oferta, com a entrega do produto como foi anunciado, conforme os arts. 30 e 35 do Código de Defesa do Consumidor. Se isso não for possível, peço o cancelamento da compra com a devolução do valor pago, corrigido",
      documentos: ["print do anúncio ou da oferta", "comprovante do pedido com o prazo de entrega prometido", "protocolos de atendimento e rastreio"],
    },
    servico_mal_prestado: {
      titulo: "Serviço mal feito ou não concluído",
      gatilhos: [
        ["servico mal feito", 4], ["mal feito", 3], ["mal feita", 3], ["malfeito", 3], ["servico ruim", 3],
        ["nao fizeram o servico", 4], ["nao terminaram", 3], ["nao concluiram", 3], ["deixaram pela metade", 4],
        ["instalaram errado", 4], ["instalacao", 2], ["reforma", 2], ["obra", 2], ["prestador", 2], ["servico", 1],
        ["tecnico", 1], ["pintura", 1], ["conserto nao resolveu", 3], ["servico porco", 4], ["pela metade", 3],
      ],
      artigos: [
        { ref: "art. 20", texto: "o prestador responde pelo serviço mal feito ou diferente do que foi oferecido. Você escolhe entre refazer sem custo, receber o dinheiro de volta corrigido ou pedir abatimento no preço." },
        { ref: "art. 26", texto: "o prazo para reclamar é de 30 dias para serviço que não dura e 90 dias para serviço que dura, contados do fim do serviço." },
      ],
      pedido: "que o serviço seja refeito sem custo adicional, como prevê o art. 20 do Código de Defesa do Consumidor. Se não for possível, peço a devolução do valor pago, corrigido, ou um abatimento proporcional no preço",
      documentos: ["orçamento, contrato ou mensagem com o que foi combinado", "fotos do serviço", "comprovante de pagamento", "protocolos e conversas com o prestador"],
    },
  };

  const FORA_DO_ESCOPO = {
    trabalho: {
      gatilhos: [["patrao", 4], ["meu chefe", 4], ["salario", 3], ["demissao", 3], ["demitid*", 3], ["carteira assinada", 4],
        ["fgts", 4], ["rescisao", 3], ["hora extra", 4], ["empregador", 4], ["onde eu trabalho", 4], ["trabalhista", 4]],
      resposta: "Pelo que você contou, é um problema de trabalho. O Código de Defesa do Consumidor não cobre a relação entre empregado e empregador, então eu não consigo ajudar com isso. Procure o sindicato da sua categoria, a Superintendência Regional do Trabalho ou a Defensoria Pública.",
    },
    aluguel: {
      gatilhos: [["aluguel", 4], ["inquilino", 4], ["locador", 4], ["locatario", 4], ["contrato de locacao", 4], ["despejo", 4],
        ["dono do imovel", 3], ["senhorio", 4]],
      resposta: "Parece um problema de aluguel. Contrato de locação de imóvel segue a Lei do Inquilinato, e não o Código de Defesa do Consumidor, então eu posso acabar orientando errado. A Defensoria Pública do seu estado atende esse tipo de caso de graça.",
    },
    particular: {
      gatilhos: [["olx", 2], ["de uma pessoa", 3], ["de um particular", 4], ["pessoa fisica", 3], ["de um conhecido", 4],
        ["de um amigo", 3], ["vizinho", 2], ["comprei usado", 2]],
      resposta: "Pelo que entendi, a compra foi feita com uma pessoa, e não com uma empresa. O Código de Defesa do Consumidor vale quando quem vende faz isso como atividade, como uma loja. Entre duas pessoas comuns, o caminho costuma ser o Juizado Especial Cível. Se houve golpe, registre um boletim de ocorrência.",
    },
    golpe: {
      gatilhos: [["golpe", 4], ["golpista", 4], ["fraude", 3], ["estelionat*", 4], ["clonaram", 4], ["clonado", 3],
        ["hackearam", 4], ["invadiram minha conta", 4], ["boleto falso", 4], ["site falso", 4], ["perfil falso", 4]],
      resposta: "Isso parece golpe, e aí a prioridade é outra: avise o seu banco agora mesmo, registre um boletim de ocorrência (dá para fazer pela internet na delegacia virtual do seu estado) e guarde prints de tudo. Depois disso, se uma empresa estiver envolvida, eu posso ajudar a montar a reclamação.",
    },
    acidente: {
      gatilhos: [["me machuquei", 4], ["machucou", 3], ["explodiu", 4], ["pegou fogo", 4], ["incendio", 3], ["intoxica*", 4],
        ["alergia", 3], ["passei mal", 4], ["hospital", 3], ["queimadura", 4], ["choque eletrico", 4], ["feriu", 3]],
      resposta: "Se alguém se machucou ou passou mal, procure atendimento de saúde primeiro. Quando um produto ou serviço causa dano à saúde ou à segurança, o caso é de acidente de consumo e costuma envolver indenização, o que foge do que eu consigo orientar com segurança. Guarde o produto, as notas e os laudos e procure o Procon ou a Defensoria Pública.",
    },
  };

  // [termo normalizado, nome para mostrar, artigo]
  const DURAVEIS = [
    ["celular", "celular", "um"], ["smartphone", "smartphone", "um"], ["geladeira", "geladeira", "uma"],
    ["refrigerador", "refrigerador", "um"], ["fogao", "fogão", "um"], ["microondas", "micro-ondas", "um"],
    ["televisao", "televisão", "uma"], ["tv", "TV", "uma"], ["notebook", "notebook", "um"], ["computador", "computador", "um"],
    ["tablet", "tablet", "um"], ["maquina de lavar", "máquina de lavar", "uma"], ["lavadora", "lavadora", "uma"],
    ["ar condicionado", "ar-condicionado", "um"], ["ventilador", "ventilador", "um"], ["movel", "móvel", "um"],
    ["moveis", "móveis", "os"], ["sofa", "sofá", "um"], ["cama", "cama", "uma"], ["colchao", "colchão", "um"],
    ["guarda roupa", "guarda-roupa", "um"], ["armario", "armário", "um"], ["carro", "carro", "um"], ["moto", "moto", "uma"],
    ["bicicleta", "bicicleta", "uma"], ["fone", "fone de ouvido", "um"], ["relogio", "relógio", "um"],
    ["impressora", "impressora", "uma"], ["videogame", "videogame", "um"], ["console", "console", "um"],
    ["liquidificador", "liquidificador", "um"], ["batedeira", "batedeira", "uma"], ["air fryer", "air fryer", "uma"],
    ["fritadeira", "fritadeira", "uma"], ["aspirador", "aspirador", "um"], ["ferro de passar", "ferro de passar", "um"],
    ["monitor", "monitor", "um"], ["eletrodomestico", "eletrodoméstico", "um"], ["reforma", "reforma", "uma"],
    ["instalacao", "instalação", "uma"], ["obra", "obra", "uma"], ["pintura", "pintura", "uma"], ["construcao", "construção", "uma"],
  ];

  const NAO_DURAVEIS = [
    ["comida", "comida", "uma"], ["alimento", "alimento", "um"], ["lanche", "lanche", "um"], ["pizza", "pizza", "uma"],
    ["bebida", "bebida", "uma"], ["remedio", "remédio", "um"], ["medicamento", "medicamento", "um"],
    ["cosmetico", "cosmético", "um"], ["maquiagem", "maquiagem", "uma"], ["shampoo", "xampu", "um"],
    ["sabonete", "sabonete", "um"], ["flores", "flores", "as"], ["bolo", "bolo", "um"], ["carne", "carne", "uma"],
    ["fruta", "fruta", "uma"], ["leite", "leite", "um"], ["racao", "ração", "uma"], ["produto de limpeza", "produto de limpeza", "um"],
    ["lavagem", "lavagem", "uma"], ["lavanderia", "lavanderia", "uma"], ["corte de cabelo", "corte de cabelo", "um"],
    ["manicure", "manicure", "uma"], ["limpeza", "limpeza", "uma"], ["buffet", "bufê", "um"], ["festa", "festa", "uma"],
    ["ingresso", "ingresso", "um"],
  ];

  const CANAL_FORA = ["internet", "online", "on line", "pelo site", "no site", "site da", "site do", "aplicativo", "pelo app",
    "no app", "loja virtual", "ecommerce", "por telefone", "pelo telefone", "televendas", "whatsapp", "instagram",
    "em casa", "a domicilio", "porta a porta", "na minha casa", "fora da loja", "pela internet", "zap", "pelo zap"];

  const CANAL_LOJA = ["na loja", "loja fisica", "no shopping", "no mercado", "supermercado", "na farmacia", "pessoalmente",
    "no balcao", "na loja fisica"];

  const CANAIS_DE_RECLAMACAO = [
    "Fale primeiro com a empresa (SAC, chat ou ouvidoria) e anote o número do protocolo.",
    "Se não resolver, registre no consumidor.gov.br, onde a empresa responde pela própria plataforma (veja se ela está cadastrada).",
    "Outra opção é o Procon do seu estado, que pode chamar a empresa para uma audiência.",
    "Se nada funcionar, o Juizado Especial Cível julga causas de até 20 salários mínimos sem precisar de advogado (Lei nº 9.099/1995).",
  ];

  const TEXTOS = {
    saudacao: "Oi, eu sou a Lia. Ajudo você a entender seus direitos numa compra ou num serviço que deu problema e a montar a reclamação para mandar à empresa, ao consumidor.gov.br ou ao Procon. Conte o que aconteceu do seu jeito. Por exemplo: \"comprei um celular pela internet e veio com a tela quebrada\".",
    ajuda: "Eu sei orientar seis tipos de problema: produto com defeito, arrependimento de compra feita fora da loja, cobrança indevida, cobrança por algo que você não pediu, atraso na entrega ou oferta não cumprida, e serviço mal feito. Conte o que aconteceu e eu vou perguntando o que faltar.",
    naoEntendi: "Não consegui identificar o tipo de problema. Pode contar com outras palavras? Diga o que comprou ou contratou e o que deu errado.",
    naoEntendiDeNovo: "Ainda não consegui entender. Talvez o seu caso não seja um dos seis que eu conheço. O Procon do seu estado atende qualquer problema de consumo, e você pode procurar o atendimento presencial ou o site dele.",
    despedida: "Boa sorte com a reclamação. Se precisar, é só contar outro problema.",
    aviso: "Eu sou uma assistente automática e não substituo um advogado nem a Defensoria Pública. As informações seguem o Código de Defesa do Consumidor (Lei nº 8.078/1990).",
    indenizacao: "Eu não calculo nem prometo valor de indenização. Quanto alguém recebe por dano moral depende de um juiz analisar o caso, e um número dito aqui poderia criar uma expectativa errada. O que eu consigo é mostrar o que a lei garante no seu caso.",
    tomAgressivo: "Entendo a raiva, esse tipo de problema cansa. Mesmo assim, vou manter a reclamação num tom educado: ameaça ou xingamento costuma atrasar a solução e pode até ser usado contra quem reclama.",
    dadosPessoais: "Tirei do texto um dado pessoal que você digitou. Eu não preciso de CPF, telefone, e-mail nem número de cartão para orientar você.",
    textoLongo: "A mensagem era muito longa e eu li só o começo (até 1.000 caracteres). Se faltou algo importante, mande em outra mensagem.",
    novoCaso: "Entendi que agora é outro problema, então comecei uma ficha nova.",
  };

  const PERGUNTAS = {
    canal: {
      texto: "Você comprou pela internet, por telefone ou em casa, ou foi numa loja física?",
      opcoes: ["Pela internet, telefone ou em casa", "Numa loja física"],
    },
    duravel: {
      texto: "É um produto ou serviço feito para durar (como eletrodoméstico, celular, móvel ou uma reforma) ou que acaba rápido (como alimento, cosmético ou uma lavagem)?",
      opcoes: ["Feito para durar", "Acaba rápido"],
    },
    oculto: {
      texto: "O defeito apareceu logo que você recebeu ou só depois de um tempo de uso?",
      opcoes: ["Logo que recebi", "Depois de um tempo de uso"],
    },
    dias: {
      defeito_produto: { aparente: "Há quantos dias você recebeu o produto?", oculto: "Há quantos dias o defeito apareceu?" },
      arrependimento: "Há quantos dias você fez a compra ou recebeu o produto? Pode responder \"há 3 dias\" ou com a data.",
      arrependimentoRecebimento: "E há quantos dias o produto chegou? O prazo de 7 dias também pode contar a partir do recebimento.",
      servico_mal_prestado: "Há quantos dias o serviço terminou?",
    },
    pagou: {
      texto: "Você já pagou esse valor ou ainda não?",
      opcoes: ["Já paguei", "Ainda não paguei"],
    },
    prazoPrometido: {
      texto: "A loja informou uma data ou um prazo de entrega?",
      opcoes: ["Informou, e o prazo já passou", "Não informou prazo"],
    },
    ambiguo: "Seu relato se encaixa em mais de um caso. Qual destes chega mais perto?",
  };

  const PALAVROES = ["porra", "merda", "caralho", "idiota", "burra", "burro", "inutil", "lixo", "otaria", "otario"];

  const INJECAO = ["ignore as regras", "ignore suas regras", "ignore tudo", "esqueca as regras", "esqueca suas instrucoes",
    "finja que", "a partir de agora voce", "modo desenvolvedor"];

  const base = { CASOS, FORA_DO_ESCOPO, DURAVEIS, NAO_DURAVEIS, CANAL_FORA, CANAL_LOJA, CANAIS_DE_RECLAMACAO, TEXTOS, PERGUNTAS, PALAVROES, INJECAO };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = base;
  } else {
    raiz.BaseConsumidor = base;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
