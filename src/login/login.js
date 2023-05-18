import { useState, useEffect } from "react";
import useAuth from "../Auth/useAuth";
import md5 from 'md5'
import { Link } from "react-router-dom";
import React from 'react';
import { InputUsuario } from '../componentes/elementos/input';
import axios from 'axios'
import { URL, INPUT } from '../Auth/config'
import { Toaster, toast } from 'react-hot-toast'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";


function Formulario() {
  useEffect(() => {
    listarEmpresa()
  }, [])

  const [usuario, setUsuario] = useState({ campo: '', valido: null })
  const [password, setPassword] = useState({ campo: '', valido: null })
  const [correo, setCorreo] = useState({ campo: null, valido: null })
  const [clave, setClave] = useState({ campo: null, valido: null })
  const [pass1, setPass1] = useState({ campo: null, valido: null })
  const [pass2, setPass2] = useState({ campo: null, valido: null })

  const [mensaje, setMensaje] = useState('')
  const [login, setLogin] = useState(true)
  const [recover1, setRecover1] = useState(false)
  const [codigo, setCodigo] = useState(false)
  const [recover2, setRecover2] = useState(false)


  const expresiones = {
    // usuario: /^[a-zA-Z0-9_-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    usuario: /^[a-zA-ZÑñ]{4,16}$/, // Letras, numeros, guion y guion_bajo
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,30}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,14}$/ // 7 a 14 numeros.
  }
  const [empresa, setempresa] = useState([])

  const auth = useAuth()




  const listarEmpresa = async () => {
    try {
      axios.get(URL + '/public/empresa').then(json => {
        if (json.data.ok)
          setempresa(json.data.data)
        else toast.error(json.data.msg)
      })
    }
    catch (error) {

    }
  }


  const iniciarSesion = async () => {

    if ((usuario.valido === 'true' && password.valido === 'true')) {
      const pass = md5(password.campo)
      const user = usuario.campo;

      try {
        await axios.get(URL, {
          params: {
            "user": user,
            "pass": pass
          }
        }).then(json => {

          if (json.data.ok) {
            localStorage.setItem('tiempo', new Date().getMinutes())
            const token = json.data.token
            localStorage.setItem("token", token)
            localStorage.setItem('username', json.data.username)
            localStorage.setItem('nombre', json.data.nombre)
            localStorage.setItem('apellido', json.data.apellido)
            localStorage.setItem('rol', json.data.rol)
            localStorage.setItem('numRol', json.data.numRol)
            localStorage.setItem('url', window.location.href)
            auth.login('ok')
            toast.success(json.data.msg)
          }
          else
            toast.error(json.data.msg)
        })
      } catch (error) {
        toast.error('Error, intente mas tarde')
      }
    } else {
      toast.error('Introduzca sus datos')
    }
  }


  const enviarSolicitud = async () => {
    if (correo.valido === 'true') {
      setRecover1(false)
      await axios.get(URL + '/olvideMiContrasena', {
        params: {
          "correo": correo.campo
        }
      }).then(json => {
        if (json.data.ok === false) {
          setMensaje(json.data.msg)
          setRecover1(true)
        }
        if (json.data.ok === true) {
          setCodigo(true)
          setMensaje(json.data.msg)
        }
      })
    }
    else {
      setMensaje('DEBE ESCRIBIR SU CORREO DE RECUPERACION')
    }
  }

  const enviarCodigo = async () => {
    if (clave.valido === 'true' && correo.valido === 'true') {
      setCodigo(false)
      await axios.get(URL + '/codigo', {
        params: {
          "correo": correo.campo,
          "codigo": clave.campo
        }
      }).then(json => {
        if (json.data.ok === false) {
          setMensaje(json.data.msg)
          setCodigo(true)
        }
        if (json.data.ok === true) {
          setRecover2(true)
        }
      })
    } else {
      setMensaje('DEBE ESCRIBIR EL CODIGO QUE LE ACABA DE LLEGAR A SU CORREO')
    }
  }

  const guardarContraseña = async () => {
    if (pass1.valido === 'true' && pass2.valido === 'true') {
      if (pass1.campo === pass2.campo) {

        setRecover2(false)
        await axios.get(URL + '/nuevaContrasena', {
          params: {
            "correo": correo.campo,
            "pass": md5(pass2.campo)
          }
        }).then(json => {
          if (json.data.ok === true) {
            setMensaje(json.data.msg)
            setLogin(true)
            setPass1({ campo: null, valido: null })
            setPass2({ campo: null, valido: null })
            setClave({ campo: null, valido: null })
            setCorreo({ campo: null, valido: null })
          }
          if (json.data.ok === false) {
            setRecover2(true)
          }
        })
      }
      else {
        setMensaje('LAS CONTRASEÑA NO COINCIDEN !!!')
      }
    }
  }

  let tam = window.innerWidth
  let clase = null
  if (tam > 600)
    clase = "fondo-login"
  else
    clase = "fondo-login-movil"

  return (
    <div >

      {login === true &&
        // <div className="hold-transition login-page mt-0 "  >
        <div className={clase}  >

          <div className="login-box mt-0">

            <div className="card card-outline card-primary mt-0">
              <div className="card-header text-center">
                <h4 className="login-box-msg"> <p>BS CH</p></h4>
                <p className='text-danger' >{mensaje}</p>
              </div>
              <div className=" card-body">
                <p className="login-box-msg">inicie session</p>
                <div className="col-12 mb-3">
                  <InputUsuario 
                    estado={usuario}
                    cambiarEstado={setUsuario}
                    tipo="text"
                    name="user"
                    placeholder="Usuario"
                    ExpresionRegular={expresiones.usuario}
                    span="fas fa-envelope"
                    eventoBoton={iniciarSesion}
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputUsuario
                    estado={password}
                    cambiarEstado={setPassword}
                    tipo="password"
                    name="pass"
                    placeholder="Contraseña"
                    ExpresionRegular={expresiones.password}
                    span="fas fa-lock"
                    eventoBoton={iniciarSesion}
                  />
                </div>
                <div className=" col-12 ">
                  <Link
                    to='#'
                    onClick={iniciarSesion}
                    className="btn btn-primary btn-block"
                  >Ingresar
                  </Link>
                </div>

                {/* <p className="text-left">

                  <Link to="#" onClick={() => { setRecover1(true); setLogin(false) }}>olvidó su contraseña ?</Link>
                </p> */}
                <br></br>

                <p className="text-left">
                  <Link to="/registrame" className="text-center">Solicite su cuenta ahora! </Link>
                </p>
                <br></br>
                {empresa.length > 0 &&
                  <p className="text-left">   
                    <div className="info-empresa">{'Desarrollador: Gustavo Aguilar T'}</div>
                    <div className="info-empresa"> <i className="fas fa-phone mr-1"></i>{'Contactos : 71166513' }</div>
                    <div className="info-empresa"><FontAwesomeIcon icon={faMailBulk} className='mr-2'></FontAwesomeIcon>{'gustavoaguilares@gmail.com'}</div>
                  </p>
                }
                {/* {empresa.length > 0 &&
                  <p className="text-left">   
                    <div className="info-empresa">{empresa[0].nombre}</div>
                    <div className="info-empresa"> <i className="fas fa-phone mr-1"></i>{'Contactos : ' + empresa[0].telefono}</div>
                    <div className="info-empresa"><FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon>{empresa[0].correo}</div>
                  </p>
                } */}
              </div>
            </div>
          </div>
        </div>
      }
      {
        recover1 === true &&
        <div className="hold-transition login-page">
          <div className="login-box">
            <div className="card card-outline card-primary">
              <div className="card-header text-center">
                <h4 className="login-box-msg"> <p> </p></h4>
                <p className='text-danger' >{mensaje}</p>

              </div>
              <div className="card-body">
                <p className="login-box-msg">INGRESE EL CORREO DE RECUPERACION</p>
                <p className="login-box-msg" style={{ fontSize: '11px' }}>Si ha perdido el acceso a su correo, contactese con el administrador</p>

                <div className="col-12 mb-3">
                  <InputUsuario
                    estado={correo}
                    cambiarEstado={setCorreo}
                    name="correo"
                    placeholder="CORREO ELECTRONICO"
                    ExpresionRegular={INPUT.CORREO}
                    etiqueta={'Correo electronico'}
                    campoUsuario={true}
                    span="fas fa-envelope"

                  />

                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block" onClick={() => enviarSolicitud()}>Enviar Correo</button>
                </div>
                <p className="mt-3 mb-1">
                  <Link to="#" onClick={() => { setLogin(true); setRecover1(false) }}>Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      {
        codigo === true &&
        <div className="hold-transition login-page">
          <div className="login-box">
            <div className="card card-outline card-primary">
              <div className="card-header text-center">
                <h4 className="login-box-msg"> <p> </p></h4>
                <p className='text-success' >{mensaje}</p>
              </div>
              <div className="card-body">
                <p className="login-box-msg">INGRESE EL CODIGO QUE LE ACABA DE LLEGAR A SU CORREO</p>
                <div className="col-12 mb-3">
                  <InputUsuario
                    estado={clave}
                    cambiarEstado={setClave}
                    name="codigo"
                    placeholder="CODIGO"
                    ExpresionRegular={INPUT.DIRECCION}
                    etiqueta={'CODIGO'}
                    campoUsuario={true}
                    span="fas fa-lock"
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block" onClick={() => enviarCodigo()}>Enviar Codigo</button>
                </div>
                <p className="mt-3 mb-1">
                  <Link to="#" onClick={() => { setRecover1(true); setCodigo(false) }}>Volver</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      {
        recover2 === true &&
        <div className="hold-transition login-page">
          <div className="login-box">
            <div className="card card-outline card-primary">
              <div className="card-header text-center">
                <h4 className="login-box-msg"> <p> </p></h4>
              </div>
              <div className="card-body">
                <p className="login-box-msg">Confirme su nueva contraseña</p>

                <div className="col-12 mb-3">
                  <InputUsuario
                    estado={pass1}
                    cambiarEstado={setPass1}
                    name="pass1"
                    placeholder="Nueva Contraseña"
                    ExpresionRegular={INPUT.DIRECCION}
                    etiqueta={'NUEVA CONTRASEÑA'}
                    campoUsuario={true}
                    span="fas fa-lock"
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputUsuario
                    estado={pass2}
                    cambiarEstado={setPass2}
                    name="pass2"
                    placeholder="Confirmar Contraseña"
                    ExpresionRegular={INPUT.DIRECCION}
                    etiqueta={'CONFIRMAR CONTRASEÑA'}
                    campoUsuario={true}
                    span="fas fa-lock"
                  />
                </div>

                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block" onClick={() => guardarContraseña()} >Guardar Contraseña</button>
                  </div>
                </div>
                <p className="mt-3 mb-1">
                  <Link to="#" onClick={() => { setCodigo(true); setRecover2(false) }}>volver</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      <Toaster position='top-center' />
    </div>
  );
}
export default Formulario;
