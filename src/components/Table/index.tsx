import React, { useEffect, useState } from "react";
import { IPartner } from "../../interfaces/IPartner";
import { useLocation, useNavigate } from "react-router-dom";
import InputSearch from "../InputSearch";
import "./styles.css";
import Modal from "../Modal";
import { v4 as uuidv4 } from "uuid";
import SkeletonTable from "../SkeletonTable";
import { usePartners } from "../../contexts/partnerContext";
import { toast } from "react-toastify";

function truncateText(text: string, maxWords: number = 20): string {
  const words = text.split(/\s+/);
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;
}

function joinWithComma(items: (string | number)[], limit: number = 15): string {
  return items.length ? items.slice(0, limit).join(", ") : "";
}

const emptyNewPartner = {
  createdAt: new Date().toISOString(),
  name: "",
  description: "",
  repositoryGit: "",
  urlDoc: "",
  clients: [],
  projects: [],
  id: uuidv4(),
};

const Table: React.FC = () => {
  const {
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    loadingPartners,
  } = usePartners();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [partner, setPartner] = useState<IPartner>(emptyNewPartner);
  const [newPartner, setNewPartner] = useState<IPartner>(emptyNewPartner);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const rowsPerPage = 5;
  const queryParams = new URLSearchParams(location.search);
  const initialPageIndex = parseInt(queryParams.get("page") || "0", 10);

  const [filterInput, setFilterInput] = useState("");
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [filteredPartners, setFilteredPartners] =
    useState<IPartner[]>(partners);

  useEffect(() => {
    setFilteredPartners(
      filterInput
        ? partners.filter((partner) =>
            partner.name.toLowerCase().includes(filterInput.toLowerCase())
          )
        : partners
    );
  }, [filterInput, partners]);

  useEffect(() => {
    setPageIndex(initialPageIndex);
  }, [initialPageIndex]);

  useEffect(() => {
    navigate(`?page=${pageIndex}`);
  }, [pageIndex, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof IPartner,
    isNew: boolean = false
  ) => {
    const { value } = e.target;
    if (isNew) {
      setNewPartner((prevPartner) => ({ ...prevPartner, [field]: value }));
    } else {
      setPartner((prevPartner) => ({ ...prevPartner, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (partner.id === "") {
      await addPartner(partner);
    } else {
      await updatePartner(partner.id, partner);
    }
    setLoading(false);
    closeModal();
    toast.success("Parceiro alterado com sucesso");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPartner.name === "") {
      toast.error("O campo nome é obrigatório");
      return;
    }
    setLoading(true);
    await addPartner(newPartner);
    setLoading(false);
    closeAddModal();
    toast.success("Parceiro cadastrado com sucesso");
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await deletePartner(id);
    toast.warning("Parceiro deletado!");
    setLoading(false);
  };

  const startRow = pageIndex * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const pageData = filteredPartners.slice(startRow, endRow);
  const pageCount = Math.ceil(filteredPartners.length / rowsPerPage);

  const handleSearch = (searchTerm: string) => {
    setFilterInput(searchTerm);
    setPageIndex(0);
  };

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 0 && newPageIndex < pageCount) {
      setPageIndex(newPageIndex);
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const closeAddModal = () => setIsAddModalOpen(false);

  const renderTitle = () => <h3 className="table-title">Lista de Parceiros</h3>;

  const renderSearch = () => <InputSearch handleSearch={handleSearch} />;

  const renderAddButton = () => (
    <button
      onClick={() => {
        setNewPartner(emptyNewPartner);
        setIsAddModalOpen(true);
      }}
    >
      Cadastrar Novo Parceiro
    </button>
  );

  const renderTable = () => (
    <div className="container-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Repositório Git</th>
            <th>Clientes</th>
            <th>Projetos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((partner) => (
            <tr key={partner.id}>
              <td>
                <h4>{partner.name}</h4>
                <p>Descrição: {truncateText(partner.description)}</p>
              </td>
              <td>
                <p>{partner.repositoryGit}</p>
                <a
                  href={partner.urlDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partner.urlDoc}
                </a>
              </td>
              <td>{joinWithComma(partner.clients)}</td>
              <td>{joinWithComma(partner.projects)}</td>
              <td className="container-actions-table">
                <button
                  onClick={() => {
                    setPartner(partner);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(partner.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="container-pagination-table">
        <button onClick={() => handlePageChange(0)} disabled={pageIndex === 0}>
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          {"<"}
        </button>
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(pageCount - 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          {">>"}
        </button>
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} de {pageCount}
          </strong>
        </span>
      </div>
    </div>
  );

  const renderModalEdit = () => (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h3>Editar Parceiro</h3>
      <form className="form-partners" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={partner.name}
            onChange={(e) => handleChange(e, "name")}
          />
        </label>
        <label>
          Descrição:
          <textarea
            value={partner.description}
            onChange={(e) => handleChange(e, "description")}
          />
        </label>
        <div className="container-actions-form-partners">
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );

  const renderModalAdd = () => (
    <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
      <h3>Cadastrar Novo Parceiro</h3>
      <form className="form-partners" onSubmit={handleAddSubmit}>
        <label>
          Nome: (obrigatório)
          <input
            type="text"
            value={newPartner.name}
            onChange={(e) => handleChange(e, "name", true)}
          />
        </label>
        <label>
          Descrição:
          <textarea
            value={newPartner.description}
            onChange={(e) => handleChange(e, "description", true)}
          />
        </label>
        <label>
          Repositório Git:
          <input
            type="text"
            value={newPartner.repositoryGit}
            onChange={(e) => handleChange(e, "repositoryGit", true)}
          />
        </label>
        <label>
          URL da Documentação:
          <input
            type="text"
            value={newPartner.urlDoc}
            onChange={(e) => handleChange(e, "urlDoc", true)}
          />
        </label>
        <div className="container-actions-form-partners">
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </Modal>
  );

  const renderLoading = () => <SkeletonTable rows={8} columns={5} />;

  const renderContent = () => (
    <>
      {renderTitle()}
      <div className="container-search-add">
        {renderSearch()}
        {renderAddButton()}
      </div>
      {loadingPartners ? renderLoading() : renderTable()}
      {renderModalEdit()}
      {renderModalAdd()}
    </>
  );

  return renderContent();
};

export default Table;
