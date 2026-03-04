// =========================================================
// CONTROLE DE INTERFACE (MODAL E SIDEBAR)
// =========================================================
// Elementos do DOM
const modalCadastro = document.getElementById("modalPaciente");
const btnNovo = document.getElementById("btnNovoPaciente");
const btnFechar = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelarModal");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

// Abrir Modal
btnNovo.addEventListener("click", () => {
  document.getElementById("formPaciente").reset(); // Limpa o formulário
  document.getElementById("pacienteId").value = ""; // Limpa o ID oculto
  document.getElementById("alergiasTags").innerHTML = ""; // Limpa as tags
  document.getElementById("modalTitle").innerHTML =
    '<i class="fa-solid fa-user-plus"></i> Cadastro de Paciente';
  modalCadastro.classList.add("active");
});

// Fechar Modal
const fecharModalCadastro = () => modalCadastro.classList.remove("active");
btnFechar.addEventListener("click", fecharModalCadastro);
btnCancelar.addEventListener("click", fecharModalCadastro);

// =========================================================
// LÓGICA DO CAMPO MULTIVALORADO (ALERGIAS)
// =========================================================

const btnAddAlergia = document.getElementById("btnAddAlergia");
const inputAlergia = document.getElementById("alergiaInput");
const containerTags = document.getElementById("alergiasTags");

// Array para guardar as alergias temporariamente na memória antes de salvar
let listaAlergiasTemporaria = [];

// Função para adicionar a tag visualmente
btnAddAlergia.addEventListener("click", () => {
  const alergia = inputAlergia.value.trim();

  if (alergia !== "") {
    // Adiciona no array
    listaAlergiasTemporaria.push(alergia);
    // Cria a tag em HTML
    atualizarTagsNaTela();
    // Limpa o input
    inputAlergia.value = "";
    inputAlergia.focus();
  }
});

// Permite adicionar alergia apertando "Enter" no teclado
inputAlergia.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); 
    btnAddAlergia.click();
  }
});

// Atualiza a interface com os "chips" de alergias
function atualizarTagsNaTela() {
  containerTags.innerHTML = ""; // Limpa a tela

  listaAlergiasTemporaria.forEach((alergia, index) => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `
            ${alergia} 
            <i class="fa-solid fa-xmark" onclick="removerAlergia(${index})"></i>
        `;
    containerTags.appendChild(tag);
  });
}

// Remove uma alergia se clicar no "X"
window.removerAlergia = function (index) {
  listaAlergiasTemporaria.splice(index, 1); // Remove o item
  atualizarTagsNaTela();
};

