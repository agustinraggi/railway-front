import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loggedUser.css";

function Admin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    return (
        <div>
            <div className="btnUser">
                <button className="buttonUser" onClick={handleLogout}>Salir</button>
            </div>
            <h1>ADMIN</h1>
            <div className="adminFeatures">
                <Link to="/editAdminData" className="adminLink">
                    <span>Administrar Usuarios</span>
                </Link>
                <Link to="/addFilmAdmin" className="adminLink">
                    <span>Agregar Películas</span>
                </Link>
                <Link to="/deleteFilmAdmin" className="adminLink">
                    <span>Eliminar Películas</span>
                </Link>
                <Link to="/addTheaterHourAdmin" className="adminLink">
                    <span>Agregar Sala y Horario</span>
                </Link>
                <Link to="/verifyVoucher" className="adminLink">
                    <span>Verificar Código de Entrada</span>
                </Link>
            </div>
            <div className="footerLoggedAdmin">

            </div>
        </div>
    );
}

export default Admin;