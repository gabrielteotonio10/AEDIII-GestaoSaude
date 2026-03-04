function salvarPacienteNoJava(paciente) {
  return fetch("/pacientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente),
  });
}
