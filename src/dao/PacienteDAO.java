package src.dao;

import src.model.Paciente;
import java.lang.reflect.Constructor;

public class PacienteDAO {
    private Arquivo<Paciente> arquivo;

    public PacienteDAO() throws Exception {
        // Pega o construtor vazio da classe Paciente
        Constructor<Paciente> construtor = Paciente.class.getConstructor();
        // Inicializa o motor: nome da pasta/arquivo será "pacientes"
        this.arquivo = new Arquivo<>("pacientes", construtor);
    }

    // Métodos que apenas repassam a ordem para Arquivo.java
    public int incluir(Paciente p) throws Exception {
        return arquivo.create(p);
    }

    public Paciente buscar(int id) throws Exception {
        return arquivo.read(id);
    }

    public boolean alterar(Paciente p) throws Exception {
        return arquivo.update(p);
    }
    
    public boolean excluir(int id) throws Exception {
        return arquivo.delete(id);
    }
}