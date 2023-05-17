import React from 'react';
import { Link } from 'react-router-dom'
import { ComponenteInputUser, } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Button, Modal, ModalBody } from 'reactstrap';
import md5 from 'md5'
import { Toaster, toast } from 'react-hot-toast'
import { faSave, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Registrame() {
    const [username, setUsername] = useState({ campo: '', valido: null })
    const [password, setPassword] = useState({ campo: '', valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })
    const [ci, setCi] = useState({ campo: '', valido: null })
    const [apellidoPat, setApellidoPat] = useState({ campo: '', valido: null })
    const [apellidoMat, setApellidoMat] = useState({ campo: '', valido: null })
    const [telefono, setTelefono] = useState({ campo: '', valido: null })
    const [modalVer, setModalVer] = useState(false)
    const [proyecto, setProyecto] = useState([])


    const insertar = async () => {

        if (username.valido === 'true' && password.valido === 'true' && telefono.valido === 'true' && ci.valido === 'true' &&
            nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true') {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]
            const pas = md5(password.campo)
            axios.get(URL + '/public/registrarme', {
                params: {
                    username: username.campo,
                    xyz: pas,
                    ci: ci.campo,
                    nombre: nombre.campo,
                    apellido1: apellidoPat.campo,
                    apellido2: apellidoMat.campo,
                    telefono: telefono.campo,
                    creado: fecha + ' ' + new Date().toLocaleTimeString()
                }
            }).then(json => {

                if (json.data.ok) {
                    toast.success(json.data.msg)
                    window.location.href = '/'
                } else toast.error(json.data.msg)
            })
        } else toast.error('Complete todos los campos requeridos en el formulario')
    }


    const ver = async () => {
        if (username.valido === 'true' && password.valido === 'true' && telefono.valido === 'true' && ci.valido === 'true' &&
            nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true') {
            setModalVer(true)
        } else toast.error('complete todos los campos')
    }



    return (
        <>
            <div className="hold-transition login-page">
                <div className="login-box mb-5" >
                    <div className="card card-outline card-primary">
                        <form className='p-2' >
                            <small className='text-center'>REGISTRARME</small>

                            <div className="row">
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={username}
                                        cambiarEstado={setUsername}
                                        name="username"
                                        placeholder="Usuario"
                                        ExpresionRegular={INPUT.INPUT_USUARIO}
                                        etiqueta={'Usuario'}
                                        campoUsuario={true}
                                    />
                                </div>

                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={password}
                                        cambiarEstado={setPassword}
                                        name="apellidoPat"
                                        placeholder="Contraseña"
                                        ExpresionRegular={INPUT.PASSWORD}  //expresion regular
                                        etiqueta='Contraseña'
                                    />
                                </div>
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={ci}
                                        cambiarEstado={setCi}
                                        name="ci"
                                        placeholder="Carnet de Identidad"
                                        ExpresionRegular={INPUT.CI}
                                        etiqueta={'C.I.'}
                                    />
                                </div>
                                <div className="col-12">
                                    <ComponenteInputUser
                                        estado={nombre}
                                        cambiarEstado={setNombre}
                                        name="nombre"
                                        placeholder="Nombre completo"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Nombre'
                                    />
                                </div>
                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={apellidoPat}
                                        cambiarEstado={setApellidoPat}
                                        name="apellidoPat"
                                        placeholder="Apellido Paterno"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Apellido Paterno'
                                    />
                                </div>

                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={apellidoMat}
                                        cambiarEstado={setApellidoMat}
                                        name="apellidoMat"
                                        placeholder="Apellido Materno"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                        etiqueta='Apellido Materno'
                                    />
                                </div>

                                <div className="col-6">
                                    <ComponenteInputUser
                                        estado={telefono}
                                        cambiarEstado={setTelefono}
                                        name="telefono"
                                        placeholder="Telefono/cel."
                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                        etiqueta='telefono/celular'
                                    />
                                </div>
                            </div>
                            <div>
                                <Button className=' info' onClick={() => ver()}>Registrarme</Button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>


            <Modal isOpen={modalVer}>
                <div className='titloFormulario' >
                    DETALLES DEL MONTO
                </div>
                <ModalBody>
                    <div className='groupInput'>
                        <div className='titleDetalle' >
                            Datos Generales
                        </div>
                        <p className='textoDetalle'>{'Carnet de Identidad: ' + ci.campo}</p>
                        <p className='textoDetalle'>{'Nombre  : ' + nombre.campo + ' ' + apellidoPat.campo + ' ' + apellidoMat.campo}</p>
                        <p className='textoDetalle'>{'Usuario  : ' + username.campo}</p>
                        <p className='textoDetalle'>{'Contraseña  : ' + password.campo}</p>
                        <p className='textoDetalle'>{'Celular/Telf. : ' + telefono.campo}</p>

                    </div>

                </ModalBody>
                <div className="row botonModal">
                    <Button className='btn-restaurar col-auto' onClick={() => setModalVer(false)}  >
                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>

                    <Button className='btn-nuevo col-auto' onClick={() => insertar()}>
                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Registrarme </Button>
                </div>
            </Modal>
            <Toaster position='top-center' />
            {/* <div className='footer-pagueR'> @COPYRIGHT  <Link className='ml-5' to={'#'} onClick={() => { window.location.href = 'https://wa.me/59171166513' }}>
                <spam className='spam-footerR'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div> */}
        </>


    );

}
export default Registrame;
