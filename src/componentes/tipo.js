import React from 'react';


import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowLeft, faArrowRight,  faEdit, faPlusCircle, faRecycle, faSave, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputBuscar_, ComponenteInputUser } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';



function Tipo() {
    const auth = useAuth()

    const [lista, setLista] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [tipo, setTipo] = useState({ campo: null, valido: null })
    const [descripcion, setDescripcion] = useState({ campo: null, valido: null })
    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [eliminado, seteliminado] = useState(false)


    try {


        useEffect(() => {
            if (inputBuscar.valido === null && eliminado === false) listarTipo()
            if (inputBuscar.valido === 'false' && eliminado === false) listarTipo()

            if (inputBuscar.valido === null && eliminado === true) listarReciclaje()
            if (inputBuscar.valido === 'false' && eliminado === true) listarReciclaje()
            document.title = 'Tipo Información'
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

        const listarTipo = async () => {
            axios.post(URL + '/tipo/all').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else toast.error(json.data.msg)
            })
        }

        const listarReciclaje = async () => {
            axios.post(URL + '/tipo/reciclaje').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }

        const vaciarDatos = () => {
            setId({ campo: null, valido: null })
            setTipo({ campo: null, valido: null })
            setDescripcion({ campo: null, valido: null })
        }

        const abrirModalInsetar = () => {
            vaciarDatos()
            setModalInsertar(true);
        }

        const abrirModalEditar = (a) => {
            setId({ campo: a.id, valido: 'true' })
            setTipo({ campo: a.tipo, valido: 'true' })
            setDescripcion({ campo: a.descripcion, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {

            if (tipo.valido === 'true' && descripcion.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec
                axios.post(URL + '/tipo/insertar', {
                    tipo: tipo.campo,
                    descripcion: descripcion.campo,
                    creado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        vaciarDatos()
                        setModalInsertar(false)
                        toast.success(json.data.msg)
                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }
        }


        const actualizar = async (e) => {
            if (id.valido === 'true' && tipo.valido === 'true' && descripcion.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                let hora = new Date().toLocaleTimeString().split(':')[0]
                let min = new Date().toLocaleTimeString().split(':')[1]
                let sec = new Date().toLocaleTimeString().split(':')[2]
                if (hora < 10) hora = '0' + hora
                let horafinal = hora + ':' + min + ':' + sec

                axios.post(URL + '/tipo/actualizar', {
                    id: id.campo,
                    tipo: tipo.campo,
                    descripcion: descripcion.campo,
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
                toast.error('Complete los campos')
            }

        }

        const eliminar = async (a) => {
            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok) {
                if (a != null) {
                    await axios.post(URL + '/tipo/eliminar', { id: a }).then(json => {
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

                    axios.post(URL + '/tipo/restaurar', { id: ids }).then(json => {
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


        const siguiente = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/tipo/nextdelete'
            else dir = URL + '/tipo/next'

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
                dir = URL + '/tipo/anterioreliminados'
            else dir = URL + '/tipo/anterior'
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

        const buscar = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/tipo/buscareliminados'
            else dir = URL + '/tipo/buscar'
            if (inputBuscar.valido === 'true') {
                console.log('pasa validaciones')

                axios.post(dir, { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok)
                        setLista(json.data.data)
                    else toast.error(json.data.msg)
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
                                    <div className='col-12 tituloPaginas'>
                                        Tipo de registro <spam className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</spam>
                                    </div>
                                    <div style={{ background: 'white' }}>
                                        <div className="contenedor-cabecera">

                                            <div className=' row '>
                                                {eliminado === false &&
                                                    <>
                                                        <Button className="btn-nuevo col-auto" onClick={abrirModalInsetar} >
                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle}></FontAwesomeIcon>Añadir Tipo
                                                        </Button>
                                                        <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); seteliminado(true); setInputBuscar({ campo: null, valido: null }) }} >
                                                            <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                        </Button>
                                                    </>
                                                }
                                                {eliminado === true &&
                                                    <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarTipo(); setInputBuscar({ campo: null, valido: null }) }} >
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
                                            <div className="table table-responsive custom " >

                                                <Table id='example12' className="table table-sm" >
                                                    <thead>
                                                        <tr className='col-12' >
                                                            <th className="col-3 ">Tipo registro</th>
                                                            <th className="col-4  ">Descripción</th>
                                                            <th className="col-2  ">Código</th>
                                                            <th className="col-1  "></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >

                                                        {lista.map((a) => (
                                                            <tr key={a.tipo} >
                                                                <td className="col-3">{a.tipo}</td>
                                                                <td className="col-4">{a.descripcion}</td>
                                                                <td className="col-1">{a.codigo}</td>
                                                                {
                                                                    eliminado === false &&
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(a.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faEdit} onClick={() => abrirModalEditar(a)} className='botonEditar' />
                                                                    </td>
                                                                }
                                                                {eliminado === true &&
                                                                    <td className="col-1 text-center pl-5">
                                                                        <Button className="btn-restaurar-tabla" onClick={() => { restaurar(a.id) }} >
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
                                            Registrar Tipo de registro
                                        </div>
                                        <ModalBody>
                                            <div className="row">
                                                <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                    <ComponenteInputUser
                                                        estado={tipo}
                                                        cambiarEstado={setTipo}
                                                        name="tipo"
                                                        placeholder="Tipo de Información"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Tipo informacion'
                                                        msg='Este campo permite letras, numero y algunos caracteres'
                                                    />
                                                    <ComponenteInputUser
                                                        estado={descripcion}
                                                        cambiarEstado={setDescripcion}
                                                        name="descripcion"
                                                        placeholder="Descripción"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Descripcion'
                                                        msg='Este campo permite letras, numero y algunos caracteres'
                                                    />

                                                </div>
                                            </div>
                                        </ModalBody>
                                        <div className="row p-2">
                                            <Button className="btn-restaurar col-auto" onClick={() => setModalInsertar(false)} >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                            </Button>
                                            <Button className="btn-nuevo col-auto" onClick={() => insertar()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Añadir tipo
                                            </Button>
                                        </div>
                                    </Modal>

                                    <Modal isOpen={modalEditar}>
                                        <div className='titloFormulario' >
                                            Actualizar registro
                                        </div>
                                        <ModalBody>
                                            <div className="row">
                                                <div className="form-group col-9 mb-2 mt-1 pl-1">
                                                    <ComponenteInputUser
                                                        estado={tipo}
                                                        cambiarEstado={setTipo}
                                                        name="tipo"
                                                        placeholder="Tipo de Información"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Tipo informacion'
                                                        msg='Este campo permite letras, numero y algunos caracteres'

                                                    />
                                                    <ComponenteInputUser
                                                        estado={descripcion}
                                                        cambiarEstado={setDescripcion}
                                                        name="descripcion"
                                                        placeholder="Descripción"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Descripcion'
                                                        msg='Este campo permite letras, numero y algunos caracteres'

                                                    />

                                                </div>
                                            </div>
                                        </ModalBody>
                                        <div className="row p-2">
                                            <Button className="btn-restaurar col-auto" onClick={() => setModalEditar(false)} >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                            </Button>
                                            <Button className="btn-nuevo col-auto" onClick={() => actualizar()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Actualizar
                                            </Button>
                                        </div>
                                    </Modal>
                                </div>
                                <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>

                            </div>
                        </div>
                    </div>
                </div >

                <Toaster position='top-right' />

            </div >
        );

    } catch (error) {
        auth.logout()
    }

}
export default Tipo;
