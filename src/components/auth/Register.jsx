import React, { useEffect, useState } from "react";
import miLogo from "../../assets/img/logo-pro-help.png";
import campania from "../../assets/img/voluntarios.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
    const navigate = useNavigate();
    // Definir los estados para cada campo del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [sexo, setSexo] = useState('H'); // Valor por defecto "H" para Hombre
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const user = { name, lastName, phone, email, password, role: "USER", isActive: true, sexo };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar alerta de éxito
                Swal.fire({
                    title: 'Registro Exitoso',
                    text: 'Tu cuenta ha sido registrada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Ir al Login',
                }).then(() => {

                    navigate('/');
                });
            } else {

                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Hubo un error al registrar la cuenta',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al registrar la cuenta. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };


    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#896447" }}>
            <div className="row w-100">

                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center text-white position-relative"
                    style={{
                        backgroundColor: "white",
                        borderTopLeftRadius: "300px",
                        borderTopRightRadius: "50px",
                        clipPath: "path('M 0 0 Q 100% 0, 50% 50% T 0 100% L 0 0')",
                        height: "98vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <div className="text-center position-relative z-1">
                        <img src={miLogo} alt="Logo" className="img-fluid" style={{ maxHeight: "200px", marginRight: "250px" }} />
                        <img src={campania} alt="Campaña" className="img-fluid" style={{ maxWidth: "90%" }} />
                    </div>
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card p-3 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                        <h1 className="text-center" style={{ fontWeight: "bold", fontSize: 22}}>Registro</h1>
                
                        <form onSubmit={handleSubmit} className="p-2">
                            <div className="mb-1">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Telefono</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Correo</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="form-control"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Confirmar Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        className="form-control"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>

                            {/* Campo de Sexo */}
                            <div className="mb-1">
                                <label className="form-label">Sexo</label>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="sexo"
                                            value="H"
                                            checked={sexo === 'H'}
                                            onChange={(e) => setSexo(e.target.value)}
                                        />
                                        Hombre
                                    </label>
                                    <label className="ml-2">
                                        <input
                                            type="radio"
                                            name="sexo"
                                            value="M"
                                            checked={sexo === 'M'}
                                            onChange={(e) => setSexo(e.target.value)}
                                        />
                                        Mujer
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn w-100"
                                style={{ backgroundColor: '#896447', borderColor: '#896447', color: 'white' }}
                            >
                                Registrarse
                            </button>
                        </form>

                    </div>
                </div>
            </div >
        </div >
    )
}

export default Register
