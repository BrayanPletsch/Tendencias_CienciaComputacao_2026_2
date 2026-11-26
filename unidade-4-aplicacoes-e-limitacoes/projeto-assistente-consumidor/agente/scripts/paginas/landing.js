(function () {
  const UI = window.LiaUI;
  const { trocarMarcadores } = window.LiaIcones;
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.getElementById("acoes-topo").prepend(window.LiaTema.criarBotao());
  UI.ligarLinks();

  UI.preencherCasos();

  // A faixa corre até -50%: com a segunda cópia igual, o recomeço não aparece.
  const trilho = document.querySelector(".trilho");
  const copia = trilho.firstElementChild.cloneNode(true);
  copia.setAttribute("aria-hidden", "true");
  trilho.append(copia);

  trocarMarcadores();

  const topo = document.getElementById("topo-pagina");
  const botaoMenu = document.getElementById("menu-botao");
  const largo = window.matchMedia("(min-width: 1024px)");

  function abrirMenu(abrir) {
    topo.classList.toggle("menu-aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
  }

  botaoMenu.addEventListener("click", () => abrirMenu(botaoMenu.getAttribute("aria-expanded") !== "true"));
  document.getElementById("menu").addEventListener("click", (evento) => {
    if (evento.target.closest("a")) abrirMenu(false);
  });
  document.addEventListener("click", (evento) => {
    if (topo.classList.contains("menu-aberto") && !topo.contains(evento.target)) abrirMenu(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape" || !topo.classList.contains("menu-aberto")) return;
    abrirMenu(false);
    botaoMenu.focus();
  });
  largo.addEventListener("change", () => abrirMenu(false));

  const botaoTopo = document.getElementById("topo-btn");
  let visivel = false;
  let agendado = false;

  function conferirRolagem() {
    agendado = false;
    topo.classList.toggle("topo--rolado", window.scrollY > 4);
    const mostrar = window.scrollY > 600;
    if (mostrar === visivel) return;
    visivel = mostrar;
    botaoTopo.classList.toggle("visivel", visivel);
  }

  window.addEventListener("scroll", () => {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(conferirRolagem);
  }, { passive: true });
  conferirRolagem();

  botaoTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduz.matches ? "auto" : "smooth" });
    document.getElementById("topo-pagina").focus({ preventScroll: true });
  });

  const contato = document.getElementById("contato-form");
  const status = document.getElementById("contato-status");
  const botaoContato = contato.querySelector('button[type="submit"]');

  function mostrarStatus(texto, tipo) {
    status.textContent = texto;
    status.className = tipo ? `contato__status contato__status--${tipo}` : "contato__status";
  }

  // Sem JavaScript o formulário vai direto para o FormSubmit; com ele, a mensagem sai pelo endereço /ajax/ sem trocar de página.
  contato.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(contato));
    dados._subject = `Contato pelo site da Lia: ${dados.assunto}`;
    botaoContato.disabled = true;
    mostrarStatus("Enviando...");
    try {
      const resposta = await fetch(contato.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(dados),
      });
      const retorno = await resposta.json();
      if (!resposta.ok || String(retorno.success) !== "true") throw new Error(retorno.message);
      contato.reset();
      mostrarStatus("Mensagem enviada. Eu respondo no e-mail que você deixou.", "ok");
    } catch (erro) {
      mostrarStatus("Não deu para enviar agora. Tente de novo daqui a pouco.", "erro");
    } finally {
      botaoContato.disabled = false;
    }
  });
})();
