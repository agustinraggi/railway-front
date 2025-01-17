import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import YouTube from "react-youtube";
import "./movie.css";

function Movie() {
    const URL_BACK = process.env.REACT_APP_BACK_URL || "http://localhost:3001";

    const [trailer, setTrailer] = useState(null);
    const [currentMovieDetail, setCurrentMovieDetail] = useState({ title: "Loading Movies" });
    const [playing, setPlaying] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    // Función para obtener los detalles de la película desde tu backend
    const fetchMovie = async () => {
        try {
            const { data } = await axios.get(`${URL_BACK}/movie/${id}`);
            setCurrentMovieDetail(data);

            // Ahora se hace la llamada para obtener los trailers desde tu backend
            const trailerResponse = await axios.get(`${URL_BACK}/movie/videos/${id}`);
            if (trailerResponse.data.results) {
                let selectedTrailer;
                selectedTrailer = trailerResponse.data.results.find(
                    (vid) => vid.type === "Trailer" && vid.iso_639_1 === "es-MX" && vid.iso_3166_1 === "MX"
                );
                if (!selectedTrailer) {
                    selectedTrailer = trailerResponse.data.results.find(
                        (vid) => vid.type === "Trailer" && vid.iso_639_1 === "es-MX" && vid.iso_3166_1 === "ES"
                    );
                }
                if (!selectedTrailer) {
                    selectedTrailer = trailerResponse.data.results.find(
                        (vid) => vid.type === "Trailer" && vid.iso_639_1 === "es-MX" && vid.name.toLowerCase().includes("subtitulado")
                    );
                }
                if (!selectedTrailer) {
                    selectedTrailer = trailerResponse.data.results.find(
                        (vid) => vid.type === "Trailer"
                    );
                }
                setTrailer(selectedTrailer);
            }
        } catch (error) {
            console.error("Error fetching movie details", error);
        }
    };

    useEffect(() => {
        fetchMovie();
    }, [id]);

    useEffect(() => {
        if (trailer) {
            setPlaying(true);
        }
    }, [trailer]);

    const closeTrailer = () => {
        setPlaying(false);
    };

    const handleCartClick = () => {
        navigate(`/buyTicket/${id}`);
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail.backdrop_path}`} alt="Backdrop" />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail.poster_path}`} alt="Poster" />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail.original_title}</div>
                        <div className="movie__tagline">{currentMovieDetail.tagline}</div>
                        <div className="movie__releaseDate">Proximamente: {currentMovieDetail.release_date}</div>
                        <div className="movie__genres">
                            {currentMovieDetail.genres && currentMovieDetail.genres.map(genre => (
                                <span key={genre.id} className="movie__genre">{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail.overview}</div>
                        <div className="cartMovie" onClick={handleCartClick}>
                            <button className="cart-button">
                                <span className="cart-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EFEFEF">
                                        <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                                    </svg>
                                </span>
                                <span className="cart-text">Comprar entrada</span>
                            </button>
                        </div>
                    </div>
                    <div className="viewtrailer">
                        {playing && trailer ? (
                            <YouTube
                                videoId={trailer.key}
                                className="youtube-container"
                                containerClassName="viewtrailer"
                                opts={{
                                    width: "100%",
                                    height: "100%",
                                    playerVars: {
                                        autoplay: 1,
                                        controls: 1,
                                        cc_load_policy: 0,
                                        fs: 1,
                                        iv_load_policy: 0,
                                        modestbranding: 1,
                                        rel: 0,
                                        showinfo: 0,
                                    },
                                }}
                            />
                        ) : (
                            <div className="no-trailer">Trailer no disponible :(</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="movieFooter"></div>
        </div>
    );
}

export default Movie;
