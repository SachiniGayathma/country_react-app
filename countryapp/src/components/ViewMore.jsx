import React, { useState, useEffect ,useRef} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ViewMore.css"; // <-- import the CSS
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';


const ViewMore = () => {
  const [details, setDetails] = useState(null);
  const { country } = useParams();
  const mapContainer = useRef(null);
  const map = useRef(null);

  maptilersdk.config.apiKey = 'nvyMtaSa43DltZEED8F1';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const respond = await axios.get(
          `https://restcountries.com/v3.1/name/${country}?fullText=true`
        );
        setDetails(respond.data[0]);
      } catch (error) {
        console.error("Error fetching country details:", error);
      }
    };

    fetchDetails();
  }, [country]);

  useEffect(() => {
    if (!details || !mapContainer.current || map.current) return;
  
    const [lat, lng] = details.latlng; 
  
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat], 
      zoom: 3,
    });
  
    new maptilersdk.Marker()
      .setLngLat([lng, lat]) 
      .addTo(map.current);
  }, [details]);
  
  
  

  if (!details) return <p>Loading...</p>;

  return (
    <div className="view-more-container">
      <div className="flag-info-container">
        <img
          src={details.flags.png}
          alt={`Flag of ${details.name.common}`}
          className="country-flag"
        />
        <div className="info-container">
          <h1>{details.name?.common}</h1>
          <p><strong>Official Name:</strong>{details.name?.official}</p>
          <div className="info-grid">
            <div className="info-col">
              <p><strong>Capital:</strong> {details.capital?.[0]}</p>
              <p><strong>Region:</strong> {details.region}</p>
              <p><strong>Sub Region:</strong> {details.subregion}</p>
              <p><strong>Population:</strong> {details.population.toLocaleString()}</p>
            </div>
            <div className="info-col">
              <p><strong>Languages:</strong> {details.languages ? Object.values(details.languages).join(", ") : "N/A"}</p>
              <p><strong>Currency:</strong> {details.currencies ? `${Object.values(details.currencies)[0]?.name} (${Object.values(details.currencies)[0]?.symbol})` : "N/A"}</p>
              <p><strong>Area:</strong> {details.area.toLocaleString()} km²</p>
              <p><strong>Border Countries:</strong> {details.borders?.length > 0 ? details.borders.join(", ") : "None"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
};

export default ViewMore;
