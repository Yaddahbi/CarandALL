import { useState } from "react";
import { voegGebruikerToe } from "./api";

const GebruikerAanmaken = () => {
  const [gebruiker, setGebruiker] = useState({
    rol: "Particulier", // standaardwaarde
    naam: "",
    email: "",
    wachtwoord: "",
    telefoonnummer: "",
    adres: "",
    bedrijfsNaam: "",
    kvkNummer: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGebruiker((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await voegGebruikerToe(gebruiker);  // Verstuurt de gegevens naar de API
      setSuccess("Gebruiker succesvol aangemaakt!");
      setError(null);
    } catch (err) {
      setError("Er is iets misgegaan: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Maak een Account aan</h2>
      <form onSubmit={handleSubmit}>
        <label>Rol: </label>
        <select name="rol" value={gebruiker.rol} onChange={handleInputChange}>
          <option value="Particulier">Particulier</option>
          <option value="Zakelijk">Zakelijk</option>
        </select>

        <label>Naam: </label>
        <input type="text" name="naam" onChange={handleInputChange} required />

        <label>Email: </label>
        <input type="email" name="email" onChange={handleInputChange} required />

        <label>Wachtwoord: </label>
        <input
          type="password"
          name="wachtwoord"
          onChange={handleInputChange}
          required
        />

        {gebruiker.rol === "Particulier" && (
          <>
            <label>Adres: </label>
            <input type="text" name="adres" onChange={handleInputChange} />
            <label>Telefoonnummer: </label>
            <input
              type="tel"
              name="telefoonnummer"
              onChange={handleInputChange}
            />
          </>
        )}

        {gebruiker.rol === "Zakelijk" && (
          <>
            <label>Bedrijfsnaam: </label>
            <input
              type="text"
              name="bedrijfsNaam"
              onChange={handleInputChange}
            />
            <label>KVK-nummer: </label>
            <input
              type="text"
              name="kvkNummer"
              onChange={handleInputChange}
            />
          </>
        )}

        <button type="submit">Account Aanmaken</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GebruikerAanmaken;
