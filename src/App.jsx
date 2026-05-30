/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import Search from "./components/search.jsx";
import { useState, useEffect } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMovies = async () => {

    setIsLoading(false)
    setErrorMessage("")

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = await response.json()
      if (data == null) {
        setErrorMessage('Failed to fetch movies')
        setMovieList([])
        return
      }
      console.log(data.results)
      setMovieList(data.results || [])

    } catch (error) {
      console.log(`error fetching movies : ${error}`)
      setErrorMessage("Error looking for the movie, please try again later")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])


  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} ></Search>
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <p className="text-white">Loading ...</p>)
            : errorMessage ? (<p className="text-red-500"> {errorMessage} </p>)
              : (
                <ul>
                  {movieList.map((movie) => (
                    <p key={movie.id} className="text-white">{movie.title}</p>
                  ))}
                </ul>
              )}
        </section>
      </div>
    </main>
  );
}

export default App;
