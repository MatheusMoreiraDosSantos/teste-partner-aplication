import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../components/Table";
import { PartnerProvider } from "../contexts/partnerContext";
import { MemoryRouter } from "react-router-dom";

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <PartnerProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </PartnerProvider>
  );
};

describe("Table Component", () => {
  test("deve renderizar a lista de parceiros", () => {
    renderWithProvider(<Table />);
    expect(screen.getByText("Partner 1")).toBeInTheDocument();
    expect(screen.getByText("Partner 2")).toBeInTheDocument();
  });

  test("deve filtrar parceiros com base no input de busca", () => {
    renderWithProvider(<Table />);
    const input = screen.getByPlaceholderText("Pesquisar por nome...");
    fireEvent.change(input, { target: { value: "Partner 1" } });
    expect(screen.getByText("Partner 1")).toBeInTheDocument();
    expect(screen.queryByText("Partner 2")).not.toBeInTheDocument();
  });

  test("deve abrir o modal para adicionar um novo parceiro", () => {
    renderWithProvider(<Table />);
    const addButton = screen.getByText("Cadastrar Novo Parceiro");
    fireEvent.click(addButton);
    expect(screen.getByText("Cadastrar Novo Parceiro")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome: (obrigatório)")).toBeInTheDocument();
  });

  test("deve exibir mensagem de erro se tentar cadastrar um parceiro sem nome", () => {
    renderWithProvider(<Table />);
    const addButton = screen.getByText("Cadastrar Novo Parceiro");
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Cadastrar");
    fireEvent.click(submitButton);

    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
  });

  test("deve abrir o modal de edição ao clicar no botão Editar", () => {
    renderWithProvider(<Table />);
    const editButton = screen.getAllByText("Editar")[0];
    fireEvent.click(editButton);
    expect(screen.getByText("Editar Parceiro")).toBeInTheDocument();
  });

  test("deve deletar um parceiro ao clicar no botão Excluir", () => {
    renderWithProvider(<Table />);
    const deleteButton = screen.getAllByText("Excluir")[0];
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Partner 1")).not.toBeInTheDocument();
  });
});
