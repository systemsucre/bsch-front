import useAuth from "../Auth/useAuth";
import { useEffect } from "react";
import React from 'react';
import { useState } from "react";
import { URL, INPUT } from '../Auth/config';
import { ComponenteInputUser, ComponenteInputFile } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados

import { Button, Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { faCaretLeft, faDatabase, faEdit, faMailBulk, faSave, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toaster, toast } from 'react-hot-toast'
import Home from './elementos/home'



function Informaciones() {
    const auth = useAuth()

    const [modalInsertar, setModalInsertar] = useState(false);

    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [correo, setCorreo] = useState({ campo: null, valido: null })
    const [usuario, setUsuario] = useState({ campo: null, valido: null })
    const [creado, setCreado] = useState({ campo: null, valido: null })
    const [modificado, setModificado] = useState({ campo: null, valido: null })


    useEffect(() => {
        axios.post(URL + '/informacion/all').then(json => {
            if (json.data.ok) {
                setId({ campo: json.data.data[0].id, valido: 'true' })
                setNombre({ campo: json.data.data[0].nombre, valido: 'true' })
                setTelefono({ campo: json.data.data[0].telefono, valido: 'true' })
                setDireccion({ campo: json.data.data[0].direccion, valido: 'true' })
                setCorreo({ campo: json.data.data[0].correo, valido: 'true' })
                setUsuario({ campo: json.data.data[0].usuario, valido: 'true' })
                setCreado({ campo: json.data.data[0].creado, valido: 'true' })
                setModificado({ campo: json.data.data[0].modificado, valido: 'true' })
            } else {
                setModalInsertar(true)
            }

        }).catch(() => {
            // auth.logout()
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


        const abrirModalEditar = () => {
            setModalEditar(true)
        }

        const insertar = async () => {
            if (nombre.valido === 'true' && telefono.valido === 'true' &&
                direccion.valido === 'true' && correo.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]

                try {
                    axios.post(URL + '/informacion/insertar', {
                        nombre: nombre.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo,
                        correo: correo.campo,
                        creado: fecha + ' ' + new Date().toLocaleTimeString(),
                    }).then(json => {
                        if (json.data.ok) {
                            setId({ campo: json.data.data[0].id, valido: 'true' })
                            setNombre({ campo: json.data.data[0].nombre, valido: 'true' })
                            setTelefono({ campo: json.data.data[0].telefono, valido: 'true' })
                            setDireccion({ campo: json.data.data[0].direccion, valido: 'true' })
                            setCorreo({ campo: json.data.data[0].correo, valido: 'true' })
                            setUsuario({ campo: json.data.data[0].usuario, valido: 'true' })
                            setCreado({ campo: json.data.data[0].creado, valido: 'true' })
                            setModificado({ campo: json.data.data[0].modificado, valido: 'true' })
                            setModalInsertar(false)
                            toast.success(json.data.msg)
                        } else toast.error(json.data.msg)
                    })
                } catch (error) {
                    return error
                }
            } else {
                toast.error('Complete todos los campos')
            }
        }


        const actualizar = async (e) => {

            if (id.valido === 'true' && nombre.valido === 'true'
                && telefono.valido === 'true' && direccion.valido === 'true' && correo.valido === 'true') {

                try {
                    let today = new Date()
                    let fecha = today.toISOString().split('T')[0]



                    let hora = new Date().toLocaleTimeString().split(':')[0]
                    let min = new Date().toLocaleTimeString().split(':')[1]
                    let sec = new Date().toLocaleTimeString().split(':')[2]
                    if (hora < 10) hora = '0' + hora
                    let horafinal = hora + ':' + min + ':' + sec


                    axios.post(URL + '/informacion/actualizar', {
                        id: id.campo,
                        nombre: nombre.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo,
                        correo: correo.campo,
                        modificado: fecha + ' ' + horafinal,

                    }).then(json => {
                        if (json.data.ok) {
                            setId({ campo: json.data.data[0].id, valido: 'true' })
                            setNombre({ campo: json.data.data[0].nombre, valido: 'true' })
                            setTelefono({ campo: json.data.data[0].telefono, valido: 'true' })
                            setDireccion({ campo: json.data.data[0].direccion, valido: 'true' })
                            setCorreo({ campo: json.data.data[0].correo, valido: 'true' })
                            setUsuario({ campo: json.data.data[0].usuario, valido: 'true' })
                            setCreado({ campo: json.data.data[0].creado, valido: 'true' })
                            setModificado({ campo: json.data.data[0].modificado, valido: 'true' })
                            setModalEditar(false)
                            toast.success(json.data.msg)
                        } else toast.error(json.data.msg)
                    })
                } catch (error) {
                    console.log(error)
                    return error
                }
            } else {
                toast.error('Complete todos los campos')
            }

        }

        const copiaseguridad = () => {
            let today = new Date()
            let fecha = today.toISOString().split('T')[0]



            let hora = new Date().toLocaleTimeString().split(':')[0]
            let min = new Date().toLocaleTimeString().split(':')[1]
            let sec = new Date().toLocaleTimeString().split(':')[2]
            if (hora < 10) hora = '0' + hora
            let horafinal = hora + min + sec

            axios.post(URL + '/informacion/copiaSeguridad', { fecha: fecha + horafinal }).then(json => {
                toast.success(json.data.msg)
            })

        }

        return (
            <div >
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content" >

                                <div className="container-fluid pt-1" >
                                    <div style={{ background: 'white', height:'520px' }}>
                                        

                                        <div className=" card-widget widget-user-2 col-lg-7 col-md-7 col-sm-10 col-sm-12 col-12 m-auto mt-3 pt-5 pb-5">
                                            <div className="widget-user-header bg-success " >
                                                <div className="widget-user-image">
                                                    <img className="img-circle elevation-2" src="../../dist/img/empresa.png" alt="User Avatar" />
                                                </div>
                                                <h3 className="widget-user-username">{nombre.campo}</h3>
                                            </div>
                                            <div className="card-footer p-0">
                                                <ul className="nav flex-column">
                                                    <li className="nav-item">
                                                        <Link to="#" className="nav-link">
                                                            <i className="fas fa-map-marker-alt mr-1"></i>{direccion.campo}
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="#" className="nav-link">
                                                            <i className="fas fa-phone mr-1"></i> {telefono.campo}
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="#" className="nav-link">
                                                            <FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon>
                                                            {correo.campo}
                                                        </Link>
                                                    </li>

                                                    <div className='groupInput m-3'>
                                                        <div className='titleDetalle' >
                                                            Interacciones
                                                        </div>
                                                        <p className='textoDetalle'>{'USUARIO :  ' + usuario.campo}</p>
                                                        <p className='textoDetalle'>{'CREADO EN :  ' + creado.campo}</p>
                                                        <p className='textoDetalle'><span>ACTUALIZADO EN :  </span>{modificado.campo ? modificado.campo : 'Aun no se actualizo el registro'}</p>
                                                    </div>

                                                </ul>
                                                <div className="row botonModal">
                                                    <Button className="btn-restaurar col-auto" onClick={() => copiaseguridad()} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faDatabase}></FontAwesomeIcon>Copia de seguridad
                                                    </Button>
                                                    <Button className="btn-nuevo col-auto" onClick={() => abrirModalEditar()}>
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>




                                        <Modal isOpen={modalInsertar}>
                                            <div className='titloFormulario' >
                                                REGISTRAR HOSPITAL
                                            </div>
                                            <ModalBody>
                                                <form>
                                                    <div className='row'>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={direccion}
                                                                cambiarEstado={setDireccion}
                                                                name="Dieccion"
                                                                placeholder="DIRECCION"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Direccion'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="LABORATORIO"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="form-group col-6">
                                                            <ComponenteInputUser
                                                                estado={telefono}
                                                                cambiarEstado={setTelefono}
                                                                name="telefono"
                                                                placeholder="TELEFONO"
                                                                ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                                etiqueta='Telefono'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={correo}
                                                                cambiarEstado={setCorreo}
                                                                name="red"
                                                                placeholder="CORREO ELECTRONICO"
                                                                ExpresionRegular={INPUT.CORREO}  //expresion regular
                                                                etiqueta='CORREO ELECTRONIO'
                                                                campoUsuario={true}
                                                            />
                                                        </div>

                                                    </div>
                                                </form>
                                            </ModalBody>
                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalInsertar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insertar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Registrar
                                                </Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalEditar}>
                                            <div className='titloFormulario' >
                                                ACTUALIZAR DATOS
                                            </div>
                                            <ModalBody>
                                                <form>
                                                    <div className='row'>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={direccion}
                                                                cambiarEstado={setDireccion}
                                                                name="Dieccion"
                                                                placeholder="DIRECCION"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Direccion'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={nombre}
                                                                cambiarEstado={setNombre}
                                                                name="nombre"
                                                                placeholder="LABORATORIO"
                                                                ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                                etiqueta='Nombre'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="form-group col-6">
                                                            <ComponenteInputUser
                                                                estado={telefono}
                                                                cambiarEstado={setTelefono}
                                                                name="telefono"
                                                                placeholder="TELEFONO"
                                                                ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                                etiqueta='Telefono'
                                                            />
                                                        </div>
                                                        <div className="form-group col-12">
                                                            <ComponenteInputUser
                                                                estado={correo}
                                                                cambiarEstado={setCorreo}
                                                                name="red"
                                                                placeholder="CORREO ELECTRONICO"
                                                                ExpresionRegular={INPUT.CORREO}  //expresion regular
                                                                etiqueta='CORREO ELECTRONIO'
                                                                campoUsuario={true}
                                                            />
                                                        </div>

                                                    </div>
                                                </form>
                                            </ModalBody>

                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalEditar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => actualizar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Actualizar
                                                </Button>
                                            </div>
                                        </Modal>
                                        <Toaster position='top-right' />

                                    </div>
                                    <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div >
        )
    } catch (error) {
        // auth.logout()
    }

}
export default Informaciones;