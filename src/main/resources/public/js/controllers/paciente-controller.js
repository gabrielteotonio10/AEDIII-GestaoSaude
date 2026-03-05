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

// Carregar a tabela 
function atualizarTabelaPacientes() {
  const corpoTabela = document.getElementById("listaPacientes");

  buscarPacientesNoJava()
    .then((pacientes) => {
      corpoTabela.innerHTML = ""; // Limpa a tabela para não duplicar

      if (pacientes.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum paciente cadastrado.</td></tr>';
        return;
      }

      // Percorre a lista de pacientes do Java
      pacientes.forEach((p) => {
        const tr = document.createElement("tr");

        // Tratamento para a lista de alergias 
        const alergiasTexto = p.alergias && p.alergias.length > 0 
                               ? p.alergias.join(", ") 
                               : '<span class="text-muted">Nenhuma</span>';

        tr.innerHTML = `
            <td>${p.id}</td>
            <td><strong>${p.nome}</strong></td>
            <td>${p.cpf}</td>
            <td>${alergiasTexto}</td>
            <td><span class="status-badge ativo">Ativo</span></td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="editarPaciente(${p.id})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon delete" onclick="excluirPaciente(${p.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        corpoTabela.appendChild(tr);
      });
      
      // Atualiza os cards de estatísticas 
      document.getElementById("statTotal").innerText = pacientes.length;
      document.getElementById("statAtivos").innerText = pacientes.length;
    })
    .catch((erro) => {
      console.error("Erro ao carregar tabela:", erro);
      mostrarNotificacao("Não foi possível carregar a lista de pacientes.", "erro");
    });
}
// Chamar a função assim que a página terminar de carregar
document.addEventListener("DOMContentLoaded", atualizarTabelaPacientes);