import React from 'react'
import logo from '../../assets/img/voluntarios.jpg'
import './ErrorPage.css'
const ErrorPage = () => {

  return (
    <div className='wrapper-error'>
      <div className='error-page'>
      <h1>Acceso denegado</h1>
      <p>Incia sesion para navegar a traves de nuestra web</p>
      <img src={logo} alt='Logo de la empresa'/>
      </div>

    </div>
  )
}

export default ErrorPage
