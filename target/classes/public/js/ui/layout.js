// --- NAVEGAÇÃO LATERAL ---
function navegarPara(idDaSecao) {
  document.querySelectorAll(".crud-section").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });
  const secaoAtiva = document.getElementById(idDaSecao);
  secaoAtiva.classList.add("active");
  secaoAtiva.style.display = "block";
}

document
  .querySelector('a[href="#consultas"]')
  ?.addEventListener("click", () => {
    navegarPara("section-consultas");
  });

// --- CONTROLE DO MODAL ---
const modalCadastro = document.getElementById("modalPaciente");

document.getElementById("btnNovoPaciente")?.addEventListener("click", () => {
  document.getElementById("formPaciente").reset();
  document.getElementById("pacienteId").value = "";
  document.getElementById("alergiasTags").innerHTML = "";
  document.getElementById("modalTitle").innerHTML =
    '<i class="fa-solid fa-user-plus"></i> Cadastro de Paciente';
  modalCadastro.classList.add("active");
});

function fecharModalCadastro() {
  modalCadastro.classList.remove("active");
}

document
  .getElementById("btnFecharModal")
  ?.addEventListener("click", fecharModalCadastro);
document
  .getElementById("btnCancelarModal")
  ?.addEventListener("click", fecharModalCadastro);
