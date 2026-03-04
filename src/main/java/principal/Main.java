package principal;

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

        // Cria o post do paciente recebido do frontend
        app.post("/pacientes", ctx -> {
            // Recebe o paciente do frontend e transforma em um objeto Java
            Paciente novoPaciente = ctx.bodyAsClass(Paciente.class);
            // Salva o paciente no banco de dados usando o DAO
            PacienteDAO dao = new PacienteDAO();
            dao.incluir(novoPaciente); 
            System.out.println("Salvo no banco de dados: " + novoPaciente.getNome());
            ctx.status(201).result("Paciente salvo com sucesso!");
        });

        // Liga o servidor na porta 8080
        app.start(8080);
        System.out.println("Servidor iniciado! Acesse: http://localhost:8080");
    }
}