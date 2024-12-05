import { useEffect, useMemo, useState } from "react";
import CountryCard from "./CountryCard";
import CountriesListShimmer from "./CountriesListShimmer";

const CountriesList = ({ query }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        setCountriesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (!query) return countriesData;
    return countriesData.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase()) ||
        country.region.toLowerCase().includes(query)
    );
  }, [countriesData, query]);

  // if (loading) return <p>Loading countries...</p>;
  // if (error) return <p>Error: {error}</p>;

  if (!countriesData.length) {
    return <CountriesListShimmer />;
  }

  return (
    <div className="countries-container">
      {filteredCountries.map((country) => (
        <CountryCard
          key={country.cca3}
          name={country.name.common}
          flag={country.flags.svg}
          population={country.population}
          region={country.region}
          capital={country.capital?.[0]}
          data={country}
        />
      ))}
    </div>
  );
};

export default CountriesList;
