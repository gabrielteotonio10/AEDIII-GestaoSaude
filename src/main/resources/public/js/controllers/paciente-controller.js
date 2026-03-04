// --- LÓGICA DE ALERGIAS ---
const btnAddAlergia = document.getElementById("btnAddAlergia");
const inputAlergia = document.getElementById("alergiaInput");
const containerTags = document.getElementById("alergiasTags");
let listaAlergiasTemporaria = [];

btnAddAlergia?.addEventListener("click", () => {
  const alergia = inputAlergia.value.trim();
  if (alergia !== "") {
    listaAlergiasTemporaria.push(alergia);
    atualizarTagsNaTela();
    inputAlergia.value = "";
    inputAlergia.focus();
  }
});

inputAlergia?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnAddAlergia.click();
  }
});

function atualizarTagsNaTela() {
  containerTags.innerHTML = "";
  listaAlergiasTemporaria.forEach((alergia, index) => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `${alergia} <i class="fa-solid fa-xmark" onclick="removerAlergia(${index})"></i>`;
    containerTags.appendChild(tag);
  });
}

window.removerAlergia = function (index) {
  listaAlergiasTemporaria.splice(index, 1);
  atualizarTagsNaTela();
};

// --- ENVIO DO FORMULÁRIO PARA A API ---
document.getElementById("formPaciente")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const paciente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    alergias: listaAlergiasTemporaria,
  };

  // Chama o serviço, e depois usa a UI para mostrar a mensagem!
  salvarPacienteNoJava(paciente)
    .then((resposta) => {
      if (resposta.ok) {
        mostrarNotificacao("Paciente cadastrado com sucesso!", "sucesso");
        fecharModalCadastro();
        listaAlergiasTemporaria = []; // Limpa as alergias da memória
      } else {
        mostrarNotificacao("O servidor negou o cadastro.", "erro");
      }
    })
    .catch((erro) => {
      console.error(erro);
      mostrarNotificacao("Servidor Java desligado ou inacessível.", "erro");
    });
});
