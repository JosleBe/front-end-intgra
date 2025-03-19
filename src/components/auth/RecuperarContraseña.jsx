import React, { useEffect, useState } from "react";
import miLogo from "../../assets/img/logo-pro-help.png";
import campania from "../../assets/img/voluntarios.jpg";
import { NavLink, useNavigate } from "react-router-dom";
const RecuperarContraseña = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = () =>{


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
                <h1 className="text-center" style={{ fontWeight: "semibold", fontSize: '23px' }}>Recupereación de constraseña</h1>
                {error && <p className="alert alert-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <p className="text-center">Ingresa el correo electronico asociado a tu cuenta</p>
                        <label className="form-label">Correo </label>
                        <input type="text" name="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn w-100"
                style={{ backgroundColor: "#", borderColor: "#E0E2CB", color: "white" }}>Enviar</button>
          
        </form>
    </div>
</div>
    </div >
</div >
  )
}

export default RecuperarContraseña
