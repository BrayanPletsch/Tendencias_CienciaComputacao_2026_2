(function () {
  const UI = window.LiaUI;
  const BASE = window.BaseConsumidor;
  const { icone, trocarMarcadores } = window.LiaIcones;
  const LIMITE = window.Lia.LIMITE_CARACTERES;

  // Conversas prontas para a apresentação: index.html?exemplo=1 até ?exemplo=4
  const DEMONSTRACOES = {
    1: ["Comprei um fogão pelo site há 5 dias e ele não liga", "Logo que recebi"],
    2: ["comprei uma geladeira na loja do shopping e quero devolver porque não gostei"],
    3: ["essa loja me cobrou duas vezes, meu cpf é 123.456.789-00", "Já paguei"],
    4: ["meu patrão não pagou meu salário"],
  };

  const parametros = new URLSearchParams(location.search);
  const modoFoto = parametros.has("foto");
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const celular = window.matchMedia("(max-width: 859px)");
  const ATRASO_DIGITANDO = movimentoReduzido.matches ? 0 : 450;

  const tela = {
    app: document.getElementById("app"),
    acoes: document.getElementById("acoes"),
    fecharFicha: document.getElementById("fechar-ficha"),
    veu: document.getElementById("veu"),
    ficha: document.getElementById("ficha"),
    progresso: document.getElementById("progresso-movel"),
    apoio: document.getElementById("apoio-relato"),
    slotConversa: document.getElementById("slot-conversa"),
    mensagens: document.getElementById("mensagens"),
    formulario: document.getElementById("formulario"),
    campo: document.getElementById("campo"),
    contador: document.getElementById("contador"),
  };

  const PLACEHOLDER_INICIO = tela.campo.placeholder;

  const estado = { agente: null, fila: Promise.resolve(), rodada: 0, confianca: null };

  function atualizarFicha(resposta) {
    const etapa = resposta.tipo === "orientacao" ? 2 : resposta.caso ? 1 : 0;
    const titulo = resposta.caso ? BASE.CASOS[resposta.caso].titulo : "";
    if (resposta.explicacao && resposta.explicacao.confianca) {
      estado.confianca = { caso: resposta.caso, valor: resposta.explicacao.confianca };
    }
    const confianca = estado.confianca && estado.confianca.caso === resposta.caso ? estado.confianca.valor : null;
    tela.ficha.replaceChildren(...UI.ficha({ etapa, titulo, confianca, campos: UI.camposDaFicha(resposta.ficha) }));
    tela.progresso.replaceChildren(...UI.progressoMovel(etapa, titulo));
  }

  function esperar(ms) {
    return new Promise((resolver) => setTimeout(resolver, ms));
  }

  function rolarAte(no, bloco) {
    if (modoFoto) return;
    no.scrollIntoView({ block: bloco, behavior: movimentoReduzido.matches ? "auto" : "smooth" });
  }

  function ajustarCampo() {
    tela.campo.style.height = "auto";
    tela.campo.style.height = `${tela.campo.scrollHeight}px`;
    tela.contador.textContent = `${tela.campo.value.length}/${LIMITE}`;
  }

  function trocarPlaceholder() {
    if (tela.app.dataset.estado === "inicio") tela.campo.placeholder = PLACEHOLDER_INICIO;
    else tela.campo.placeholder = celular.matches ? "Conte um novo detalhe" : "Escreva uma dúvida ou um novo detalhe";
  }

  function entrarNaConversa() {
    if (tela.app.dataset.estado === "conversa") return;
    tela.app.dataset.estado = "conversa";
    tela.slotConversa.append(tela.formulario);
    tela.formulario.classList.replace("compositor--grande", "compositor--linha");
    tela.campo.rows = 1;
    // Na conversa o rótulo "O que aconteceu?" some junto com o início, então o campo ganha outro nome.
    tela.campo.setAttribute("aria-label", "Sua mensagem");
    trocarPlaceholder();
    ajustarCampo();
  }

  function iniciarConversa() {
    estado.rodada += 1;
    estado.agente = window.Lia.criarAgente();
    estado.confianca = null;
    tela.mensagens.replaceChildren();
    tela.ficha.replaceChildren(...UI.ficha());
    tela.progresso.replaceChildren(...UI.progressoMovel(0));
  }

  async function processar(texto, rodada, daDemonstracao) {
    if (daDemonstracao) UI.marcarOpcao(tela.mensagens, texto);
    UI.desativarOpcoes(tela.mensagens);
    const { agente } = estado;
    const resposta = agente.responder(texto);
    const digitado = agente.verMemoriaCurta().filter((m) => m.autor === "pessoa").pop();
    tela.mensagens.append(UI.mensagemPessoa(digitado ? digitado.texto : texto));
    const indicador = UI.mensagemLia([UI.digitando()]);
    tela.mensagens.append(indicador);
    rolarAte(indicador, "end");
    await esperar(ATRASO_DIGITANDO);
    if (rodada !== estado.rodada) return;
    const mensagem = UI.respostaLia(resposta, {
      aoAvaliar: (nota) => agente.avaliar(resposta.id, nota),
      aoEscolher: (escolha) => enviar(escolha),
    });
    indicador.replaceWith(mensagem);
    atualizarFicha(resposta);
    rolarAte(mensagem, "start");
  }

  function enviar(texto, daDemonstracao = false) {
    if (!texto.trim()) return;
    entrarNaConversa();
    const rodada = estado.rodada;
    estado.fila = estado.fila.then(() => (rodada === estado.rodada ? processar(texto, rodada, daDemonstracao) : null));
  }

  const botaoFicha = UI.el("button", {
    classe: "btn-ico so-mobile",
    atributos: { type: "button", id: "ficha-botao", "aria-label": "Ver ficha do caso", "aria-expanded": "false", "aria-controls": "lado" },
  }, icone("documento"));

  function abrirFicha() {
    tela.app.classList.add("ficha-aberta");
    tela.veu.hidden = false;
    botaoFicha.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    tela.fecharFicha.focus();
  }

  function fecharFicha(devolverFoco = true) {
    if (!tela.app.classList.contains("ficha-aberta")) return;
    tela.app.classList.remove("ficha-aberta");
    tela.veu.hidden = true;
    botaoFicha.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (devolverFoco) botaoFicha.focus();
  }

  function voltarAoInicio() {
    fecharFicha(false);
    tela.app.dataset.estado = "inicio";
    tela.apoio.after(tela.formulario);
    tela.formulario.classList.replace("compositor--linha", "compositor--grande");
    tela.campo.rows = 3;
    tela.campo.removeAttribute("aria-label");
    trocarPlaceholder();
    iniciarConversa();
    ajustarCampo();
    window.scrollTo({ top: 0 });
    tela.campo.focus({ preventScroll: true });
  }

  const botaoNova = UI.el("button", {
    classe: "btn2 btn--topo",
    atributos: { type: "button", "aria-label": "Nova conversa" },
    aoClicar: voltarAoInicio,
  }, icone("recomecar"), UI.el("span", { classe: "rot", texto: "Nova conversa" }));

  botaoFicha.addEventListener("click", abrirFicha);
  tela.fecharFicha.addEventListener("click", () => fecharFicha());
  tela.veu.addEventListener("click", () => fecharFicha());
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharFicha();
  });
  celular.addEventListener("change", () => {
    if (!celular.matches) fecharFicha(false);
    trocarPlaceholder();
  });

  tela.acoes.append(botaoFicha, window.LiaTema.criarBotao(), botaoNova);
  document.getElementById("casos").replaceWith(UI.casos(UI.CASOS_INICIAIS, (exemplo) => {
    enviar(exemplo);
    tela.campo.focus();
  }));
  document.getElementById("rodape").replaceWith(UI.rodape());
  trocarMarcadores();

  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--doca-h", `${tela.slotConversa.offsetHeight}px`);
  }).observe(tela.slotConversa);

  tela.campo.maxLength = LIMITE;
  tela.campo.addEventListener("input", ajustarCampo);
  tela.campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      tela.formulario.requestSubmit();
    }
  });
  tela.formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    enviar(tela.campo.value);
    tela.campo.value = "";
    ajustarCampo();
    tela.campo.focus();
  });

  iniciarConversa();
  ajustarCampo();

  const relato = parametros.get("relato");
  if (relato) {
    tela.campo.value = relato.slice(0, LIMITE);
    ajustarCampo();
    tela.campo.focus();
  }

  const demonstracao = DEMONSTRACOES[parametros.get("exemplo")];
  if (demonstracao) demonstracao.forEach((texto) => enviar(texto, true));
})();
