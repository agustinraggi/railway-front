import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./crudUser.css";

function User() {
    const [listPeople, setListPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [search, setSearch] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        updateAges();
        ReadData();
    }, []);

    useEffect(() => {
        filterPeople();
    }, [search, listPeople]);

    function validateForm() {
        let email = document.getElementById('inputEmail').value;
        let name = document.getElementById('inputName').value;
        let dni = document.getElementById('inputDni').value;
        let password = document.getElementById('inputPassword').value;

        if (email === "") {
            alert('Por favor complete el correo electrónico');
            return false;
        } else if (!email.includes('@')) {
            alert('Correo electrónico inválido');
            return false;
        }
        if (name === "") {
            alert('Por favor complete el nombre');
            return false;
        }
        if (dni === "" || (dni.length !== 7 && dni.length !== 8)) {
            alert('Por favor escribe un DNI válido (de 7 u 8 caracteres)');
            return false;
        }
        if (!selectedDate) {
            alert('Por favor seleccione una fecha de nacimiento');
            return false;
        }
        if (password === "") {
            alert('Por favor complete la contraseña');
            return false;
        }
        return true;
    }

    function AddData() {
        if (validateForm()) {
            let email = document.getElementById('inputEmail').value;
            let name = document.getElementById('inputName').value;
            let dni = document.getElementById('inputDni').value;
            let password = document.getElementById('inputPassword').value;
            let fecha = selectedDate.toISOString();
            let age = calculateAge(new Date(selectedDate));

            let newListPeople = localStorage.getItem("listPeople") ? JSON.parse(localStorage.getItem('listPeople')) : [];

            newListPeople.push({
                email: email,
                name: name,
                dni: dni,
                fecha: fecha,
                age: age,
                password: password
            });

            localStorage.setItem("listPeople", JSON.stringify(newListPeople));
            ReadData();

            clearForm();
        }
    }

    function calculateAge(birthday) {
        const ageDate = new Date(Date.now() - birthday.getTime());
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    function ReadData() {
        const newListPeople = localStorage.getItem('listPeople') ? JSON.parse(localStorage.getItem('listPeople')) : [];
        setListPeople(newListPeople);
        setFilteredPeople(newListPeople);
    }

    function updateAges() {
        const newListPeople = localStorage.getItem('listPeople') ? JSON.parse(localStorage.getItem('listPeople')) : [];
        const updatedPeople = newListPeople.map(person => {
            person.age = calculateAge(new Date(person.fecha));
            return person;
        });
        localStorage.setItem("listPeople", JSON.stringify(updatedPeople));
    }

    function editData(index) {
        setEditIndex(index);
        document.getElementById('btnAdd').style.display = 'none';
        document.getElementById('btnUpdate').style.display = 'block';

        const person = listPeople[index];
        document.getElementById('inputEmail').value = person.email;
        document.getElementById('inputName').value = person.name;
        document.getElementById('inputDni').value = person.dni;
        document.getElementById('inputPassword').value = person.dni;
        setSelectedDate(new Date(person.fecha));
    }

    function updateData() {
        if (validateForm()) {
            let email = document.getElementById('inputEmail').value;
            let name = document.getElementById('inputName').value;
            let dni = document.getElementById('inputDni').value;
            let fecha = selectedDate.toISOString();
            let age = calculateAge(new Date(selectedDate));
            let password = document.getElementById('inpuPassword').value;

            let newListPeople = [...listPeople];
            newListPeople[editIndex] = {
                email: email,
                name: name,
                dni: dni,
                fecha: fecha,
                age: age,
                password: password
            };

            localStorage.setItem("listPeople", JSON.stringify(newListPeople));
            ReadData();

            clearForm();
            setEditIndex(null);
            document.getElementById('btnAdd').style.display = 'block';
            document.getElementById('btnUpdate').style.display = 'none';
        }
    }

    function clearForm() {
        document.getElementById('inputEmail').value = "";
        document.getElementById('inputName').value = "";
        document.getElementById('inputDni').value = "";
        document.getElementById('inputPassword').value = "";
        setSelectedDate(new Date());
    }

    function deleteData(index) {
        let newListPeople = [...listPeople];
        newListPeople.splice(index, 1);
        localStorage.setItem("listPeople", JSON.stringify(newListPeople));
        ReadData();
    }

    function filterPeople() {
        const filtered = listPeople.filter(person =>
            person.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredPeople(filtered);
    }

    return (
        <div className="container">
            <div className="container mb-5">
                <div className="row">
                    <form>
                        <h1>REGISTRAR USUARIO</h1>
                        <div className="login-form">
                            <label className="form-label" id="text">Correo Electrónico</label>
                            <input type="email" className="form-control" id="inputEmail" placeholder="Ingrese su correo electrónico" />
                        </div>
                        <div className="login-form">
                            <label className="form-label" id="text">Nombre Completo</label>
                            <input type="text" className="form-control" id="inputName" placeholder="Ingrese su nombre completo" />
                        </div>
                        <div className="login-form">
                            <label className="form-label" id="text">DNI</label>
                            <input type="number" className="form-control" id="inputDni" placeholder="Ingrese su número D.N.I" />
                        </div>
                        <div className="login-form">
                            <div className="grupo">
                                <label className="form-label" id="inputFecha">Fecha de Nacimiento</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date("1900-01-01")}
                                    maxDate={new Date()}
                                    className="custom-datepicker"
                                    showYearDropdown
                                    yearDropdownItemNumber={10}
                                    scrollableYearDropdown
                                    showMonthDropdown
                                    useShortMonthInDropdown
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                        <div className="login-form">
                            <label className="form-label" id="text">contraseña</label>
                            <input type="password" className="form-control" id="inputPassword" placeholder="*****" />
                        </div>
                        <button type="button" className="Btn btn btn-primary" id="btnAdd" onClick={AddData}>Enviar</button>
                        <button type="button" className="Btn btn-primary" id="btnUpdate" style={{ display: 'none' }} onClick={updateData}>Actualizar</button>
                    </form>
                </div>
            </div>
            <div className="btnSearch">
                <input 
                    type="text" 
                    className="form-control-search" 
                    placeholder="Buscar por nombre" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                />
            </div>
            <hr />
            <table className="table table-bordered" id="tableData">
                <thead>
                    <tr>
                        <th>Correo</th>
                        <th>Nombre Completo</th>
                        <th>DNI</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Edad</th>
                        <th>Contraseña</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPeople.map((element, index) => (
                        <tr key={index}>
                            <td>{element.email}</td>
                            <td>{element.name}</td>
                            <td>{element.dni}</td>
                            <td>{new Date(element.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                            <td>{element.age}</td>
                            <td>{element.password}</td>
                            <td>
                                <button
                                    onClick={() => deleteData(index)}
                                    className="btnDelete"
                                >
                                    Eliminar datos
                                </button>{" "}
                                <button
                                    onClick={() => editData(index)}
                                    className="btnEdit"
                                >
                                    Editar datos
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
