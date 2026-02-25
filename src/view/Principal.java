package src.view; // Ajuste o pacote se necessário

import java.util.Scanner;

public class Principal {
    public static void main(String[] args) {
        Scanner console = new Scanner(System.in);
        int opcao;
        try {
            do {
                System.out.println("\n\n🏥 Sistema de Gestão de Saúde - AED III");
                System.out.println("---------------------------------------");
                System.out.println("> Início");
                System.out.println("\n1 - Gerenciar Pacientes");
                System.out.println("0 - Sair");
                System.out.print("\nOpção: ");

                try {
                    opcao = Integer.valueOf(console.nextLine());
                } catch (NumberFormatException e) {
                    opcao = -1;
                }

                while (opcao != 1 || opcao != 0) {
                    System.out.println("\nErro, opção inválida! Tente novamente: ");
                    try {
                        opcao = Integer.valueOf(console.nextLine());
                    } catch (NumberFormatException e) {
                        opcao = -1;
                    }
                }

                switch (opcao) {
                    case 1:
                        MenuPacientes menuPacientes = new MenuPacientes();
                        menuPacientes.menu();
                        break;
                    case 0:
                        System.out.println("Encerrando o sistema... Até logo!");
                        break;
                    default:
                        System.out.println("Opção inválida!");
                        break;
                }
            } while (opcao != 0);
        } catch (Exception e) {
            System.err.println("Erro fatal no sistema:");
            e.printStackTrace();
        } finally {
            console.close();
        }
    }
}