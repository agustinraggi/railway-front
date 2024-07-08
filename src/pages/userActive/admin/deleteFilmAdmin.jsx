import React, { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import "./deleteFilm.css"

function DeleteFilmAdmin() {
    const [listFilm, setListFilm] = useState([]);
    const [filteredFilm, setFilteredFilm] = useState([]);
    const [search] = useState("");

    // Obtener todas las películas
    const getFilm = () => {
        axios.get("http://localhost:3001/allFilm")
            .then((response) => {
                setListFilm(response.data);
                setFilteredFilm(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener datos:", error);
            });
    };

    // Eliminar una película por su ID
    const deleteData = (id, nameFilm) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: `No podrás revertir esta acción. ¿Estás seguro de que deseas eliminar ${nameFilm}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar!",
            cancelButtonText: "No, cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/deleteFilm/${id}`)
                    .then(() => {
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: `La película ${nameFilm} ha sido eliminada.`,
                            icon: "success",
                            timer: 2000
                        });
                        getFilm();
                    })
                    .catch((error) => {
                        console.error("Error al eliminar la película:", error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelado",
                    text: "Tu archivo está a salvo :)",
                    icon: "error",
                    timer: 2000
                });
            }
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo eliminar la película!",
                footer: error.message
            });
        });
    };

    useEffect(() => {
        getFilm();
    }, []);

    useEffect(() => {
        filterFilm();
    }, [search, listFilm]);

    const filterFilm = () => {
        if (listFilm) {
            const filtered = listFilm.filter(film =>
                film.nameFilm.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredFilm(filtered);
        }
    };

    return (
        <div className="container">
            <h1>Películas a eliminar</h1>
            <table className="table table-bordered" id="tableData">
                <thead>
                    <tr>
                        <th className="datesFilm">ID</th>
                        <th className="datesFilm">Código</th>
                        <th className="datesFilm">Nombre de la Película</th>
                        <th className="datesFilm">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFilm.map((film) => (
                        <tr key={film.id}>
                            <td>{film.id}</td>
                            <td>{film.codeFilm}</td>
                            <td>{film.nameFilm}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteData(film.id, film.nameFilm)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeleteFilmAdmin;
