import SearchBar from "./Search";
import SelectMenu from "./SelectMenu";
import CountriesList from "./CountriesList";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
// import { useWindowSize } from "../hooks/useWindowSize";

const Home = () => {
  const [query, setQuery] = useState("");
  const [isDark] = useTheme();

  // const windowSize = useWindowSize(); // No destructuring
  // console.log("🚀 ~ Home ~ windowSize:", windowSize.width);

  return (
    <main className={`${isDark ? "dark" : ""}`}>
      {/* <p style={{ textAlign: "center" }}>
        Width: {windowSize.width}px, Height: {windowSize.height}px
      </p> */}

      <div className="search-filter-container">
        <SearchBar setQuery={setQuery} />
        <SelectMenu setQuery={setQuery} />
      </div>

      <CountriesList query={query} />
    </main>
  );
};

export default Home;
