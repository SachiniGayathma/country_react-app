import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const ViewMore = () => {
  const [details, setDetails] = useState(null);
  const [description, setDescription] = useState(null);
  const { country } = useParams();
  const mapContainer = useRef(null);
  const map = useRef(null);

  maptilersdk.config.apiKey = "nvyMtaSa43DltZEED8F1";

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

    const fetchDescription = async () => {
      const res = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${country}`
      );
      setDescription(res.data.extract);
    };

    fetchDetails();
    fetchDescription();
  }, [country]);

  useEffect(() => {
    if (!details || !mapContainer.current || map.current) return;

    const [lat, lng] = details.latlng;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat],
      zoom: 4,
    });

    new maptilersdk.Marker().setLngLat([lng, lat]).addTo(map.current);
  }, [details]);

  if (!details) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
        <img
          src={details.flags.png}
          alt={`Flag of ${details.name.common}`}
          className="w-40 h-28 object-cover rounded shadow-md"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 mt-6 md:mt-0">{details.name?.common}</h1>
          <p className="text-gray-700 mb-4">{description}</p>

          <p className="mb-2"><span className="font-semibold">Official Name:</span> {details.name?.official}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <p><span className="font-semibold">Capital:</span> {details.capital?.[0]}</p>
              <p><span className="font-semibold">Region:</span> {details.region}</p>
              <p><span className="font-semibold">Sub Region:</span> {details.subregion}</p>
              <p><span className="font-semibold">Population:</span> {details.population.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Languages:</span>{" "}
                {details.languages
                  ? Object.values(details.languages).join(", ")
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Currency:</span>{" "}
                {details.currencies
                  ? `${Object.values(details.currencies)[0]?.name} (${Object.values(details.currencies)[0]?.symbol})`
                  : "N/A"}
              </p>
              <p><span className="font-semibold">Area:</span> {details.area.toLocaleString()} km²</p>
              <p>
                <span className="font-semibold">Border Countries:</span>{" "}
                {details.borders?.length > 0
                  ? details.borders.join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[400px] rounded shadow-lg overflow-hidden">
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ borderRadius: "0.5rem" }}
        />
      </div>
    </div>
  );
};

export default ViewMore;
