package principal;

import java.util.List;

import dao.PacienteDAO;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import model.Paciente;

public class Main {
    public static void main(String[] args) {

        // Cria o servidor Javalin
        var app = Javalin.create(config -> {
            // Permite que o frontend (que roda em outro domínio) fale com o backend (CORS)
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));
            // Configura a pasta "public" para servir os arquivos estáticos
            config.staticFiles.add("/public", Location.CLASSPATH);
        });

        // ---------------------- PACIENTES ----------------------
        // CREATE
        app.post("/pacientes", ctx -> {
            // Recebe o paciente do frontend e transforma em um objeto Java
            Paciente novoPaciente = ctx.bodyAsClass(Paciente.class);
            // Salva o paciente no banco de dados usando o DAO
            PacienteDAO dao = new PacienteDAO();
            dao.incluir(novoPaciente);
            System.out.println("Salvo no banco de dados: " + novoPaciente.getNome());
            ctx.status(201).result("Paciente salvo com sucesso!");
        });
        // MOSTRAR TODOS PACIENTES
        app.get("/pacientes", ctx -> {
            try {
                PacienteDAO dao = new PacienteDAO();
                List<Paciente> lista = dao.listarTodos();
                ctx.json(lista);
            } catch (Exception e) {
                ctx.status(500).result("Erro ao ler o arquivo binário: " + e.getMessage());
            }
        });
        // READ
        app.get("/pacientes/{id}", ctx -> {
            try {
                int id = Integer.parseInt(ctx.pathParam("id")); // Pega o número da URL
                PacienteDAO dao = new PacienteDAO();
                Paciente p = dao.buscar(id); // Chama a busca no arquivo binário

                if (p != null) {
                    ctx.json(p); // Devolve o paciente encontrado
                } else {
                    ctx.status(404).result("Paciente não encontrado.");
                }
            } catch (Exception e) {
                ctx.status(500).result("Erro na busca: " + e.getMessage());
            }
        });
        // UPTADE
        app.put("/pacientes/{id}", ctx -> {
            try {
                int id = Integer.parseInt(ctx.pathParam("id"));
                Paciente pacienteAtualizado = ctx.bodyAsClass(Paciente.class);
                pacienteAtualizado.setId(id); // Garante que o ID não foi perdido

                PacienteDAO dao = new PacienteDAO();
                boolean sucesso = dao.alterar(pacienteAtualizado);

                if (sucesso) {
                    ctx.status(200).result("Paciente atualizado com sucesso!");
                } else {
                    ctx.status(404).result("Paciente não encontrado para edição.");
                }
            } catch (Exception e) {
                ctx.status(500).result("Erro ao atualizar: " + e.getMessage());
            }
        });
        // DELETE
        app.delete("/pacientes/{id}", ctx -> {
            try {
                int id = Integer.parseInt(ctx.pathParam("id"));
                PacienteDAO dao = new PacienteDAO();
                boolean sucesso = dao.excluir(id);

                if (sucesso) {
                    ctx.status(200).result("Paciente excluído logicamente.");
                } else {
                    ctx.status(404).result("Paciente não encontrado.");
                }
            } catch (Exception e) {
                ctx.status(500).result("Erro ao excluir: " + e.getMessage());
            }
        });

        // Liga o servidor na porta 8080
        app.start(8080);
        System.out.println("Servidor iniciado! Acesse: http://localhost:8080");
    }
}