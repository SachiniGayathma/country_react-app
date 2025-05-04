import React, { useState, useEffect } from "react";
import axios from 'axios';
import './AllCountries.css';
import { useNavigate } from 'react-router-dom';

const AllCountries = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const navigate = useNavigate();
  //console.log(selectedLanguage);

  useEffect(() => {
    const fetchFilteredCountries = async () => {
      try {
        let url = 'https://restcountries.com/v3.1/all';

        if (searchQuery.trim()) {
          url = `https://restcountries.com/v3.1/name/${searchQuery}`;
        } else if (selectedRegion) {
          url = `https://restcountries.com/v3.1/region/${selectedRegion}`;
        } else if (selectedLanguage) {
          url = `https://restcountries.com/v3.1/lang/${selectedLanguage}`;
        }

        const response = await axios.get(url);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };

    fetchFilteredCountries();
  }, [searchQuery, selectedRegion, selectedLanguage]);

  const handleOnClick = (countryName) => {
    navigate(`/view/${countryName}`);
  };

  return (
    <div style={{ textAlign: "center", margin: "30px 0" }}>
      <h2 style={{ 
        fontWeight: "500", 
        fontSize: "1.4rem", 
        color: "#333", 
        marginBottom: "15px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "10px" 
      }}>
        <span className="rotating-globe">🌍</span>
        Looking for a country? Use the filters below to search by name, region, or language.
      </h2>

      <div style={{ textAlign: "center", margin: "20px 0", display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by country name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedRegion('');
            setSelectedLanguage('');
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "250px",
            fontSize: "1rem",
          }}
        />

        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSearchQuery('');
            setSelectedLanguage('');
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "180px",
          }}
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select 
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            setSearchQuery('');
            setSelectedRegion('');
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "180px",
          }}
        >
          <option value="">All Languages</option>
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="arabic">Arabic</option>
          <option value="chinese">Chinese</option>
          <option value="russian">Russian</option>
          <option value="hindi">Hindi</option>
          <option value="portuguese">Portuguese</option>
          <option value="german">German</option>
        </select>
      </div>

      <div className="card-grid">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div className="card" key={index}>
              <img
                className="img"
                src={country.flags?.png}
                alt={country.name.common}
              />
              <div className="container">
                <h4><b>{country.name.common}</b></h4>
                <p>Population: {country.population.toLocaleString()}</p>
                <p>Region: {country.region}</p>
                <p>Capital: {country.capital?.[0] || 'N/A'}</p>
                <button onClick={() => handleOnClick(country.name.common)}>
                  View More
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px", fontSize: "1.2rem", color: "#777" }}>
            No countries found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllCountries;
