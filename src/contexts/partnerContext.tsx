import React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { IPartner } from "../interfaces/IPartner";

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = "https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners";

interface PartnerContextProps {
  partners: IPartner[];
  getPartnerById: (id: string) => IPartner | undefined;
  addPartner: (partner: Omit<IPartner, "id">) => Promise<void>;
  updatePartner: (id: string, updatedPartner: IPartner) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  fetchPartners: () => void;
  loadingPartners: boolean;
}

const PartnerContext = createContext<PartnerContextProps | undefined>(
  undefined
);

export const usePartners = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartners deve ser usado com PartnerProvider");
  }
  return context;
};

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const fetchPartners = async () => {
    setLoadingPartners(true);
    const response = await fetch(apiUrl);
    const data = await response.json();
    setPartners(data);
    setLoadingPartners(false);
  };

  const getPartnerById = (id: string) => {
    return partners.find((partner) => partner.id === id);
  };

  const addPartner = async (partner: Omit<IPartner, "id">) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partner),
    });

    const newPartner = await response.json();
    setPartners((prev) => [...prev, newPartner]);
  };

  const updatePartner = async (id: string, updatedPartner: IPartner) => {
    await fetch(`${apiUrl}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPartner),
    });

    setPartners((prev) =>
      prev.map((partner) => (partner.id === id ? updatedPartner : partner))
    );
  };

  const deletePartner = async (id: string) => {
    await fetch(`${apiUrl}${id}`, {
      method: "DELETE",
    });

    setPartners((prev) => prev.filter((partner) => partner.id !== id));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <PartnerContext.Provider
      value={{
        partners,
        getPartnerById,
        addPartner,
        updatePartner,
        deletePartner,
        fetchPartners,
        loadingPartners,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};
