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

function limparFormularioEPaciente() {
  listaAlergiasTemporaria = [];
  atualizarTagsNaTela();
  document.getElementById("formPaciente").reset(); 
}
document
  .getElementById("btnFecharModal")
  ?.addEventListener("click", limparFormularioEPaciente);
document
  .getElementById("btnCancelarModal")
  ?.addEventListener("click", limparFormularioEPaciente);
document
  .getElementById("btnNovoPaciente")
  ?.addEventListener("click", limparFormularioEPaciente);

// Ação do botão de recarregar a tabela
document.getElementById("btnRecarregar")?.addEventListener("click", () => {
  const inputBusca = document.getElementById("inputBuscaId");
  if (inputBusca) {
    inputBusca.value = "";
  }
  atualizarTabelaPacientes();
});

// Carregar a tabela
function atualizarTabelaPacientes() {
  const corpoTabela = document.getElementById("listaPacientes");

  buscarPacientesNoJava()
    .then((pacientes) => {
      pacientes.reverse();
      corpoTabela.innerHTML = ""; // Limpa a tabela para não duplicar
      if (pacientes.length === 0) {
        corpoTabela.innerHTML =
          '<tr><td colspan="6" style="text-align:center">Nenhum paciente cadastrado.</td></tr>';
        return;
      }
      // Percorre a lista de pacientes do Java
      pacientes.forEach((p) => {
        const tr = document.createElement("tr");

        // Tratamento para a lista de alergias
        const alergiasTexto =
          p.alergias && p.alergias.length > 0
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
      const totalAtivos = pacientes.length;
      // Filtra e conta quantos pacientes têm pelo menos 1 alergia
      const pacientesComAlergia = pacientes.filter(
        (p) => p.alergias && p.alergias.length > 0,
      ).length;
      // Descobre qual é o maior ID cadastrado (se a lista estiver vazia, é 0)
      const ultimoId =
        pacientes.length > 0 ? Math.max(...pacientes.map((p) => p.id)) : 0;
      // Joga os valores na tela 
      document.getElementById("statAtivos").innerText = totalAtivos;
      const elAlergias = document.getElementById("statAlergias");
      if (elAlergias) elAlergias.innerText = pacientesComAlergia;
      const elUltimoId = document.getElementById("statUltimoId");
      if (elUltimoId) elUltimoId.innerText = ultimoId;
    })
    .catch((erro) => {
      console.error("Erro ao carregar tabela:", erro);
      mostrarNotificacao(
        "Não foi possível carregar a lista de pacientes.",
        "erro",
      );
    });
}
// Chamar a função assim que a página terminar de carregar
document.addEventListener("DOMContentLoaded", atualizarTabelaPacientes);

// ==========================================
// CRIAR E EDITAR
// ==========================================

// --- ENVIO DO FORMULÁRIO PARA A API ---
document.getElementById("formPaciente")?.addEventListener("submit", (e) => {
  e.preventDefault();
  // Captura o ID oculto. Se tiver valor, é edição. Se estiver vazio, é cadastro novo.
  const idInput = document.getElementById("pacienteId").value;
  const paciente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    alergias: listaAlergiasTemporaria,
  };
  if (idInput === "") {
    // --- MODO CADASTRO ---
    salvarPacienteNoJava(paciente).then((resposta) => {
      if (resposta.ok) finalizarAcao("Paciente cadastrado com sucesso!");
    });
  } else {
    // --- MODO EDIÇÃO ---
    atualizarPacienteNoJava(idInput, paciente).then((resposta) => {
      if (resposta.ok) finalizarAcao("Paciente atualizado com sucesso!");
    });
  }
});

function finalizarAcao(mensagem) {
  mostrarNotificacao(mensagem, "sucesso");
  fecharModalCadastro();
  atualizarTabelaPacientes();
}

// ==========================================
// EDITAR (Abre o modal preenchido)
// ==========================================
// Usamos "window." para que o HTML consiga enxergar a função no onclick do botão
window.editarPaciente = function (id) {
  buscarPacientePorIdNoJava(id)
    .then((paciente) => {
      // Preenche os campos de texto
      document.getElementById("pacienteId").value = paciente.id;
      document.getElementById("nome").value = paciente.nome;
      document.getElementById("cpf").value = paciente.cpf;
      // Muda o título do modal
      document.getElementById("modalTitle").innerHTML =
        '<i class="fa-solid fa-pen"></i> Editar Paciente';
      // Carrega as alergias para a memória e desenha na tela
      listaAlergiasTemporaria = paciente.alergias ? paciente.alergias : [];
      atualizarTagsNaTela();
      // Abre o modal
      document.getElementById("modalPaciente").classList.add("active");
    })
    .catch((erro) =>
      mostrarNotificacao("Erro ao buscar dados do paciente.", "erro"),
    );
};

// ==========================================
// DELETAR
// ==========================================
let pacienteIdParaExcluir = null; // Variável para guardar quem será deletado
const modalConfirmacao = document.getElementById("modalConfirmacao");
// Quando clica na lixeira da tabela, apenas abre o modal e salva o ID
window.excluirPaciente = function (id) {
  pacienteIdParaExcluir = id;
  modalConfirmacao.classList.add("active");
};
// Se clicar em Cancelar apenas esconde o modal
document
  .getElementById("btnCancelarExclusao")
  ?.addEventListener("click", () => {
    modalConfirmacao.classList.remove("active");
    pacienteIdParaExcluir = null; // Limpa a memória
  });
// Se clicar no botão vermelho Sim, excluir dispara o comando pro Java!
document
  .getElementById("btnConfirmarExclusao")
  ?.addEventListener("click", () => {
    if (pacienteIdParaExcluir !== null) {
      excluirPacienteNoJava(pacienteIdParaExcluir)
        .then((resposta) => {
          if (resposta.ok) {
            mostrarNotificacao("Paciente excluído logicamente.", "sucesso");
            atualizarTabelaPacientes(); // Remove da tabela na hora
          } else {
            mostrarNotificacao("Erro ao excluir no servidor.", "erro");
          }
        })
        .finally(() => {
          // Independente de dar certo ou errado, fecha o modal no final
          modalConfirmacao.classList.remove("active");
          pacienteIdParaExcluir = null;
        });
    }
  });

// ==========================================
// PESQUISA (Busca por ID)
// ==========================================
document.getElementById("btnBuscar")?.addEventListener("click", () => {
  const idBusca = document.getElementById("inputBuscaId").value;
  const corpoTabela = document.getElementById("listaPacientes");
  // Se o campo estiver vazio, recarrega a tabela completa
  if (idBusca === "") {
    atualizarTabelaPacientes();
    return;
  }
  // Busca apenas o ID digitado
  buscarPacientePorIdNoJava(idBusca)
    .then((p) => {
      corpoTabela.innerHTML = ""; // Limpa a tabela
      const alergiasTexto =
        p.alergias && p.alergias.length > 0 ? p.alergias.join(", ") : "Nenhuma";
      corpoTabela.innerHTML = `
                <tr>
                    <td>${p.id}</td>
                    <td><strong>${p.nome}</strong></td>
                    <td>${p.cpf}</td>
                    <td>${alergiasTexto}</td>
                    <td><span class="status-badge ativo">Ativo</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon" onclick="editarPaciente(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon delete" onclick="excluirPaciente(${p.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
      mostrarNotificacao("Paciente localizado!", "sucesso");
    })
    .catch(() => {
      corpoTabela.innerHTML =
        '<tr><td colspan="6" style="text-align:center">Nenhum paciente encontrado com este ID.</td></tr>';
      mostrarNotificacao("ID não encontrado no arquivo.", "aviso");
    });
});
