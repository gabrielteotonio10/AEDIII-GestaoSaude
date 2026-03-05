function salvarPacienteNoJava(paciente) {
  return fetch("/pacientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente),
  });
}

function buscarPacientesNoJava() {
  return fetch("/pacientes").then((resposta) => {
    if (!resposta.ok) throw new Error("Erro ao buscar dados");
    return resposta.json(); 
  });
}