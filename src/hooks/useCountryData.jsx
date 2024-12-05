import { useState, useEffect } from "react";

/**
 * Custom hook to fetch country data by name.
 * @param {string} country - The name of the country to fetch data for.
 * @returns {object} - An object containing country data, loading state, and error state.
 */
const useCountryData = (country) => {
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://restcountries.com/v3.1/name/${country}?fullText=true`
        );

        if (!response.ok) {
          throw new Error(`Country not found: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.length) {
          throw new Error("No country data found");
        }

        const countryInfo = data[0];

        setCountryData({
          name: countryInfo.name.common,
          nativeName: countryInfo.name.nativeName
            ? Object.values(countryInfo.name.nativeName)[0]?.common
            : "N/A",
          population: countryInfo.population.toLocaleString("en-IN"),
          region: countryInfo.region,
          subregion: countryInfo.subregion || "N/A",
          capital: Array.isArray(countryInfo.capital)
            ? countryInfo.capital.join(", ")
            : "N/A",
          flag: countryInfo.flags.svg,
          tld: countryInfo.tld?.[0] || "N/A",
          languages: countryInfo.languages
            ? Object.values(countryInfo.languages).join(", ")
            : "N/A",
          currencies: countryInfo.currencies
            ? Object.values(countryInfo.currencies)
                .map((currency) => currency.name)
                .join(", ")
            : "N/A",
          borders: countryInfo.borders || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [country]);

  return { countryData, loading, error };
};

export default useCountryData;
