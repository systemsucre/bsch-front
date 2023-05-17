import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowLeft, faArrowRight, faCaretLeft, faCartPlus, faEdit, faFolderPlus, faPlus, faPlusCircle, faPlusSquare, faRecycle, faSave, faStar, faTrashAlt, faTruckLoading, faUndo, faWindowClose, faXRay } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser, ComponenteInputBuscar_, } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados

import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'

import axios from 'axios';


function Clasificacion() {
    const auth = useAuth()

    const [id, setId] = useState({ campo: null, valido: null })

    const [clasificacion, setClasificacion] = useState({ campo: null, valido: null });
    const [lista, setLista] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })

    const [eliminado, seteliminado] = useState(false)
    try {

        useEffect(() => {
            if (inputBuscar.valido === null && eliminado === false) listarClasificacion()
            if (inputBuscar.valido === 'false'&& eliminado === false) listarClasificacion()

            if (inputBuscar.valido === null && eliminado === true) listarReciclaje()
            if (inputBuscar.valido === 'false'&& eliminado === true) listarReciclaje()
            document.title = 'Clasificación'
        }, [inputBuscar])



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

        const listarClasificacion = async () => {
            axios.post(URL + '/clasificacion/all').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }

        const listarReciclaje = async () => {
            axios.post(URL + '/clasificacion/reciclaje').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }


        const vaciarDatos = () => {
            setId({ campo: null, valido: null })
            setClasificacion({ campo: null, valido: null })
        }

        const abrirModalInsetar = () => {
            setModalInsertar(true);
        }

        const abrirModalEditar = (a) => {
            setId({ campo: a.id, valido: 'true' })
            setClasificacion({ campo: a.clasificacion, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {

            if (clasificacion.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/clasificacion/insertar', {
                    nombre: clasificacion.campo,
                    creado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalInsertar(false)
                        setLista(json.data.data)
                        toast.success(json.data.msg)
                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete todos los campos')
            }
        }


        const actualizar = async (e) => {
            if (id.valido === 'true' && clasificacion.valido === 'true') {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/clasificacion/actualizar', {
                    id: id.campo,
                    nombre: clasificacion.campo,
                    modificado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setModalEditar(false)
                        setLista(json.data.data)
                        toast.success(json.data.msg)

                    }
                    else
                        toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete todos los campos')
            }

        }

        const eliminar = async (ids) => {

            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/clasificacion/eliminar', { id: ids }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            setLista(json.data.data)
                            toast.success(json.data.msg)
                        }
                        else
                            toast.error(json.data.msg)
                    })

                }
            }
        }


        const restaurar = async (ids) => {

            const ok = window.confirm('¿está seguro de restaurar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/clasificacion/restaurar', { id: ids }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            setLista(json.data.data)
                            toast.success(json.data.msg)
                            seteliminado(false)
                        }
                        else
                            toast.error(json.data.msg)
                    })

                }
            }
        }

        const buscar = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/clasificacion/buscareliminados'
            else dir = URL + '/clasificacion/buscar'
            if (inputBuscar.valido === 'true') {
                // console.log('pasa validaciones')

                axios.post(dir, { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)

                    }
                    else toast.error(json.data.msg)
                })
            }
        }


        const siguiente = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/clasificacion/nextdelete'
            else dir = URL + '/clasificacion/next'

            if (lista.length > 0) {
                const last = lista[lista.length - 1].id
                // console.log(last, lista)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }

        const anterior = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/clasificacion/anterioreliminados'
            else dir = URL + '/clasificacion/anterior'
            if (lista.length > 0) {
                const last = lista[0].id
                console.log(last, lista)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }

        return (
            <div>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content">
                                <div className="container-fluid pt-1">

                                    <div className='tituloPaginas'>
                                        Clasificación de la información <spam className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</spam>
                                    </div >
                                    <div style={{ background: 'white' }}>

                                        <div className='contenedor-cabecera'>

                                            <div className='row '>
                                                {eliminado === false &&
                                                    <>
                                                        <Button className="btn-nuevo col-auto" onClick={abrirModalInsetar} >
                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle}></FontAwesomeIcon>Añadir clasificación
                                                        </Button>
                                                        
                                                        <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); seteliminado(true); setInputBuscar({campo:null, valido:null}) }} >
                                                            <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                        </Button>
                                                    </>
                                                }

                                                {eliminado === true &&
                                                    <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarClasificacion(); setInputBuscar({campo:null, valido:null}) }} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowAltCircleLeft}></FontAwesomeIcon>Regresar
                                                    </Button>
                                                }
                                            </div>


                                        </div>
                                        <div className='contenedor'>

                                            <div className="container-4">
                                                <ComponenteInputBuscar_
                                                    estado={inputBuscar}
                                                    cambiarEstado={setInputBuscar}
                                                    name="inputBuscar"
                                                    ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                    placeholder="Escriba para filtrar ..."
                                                    eventoBoton={buscar}
                                                    // evento2 = {b}
                                                    etiqueta={'Buscar'}
                                                />
                                            </div>

                                            <div className="table table-responsive custom">

                                                <Table className="table table-sm">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-5 ">Clasificación</th>
                                                            <th className="col-1 text-center">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lista.map((s) => (
                                                            <tr key={s.id}>
                                                                <td className="col-5 ">{s.clasificacion}</td>

                                                                {
                                                                    eliminado === false &&
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(s.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(s)} className='botonEditar' />
                                                                    </td>
                                                                }
                                                                {eliminado === true &&
                                                                    <td className="col-1 text-center pl-5">
                                                                        <Button className="btn-restaurar-tabla" onClick={() => { restaurar(s.id) }} >
                                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowRight}></FontAwesomeIcon>Restaurar
                                                                        </Button>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {lista.length === 0 &&
                                                    <div className='paciente' style={{ width: '100%' }}><strong>NO SE ENCONTRO NINGUNA INFORMACION</strong></div>
                                                }
                                            </div>
                                        </div>
                                        <div className='contenedor-foot'>
                                            <div className='navegador-tabla'>
                                                <div className='row'>
                                                    <FontAwesomeIcon className='col-auto anterior' icon={faArrowLeft} onClick={() => anterior()} > </FontAwesomeIcon>
                                                    <div className=' col-auto now'>{lista.length > 0 ? lista[lista.length - 1].id + ' - ' + lista[0].id : '0   -   0'}</div>
                                                    <FontAwesomeIcon className='col-auto next' icon={faArrowRight} onClick={() => siguiente()}> </FontAwesomeIcon>
                                                </div>
                                            </div>
                                        </div>


                                        <Modal isOpen={modalInsertar}>
                                            <div className='titloFormulario' >
                                                Nueva clasificación
                                            </div>
                                            <ModalBody>
                                                <ComponenteInputUser
                                                    estado={clasificacion}
                                                    cambiarEstado={setClasificacion}
                                                    name="clasificacion"
                                                    placeholder="Clasificacion"
                                                    ExpresionRegular={INPUT.CLASIFICACION}  //expresion regular  
                                                    etiqueta='Clasificacion'
                                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                                />
                                            </ModalBody>
                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalInsertar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insertar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Añadir clasificación
                                                </Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalEditar}>
                                            <div className='titloFormulario' >
                                                Actualizar clasificación
                                            </div>
                                            <ModalBody>
                                                <ComponenteInputUser
                                                    estado={clasificacion}
                                                    cambiarEstado={setClasificacion}
                                                    name="clasificacion"
                                                    placeholder="Clasificacion"
                                                    ExpresionRegular={INPUT.CLASIFICACION}  //expresion regular
                                                    etiqueta='Clasificación'
                                                    msg={'Escriba una clasificación'}
                                                />
                                            </ModalBody>

                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalEditar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => actualizar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>actualizar clasificación
                                                </Button>
                                            </div>
                                        </Modal>
                                    </div>
                                    <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster position='top-right' />
            </div>
        );
    } catch (error) {
        // auth.logout()
    }

}
export default Clasificacion;
