(function (raiz) {
  const BASE = typeof module !== "undefined" && module.exports ? require("./base-conhecimento.js") : raiz.BaseConsumidor;

  const LIMITE_CARACTERES = 1000;
  const TAMANHO_MEMORIA_CURTA = 6;
  const DIA_EM_MS = 24 * 60 * 60 * 1000;
  // Palavras comuns que ficam a uma letra de um gatilho ("atras" e "atraso", por exemplo) e não podem ser aproximadas.
  const NAO_APROXIMAR = new Set(["atras", "mais", "mes", "dias", "pago", "paga", "conta", "casa", "cobra", "tarefa", "futura"]);
  const NUMEROS = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
    onze: 11, doze: 12, quinze: 15, vinte: 20, trinta: 30 };
  const MESES = { janeiro: 0, fevereiro: 1, marco: 2, abril: 3, maio: 4, junho: 5, julho: 6, agosto: 7, setembro: 8,
    outubro: 9, novembro: 10, dezembro: 11 };
  // Quando dois casos aparecem juntos, o mais específico ganha.
  const PRECEDENCIA = [
    ["nao_solicitado", "cobranca_indevida"],
    ["defeito_produto", "arrependimento"],
    ["oferta_descumprida", "arrependimento"],
  ];

  function normalizar(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9$/,.\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function tokenizar(normal) {
    return normal.split(/[^a-z0-9]+/).filter(Boolean);
  }

  function distancia(a, b) {
    const linha = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let anterior = linha[0];
      linha[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const guardado = linha[j];
        linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
        anterior = guardado;
      }
    }
    return linha[b.length];
  }

  function tolerancia(tamanho) {
    return tamanho >= 8 ? 2 : tamanho >= 5 ? 1 : 0;
  }

  // A aproximação só vale quando as duas primeiras letras batem: sem isso, "colocaram" virava "clonaram" e "feita" virava "festa".
  function podeAproximar(token, alvo) {
    return !NAO_APROXIMAR.has(token) && token.slice(0, 2) === alvo.slice(0, 2);
  }

  function palavraCasa(token, alvo, aproximar = true) {
    if (alvo.endsWith("*")) {
      const radical = alvo.slice(0, -1);
      if (token.startsWith(radical)) return true;
      if (!aproximar || radical.length < 5 || !podeAproximar(token, radical)) return false;
      return distancia(token.slice(0, radical.length), radical) <= 1;
    }
    if (token === alvo || token === `${alvo}s`) return true;
    if (!aproximar || !podeAproximar(token, alvo)) return false;
    const limite = tolerancia(alvo.length);
    return limite > 0 && Math.abs(token.length - alvo.length) <= limite && distancia(token, alvo) <= limite;
  }

  function contemExpressao(tokens, expressao, aproximar = true) {
    const palavras = expressao.split(" ");
    for (let i = 0; i + palavras.length <= tokens.length; i++) {
      if (palavras.every((p, j) => palavraCasa(tokens[i + j], p, aproximar))) return true;
    }
    return false;
  }

  function contemAlguma(tokens, lista) {
    return lista.find((expressao) => contemExpressao(tokens, expressao, false)) || null;
  }

  function pontuar(tokens, gatilhos, aproximar = true) {
    let total = 0;
    const achados = [];
    for (const [alvo, peso] of gatilhos) {
      if (contemExpressao(tokens, alvo, aproximar)) {
        total += peso;
        achados.push(alvo.replace("*", ""));
      }
    }
    return { total, achados };
  }

  function mascararDadosPessoais(texto) {
    return texto
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[dado pessoal removido]")
      .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[dado pessoal removido]")
      .replace(/\b(?:\d[ .-]?){13,19}\b/g, "[dado pessoal removido]")
      .replace(/\(?\b\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b/g, "[dado pessoal removido]");
  }

  function lerNumero(texto) {
    if (/^\d+$/.test(texto)) return parseInt(texto, 10);
    return NUMEROS[texto] ?? null;
  }

  function diasEntre(hoje, data) {
    const inicio = Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
    const fim = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    return Math.round((fim - inicio) / DIA_EM_MS);
  }

  function referenciaAntes(normal, posicao) {
    const trecho = normal.slice(Math.max(0, posicao - 40), posicao);
    if (/(receb|cheg|entreg)/.test(trecho)) return "recebimento";
    if (/(apareceu|parou|quebr|defeit|comecou|pifou)/.test(trecho)) return "defeito";
    if (/(termin|conclu|instal|fizeram|acabaram)/.test(trecho)) return "servico";
    if (/(compr|pedi|pedido|contrat|assinei)/.test(trecho)) return "compra";
    return "desconhecida";
  }

  function extrairTempo(normal, hoje, comoResposta = false) {
    const quantidade = "(\\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|quinze|vinte|trinta)";
    const unidade = "(dia|dias|semana|semanas|mes|meses)";
    const fatores = { dia: 1, dias: 1, semana: 7, semanas: 7, mes: 30, meses: 30 };
    const relativos = [
      new RegExp(`\\b(?:ha|faz|fazem|tem)\\s+(?:uns |umas |quase |mais de |cerca de )?${quantidade}\\s+${unidade}\\b`),
      new RegExp(`\\b${quantidade}\\s+${unidade}\\s+atras\\b`),
    ];
    for (const padrao of relativos) {
      const m = normal.match(padrao);
      if (m) {
        const n = lerNumero(m[1]);
        if (n !== null) return { dias: n * fatores[m[2] || "dias"], referencia: referenciaAntes(normal, m.index) };
      }
    }
    const palavras = [[/\banteontem\b/, 2], [/\bontem\b/, 1], [/\bhoje\b/, 0], [/\bsemana passada\b/, 7], [/\bmes passado\b/, 30]];
    for (const [padrao, dias] of palavras) {
      const m = normal.match(padrao);
      if (m) return { dias, referencia: referenciaAntes(normal, m.index) };
    }
    const dataNumerica = normal.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
    const dataPorExtenso = normal.match(/\bdia (\d{1,2})(?: de (janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro))?\b/);
    let data = null;
    let posicao = 0;
    if (dataNumerica) {
      let ano = dataNumerica[3] ? parseInt(dataNumerica[3], 10) : hoje.getFullYear();
      if (ano < 100) ano += 2000;
      data = new Date(ano, parseInt(dataNumerica[2], 10) - 1, parseInt(dataNumerica[1], 10));
      if (!dataNumerica[3] && data > hoje) data.setFullYear(ano - 1);
      posicao = dataNumerica.index;
    } else if (dataPorExtenso) {
      const mes = dataPorExtenso[2] ? MESES[dataPorExtenso[2]] : hoje.getMonth();
      data = new Date(hoje.getFullYear(), mes, parseInt(dataPorExtenso[1], 10));
      if (data > hoje) {
        if (dataPorExtenso[2]) data.setFullYear(hoje.getFullYear() - 1);
        else data.setMonth(data.getMonth() - 1);
      }
      posicao = dataPorExtenso.index;
    }
    if (data && !isNaN(data)) {
      const dias = diasEntre(hoje, data);
      if (dias >= 0) return { dias, referencia: referenciaAntes(normal, posicao) };
    }
    if (comoResposta) {
      const m = normal.match(new RegExp(`^(?:uns |umas |quase |mais de |cerca de )?${quantidade}(?:\\s+${unidade})?\\b`));
      if (m && lerNumero(m[1]) !== null) return { dias: lerNumero(m[1]) * fatores[m[2] || "dias"], referencia: "informada" };
    }
    return null;
  }

  function extrairPagamento(normal) {
    if (/\b(nao paguei|ainda nao paguei|nao pago|nao vou pagar|nao foi pago)\b/.test(normal)) return false;
    if (/\b(ja paguei|paguei|foi debitad[oa]|debitaram|descontaram|ja foi pago|pago)\b/.test(normal)) return true;
    return null;
  }

  function extrairEntidades(normal, tokens, textoOriginal, hoje) {
    const entidades = {};
    const fora = contemAlguma(tokens, BASE.CANAL_FORA);
    const loja = contemAlguma(tokens, BASE.CANAL_LOJA);
    if (fora && !loja) entidades.canal = "fora";
    if (loja && !fora) entidades.canal = "loja";
    const acharProduto = (lista) => lista.find(([termo]) => contemExpressao(tokens, termo, false)) || null;
    const duravel = acharProduto(BASE.DURAVEIS);
    const naoDuravel = acharProduto(BASE.NAO_DURAVEIS);
    if (duravel && !naoDuravel) {
      entidades.duravel = true;
      entidades.produto = { nome: duravel[1], artigo: duravel[2] };
    } else if (naoDuravel && !duravel) {
      entidades.duravel = false;
      entidades.produto = { nome: naoDuravel[1], artigo: naoDuravel[2] };
    }
    const tempo = extrairTempo(normal, hoje);
    if (tempo) entidades.tempo = tempo;
    const pagou = extrairPagamento(normal);
    if (pagou !== null) entidades.pagou = pagou;
    if (/\b(depois de um tempo|depois de uns|com o uso|apos|depois de usar)\b/.test(normal)) entidades.oculto = true;
    else if (/\b(logo que|assim que|ja veio|veio com|chegou com|na caixa|quando chegou)\b/.test(normal)) entidades.oculto = false;
    if (/\b(nao informaram prazo|nao informou prazo|sem prazo|nao deram prazo|nao falaram prazo)\b/.test(normal)) entidades.prazoPrometido = false;
    else if (/\b(prazo|previsao|era pra chegar|era para chegar|prometeram|data de entrega|data prevista)\b/.test(normal)) entidades.prazoPrometido = true;
    const valor = textoOriginal.match(/r\$\s*([\d.]+(?:,\d{1,2})?)/i) || textoOriginal.match(/\b(\d+(?:[.,]\d+)?)\s*reais\b/i);
    if (valor) entidades.valor = valor[1];
    return entidades;
  }

  function perceber(textoOriginal) {
    const avisos = [];
    let texto = String(textoOriginal ?? "").trim();
    if (texto.length > LIMITE_CARACTERES) {
      texto = texto.slice(0, LIMITE_CARACTERES);
      avisos.push("textoLongo");
    }
    const mascarado = mascararDadosPessoais(texto);
    if (mascarado !== texto) avisos.push("dadosPessoais");
    const normal = normalizar(mascarado);
    return { texto: mascarado, normal, tokens: tokenizar(normal), avisos };
  }

  function entender(percepcao, hoje) {
    const { tokens, normal, texto } = percepcao;
    const casos = Object.keys(BASE.CASOS).map((id) => ({ id, ...pontuar(tokens, BASE.CASOS[id].gatilhos) }))
      .sort((a, b) => b.total - a.total);
    // Fora do escopo só com a palavra exata: um falso positivo aqui nega ajuda a quem tem direito.
    const fora = Object.keys(BASE.FORA_DO_ESCOPO).map((id) => ({ id, ...pontuar(tokens, BASE.FORA_DO_ESCOPO[id].gatilhos, false) }))
      .sort((a, b) => b.total - a.total);
    const sinais = {
      saudacao: tokens.length <= 4 && /\b(oi|ola|bom dia|boa tarde|boa noite|e ai)\b/.test(normal),
      ajuda: /\b(ajuda|o que voce faz|como funciona|o que voce sabe)\b/.test(normal),
      despedida: /\b(obrigad[oa]|valeu|tchau|ate mais)\b/.test(normal),
      indenizacao: /\b(indenizacao|dano moral|danos morais|quanto vou ganhar|quanto vou receber|quanto eu ganho)\b/.test(normal),
      agressivo: tokens.some((t) => BASE.PALAVROES.includes(t)) || /\b(ameac|xing)/.test(normal),
      injecao: BASE.INJECAO.some((frase) => normal.includes(frase)),
    };
    return { casos, fora, sinais, entidades: extrairEntidades(normal, tokens, texto, hoje) };
  }

  function fichaVazia() {
    return { caso: null, canal: null, duravel: null, oculto: null, dias: null, referenciaDias: null, pagou: null,
      prazoPrometido: null, valor: null, produto: null, pendente: null, tentativasPendente: 0, candidatos: null,
      perguntouRecebimento: false };
  }

  function mesclar(ficha, entidades) {
    for (const campo of ["canal", "duravel", "oculto", "pagou", "prazoPrometido", "valor", "produto"]) {
      if (ficha[campo] === null && entidades[campo] !== undefined) ficha[campo] = entidades[campo];
    }
    if (ficha.dias === null && entidades.tempo) {
      ficha.dias = entidades.tempo.dias;
      ficha.referenciaDias = entidades.tempo.referencia;
    }
  }

  function escolherCaso(ranking) {
    const [primeiro, segundo] = ranking;
    if (primeiro.total < 2) return { caso: null };
    if (segundo && segundo.total >= 3 && primeiro.total - segundo.total <= 1) {
      const regra = PRECEDENCIA.find(([a, b]) => [a, b].includes(primeiro.id) && [a, b].includes(segundo.id));
      if (regra) return { caso: regra[0], porPrecedencia: true };
      return { caso: null, ambiguo: [primeiro.id, segundo.id] };
    }
    return { caso: primeiro.id };
  }

  function lerResposta(campo, percepcao, entendimento, ficha, hoje) {
    const n = percepcao.normal;
    const e = entendimento.entidades;
    switch (campo) {
      case "canal":
        if (e.canal) return e.canal;
        if (/(internet|telefone|em casa|fora|online|site|app)/.test(n)) return "fora";
        if (/(loja|presencial|pessoalmente|shopping)/.test(n)) return "loja";
        return null;
      case "duravel":
        if (/(acaba rapido|nao dura|consome|rapido)/.test(n)) return false;
        if (/(feito para durar|dura|duravel)/.test(n)) return true;
        return e.duravel ?? null;
      case "oculto":
        if (/(depois|tempo de uso|com o uso|apos|usando)/.test(n)) return true;
        if (/(logo|assim que|quando chegou|na entrega|ja veio|chegou)/.test(n)) return false;
        return null;
      case "dias":
      case "diasRecebimento": {
        const tempo = extrairTempo(n, hoje, true);
        return tempo ? tempo.dias : null;
      }
      case "pagou": {
        const pagou = extrairPagamento(n);
        if (pagou !== null) return pagou;
        if (/^(sim|ja|paguei)\b/.test(n)) return true;
        if (/^(nao|ainda nao)\b/.test(n)) return false;
        return null;
      }
      case "prazoPrometido":
        if (/(nao informou|nao informaram|sem prazo|nao deram|^nao\b)/.test(n)) return false;
        if (/(informou|informaram|passou|prometeram|tinha prazo|^sim\b)/.test(n)) return true;
        return e.prazoPrometido ?? null;
      case "ambiguo": {
        for (const id of ficha.candidatos || []) {
          if (n.includes(normalizar(BASE.CASOS[id].titulo).split(" ").slice(0, 2).join(" "))) return id;
        }
        const melhor = entendimento.casos.find((c) => (ficha.candidatos || []).includes(c.id) && c.total > 0);
        return melhor ? melhor.id : null;
      }
      default:
        return null;
    }
  }

  function aplicarResposta(ficha, campo, valor) {
    if (campo === "ambiguo") {
      ficha.caso = valor;
      ficha.candidatos = null;
    } else if (campo === "diasRecebimento") {
      ficha.dias = valor;
      ficha.referenciaDias = "recebimento";
    } else if (campo === "dias") {
      ficha.dias = valor;
      if (!ficha.referenciaDias || ficha.referenciaDias === "desconhecida") ficha.referenciaDias = "informada";
    } else {
      ficha[campo] = valor;
    }
    ficha.pendente = null;
    ficha.tentativasPendente = 0;
  }

  function desistirDoCampo(ficha) {
    const campo = ficha.pendente;
    if (campo === "ambiguo") {
      ficha.caso = ficha.candidatos[0];
      ficha.candidatos = null;
    } else if (campo === "diasRecebimento") {
      ficha.perguntouRecebimento = true;
    } else if (campo === "dias") {
      ficha.dias = -1;
    } else {
      ficha[campo] = "desconhecido";
    }
    ficha.pendente = null;
    ficha.tentativasPendente = 0;
    return campo;
  }

  function proximoCampo(ficha) {
    const falta = (campo) => ficha[campo] === null;
    switch (ficha.caso) {
      case "defeito_produto":
        if (falta("duravel")) return "duravel";
        if (falta("oculto")) return "oculto";
        if (falta("dias")) return "dias";
        return null;
      case "arrependimento":
        if (falta("canal")) return "canal";
        if (ficha.canal === "loja") return null;
        if (falta("dias")) return "dias";
        if (ficha.referenciaDias === "compra" && ficha.dias > 7 && !ficha.perguntouRecebimento) return "diasRecebimento";
        return null;
      case "cobranca_indevida":
      case "nao_solicitado":
        return falta("pagou") ? "pagou" : null;
      case "oferta_descumprida":
        return falta("prazoPrometido") ? "prazoPrometido" : null;
      case "servico_mal_prestado":
        if (falta("duravel")) return "duravel";
        if (falta("dias")) return "dias";
        return null;
      default:
        return null;
    }
  }

  function perguntaPara(campo, ficha) {
    const P = BASE.PERGUNTAS;
    if (campo === "dias") {
      if (ficha.caso === "defeito_produto") return { texto: ficha.oculto ? P.dias.defeito_produto.oculto : P.dias.defeito_produto.aparente, opcoes: [] };
      return { texto: P.dias[ficha.caso], opcoes: [] };
    }
    if (campo === "diasRecebimento") return { texto: P.dias.arrependimentoRecebimento, opcoes: [] };
    if (campo === "ambiguo") return { texto: P.ambiguo, opcoes: ficha.candidatos.map((id) => BASE.CASOS[id].titulo) };
    return { texto: P[campo].texto, opcoes: P[campo].opcoes.slice() };
  }

  function avaliarPrazo(ficha) {
    const regras = [];
    const contagem = ficha.oculto ? "desde que o defeito apareceu" : ficha.caso === "servico_mal_prestado" ? "desde o fim do serviço" : "desde a entrega";
    if (ficha.caso === "defeito_produto" || ficha.caso === "servico_mal_prestado") {
      const limite = ficha.duravel === true ? 90 : ficha.duravel === false ? 30 : null;
      if (limite === null) {
        regras.push("Durabilidade não informada: mostrei os dois prazos do art. 26.");
        return { texto: "O prazo para reclamar é de 30 dias se o produto ou serviço acaba rápido e de 90 dias se é feito para durar (art. 26). Confira em qual dos dois o seu caso se encaixa.", situacao: "indefinida", regras, limite: null, dias: ficha.dias };
      }
      regras.push(`${ficha.duravel ? "Feito para durar" : "Acaba rápido"}: prazo de ${limite} dias (art. 26).`);
      if (ficha.dias === null) {
        return { texto: `O prazo para reclamar é de ${limite} dias, contados ${contagem} (art. 26). Não consegui saber há quantos dias foi, então confira a data.`, situacao: "indefinida", regras, limite, dias: null };
      }
      regras.push(`${ficha.dias} dias ${ficha.dias <= limite ? "<=" : ">"} ${limite}.`);
      if (ficha.dias <= limite) {
        return { texto: `Você está dentro do prazo: são ${limite} dias para reclamar, contados ${contagem}, e passaram ${ficha.dias} (art. 26). Não deixe para depois.`, situacao: "dentro", regras, limite, dias: ficha.dias };
      }
      return { texto: `Pelo art. 26, o prazo de ${limite} dias para reclamar já passou (foram ${ficha.dias} dias ${contagem}). Mesmo assim vale tentar: a garantia da loja ou do fabricante pode dar mais tempo, e o Procon consegue avaliar o seu caso.`, situacao: "fora", regras, limite, dias: ficha.dias };
    }
    if (ficha.caso === "cobranca_indevida") {
      regras.push(ficha.pagou ? "Valor já pago: cabe devolução em dobro (art. 42, parágrafo único)." : "Valor ainda não pago: contestar antes de pagar.");
      return ficha.pagou
        ? { texto: "Como você já pagou, pode pedir de volta o dobro do que pagou a mais, com correção e juros. A empresa só escapa disso se provar que foi um engano justificável (art. 42, parágrafo único).", situacao: "direito", regras }
        : { texto: "Conteste a cobrança antes do vencimento e peça a fatura corrigida. Se a empresa não corrigir e você acabar pagando, guarde o comprovante: aí cabe pedir a devolução em dobro (art. 42, parágrafo único).", situacao: "direito", regras };
    }
    if (ficha.caso === "nao_solicitado") {
      regras.push(ficha.pagou ? "Já pagou por algo que não pediu: cancelamento e devolução em dobro." : "Não pagou: não há obrigação de pagar (art. 39, parágrafo único).");
      return ficha.pagou
        ? { texto: "Peça o cancelamento e a devolução em dobro do que você pagou por algo que não pediu (arts. 39 e 42, parágrafo único).", situacao: "direito", regras }
        : { texto: "Você não precisa pagar por algo que não pediu: pela lei, isso equivale a amostra grátis (art. 39, parágrafo único).", situacao: "direito", regras };
    }
    if (ficha.caso === "oferta_descumprida") {
      regras.push(ficha.prazoPrometido ? "Prazo prometido e descumprido: art. 35." : "Sem prazo informado: pedir data por escrito antes.");
      return ficha.prazoPrometido
        ? { texto: "A empresa tem que cumprir o que anunciou. Você escolhe entre exigir a entrega, aceitar outro produto equivalente ou cancelar com o dinheiro de volta, corrigido (art. 35).", situacao: "direito", regras }
        : { texto: "Peça à loja uma data de entrega por escrito. Se ela não cumprir, você pode exigir a entrega, aceitar um produto equivalente ou cancelar com o dinheiro de volta (art. 35).", situacao: "direito", regras };
    }
    if (ficha.caso === "arrependimento") {
      if (ficha.canal === "loja") {
        regras.push("Compra em loja física: o art. 49 não se aplica.");
        return { texto: "O direito de arrependimento do art. 49 vale só para compras feitas fora da loja (internet, telefone, em casa). Numa loja física, trocar ou devolver um produto sem defeito depende da política da loja. Vale pedir essa política por escrito.", situacao: "nao_se_aplica", regras, limite: 7, dias: ficha.dias };
      }
      if (ficha.dias === null) {
        regras.push("Data não informada.");
        return { texto: "Você tem 7 dias para desistir, contados da compra ou do recebimento (art. 49). Confira se ainda está dentro desse prazo antes de mandar a reclamação.", situacao: "indefinida", regras, limite: 7, dias: null };
      }
      regras.push(`${ficha.dias} dias ${ficha.dias <= 7 ? "<=" : ">"} 7 (art. 49).`);
      if (ficha.dias <= 7) {
        return { texto: `Você está dentro do prazo de 7 dias para desistir (passaram ${ficha.dias}). Peça o cancelamento por escrito ainda hoje e guarde o protocolo.`, situacao: "dentro", regras, limite: 7, dias: ficha.dias };
      }
      return { texto: `O prazo de 7 dias do art. 49 já passou (foram ${ficha.dias} dias). A partir daí, a loja só é obrigada a aceitar a devolução se o produto tiver defeito ou se a política dela permitir. Se houver defeito, me conte que o caso muda.`, situacao: "fora", regras, limite: 7, dias: ficha.dias };
    }
    return null;
  }

  function nomeDoProduto(ficha, comArtigo) {
    if (!ficha.produto) return "[produto ou serviço]";
    return comArtigo ? `${ficha.produto.artigo} ${ficha.produto.nome}` : ficha.produto.nome;
  }

  function descricaoDoCaso(ficha) {
    const produto = nomeDoProduto(ficha, false);
    switch (ficha.caso) {
      case "defeito_produto":
        return ficha.oculto
          ? `Depois de um tempo de uso, o produto (${produto}) apresentou defeito: [descreva o defeito].`
          : `O produto (${produto}) chegou com defeito: [descreva o defeito].`;
      case "arrependimento":
        return "Estou exercendo o direito de arrependimento dentro do prazo de 7 dias.";
      case "cobranca_indevida":
        return `Recebi uma cobrança de ${ficha.valor ? "R$ " + ficha.valor : "[valor]"} que não reconheço ou que está acima do combinado: [explique a cobrança].${ficha.pagou ? " Esse valor já foi pago." : ""}`;
      case "nao_solicitado":
        return `Foi incluído na minha conta um produto ou serviço que eu não pedi nem autorizei: [nome do produto ou serviço].${ficha.pagou ? " Já paguei por isso." : ""}`;
      case "oferta_descumprida":
        return ficha.prazoPrometido
          ? "A entrega estava prevista para [data prometida] e até agora o pedido não foi cumprido como foi anunciado."
          : "Até agora o pedido não foi entregue e não recebi uma data de entrega.";
      case "servico_mal_prestado":
        return "O serviço não foi feito como combinado: [descreva o problema].";
      default:
        return "";
    }
  }

  function pedidoDoCaso(ficha) {
    if (ficha.caso === "cobranca_indevida" && ficha.pagou === false) {
      return "o cancelamento dessa cobrança e o envio de uma fatura corrigida. Se eu precisar pagar o valor indevido, vou pedir a devolução em dobro, conforme o art. 42, parágrafo único, do Código de Defesa do Consumidor";
    }
    if (ficha.caso === "nao_solicitado" && ficha.pagou === false) {
      return "o cancelamento imediato do que não contratei e a retirada de qualquer cobrança. Pelo art. 39, parágrafo único, do Código de Defesa do Consumidor, o que foi enviado ou prestado sem pedido equivale a amostra grátis, e não existe obrigação de pagamento";
    }
    if (ficha.caso === "oferta_descumprida" && ficha.prazoPrometido === false) {
      return "uma data de entrega por escrito e o cumprimento do pedido como foi anunciado, conforme os arts. 30 e 35 do Código de Defesa do Consumidor. Se isso não for possível, peço o cancelamento com a devolução do valor pago, corrigido";
    }
    return BASE.CASOS[ficha.caso].pedido;
  }

  function montarReclamacao(ficha) {
    const valor = ficha.valor && ficha.caso !== "cobranca_indevida" ? ` por R$ ${ficha.valor}` : "";
    const canal = ficha.canal === "fora" ? " fora da loja física (internet, telefone ou em casa)" : ficha.canal === "loja" ? " na loja física" : "";
    const verbo = ficha.caso === "servico_mal_prestado" ? "contratei" : "comprei";
    const linhas = [
      "Olá, [nome da empresa].",
      "",
      ficha.caso === "cobranca_indevida" || ficha.caso === "nao_solicitado"
        ? `Sou cliente de vocês desde [data] e ${descricaoDoCaso(ficha).charAt(0).toLowerCase()}${descricaoDoCaso(ficha).slice(1)}`
        : `Em [data da compra], ${verbo} ${nomeDoProduto(ficha, true)}${canal}${valor}. ${descricaoDoCaso(ficha)}`,
      "",
      `Por isso, peço ${pedidoDoCaso(ficha)}.`,
      "",
      "Já entrei em contato antes pelo protocolo [número do protocolo, se tiver].",
      "",
      "Aguardo uma resposta.",
      "[seu nome]",
    ];
    return linhas.join("\n");
  }

  function resumoDoCaso(ficha) {
    const partes = [BASE.CASOS[ficha.caso].titulo.toLowerCase()];
    if (ficha.produto) partes.push(ficha.produto.nome);
    if (ficha.canal === "fora") partes.push("compra fora da loja");
    if (ficha.canal === "loja") partes.push("compra na loja física");
    if (ficha.duravel !== null && ficha.duravel !== "desconhecido") partes.push(ficha.duravel ? "feito para durar" : "acaba rápido");
    if (ficha.dias !== null) partes.push(`há ${ficha.dias} dias`);
    if (ficha.pagou !== null) partes.push(ficha.pagou ? "já pago" : "ainda não pago");
    return partes.join(", ");
  }

  function criarAgente(opcoes = {}) {
    const hoje = opcoes.hoje ? new Date(`${opcoes.hoje}T12:00:00`) : new Date();
    let ficha = fichaVazia();
    let memoriaCurta = [];
    let tentativasSemEntender = 0;
    let avisouTom = false;
    const registro = [];

    function lembrar(autor, texto) {
      memoriaCurta.push({ autor, texto });
      if (memoriaCurta.length > TAMANHO_MEMORIA_CURTA) memoriaCurta = memoriaCurta.slice(-TAMANHO_MEMORIA_CURTA);
    }

    function decidir(percepcao, entendimento) {
      const blocos = [];
      const explicacao = { trechos: [], regras: [], artigos: [], confianca: null };
      for (const aviso of percepcao.avisos) blocos.push({ tipo: "aviso", subtipo: "percepcao", texto: BASE.TEXTOS[aviso] });
      if (percepcao.avisos.includes("dadosPessoais")) explicacao.regras.push("Dado pessoal encontrado e apagado antes de qualquer análise.");
      if (entendimento.sinais.injecao) {
        blocos.push({ tipo: "texto", texto: "Eu sigo sempre as mesmas regras e não consigo mudar a forma como funciono." });
        explicacao.regras.push("Pedido para mudar as regras ignorado.");
      }
      if (entendimento.sinais.agressivo && !avisouTom) {
        blocos.push({ tipo: "texto", texto: BASE.TEXTOS.tomAgressivo });
        explicacao.regras.push("Tom agressivo detectado: a reclamação continua educada.");
        avisouTom = true;
      }

      let respondeuPendente = false;
      if (ficha.pendente) {
        const valor = lerResposta(ficha.pendente, percepcao, entendimento, ficha, hoje);
        if (valor !== null) {
          explicacao.regras.push(`Resposta à pergunta sobre "${ficha.pendente}" registrada na ficha.`);
          if (ficha.pendente === "diasRecebimento") ficha.perguntouRecebimento = true;
          aplicarResposta(ficha, ficha.pendente, valor);
          respondeuPendente = true;
        }
      }

      const foraDoEscopo = entendimento.fora[0];
      if (!respondeuPendente && foraDoEscopo.total >= 3) {
        ficha = fichaVazia();
        explicacao.trechos.push(...foraDoEscopo.achados);
        explicacao.regras.push(`Tema fora do Código de Defesa do Consumidor: ${foraDoEscopo.id}. Encaminhamento em vez de orientação.`);
        blocos.push({ tipo: "texto", texto: BASE.FORA_DO_ESCOPO[foraDoEscopo.id].resposta });
        return { tipo: "fora_do_escopo", blocos, explicacao, opcoes: [] };
      }

      if (!respondeuPendente) {
        const escolha = escolherCaso(entendimento.casos);
        const novo = escolha.caso || (escolha.ambiguo ? "ambiguo" : null);
        const forte = entendimento.casos[0].total >= 4;
        if (novo && ficha.caso && novo !== ficha.caso && forte) {
          ficha = fichaVazia();
          blocos.push({ tipo: "texto", texto: BASE.TEXTOS.novoCaso });
          explicacao.regras.push("Relato de outro tipo de problema: ficha anterior descartada.");
        }
        if (!ficha.caso && escolha.caso) {
          ficha.caso = escolha.caso;
          ficha.candidatos = null;
          if (ficha.pendente === "ambiguo") ficha.pendente = null;
          tentativasSemEntender = 0;
          const pontos = entendimento.casos.find((c) => c.id === escolha.caso);
          explicacao.trechos.push(...pontos.achados);
          explicacao.confianca = pontos.total >= 5 ? "alta" : pontos.total >= 3 ? "média" : "baixa";
          explicacao.regras.push(`Caso identificado: ${BASE.CASOS[escolha.caso].titulo} (pontuação ${pontos.total}).`);
          if (escolha.porPrecedencia) explicacao.regras.push("Dois casos apareceram juntos e ficou o mais específico.");
        } else if (!ficha.caso && escolha.ambiguo) {
          ficha.candidatos = escolha.ambiguo;
          ficha.pendente = "ambiguo";
          explicacao.trechos.push(...entendimento.casos[0].achados, ...entendimento.casos[1].achados);
          explicacao.regras.push("Dois casos com pontuação parecida: pergunta para desfazer a dúvida.");
          mesclar(ficha, entendimento.entidades);
          const pergunta = perguntaPara("ambiguo", ficha);
          blocos.push({ tipo: "texto", texto: pergunta.texto });
          return { tipo: "pergunta", blocos, explicacao, opcoes: pergunta.opcoes };
        }
      }

      mesclar(ficha, entendimento.entidades);

      if (ficha.pendente && !respondeuPendente) {
        ficha.tentativasPendente += 1;
        if (ficha.tentativasPendente >= 2) {
          const campo = desistirDoCampo(ficha);
          explicacao.regras.push(`Sem resposta clara sobre "${campo}" depois de duas tentativas: segui com a informação em aberto.`);
        } else {
          const pergunta = perguntaPara(ficha.pendente, ficha);
          if (entendimento.sinais.indenizacao) blocos.push({ tipo: "texto", texto: BASE.TEXTOS.indenizacao });
          blocos.push({ tipo: "texto", texto: `Não entendi a resposta. ${pergunta.texto}` });
          explicacao.regras.push(`Resposta sobre "${ficha.pendente}" não reconhecida: pergunta repetida.`);
          return { tipo: "pergunta", blocos, explicacao, opcoes: pergunta.opcoes };
        }
      }

      if (!ficha.caso) {
        if (entendimento.sinais.indenizacao) {
          blocos.push({ tipo: "texto", texto: BASE.TEXTOS.indenizacao });
          return { tipo: "politica", blocos, explicacao, opcoes: [] };
        }
        if (entendimento.sinais.saudacao) {
          blocos.push({ tipo: "texto", texto: BASE.TEXTOS.saudacao });
          return { tipo: "saudacao", blocos, explicacao, opcoes: [] };
        }
        if (entendimento.sinais.ajuda) {
          blocos.push({ tipo: "texto", texto: BASE.TEXTOS.ajuda });
          return { tipo: "ajuda", blocos, explicacao, opcoes: [] };
        }
        if (entendimento.sinais.despedida) {
          blocos.push({ tipo: "texto", texto: BASE.TEXTOS.despedida });
          return { tipo: "despedida", blocos, explicacao, opcoes: [] };
        }
        tentativasSemEntender += 1;
        explicacao.regras.push("Nenhum caso atingiu a pontuação mínima.");
        blocos.push({ tipo: "texto", texto: tentativasSemEntender >= 2 ? BASE.TEXTOS.naoEntendiDeNovo : BASE.TEXTOS.naoEntendi });
        return { tipo: "nao_entendi", blocos, explicacao, opcoes: [] };
      }

      if (entendimento.sinais.indenizacao) blocos.push({ tipo: "texto", texto: BASE.TEXTOS.indenizacao });

      const campo = proximoCampo(ficha);
      if (campo) {
        ficha.pendente = campo;
        const pergunta = perguntaPara(campo, ficha);
        blocos.push({ tipo: "texto", texto: pergunta.texto });
        explicacao.regras.push(`Falta a informação "${campo}" para aplicar a regra do caso.`);
        return { tipo: "pergunta", blocos, explicacao, opcoes: pergunta.opcoes };
      }

      return { tipo: "orientacao", blocos, explicacao, opcoes: [] };
    }

    function executar(plano) {
      if (plano.tipo !== "orientacao") return plano;
      const caso = BASE.CASOS[ficha.caso];
      if (ficha.dias === -1) ficha.dias = null;
      for (const campo of ["duravel", "oculto", "canal", "pagou", "prazoPrometido"]) {
        if (ficha[campo] === "desconhecido") ficha[campo] = null;
      }
      const prazo = avaliarPrazo(ficha);
      const blocos = plano.blocos;
      blocos.push({ tipo: "texto", texto: `Entendi: ${resumoDoCaso(ficha)}.` });
      if (prazo) {
        blocos.push({ tipo: "destaque", texto: prazo.texto, situacao: prazo.situacao, limite: prazo.limite ?? null, dias: prazo.dias ?? null });
        plano.explicacao.regras.push(...prazo.regras);
      }
      blocos.push({ tipo: "lista", estilo: "artigos", titulo: "O que a lei garante", itens: caso.artigos.map((a) => `${a.ref.charAt(0).toUpperCase()}${a.ref.slice(1)}: ${a.texto}`) });
      plano.explicacao.artigos = caso.artigos.map((a) => a.ref);
      const semDireito = prazo && ["nao_se_aplica", "fora"].includes(prazo.situacao) && ficha.caso === "arrependimento";
      if (!semDireito) {
        blocos.push({ tipo: "lista", estilo: "passos", titulo: "O que fazer agora", itens: BASE.CANAIS_DE_RECLAMACAO.slice() });
        blocos.push({ tipo: "lista", estilo: "documentos", titulo: "Junte estes documentos", itens: caso.documentos.slice() });
        blocos.push({ tipo: "reclamacao", texto: montarReclamacao(ficha) });
        plano.explicacao.regras.push("Reclamação montada a partir do modelo do caso, com os campos que faltam entre colchetes.");
      } else {
        plano.explicacao.regras.push("Sem direito aplicável pelo art. 49: não gerei reclamação para não induzir um pedido sem base.");
      }
      blocos.push({ tipo: "aviso", subtipo: "legal", texto: BASE.TEXTOS.aviso });
      plano.reclamacao = semDireito ? null : montarReclamacao(ficha);
      plano.situacaoPrazo = prazo ? prazo.situacao : null;
      return plano;
    }

    function responder(texto) {
      const percepcao = perceber(texto);
      const entendimento = entender(percepcao, hoje);
      lembrar("pessoa", percepcao.texto);
      const plano = executar(decidir(percepcao, entendimento));
      const resposta = {
        id: registro.length + 1,
        tipo: plano.tipo,
        blocos: plano.blocos,
        opcoes: plano.opcoes || [],
        explicacao: plano.explicacao,
        reclamacao: plano.reclamacao || null,
        situacaoPrazo: plano.situacaoPrazo || null,
        caso: ficha.caso,
        ficha: { ...ficha },
      };
      lembrar("lia", resposta.blocos.map((b) => b.texto || b.titulo || "").join(" ").slice(0, 200));
      registro.push({ id: resposta.id, tipo: resposta.tipo, caso: resposta.caso, avaliacao: null });
      if (plano.tipo === "orientacao") ficha = fichaVazia();
      return resposta;
    }

    return {
      responder,
      reiniciar() {
        ficha = fichaVazia();
        memoriaCurta = [];
        tentativasSemEntender = 0;
        avisouTom = false;
      },
      avaliar(id, nota) {
        const item = registro.find((r) => r.id === id);
        if (item) item.avaliacao = nota;
      },
      verFicha: () => ({ ...ficha }),
      verMemoriaCurta: () => memoriaCurta.map((m) => ({ ...m })),
      verRegistro: () => registro.map((r) => ({ ...r })),
    };
  }

  const api = { criarAgente, normalizar, mascararDadosPessoais, extrairTempo, perceber, entender, LIMITE_CARACTERES, TAMANHO_MEMORIA_CURTA };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    raiz.Lia = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
