import React from "react";
import "./styles.css";

interface IProps {
  handleSearch: (event: string) => void;
}

function InputSearch({ handleSearch }: IProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(event.target.value);
  };

  return (
    <div className="container-input-search">
      <input
        type="text"
        placeholder="Pesquisar por nome..."
        onChange={handleChange}
      />
    </div>
  );
}

export default InputSearch;
