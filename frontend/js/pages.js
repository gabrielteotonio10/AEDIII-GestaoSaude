// Função para trocar de tela
function navegarPara(idDaSecao) {
  // Esconde todas as seções
  document.querySelectorAll(".crud-section").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });

  // Mostra a seção desejada
  const secaoAtiva = document.getElementById(idDaSecao);
  secaoAtiva.classList.add("active");
  secaoAtiva.style.display = "block";
}

// Exemplo de uso ao clicar na Sidebar
document.querySelector('a[href="#consultas"]').addEventListener("click", () => {
  navegarPara("section-consultas");
});
