function mostrarNotificacao(mensagem, tipo = "sucesso") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;

  let icone = "";
  if (tipo === "sucesso") icone = '<i class="fa-solid fa-circle-check"></i>';
  if (tipo === "erro") icone = '<i class="fa-solid fa-circle-exclamation"></i>';
  if (tipo === "aviso")
    icone = '<i class="fa-solid fa-triangle-exclamation"></i>';

  toast.innerHTML = `${icone} <span>${mensagem}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
