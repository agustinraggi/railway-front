import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from 'axios'; 
import { getToken, initAxiosInterceptors } from './Helpers/auth-helpers'; 

import Header from './components/header/Header';
import FQ from "./pages/frequentQuestions/FQ";
import Footer from './components/footer/Footer';
import Carrusel from './pages/carrusel/carrusel';
import MovieList from './components/movieList/movieList';
import Movie from './pages/movieDetail/movie';
import Upcoming from './pages/upcoming/upcoming';
import LoginWrapper from './pages/form/LoginWrapper';
import Register from './pages/form/register';
import UserActive from './pages/userActive/loggedUser';
import EditUser from './pages/userActive/editUser';
import EmployeeActive from "./pages/userActive/loggedEmployee";
import AdminActive from './pages/userActive/loggedAdmin';
import AddFilmAdmin from './pages/userActive/admin/addFilmAdmin';
import DeleteFilmAdmin from "./pages/userActive/admin/deleteFilmAdmin";
import VerifyVoucher from "./pages/userActive/admin/verifyVoucher";
import EditAdminData from "./pages/userActive/admin/editAdminData";
import Ticket from './pages/buyTicket/ticket';
import MercadoPago from "./pages/buyTicket/mercadoPago/mercadoPago";
import StatusPay from "./pages/buyTicket/statusPay";
import ProtectedRoute from './components/protectedRoute/protectedRoute';

initAxiosInterceptors();

function App() {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!getToken()) {
                setLoadingUser(false);
                return;
            }
            try {
                const { data: user } = await Axios.get('http://localhost:3001/tokenUser');
                setUser(user);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingUser(false);
            }
        }
        loadUser();
    }, []);
    if (loadingUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Router>
                <Header user={user} />
                <Routes>
                    <Route path="/" element={<Carrusel />} />
                    <Route path="movie/:id" element={<Movie />} />
                    <Route path="movies/:type" element={<MovieList />} />
                    <Route path="upcoming" element={<Upcoming />} />
                    <Route path="login" element={<LoginWrapper setUser={setUser} />} />
                    <Route path="register" element={<Register />} />
                    <Route path="fq" element={<FQ />} />
                    
                    <Route 
                        path="userActive" 
                        element={
                            <ProtectedRoute user={user}>
                                <UserActive userId={user ? user.id : null} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="editUser/:idUser"
                        element={
                            <ProtectedRoute user={user}>
                                <EditUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                        path="employee" 
                        element={
                            <ProtectedRoute user={user}>
                                <EmployeeActive userId={user ? user.id : null} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="adminActive" 
                        element={
                            <ProtectedRoute user={user}>
                                <AdminActive />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="addFilmAdmin" 
                        element={
                            <ProtectedRoute user={user}>
                                <AddFilmAdmin />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="deleteFilmAdmin" 
                        element={
                            <ProtectedRoute user={user}>
                                <DeleteFilmAdmin />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="verifyVoucher" 
                        element={
                            <ProtectedRoute user={user}>
                                <VerifyVoucher />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="editAdminData" 
                        element={
                            <ProtectedRoute user={user}>
                                <EditAdminData userId={user ? user.id : null} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="buyTicket/:id"
                        element={
                            <ProtectedRoute user={user}>
                                <Ticket userId={user ? user.id : null} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="mercadoPago"
                        element={
                            <ProtectedRoute user={user}>
                                <MercadoPago user={user} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="statusPay"
                        element={
                            <ProtectedRoute user={user}>
                                <StatusPay userId={user ? user.id : null}  />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<h1>Error Page</h1>} />
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
