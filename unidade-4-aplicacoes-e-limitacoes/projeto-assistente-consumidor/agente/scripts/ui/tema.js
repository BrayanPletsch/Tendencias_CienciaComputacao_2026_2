// Carregado no <head>, antes dos estilos, para a página já abrir no tema certo, sem piscar.
(function (raiz) {
  const CHAVE = "lia-tema";
  const COR_DA_BARRA = { claro: "#FFFFFF", escuro: "#0F1115" };
  const parametros = new URLSearchParams(location.search);

  function temaInicial() {
    const pedido = parametros.get("tema");
    if (pedido === "claro" || pedido === "escuro") return pedido;
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo === "claro" || salvo === "escuro") return salvo;
    } catch (erro) {
      // Sem acesso ao armazenamento (aba anônima, por exemplo): segue a preferência do sistema.
    }
    return raiz.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
  }

  function aplicar(tema) {
    document.documentElement.dataset.tema = tema;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = COR_DA_BARRA[tema];
  }

  function rotular(botao, tema) {
    botao.replaceChildren(raiz.LiaIcones.icone(tema === "escuro" ? "sol" : "lua"));
    botao.setAttribute("aria-label", tema === "escuro" ? "Ativar tema claro" : "Ativar tema escuro");
  }

  function criarBotao() {
    const botao = raiz.LiaUI.el("button", { classe: "btn-ico", atributos: { type: "button" } });
    rotular(botao, document.documentElement.dataset.tema);
    botao.addEventListener("click", () => {
      const novo = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
      // A troca de tema é instantânea: as transições de cor ficam desligadas até o quadro seguinte.
      document.documentElement.dataset.trocandoTema = "";
      aplicar(novo);
      requestAnimationFrame(() => requestAnimationFrame(() => delete document.documentElement.dataset.trocandoTema));
      rotular(botao, novo);
      try {
        localStorage.setItem(CHAVE, novo);
      } catch (erro) {
        // A escolha vale só para esta visita.
      }
    });
    return botao;
  }

  aplicar(temaInicial());

  // ?foto mostra a página inteira, sem rolagem interna nem altura mínima, para print e apresentação.
  if (parametros.has("foto")) document.documentElement.dataset.foto = "";

  raiz.LiaTema = { criarBotao };
})(window);
