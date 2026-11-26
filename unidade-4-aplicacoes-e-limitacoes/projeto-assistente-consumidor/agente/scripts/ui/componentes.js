(function (raiz) {
  const { icone } = raiz.LiaIcones;

  const REPOSITORIO = "https://github.com/BrayanPletsch/Tendencias_CienciaComputacao_2026_2/tree/main/unidade-4-aplicacoes-e-limitacoes";
  const PORTFOLIO = "https://www.brayan.blog";

  // Lista única para o início do app e para a landing: o resumo aparece na tela e o exemplo é o que vai para a Lia.
  const CASOS_INICIAIS = [
    { id: "defeito_produto", icone: "pacote", titulo: "Produto com defeito", resumo: "Celular chegou com a tela quebrada", exemplo: "Comprei um celular pela internet há 20 dias e veio com a tela quebrada" },
    { id: "arrependimento", icone: "sacola", titulo: "Arrependimento de compra", resumo: "Tênis comprado no site há 3 dias", exemplo: "Me arrependi de um tênis que comprei no site há 3 dias" },
    { id: "cobranca_indevida", icone: "cartao", titulo: "Cobrança indevida", resumo: "Mesma compra cobrada duas vezes", exemplo: "Me cobraram duas vezes a mesma compra no cartão" },
    { id: "nao_solicitado", icone: "bloqueio", titulo: "Algo que você não pediu", resumo: "Seguro na fatura sem pedir", exemplo: "Colocaram um seguro na minha fatura que eu nunca pedi" },
    { id: "oferta_descumprida", icone: "caminhao", titulo: "Atraso na entrega", resumo: "Pedido passou do prazo e não chegou", exemplo: "Meu pedido ainda não chegou e já passou do prazo" },
    { id: "servico_mal_prestado", icone: "ferramenta", titulo: "Serviço mal feito", resumo: "Reforma deixada pela metade", exemplo: "O pedreiro deixou a reforma pela metade" },
  ];

  // Os endereços externos ficam só aqui; as páginas estáticas marcam os links com data-repositorio e data-portfolio.
  function ligarLinks(raizBusca = document) {
    raizBusca.querySelectorAll("[data-repositorio]").forEach((link) => {
      link.href = REPOSITORIO;
    });
    raizBusca.querySelectorAll("[data-portfolio]").forEach((link) => {
      link.href = PORTFOLIO;
    });
  }

  function el(tag, opcoes = {}, ...filhos) {
    const no = document.createElement(tag);
    if (opcoes.classe) no.className = opcoes.classe;
    if (opcoes.texto !== undefined) no.textContent = opcoes.texto;
    for (const [nome, valor] of Object.entries(opcoes.atributos || {})) no.setAttribute(nome, valor);
    if (opcoes.aoClicar) no.addEventListener("click", opcoes.aoClicar);
    no.append(...filhos.filter(Boolean));
    return no;
  }

  function maiuscula(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function plural(n, singular, varios) {
    return n === 1 ? singular : varios;
  }

  // Destaca trechos sem passar texto por HTML: cada pedaço vira nó de texto ou <span>.
  // Com regex global marca todas as ocorrências; sem a flag g, só a primeira.
  function marcar(texto, padrao, classe) {
    const achados = padrao.global ? [...texto.matchAll(padrao)] : [texto.match(padrao)].filter(Boolean);
    const nos = [];
    let inicio = 0;
    for (const achado of achados) {
      nos.push(texto.slice(inicio, achado.index), el("span", { classe, texto: achado[0] }));
      inicio = achado.index + achado[0].length;
    }
    nos.push(texto.slice(inicio));
    return nos.filter((no) => no !== "");
  }

  function iconeCom(nome, classe) {
    const svg = icone(nome);
    svg.classList.add(classe);
    return svg;
  }

  function chip(texto, aoClicar) {
    return el("button", { classe: "chip", texto, atributos: { type: "button" }, aoClicar });
  }

  function apagar(botao) {
    botao.classList.add("chip--apagado");
    botao.disabled = true;
  }

  function escolher(grupo, botao) {
    grupo.querySelectorAll(".chip").forEach((outro) => {
      if (outro !== botao) apagar(outro);
    });
    botao.classList.add("chip-on");
    botao.prepend(icone("confere"));
    botao.setAttribute("aria-pressed", "true");
    botao.disabled = true;
  }

  function opcoes(lista, aoEscolher) {
    const grupo = el("div", { classe: "opcoes" });
    for (const texto of lista) {
      const botao = chip(texto, () => {
        escolher(grupo, botao);
        aoEscolher(texto);
      });
      botao.setAttribute("aria-pressed", "false");
      grupo.append(botao);
    }
    return grupo;
  }

  // Marca o chip com o mesmo texto sem disparar o envio de novo. A demonstração usa isso porque a mensagem já está na fila.
  function marcarOpcao(raizBusca, texto) {
    const botao = [...raizBusca.querySelectorAll(".opcoes .chip:not(:disabled)")].find((b) => b.textContent === texto);
    if (botao) escolher(botao.closest(".opcoes"), botao);
  }

  function desativarOpcoes(raizBusca) {
    raizBusca.querySelectorAll(".opcoes .chip:not(:disabled)").forEach(apagar);
  }

  const SITUACOES = {
    dentro: { variante: "ok", texto: "Dentro do prazo", icone: "confere" },
    direito: { variante: "ok", texto: "Seu direito", icone: "confere" },
    indefinida: { variante: "alerta", texto: "Confira a data", icone: "alerta" },
    fora: { variante: "erro", texto: "Prazo vencido", icone: "relogio" },
    nao_se_aplica: { variante: "erro", texto: "Não se aplica", icone: "xcirculo" },
  };

  function selo(nome) {
    const s = SITUACOES[nome] || SITUACOES.indefinida;
    return el("span", { classe: `selo selo--${s.variante}` }, icone(s.icone), el("span", { texto: s.texto }));
  }

  function mensagemPessoa(texto) {
    const p = el("p", { classe: "mensagem mensagem--pessoa" });
    texto.split("[dado pessoal removido]").forEach((parte, i) => {
      if (i > 0) p.append(el("span", { classe: "dado-removido", texto: "DADO REMOVIDO" }));
      p.append(parte);
    });
    return p;
  }

  function mensagemLia(conteudo) {
    return el("div", { classe: "mensagem mensagem--lia" },
      el("span", { classe: "marca", texto: "lia", atributos: { "aria-hidden": "true" } }),
      el("div", { classe: "mensagem__corpo" }, ...conteudo));
  }

  function digitando() {
    return el("div", { classe: "digitando", atributos: { role: "status", "aria-label": "A Lia está escrevendo" } },
      el("span"), el("span"), el("span"));
  }

  function valorGrande(numero, unidade, apoio, legenda = false) {
    return el("p", { classe: "prazo__valor" },
      el("span", { classe: "prazo__numero", texto: numero }),
      unidade ? el("span", { classe: "prazo__unidade", texto: unidade }) : null,
      el("span", { classe: legenda ? "prazo__legenda" : "prazo__de", texto: apoio }));
  }

  function frase(texto) {
    return el("p", { classe: "prazo__frase", texto });
  }

  const DIREITOS = {
    cobranca_indevida: (pagou) => (pagou ? valorGrande("2×", null, "o valor cobrado a mais, de volta", true) : frase("Conteste antes de pagar")),
    nao_solicitado: (pagou) => (pagou
      ? valorGrande("2×", null, "o que você pagou sem pedir, de volta", true)
      : valorGrande("R$ 0", null, "você não paga pelo que não pediu", true)),
    oferta_descumprida: () => valorGrande("3", null, "opções: entrega, outro produto ou dinheiro de volta", true),
  };

  const INICIO_DA_CONTAGEM = { servico_mal_prestado: "Fim do serviço", arrependimento: "Recebimento" };

  function prazo(destaque, ficha) {
    const { situacao, limite, dias } = destaque;
    let chamada = ficha.caso === "arrependimento" ? "Seu prazo para desistir" : "Seu prazo para reclamar";
    let valor = null;
    let carimbo = null;
    let ruim = false;
    let usado = null;

    if (situacao === "dentro" || situacao === "fora") {
      ruim = situacao === "fora";
      const restantes = ruim ? 0 : limite - dias;
      valor = valorGrande(String(restantes), plural(restantes, "dia", "dias"), `restantes de ${limite}`);
      carimbo = ruim ? ["Prazo vencido", "carimbo carimbo--ruim"] : ["Dentro do prazo", "carimbo"];
      usado = ruim ? 100 : Math.max(2, (dias / limite) * 100);
    } else if (situacao === "indefinida") {
      valor = limite ? valorGrande(String(limite), "dias", "de prazo no total") : frase("30 ou 90 dias");
      carimbo = ["Confira a data", "carimbo carimbo--confira"];
    } else if (situacao === "nao_se_aplica") {
      chamada = "Arrependimento (art. 49)";
      valor = frase("Não se aplica");
      carimbo = ["Não se aplica", "carimbo carimbo--ruim"];
      ruim = true;
    } else {
      chamada = "Seu direito";
      valor = DIREITOS[ficha.caso] ? DIREITOS[ficha.caso](ficha.pagou) : null;
    }

    const secao = el("section", { classe: ruim ? "prazo prazo--ruim" : "prazo" }, el("p", { classe: "ey", texto: chamada }), valor);
    if (carimbo) secao.append(el("span", { classe: carimbo[1], texto: carimbo[0] }));
    if (usado !== null) {
      const cheia = el("div", { classe: "barra__cheia" });
      cheia.style.width = `${usado}%`;
      secao.append(el("div", { classe: "prazo__linha" },
        el("div", { classe: "barra", atributos: { role: "img", "aria-label": `${dias} de ${limite} dias usados` } }, cheia),
        el("div", { classe: "barra__marcas" },
          el("span", { texto: ficha.oculto ? "Defeito apareceu" : INICIO_DA_CONTAGEM[ficha.caso] || "Entrega" }),
          el("span", { texto: `Hoje, dia ${dias}` }),
          el("span", { texto: `Dia ${limite}` }))));
    }
    secao.append(el("p", { classe: "prazo__texto", texto: destaque.texto }));
    return secao;
  }

  const GRIFO = /você escolhe|em dobro|desistir em até 7 dias/i;

  function listaArtigos(itens) {
    return el("dl", { classe: "artigos" }, ...itens.map((item) => {
      const corte = item.indexOf(": ");
      return el("div", {},
        el("dt", { texto: item.slice(0, corte) }),
        el("dd", {}, ...marcar(maiuscula(item.slice(corte + 2)), GRIFO, "grifo")));
    }));
  }

  // Começos dos textos de CANAIS_DE_RECLAMACAO (base-conhecimento.js). Se a base mudar e o começo não bater, o passo sai sem negrito.
  const COMECOS_DOS_PASSOS = [
    "Fale primeiro com a empresa",
    "Se não resolver, registre no consumidor.gov.br",
    "Outra opção é o Procon do seu estado",
    "Se nada funcionar, o Juizado Especial Cível",
  ];

  function listaPassos(itens) {
    return el("ol", { classe: "passos" }, ...itens.map((texto, i) => {
      const comeco = COMECOS_DOS_PASSOS.find((inicio) => texto.startsWith(inicio));
      return el("li", {},
        el("span", { classe: "passos__n", texto: String(i + 1), atributos: { "aria-hidden": "true" } }),
        el("span", {}, comeco ? el("strong", { texto: comeco }) : null, comeco ? texto.slice(comeco.length) : texto));
    }));
  }

  function listaDocumentos(itens) {
    return el("ul", { classe: "documentos" }, ...itens.map((texto) =>
      el("li", {}, el("label", {}, el("input", { atributos: { type: "checkbox" } }), el("span", { texto: maiuscula(texto) })))));
  }

  const LISTAS = {
    artigos: { classe: "secao", montar: listaArtigos },
    passos: { classe: "secao", montar: listaPassos },
    documentos: { classe: "secao doc", montar: listaDocumentos },
  };

  function copiarPorSelecao(texto) {
    const area = el("textarea");
    area.value = texto;
    document.body.append(area);
    area.select();
    const copiou = document.execCommand("copy");
    area.remove();
    return copiou;
  }

  // A área de transferência pode recusar a escrita (página sem foco, permissão negada); aí a cópia tenta pela seleção.
  function copiarTexto(texto) {
    if (!navigator.clipboard || !window.isSecureContext) return Promise.resolve(copiarPorSelecao(texto));
    return navigator.clipboard.writeText(texto).then(() => true, () => copiarPorSelecao(texto));
  }

  function baixarArquivo(nome, conteudo, tipo) {
    const link = el("a", { atributos: { download: nome } });
    link.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const CAMPO_A_COMPLETAR = /\[[^\]]+\]/g;

  function carta(texto) {
    return el("div", { classe: "carta" }, ...texto.split(/\n\s*\n/).filter((paragrafo) => paragrafo.trim()).map((paragrafo) =>
      el("p", {}, ...paragrafo.split("\n").flatMap((linha, i) => [i > 0 ? el("br") : null, ...marcar(linha, CAMPO_A_COMPLETAR, "ph")]))));
  }

  function secaoCarta(texto) {
    const campos = (texto.match(CAMPO_A_COMPLETAR) || []).length;
    const rotulo = el("span", { texto: "Copiar texto", atributos: { "aria-live": "polite" } });
    const copiar = el("button", { classe: "btn", atributos: { type: "button" } }, icone("copiar"), rotulo);
    let espera = null;
    copiar.addEventListener("click", () => copiarTexto(texto).then((copiou) => {
      if (!copiou) return;
      rotulo.textContent = "Copiado";
      copiar.firstChild.replaceWith(icone("confere"));
      clearTimeout(espera);
      espera = setTimeout(() => {
        rotulo.textContent = "Copiar texto";
        copiar.firstChild.replaceWith(icone("copiar"));
      }, 2000);
    }));
    const baixar = el("button", { classe: "btn2", atributos: { type: "button" }, aoClicar: () => baixarArquivo("reclamacao.txt", texto, "text/plain;charset=utf-8") },
      icone("baixar"), el("span", { texto: "Baixar .txt" }));
    return el("section", { classe: "secao secao--carta" },
      el("div", { classe: "carta__cabecalho" },
        el("h3", { classe: "secao__titulo", texto: "Texto da reclamação" }),
        campos ? el("span", { classe: "carta__contagem", texto: `${campos} ${plural(campos, "campo grifado", "campos grifados")} para completar` }) : null),
      carta(texto),
      el("div", { classe: "carta__acoes" }, copiar, baixar));
  }

  function avisoLegal(texto) {
    return el("footer", { classe: "orientacao__aviso" }, icone("info"), el("span", { texto }));
  }

  function bloco(dados, ficha = {}) {
    switch (dados.tipo) {
      case "texto":
        return el("p", { texto: dados.texto });
      case "aviso":
        return dados.subtipo === "legal" ? avisoLegal(dados.texto) : el("div", { classe: "aviso-privacidade" }, icone("cadeado"), el("span", { texto: dados.texto }));
      case "destaque":
        return prazo(dados, ficha);
      case "lista": {
        const lista = LISTAS[dados.estilo] || LISTAS.passos;
        return el("section", { classe: lista.classe }, el("h3", { classe: "secao__titulo", texto: dados.titulo }), lista.montar(dados.itens));
      }
      case "reclamacao":
        return secaoCarta(dados.texto);
      default:
        return null;
    }
  }

  function explicacao(dados) {
    const itens = [];
    if (dados.trechos.length) itens.push(`Palavras que indicaram o caso: ${[...new Set(dados.trechos)].join(", ")}.`);
    if (dados.confianca) itens.push(`Confiança na identificação: ${dados.confianca}.`);
    itens.push(...dados.regras);
    if (dados.artigos.length) itens.push(`Artigos do CDC usados: ${dados.artigos.join("; ")}.`);
    if (!itens.length) itens.push("Resposta padrão, sem regra de caso aplicada.");
    return el("details", { classe: "porque" },
      el("summary", {}, el("span", { texto: "Por que recebi esta resposta?" }), icone("abaixo")),
      el("ul", {}, ...itens.map((texto) => el("li", { texto }))));
  }

  function avaliacao(aoAvaliar) {
    const caixa = el("div", { classe: "avaliacao", atributos: { "aria-live": "polite" } }, el("span", { texto: "Esta resposta ajudou?" }));
    for (const [texto, nota] of [["Sim", "ajudou"], ["Não", "nao_ajudou"]]) {
      caixa.append(chip(texto, () => {
        aoAvaliar(nota);
        caixa.replaceChildren(el("span", { classe: "avaliacao__obrigada", texto: "Obrigada. A avaliação entra no registro de curadoria." }));
      }));
    }
    return caixa;
  }

  function respostaLia(resposta, { aoAvaliar, aoEscolher } = {}) {
    const corpo = [];
    let cartao = null;
    for (const dados of resposta.blocos) {
      if (!cartao && ["destaque", "lista", "reclamacao"].includes(dados.tipo)) {
        cartao = el("article", { classe: "orientacao" });
        corpo.push(cartao);
      }
      const no = bloco(dados, resposta.ficha);
      if (no && cartao) cartao.append(no);
      else if (no) corpo.push(no);
    }
    if (resposta.opcoes && resposta.opcoes.length && aoEscolher) corpo.push(opcoes(resposta.opcoes, aoEscolher));
    const rodape = el("div", { classe: "resposta__rodape" },
      resposta.explicacao ? explicacao(resposta.explicacao) : null,
      aoAvaliar ? avaliacao(aoAvaliar) : null);
    if (rodape.childElementCount) corpo.push(rodape);
    return mensagemLia(corpo);
  }

  function casos(lista, aoEscolher) {
    return el("div", { classe: "casos" }, ...lista.map((caso) =>
      el("button", { classe: "caso", atributos: { type: "button" }, aoClicar: () => aoEscolher(caso.exemplo) },
        icone(caso.icone),
        el("span", { classe: "caso__texto" },
          el("span", { classe: "caso__titulo", texto: caso.titulo }),
          el("span", { classe: "caso__resumo", texto: caso.resumo })),
        iconeCom("seta-direita", "seta"))));
  }

  const ROTULOS = {
    produto: "Produto", canal: "Onde comprou", duravel: "Durabilidade", oculto: "Defeito apareceu",
    dias: "Há quantos dias", pagou: "Já pagou", prazoPrometido: "Prazo de entrega", valor: "Valor", pendente: "Aguardando",
  };

  const CLASSES = { dias: "mono", pendente: "pendente" };

  const PENDENCIAS = {
    canal: "onde você comprou", duravel: "se dura ou acaba rápido", oculto: "quando o defeito apareceu", dias: "há quantos dias",
    diasRecebimento: "quando o produto chegou", pagou: "se você já pagou", prazoPrometido: "se houve prazo de entrega", ambiguo: "qual é o caso",
  };

  function legivel(chave, valor) {
    if (valor === null || valor === undefined || valor === "desconhecido" || valor === -1) return null;
    switch (chave) {
      case "produto": return valor.nome;
      case "canal": return valor === "fora" ? "fora da loja" : "loja física";
      case "duravel": return valor ? "feito para durar" : "acaba rápido";
      case "oculto": return valor ? "depois de um tempo de uso" : "logo que chegou";
      case "pagou": case "prazoPrometido": return valor ? "sim" : "não";
      case "valor": return `R$ ${valor}`;
      case "pendente": return PENDENCIAS[valor] || valor;
      default: return String(valor);
    }
  }

  function camposDaFicha(dados) {
    return Object.keys(ROTULOS)
      .map((chave) => ({ chave, valor: legivel(chave, dados[chave]) }))
      .filter(({ valor }) => valor !== null)
      .map(({ chave, valor }) => ({ rotulo: ROTULOS[chave], valor, classe: CLASSES[chave] }));
  }

  // Cartões de caso da landing (e a amostra no design system): ícone, fala e link vêm de CASOS_INICIAIS.
  function preencherCasos(raizBusca = document) {
    for (const caso of CASOS_INICIAIS) {
      const cartao = raizBusca.querySelector(`[data-caso="${caso.id}"]`);
      if (!cartao) continue;
      cartao.href = `conversa.html?relato=${encodeURIComponent(caso.exemplo)}`;
      cartao.prepend(icone(caso.icone));
      cartao.querySelector(".caso__fala").textContent = `“${caso.exemplo}.”`;
    }
  }

  const ETAPAS = [
    ["Relato", "Você conta o que aconteceu"],
    ["Complemento", "A Lia pergunta o que falta"],
    ["Orientação", "Prazo, direitos e reclamação"],
  ];

  function classeDaEtapa(i, atual) {
    if (i < atual) return "feito";
    return i === atual ? "atual" : "";
  }

  function passoAtual(i, atual) {
    return i === atual ? { "aria-current": "step" } : {};
  }

  function ficha({ etapa = 0, titulo = "", confianca = null, campos = [] } = {}) {
    if (!etapa) {
      return [
        el("ol", { classe: "etapas", atributos: { "aria-label": "Etapas da conversa" } }, ...ETAPAS.map(([nome, descricao], i) =>
          el("li", { classe: classeDaEtapa(i, 0), atributos: passoAtual(i, 0) },
            el("span", { classe: "etapas__n", texto: String(i + 1) }),
            el("span", { classe: "etapas__texto" },
              el("span", { classe: "etapas__titulo", texto: nome }),
              el("span", { classe: "etapas__descricao", texto: descricao }))))),
        el("p", { classe: "ficha-vazia", texto: "Os dados do caso aparecem aqui conforme você conta." }),
      ];
    }
    return [
      el("ol", { classe: "progresso", atributos: { "aria-label": "Andamento do caso" } }, ...ETAPAS.map(([nome], i) =>
        el("li", { classe: classeDaEtapa(i, etapa), atributos: passoAtual(i, etapa) },
          el("span", { classe: "progresso__barra" }), el("span", { classe: "progresso__nome", texto: nome })))),
      el("div", { classe: "ficha__caso" },
        el("p", { classe: "ficha__titulo", texto: titulo }),
        confianca ? el("p", { classe: "ficha__confianca", texto: `Identificado com confiança ${confianca}` }) : null),
      campos.length ? el("dl", { classe: "ficha__dados" }, ...campos.map(({ rotulo, valor, classe }) =>
        el("div", {}, el("dt", { texto: rotulo }), el("dd", { classe, texto: valor })))) : null,
    ].filter(Boolean);
  }

  function progressoMovel(etapa, titulo) {
    return [
      el("div", { classe: "progresso-movel__barras", atributos: { "aria-hidden": "true" } },
        ...ETAPAS.map((_, i) => el("span", { classe: classeDaEtapa(i, etapa) }))),
      el("p", { classe: "progresso-movel__texto", texto: etapa ? `${titulo} · ${ETAPAS[etapa][0]}` : ETAPAS[0][0] }),
    ];
  }

  function rodape() {
    const link = (href, texto) => el("a", { texto, atributos: { href } });
    return el("footer", { classe: "rodape" },
      el("div", { classe: "rodape__linha" },
        el("p", { classe: "rodape__aviso" }, el("span", { classe: "marca", texto: "lia" }), el("span", { texto: "Protótipo acadêmico. As orientações são só informativas e não me responsabilizo por decisões tomadas com base nelas." })),
        el("nav", { classe: "rodape__links", atributos: { "aria-label": "Rodapé" } },
          link("index.html", "Sobre a Lia"), link("design-system.html", "Design system"), link(REPOSITORIO, "GitHub"),
          link(PORTFOLIO, "Meu portfólio"), link("index.html#contato", "Entrar em contato"))),
      el("p", { texto: "Avaliação Regimental A1 · Tendências em Ciência da Computação · UDF 2026/2 · Brayan Aragão Pletsch" }));
  }

  raiz.LiaUI = {
    el, opcoes, marcarOpcao, desativarOpcoes, selo, mensagemPessoa, mensagemLia, digitando, prazo, listaArtigos, listaPassos,
    carta, bloco, explicacao, avaliacao, respostaLia, casos, preencherCasos, ficha, camposDaFicha, progressoMovel, rodape,
    ligarLinks, CASOS_INICIAIS, SITUACOES,
  };
})(window);
