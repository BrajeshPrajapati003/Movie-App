import { useState, useEffect } from "react"
import MovieCard from "../Components/MovieCard"
import '../css/Home.css'
import { searchMovies, getPopularMovies } from '../services/api'

function Home (){

    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // const movies = [
    //     {id: 1, title: "John Wick", release_date: "2020"},
    //     {id: 2, title: "Jolly LLB 3", release_date: "2025"},
    //     {id: 3, title: "The Matrix", release_date: "2026"},
    // ]

    // const movies = getPopularMovies()

    useEffect(()=>{
        const loadPopularMovies = async ()=> {
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }catch(err){
                console.log(err);
                setError("Failed to load Movies...")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async (e)=> {
        e.preventDefault();
        console.log("Search initiated...");
        
        if(!searchQuery.trim()) return
        if(loading) return
        setLoading(true)

        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        }catch(err){
            console.log(err);
            setError("Failed to search movies...")
        }finally{
            setLoading(false)
        }
        // setSearchQuery("");
    };


    return <div className="home">

        <form onSubmit={handleSearch} className="search-form">
            <input 
                type="text" placeholder='Search for movies...' className='search-input' value={searchQuery} onChange={ (e) => setSearchQuery(e.target.value)}
            />

            <button type='submit' className='search-btn'>Search</button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
            <div className="loading">Loading...</div>
            ):(
            <div className="movies-grid">
                {movies.map((movie) => 
                    movie.title.toLowerCase().startsWith(searchQuery) && 
                    (<MovieCard movie={movie} key={movie.id} />)
                )}
            </div>
        )}

    </div>
}

export default Home