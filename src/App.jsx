import { useEffect, useState } from "react";
import Search from "./components/Search";

import { API_OPTIONS, API_BASE_URL } from "./apiconfig";
import MovieCard from "./components/MovieCard";

import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import Trending from "./components/Trending";

updateSearchCount();

const App = () => {
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearchVal, setDebouncedSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");

  const [movieList, setmovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const featchMovies = async (query = "") => {
    setIsLoading(true);
    seterrorMsg("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const reponse = await fetch(endpoint, API_OPTIONS);

      if (!reponse.ok) {
        throw new Error("Falied to load movies");
      }

      const data = await reponse.json();

      if (data.reponse === false) {
        seterrorMsg(data.error || "Failed to fetch movies");
        setmovieList([]);
        return;
      }
      setmovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      seterrorMsg(error || "Error fetching movie");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    const movies = await getTrendingMovies();
    setTrendingMovies(movies);
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    featchMovies(debouncedSearchVal);
  }, [debouncedSearchVal]);

  useDebounce(() => setDebouncedSearchVal(searchVal), 500, [searchVal]);

  return (
    <main>
      <div className="wrapper">
        <header>
          <img src="./hero.png" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchVal={searchVal} setSearchVal={setSearchVal}></Search>
        </header>

        {trendingMovies.length && <Trending trendingMovies={trendingMovies} />}

        <h2>All Movies</h2>
        <section className="all-movies mt-10 text-center">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMsg ? (
            <p className="text-red-50">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard {...movie} key={movie.id}></MovieCard>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
