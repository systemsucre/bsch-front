

import React from 'react';
import useAuth from "../Auth/useAuth"
import { Button } from 'reactstrap';
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { ComponenteInputUserRow, ComponenteInputUser } from './elementos/input'
import { Modal, ModalBody } from 'reactstrap'
import md5 from 'md5'
import { Toaster, toast } from 'react-hot-toast'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCalendar, faCalendarCheck, faEdit, faLock, faPhone, faUser, faUserAlt, faUserInjured, faWindowClose, } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function MiPerfil() {


    const [lista, setLista] = useState([])
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [apellidoPaterno, setApellidoPaterno] = useState({ campo: null, valido: null })
    const [apellidoMaterno, setApellidoMaterno] = useState({ campo: null, valido: null })
    const [ci, setCi] = useState({ campo: null, valido: null })
    // const [correo, setCorreo] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    // const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [user, setUser] = useState({ campo: null, valido: null })
    const [proyecto, setProyecto] = useState({ campo: null, valido: null })
    const [rol, setRol] = useState({ campo: null, valido: null })

    const [Pass1, setPass1] = useState({ campo: null, valido: null })
    const [Pass2, setPass2] = useState({ campo: null, valido: null })
    const [Pass3, setPass3] = useState({ campo: null, valido: null })
    const [PassDB, setPassDB] = useState({ campo: null, valido: null })

    const [modal, setModal] = useState(false)
    const [modalPass, setModalPass] = useState(false)
    const auth = useAuth()
    useEffect(() => {
        axios.post(URL + '/miPerfil/ver').then(json => {
            // setData(json.data)
            if (json.data.ok) {
                console.log(json.data.data)
                setNombre({ campo: json.data.data[0].nombre, valido: 'true' })
                setApellidoPaterno({ campo: json.data.data[0].apellido1, valido: 'true' })
                setApellidoMaterno({ campo: json.data.data[0].apellido2, valido: 'true' })
                setCi({ campo: json.data.data[0].ci, valido: 'true' })
                // setCorreo({ campo: json.data[0].correo, valido: 'true' })
                setTelefono({ campo: json.data.data[0].telefono, valido: 'true' })
                // setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                setUser({ campo: json.data.data[0].username, valido: 'true' })
                setProyecto({ campo: json.data.data[0].proyecto, valido: 'true' })
                setRol({ campo: json.data.data[0].rol, valido: 'true' })
                setPassDB({ campo: json.data.data[0].pass, valido: 'true' })
                setLista(json.data.data)
            } else toast.error(json.data.msg)
        }).catch(() => {
            toast.error('Error en el Servidor')
        })

    }, [])




    const token = localStorage.getItem("token")
    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${token}`
            return config
        },
        error => {
            auth.logout()
            return Promise.reject(error)
        }
    )

    try {
        const actualizar = async () => {
            if (nombre.valido === 'true' && apellidoPaterno.valido === 'true' && apellidoMaterno.valido === 'true' &&
                ci.valido === 'true' && telefono.valido === 'true') {
                try {


                    axios.post(URL + '/miPerfil/actualizarMiPerfil', {
                        nombre: nombre.campo,
                        apellido1: apellidoPaterno.campo,
                        apellido2: apellidoMaterno.campo,
                        ci: ci.campo,
                        // correo: correo.campo,
                        telefono: telefono.campo,
                        // direccion: direccion.campo

                    }).then(json => {

                        if (json.data.ok) {
                            setNombre({ campo: json.data.data[0].nombre, valido: 'true' })
                            setApellidoPaterno({ campo: json.data.data[0].apellido1, valido: 'true' })
                            setApellidoMaterno({ campo: json.data.data[0].apellido2, valido: 'true' })
                            setCi({ campo: json.data.data[0].ci, valido: 'true' })
                            // setCorreo({ campo: json.data[0].correo, valido: 'true' })
                            setTelefono({ campo: json.data.data[0].telefono, valido: 'true' })
                            // setDireccion({ campo: json.data[0].direccion, valido: 'true' })
                            setUser({ campo: json.data.data[0].username, valido: 'true' })
                            setProyecto({ campo: json.data.data[0].proyecto, valido: 'true' })
                            setRol({ campo: json.data.data[0].rol, valido: 'true' })
                            setPassDB({ campo: json.data.data[0].pass, valido: 'true' })
                            setModal(false)
                            toast.success(json.data.msg)
                        } else { toast.error(json.data.msg) }
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            else toast.error('Complete todos los campos')
        }

        const cambiarContraseña = () => {
            let passMd5 = md5(Pass1.campo)
            if (Pass1.valido === 'true' && Pass2.valido === 'true' && Pass3.valido === 'true') {
                if (passMd5 === PassDB.campo) {
                    if (Pass2.campo === Pass3.campo) {
                        axios.post(URL + '/miPerfil/cambiarMiContrasena', { pass1: passMd5, pass2: md5(Pass2.campo) }).then(j => {
                            if (j.data.ok) {
                                setModalPass(false)
                                toast.success(j.data.msg)
                                setPass1({ campo: null, valido: null })
                                setPass2({ campo: null, valido: null })
                                setPass3({ campo: null, valido: null })
                            } else toast.error(j.data.msg)

                        })
                    } else { toast.error('Confirme corresctamente su nueva contraseña'); return }
                } else { toast.error('Su contraseña actual es incorrecto'); return }
            }
            else { toast.error('Complete todos los campos'); return }
        }

        return (
            <div  >
                <div className="hold-transition sidebar-mini">
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper">
                            <div className="content">
                                <div className="container-fluid" style={{ height: '520px' }}>
                                    <div className='col-12 tituloPaginas'>
                                        Gestionar mi perfil
                                    </div >


                                    <div className="col-lg-6 col-xl-6 col-md-7 col-sm-8 col-12 bg-white m-auto"  >
                                        {lista.length > 0 && <>
                                            <div className="card-body box-profile row">
                                                <div className='col-5 mt-5'>
                                                    <div className="text-center">
                                                        <img className="profile-user-img img-fluid img-circle"
                                                            src="../../dist/img/profile.png"
                                                            alt="SAN PEDRO CLAVER LAJASTAMBO" />
                                                    </div>
                                                    <div className='usuario '><strong>{lista[0].nombre + ' ' + lista[0].apellido1 + ' ' + lista[0].apellido2}</strong></div>
                                                    <p className='usuarioCi'>{lista[0].campo}</p>
                                                </div>
                                                <div className='col-7'>
                                                    <div className='row pt-4 mt-5'>
                                                        <div className='col-1 '>
                                                            <div className='iconoPerfil'><FontAwesomeIcon icon={faUser} /></div>
                                                        </div>
                                                        <div className='col-11 cajaDatosUser '>
                                                            <p className='medico'><strong> {'user ' + lista[0].username}</strong></p>
                                                            <p className='rol'><strong> {'rol ' + lista[0].rol}</strong></p>
                                                        </div>
                                                    </div>


                                                    <div className='row mt-3'>
                                                        <div className='col-1 '>
                                                            <div className='iconoPerfil'><FontAwesomeIcon icon={faPhone} /></div>
                                                        </div>
                                                        <div className='col-11 cajaDatosUser'>
                                                            <p className='nhc'> {'CELULAR/TELEF ' + lista[0].telefono}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mt-3'>
                                                    <div className='groupInput row'>
                                                        <div className='titleDetalle' >
                                                            Historial de creación
                                                        </div>
                                                        <div className='col-1 '>
                                                            <div className='iconoPerfil'><FontAwesomeIcon icon={faUserInjured} /></div>
                                                        </div>
                                                        <div className='col-11 cajaDatosUser'>
                                                            <p className='nhc'> {'Usuario ' + lista[0].usuario}</p>
                                                        </div>
                                                        <div className='col-1 '>
                                                            <div className='iconoPerfil'><FontAwesomeIcon icon={faCalendar} /></div>
                                                        </div>
                                                        <div className='col-11 cajaDatosUser'>
                                                            <p className='nhc'> {'CREADO :  ' + lista[0].creado}</p>
                                                        </div>
                                                        <div className='col-1 '>
                                                            <div className='iconoPerfil'><FontAwesomeIcon icon={faCalendarCheck} /></div>
                                                        </div>
                                                        <div className='col-11 cajaDatosUser'>
                                                            <p className='nhc'> {'ACTUALIZADO :  ' + lista[0].modificado}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row botonModal">
                                                <Button className="btn-nuevo col-auto" onClick={() => setModal(true)}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar
                                                </Button>
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalPass(true)}  >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faLock}></FontAwesomeIcon>Cambiar mi contraseña
                                                </Button>
                                            </div>
                                        </>
                                        }



                                        <Modal isOpen={modal}>
                                            <div className='titloFormulario' >
                                                Actualizar mi perfil
                                            </div>
                                            <ModalBody>
                                                <div className="row">

                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                        <ComponenteInputUser
                                                            estado={nombre}
                                                            cambiarEstado={setNombre}
                                                            name="NOMBRE"
                                                            placeholder="NOMBRE COMPLETO"
                                                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                            etiqueta='Nombre'
                                                            msg='Este campo admite solo letras'
                                                        />
                                                    </div>

                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                        <ComponenteInputUser
                                                            estado={apellidoPaterno}
                                                            cambiarEstado={setApellidoPaterno}
                                                            name="ci"
                                                            placeholder="APELLIDO PATERNO"
                                                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                            etiqueta='Apellido Peterno'
                                                            msg='Este campo admite solo letras'

                                                        />
                                                    </div>


                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                        <ComponenteInputUser
                                                            estado={apellidoMaterno}
                                                            cambiarEstado={setApellidoMaterno}
                                                            name="apellido materno"
                                                            placeholder="APELLIDO MATERNO"
                                                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                            etiqueta='Apellido materno'
                                                            msg='Este campo admite solo letras'

                                                        />
                                                    </div>


                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                        <ComponenteInputUser
                                                            estado={ci}
                                                            cambiarEstado={setCi}
                                                            name="CI"
                                                            placeholder="CEDULA DE IDENTIDAD"
                                                            ExpresionRegular={INPUT.CI}  //expresion regular
                                                            etiqueta='Cédula de identidad'
                                                            msg='Ej: 72777333 ó 35656-N5'

                                                        />
                                                    </div>

                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                        <ComponenteInputUser
                                                            estado={telefono}
                                                            cambiarEstado={setTelefono}
                                                            name="telefono"
                                                            placeholder="TELEFONO/CELULAR"
                                                            ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                            etiqueta='Telefono/celular'
                                                            msg='Este campo admite solo numeros'

                                                        />
                                                    </div>
                                                </div>
                                            </ModalBody>

                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModal(false)}  >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => actualizar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar
                                                </Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalPass}>
                                            <div className='titloFormulario' >
                                                CAMBIAR CONTRASEÑA
                                            </div>
                                            <ModalBody>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">

                                                    <ComponenteInputUser
                                                        estado={Pass1}
                                                        cambiarEstado={setPass1}
                                                        name="pass1"
                                                        placeholder="CONTRASEÑA ACTUAL"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Contrasela Actual'
                                                        campoUsuario={true}
                                                        msg='Complete este campo'
                                                    /></div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">

                                                    <ComponenteInputUser
                                                        estado={Pass2}
                                                        cambiarEstado={setPass2}
                                                        name="pass1"
                                                        placeholder="NUEVA CONTRASEÑA"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Nueva Contraseña'
                                                        campoUsuario={true}
                                                        msg='Complete este campo'
                                                    /></div>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">

                                                    <ComponenteInputUser
                                                        estado={Pass3}
                                                        cambiarEstado={setPass3}
                                                        name="pass1"
                                                        placeholder="CONFIRMA CONTRASEÑA"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Confirmar contraseña'
                                                        campoUsuario={true}
                                                        msg='Complete este campo'

                                                    />
                                                </div>

                                            </ModalBody>
                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalPass(false)}  >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => cambiarContraseña()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Cambiar contraseña
                                                </Button>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                {/* <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div> */}

                            </div>
                        </div>
                    </div>
                </div>

                <Toaster position='top-right' />

            </div >

        );
    } catch (error) {
        // auth.logout()
    }

}
export default MiPerfil;
