import "../assets/CountryDetail.css";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import CountryDetailShimmer from "./CountryDetailShimmer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// import { useSearchParams } from "react-router-dom";
// import useCountryData from "../hooks/useCountryData";

const CountryDetail = () => {
  const [isDark] = useTheme();
  const { country } = useParams();
  const { state } = useLocation();

  // const [searchParams] = useSearchParams();
  // http://localhost:5173/Grenada?isGood=true
  // const isGood = searchParams.get("isGood");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [countryData, setCountryData] = useState(null);

  function updateCountryData(countryInfo) {
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
      borders: [],
    });

    if (!countryInfo.borders) {
      countryInfo.borders = [];
    }

    Promise.all(
      countryInfo.borders.map((border) => {
        return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => res.json())
          .then(([borderCountry]) => borderCountry.name.common);
      })
    ).then((borders) => {
      setTimeout(() => {
        setCountryData((prevState) => ({ ...prevState, borders }));
      }, 10);
    });

    setLoading(false);
    setNotFound(false);
  }

  useEffect(() => {
    const getCountryData = async () => {
      try {
        setNotFound(false);
        setLoading(true);

        const response = await fetch(
          `https://restcountries.com/v3.1/name/${country}?fullText=true`
        );

        if (!response.ok) {
          throw new Error(`Country not found: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          throw new Error("No country data found");
        }

        const countryInfo = data[0];

        updateCountryData(countryInfo);
      } catch (error) {
        console.error("Error fetching country data:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (state) {
      updateCountryData(state);
      return;
    }

    getCountryData();
  }, [country, state]);

  // const { countryData, loading, error } = useCountryData(country);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (notFound) {
    return <div>Error: {notFound}</div>;
  }

  return (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        {countryData === null ? (
          <CountryDetailShimmer />
        ) : (
          <div className="country-details">
            <img src={countryData.flag} alt={`${countryData.name} flag`} />
            <div className="details-text-container">
              <h1>{countryData.name}</h1>
              <div className="details-text">
                <p>
                  <b>Native Name:</b> {countryData.nativeName}
                </p>
                <p>
                  <b>Population:</b> {countryData.population}
                </p>
                <p>
                  <b>Region:</b> {countryData.region}
                </p>
                <p>
                  <b>Sub Region:</b> {countryData.subregion}
                </p>
                <p>
                  <b>Capital:</b> {countryData.capital}
                </p>
                <p>
                  <b>Top Level Domain:</b> {countryData.tld}
                </p>
                <p>
                  <b>Currencies:</b> {countryData.currencies}
                </p>
                <p>
                  <b>Languages:</b> {countryData.languages}
                </p>
              </div>
              {countryData.borders.length !== 0 && (
                <div className="border-countries">
                  <b>Border Countries: </b>&nbsp;
                  {countryData.borders.map((border) => (
                    <Link key={border} to={`/${border}`}>
                      {border}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CountryDetail;
