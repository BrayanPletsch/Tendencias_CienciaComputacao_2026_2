(function () {
  const UI = window.LiaUI;
  const BASE = window.BaseConsumidor;
  const { icone, nomes, trocarMarcadores } = window.LiaIcones;
  const { el } = UI;
  const nada = () => {};

  // Os valores saem do tokens.css já carregado: o claro do <html> e o escuro de um elemento escondido com data-tema="escuro".
  const claro = document.documentElement;
  const escuro = el("div", { atributos: { "data-tema": "escuro", hidden: "" } });
  document.body.append(escuro);

  function ler(alvo, token) {
    return getComputedStyle(alvo).getPropertyValue(token).trim();
  }

  function com(no, estilos) {
    Object.assign(no.style, estilos);
    return no;
  }

  const CORES = [
    { nome: "Tinta", fundo: "--forte", valor: () => ler(claro, "--forte"), uso: "Texto forte, blocos de destaque, rodapé." },
    { nome: "Papel", fundo: "--bg", valor: () => `${ler(claro, "--bg")} · ${ler(claro, "--painel")}`, uso: "Fundo e painel lateral.", borda: true },
    { nome: "Cobalto", fundo: "--acao", valor: () => `${ler(claro, "--acao")} · escuro ${ler(escuro, "--acao")}`, uso: "Ação principal, links, etapa atual. Texto branco por cima." },
    { nome: "Marca-texto", fundo: "--grifo", valor: () => ler(claro, "--grifo"), uso: "Grifo, prazo sobre tinta, campos a completar, a marca. Texto sempre em tinta." },
  ];

  const TOKENS = [
    { tokens: ["--bg"], uso: "Fundo da página" },
    { tokens: ["--bg2"], uso: "Fundo de apoio: hover, cabeçalho de tabela, aviso legal" },
    { tokens: ["--painel"], uso: "Painel da ficha" },
    { tokens: ["--card"], uso: "Cartões e campos" },
    { tokens: ["--forte"], uso: "Títulos, balão da pessoa" },
    { tokens: ["--texto"], uso: "Texto corrido" },
    { tokens: ["--apoio"], uso: "Legendas e rótulos (AA nos dois fundos)" },
    { tokens: ["--linha", "--linha-forte"], uso: "Fios entre itens; bordas de botão, chip e campo" },
    { tokens: ["--acao", "--acao-hover"], uso: "Botão principal, etapa atual; o mesmo com o mouse em cima" },
    { tokens: ["--sobre-acao"], uso: "Texto sobre o botão principal" },
    { tokens: ["--link", "--link-bg"], uso: "Links e artigos de lei; chip escolhido e anel de foco do campo" },
    { tokens: ["--bloco", "--bloco-linha"], uso: "Bloco de prazo, faixa de frases e privacidade; fios dentro dele" },
    { tokens: ["--sobre-bloco", "--sobre-bloco-apoio"], uso: "Texto e legendas sobre o bloco escuro" },
    { tokens: ["--grifo", "--sobre-grifo"], uso: "Marca-texto e o texto por cima dele" },
    { tokens: ["--grifo-h"], uso: "Altura do grifo: por baixo da palavra no claro, a palavra inteira no escuro" },
    { tokens: ["--grifo-cor", "--grifo-cor-ini"], uso: "Cor da palavra grifada; cor antes do grifo animado da landing" },
    { tokens: ["--ok", "--ok-bg"], uso: "Situação boa, sempre com ícone e palavra" },
    { tokens: ["--erro", "--erro-bg"], uso: "Prazo vencido, não se aplica, campo inválido" },
    { tokens: ["--alerta", "--alerta-bg"], uso: "Confira a data, aviso de dado pessoal" },
    { tokens: ["--papel"], uso: "Texto da reclamação" },
    { tokens: ["--sombra"], uso: "Cartão de orientação e formulário de contato" },
    { tokens: ["--sombra-alta"], uso: "Cartão da demonstração e gaveta da ficha" },
    { tokens: ["--rodape", "--rodape-linha"], uso: "Footer escuro e o fio dele (só no tema escuro)" },
    { tokens: ["--rolagem", "--rolagem-hover", "--rolagem-trilho"], uso: "Barra de rolagem" },
  ];

  function amostraDoToken(alvo, token, valor) {
    if (token === "--grifo-h") return null;
    if (token.startsWith("--sombra")) return com(el("span", { classe: "sw" }), { background: ler(alvo, "--card"), boxShadow: valor });
    return com(el("span", { classe: "sw" }), { background: valor });
  }

  // As amostras ficam sobre o fundo do próprio tema, senão as cores translúcidas do escuro somem no branco da página.
  function celulaDoTema(alvo, linha) {
    const valores = linha.tokens.map((token) => ler(alvo, token));
    const amostras = linha.tokens.map((token, i) => amostraDoToken(alvo, token, valores[i])).filter(Boolean);
    return el("td", {}, el("span", { classe: "tk__cores" },
      amostras.length ? com(el("span", { classe: "tk__fundo" }, ...amostras), { background: ler(alvo, "--bg") }) : null,
      el("span", { classe: "mono tk__valor", texto: valores.join(" · ") })));
  }

  document.getElementById("cores").replaceChildren(...CORES.map((cor) => el("div", { classe: "cor" },
    com(el("div", { classe: cor.borda ? "cor__amostra cor__amostra--borda" : "cor__amostra" }), { background: `var(${cor.fundo})` }),
    el("strong", { texto: cor.nome }),
    el("span", { classe: "mono", texto: cor.valor() }),
    el("span", { classe: "cor__uso", texto: cor.uso }))));

  document.getElementById("tokens").replaceChildren(...TOKENS.map((linha) => el("tr", {},
    el("td", { classe: "mono tk__nome" }, ...linha.tokens.flatMap((token, i) => [i ? el("br") : null, token])),
    celulaDoTema(claro, linha),
    celulaDoTema(escuro, linha),
    el("td", { texto: linha.uso }))));

  const MARCAS = [
    [34, "Footer da landing"], [32, "Painel do app"], [30, "Topo da landing"], [26, "Topo do app no celular"],
    [20, "Footer do design system"], [16, "Rodapé do app"], [14, "Mensagem da Lia (13 no celular)"],
  ];
  document.getElementById("marcas").replaceChildren(...MARCAS.map(([tamanho, onde]) => el("li", {},
    com(el("span", { classe: "marca", texto: "lia", atributos: { "aria-hidden": "true" } }), { fontSize: `${tamanho}px` }),
    el("span", { classe: "mono", texto: `${tamanho} px` }),
    el("span", { texto: onde }))));

  document.getElementById("icones").replaceChildren(...nomes.map((nome) =>
    el("li", {}, icone(nome), el("span", { classe: "mono", texto: nome }))));

  const ESPACOS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 64, 72, 80, 112, 128];
  document.getElementById("espacos").replaceChildren(...ESPACOS.map((px) => el("li", {},
    el("span", { classe: "mono", texto: String(px) }),
    com(el("span", { classe: "espacos__barra" }), { width: `${px}px` }))));

  const RAIOS = [
    [4, "Marca e campo grifado"], [6, "Carimbo"], [8, "Selo e número da etapa"], [10, "Amostra de cor"],
    [12, "Botão, campo, documento e carta"], [14, "Campo no celular"], [16, "Campo grande e cartão de caso"],
    [18, "Balão da pessoa"], [20, "Cartão de orientação"], [28, "Bloco de privacidade"], [999, "Chip e botão de topo"],
  ];
  document.getElementById("raios").replaceChildren(...RAIOS.map(([px, uso]) => el("li", {},
    com(el("span", { classe: "raios__amostra" }), { borderRadius: `${px}px` }),
    el("span", { classe: "mono", texto: String(px) }),
    el("span", { texto: uso }))));

  // Os exemplos saem de conversas de verdade com o agente, para a página nunca mostrar um componente diferente do app.
  function conversar(...mensagens) {
    const agente = window.Lia.criarAgente({ hoje: "2026-11-26" });
    const respostas = mensagens.map((mensagem) => agente.responder(mensagem));
    return { agente, respostas, ultima: respostas[respostas.length - 1] };
  }

  const bloco = (resposta, tipo, detalhe) => resposta.blocos.find((b) => b.tipo === tipo && (!detalhe || b.estilo === detalhe || b.subtipo === detalhe));
  const titulo = (resposta) => (resposta.caso ? BASE.CASOS[resposta.caso].titulo : "");
  const estado = (rotulo, ...conteudo) => el("div", { classe: "estado" }, el("p", { classe: "peca__subtitulo mono", texto: rotulo }), ...conteudo);
  const orientacao = (...conteudo) => el("article", { classe: "orientacao" }, ...conteudo);

  const [fogaoPergunta, fogaoOrientacao] = conversar("Comprei um fogão pelo site há 5 dias e ele não liga", "Logo que recebi").respostas;
  const arrependimento = conversar("Me arrependi de um tênis que comprei no site há 5 dias").ultima;
  const comCpf = conversar("essa loja me cobrou duas vezes, meu cpf é 123.456.789-00");
  const cobrancaPergunta = comCpf.ultima;

  const chipsEscolhido = UI.opcoes(fogaoPergunta.opcoes, nada);
  UI.marcarOpcao(chipsEscolhido, fogaoPergunta.opcoes[0]);
  const chipsApagados = UI.opcoes(fogaoPergunta.opcoes, nada);
  UI.desativarOpcoes(chipsApagados);
  document.getElementById("peca-chips").append(
    estado("Esperando resposta", UI.opcoes(cobrancaPergunta.opcoes, nada)),
    estado("Escolhido com um toque", chipsEscolhido),
    estado("A pessoa digitou em vez de tocar", chipsApagados));
  document.getElementById("peca-selos").append(...Object.keys(UI.SITUACOES).map(UI.selo));

  document.getElementById("peca-casos").append(UI.casos(UI.CASOS_INICIAIS, nada));

  const confianca = fogaoPergunta.explicacao.confianca;
  const painel = (rotulo, ficha) => estado(rotulo,
    el("div", { classe: "guia__painel" }, el("p", { classe: "ey", texto: "Ficha do caso" }), el("div", { classe: "ficha" }, ...ficha)));
  document.getElementById("peca-ficha").append(
    painel("Antes do relato", UI.ficha()),
    painel("Caso identificado, falta um dado", UI.ficha({ etapa: 1, titulo: titulo(fogaoPergunta), confianca, campos: UI.camposDaFicha(fogaoPergunta.ficha) })),
    painel("Orientação", UI.ficha({ etapa: 2, titulo: titulo(fogaoOrientacao), confianca, campos: UI.camposDaFicha(fogaoOrientacao.ficha) })));
  document.getElementById("peca-progresso").append(
    ...[[0, ""], [1, titulo(fogaoPergunta)], [2, titulo(fogaoOrientacao)]].map(([etapa, nome]) =>
      el("div", { classe: "progresso-movel guia__movel" }, ...UI.progressoMovel(etapa, nome))));

  const relatoMascarado = comCpf.agente.verMemoriaCurta().find((m) => m.autor === "pessoa").texto;
  document.getElementById("peca-mensagens").append(
    UI.mensagemPessoa(relatoMascarado),
    UI.respostaLia(cobrancaPergunta, { aoAvaliar: nada, aoEscolher: nada }),
    UI.mensagemPessoa("Já paguei"),
    UI.mensagemLia([UI.digitando()]));

  document.getElementById("peca-prazo").append(orientacao(UI.prazo(bloco(arrependimento, "destaque"), arrependimento.ficha)));

  const inicioDaCarta = arrependimento.reclamacao.split(/\n\s*\n/).slice(0, 2).join("\n\n");
  document.getElementById("peca-lei").append(
    UI.listaArtigos(bloco(arrependimento, "lista", "artigos").itens.slice(0, 1)),
    UI.listaPassos(bloco(arrependimento, "lista", "passos").itens.slice(0, 1)),
    UI.carta(inicioDaCarta));

  const VARIANTES = [
    ["Dentro do prazo", ["Comprei um fogão pelo site há 5 dias e ele não liga", "Logo que recebi"]],
    ["Prazo vencido", ["Comprei um fogão pelo site há 120 dias e ele não liga", "Logo que recebi"]],
    ["Sem a data da compra", ["Comprei uma geladeira pela internet e ela não gela", "Logo que recebi", "não lembro", "não lembro"]],
    ["Sem saber se o produto dura", ["Comprei um produto pela internet há 10 dias e veio com defeito", "não sei", "não sei"]],
    ["Direito que não se aplica", ["comprei uma geladeira na loja do shopping e quero devolver porque não gostei"]],
    ["Cobrança já paga", ["me cobraram duas vezes a mesma compra no cartão", "Já paguei"]],
    ["Cobrança ainda não paga", ["me cobraram duas vezes a mesma compra no cartão", "Ainda não paguei"]],
    ["Algo não pedido, ainda não pago", ["Colocaram um seguro na minha fatura que eu nunca pedi", "Ainda não paguei"]],
    ["Entrega atrasada", ["Meu pedido ainda não chegou e já passou do prazo"]],
  ];
  document.getElementById("peca-prazos").append(...VARIANTES.map(([rotulo, mensagens]) => {
    const { ultima } = conversar(...mensagens);
    return el("figure", { classe: "prazos__item" },
      orientacao(UI.prazo(bloco(ultima, "destaque"), ultima.ficha)),
      el("figcaption", { classe: "peca__subtitulo mono", texto: rotulo }));
  }));

  const porque = UI.explicacao(fogaoPergunta.explicacao);
  porque.open = true;
  document.getElementById("peca-porque").append(estado("Por que recebi esta resposta, aberto", porque), estado("Avaliação", UI.avaliacao(nada)));

  document.getElementById("peca-avisos").append(
    estado("Dado pessoal apagado", UI.bloco(bloco(cobrancaPergunta, "aviso", "percepcao"))),
    estado("Aviso legal, no fim da orientação", orientacao(UI.bloco(bloco(fogaoOrientacao, "aviso", "legal")))));

  document.getElementById("peca-orientacao").append(UI.respostaLia(fogaoOrientacao, { aoAvaliar: nada, aoEscolher: nada }));
  document.getElementById("peca-rodape").append(UI.rodape());

  UI.preencherCasos(document.getElementById("peca-vitrine"));
  UI.ligarLinks();
  trocarMarcadores();
})();
