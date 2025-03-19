import React, { useEffect, useState } from "react";
import miLogo from "../../assets/img/logo-pro-help.png";
import campania from "../../assets/img/voluntarios.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import UserService from "../../service/UserService";
import { auth, signInWithCustomToken } from "../../config/firebase.config";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role")
        localStorage.removeItem("profileInfo")
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(email, password)
            console.log(userData)
            if (userData.token) {
                localStorage.setItem('token', userData.token)
                localStorage.setItem('role', userData.role)

                const firebaseTokenData = await UserService.getFirebaseToken(userData.token, password);
                if (firebaseTokenData.firebaseToken) {
                  // Step 4: Authenticate with Firebase using the Firebase Custom Token
                  await signInWithCustomToken(auth, firebaseTokenData.firebaseToken);
                  console.log("Usuario autenticado en Firebase", auth.currentUser);
               
                  navigate('/profile');
                 } else {
                        setError("Error getting Firebase token.");
                    }
            
            } else {
                setError(userData.message)
            }

        } catch (error) {
            console.log(error)
            setError(error.message)
            setTimeout(() => {
                setError('');
            }, 5000);
        }


    }

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
                    <div className="text-center position-relative z-2">
                        <img src={miLogo} alt="Logo" className="img-fluid" style={{ maxHeight: "200px", marginRight: "250px" }} />
                        <img src={campania} alt="Campaña" className="img-fluid" style={{ maxWidth: "90%" }} />
                    </div>
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                        <h1 className="text-center" style={{ fontWeight: "bold" }}>Iniciar sesión</h1>
                        <p className="text-center" style={{ fontWeight: "normal" }}>Conectamos a personas generosas con quienes más lo necesitan.</p>
                        {error && <p className="alert alert-danger text-center">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Correo o teléfono</label>
                                <input type="text" name="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input type={showPassword ? "text" : "password"} name="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3 text-end">
                                <NavLink
                                    to="/recuperar-contra"
                                   style={{color:'grey'}}
                                >
                                    <span style={{ fontSize: 15, fontWeight: 500, color:'grey',}}>Olvidaste tu contraseña?</span>
                                </NavLink>
                           
                    </div>
                    <button type="submit" className="btn w-100"
                        style={{ backgroundColor: "#896447", borderColor: "#896447", color: "white" }}>Ingresar</button>
                    <div className="text-center my-2">o</div>
                    <button type="button" className="btn w-100"
                        style={{ backgroundColor: "#E0E2CB", borderColor: "#E0E2CB", }}>Registrarse</button>
                </form>
            </div>
        </div>
            </div >
        </div >
    );
};

export default LoginPage;
