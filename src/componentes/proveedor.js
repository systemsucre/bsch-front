
import React from 'react';

import { Table, Modal, ModalBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCaretLeft, faDollarSign, faPlus, faSave, faPlusCircle, faRecycle, faArrowAltCircleLeft, faArrowRight, faArrowLeft, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputUser, ComponenteInputBuscar_ } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';


function Proveedor() {

    const [lista, setLista] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [nit, setNit] = useState({ campo: null, valido: null })
    const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    const [ciudad, setCiudad] = useState({ campo: null, valido: null })


    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [eliminado, seteliminado] = useState(false)

    const auth = useAuth()


    try {

        useEffect(() => {
            document.title = 'lista'
            if (inputBuscar.valido === null && eliminado === false) listarProveedor()
            if (inputBuscar.valido === 'false' && eliminado === false) listarProveedor()

            if (inputBuscar.valido === null && eliminado === true) listarReciclaje()
            if (inputBuscar.valido === 'false' && eliminado === true) listarReciclaje()
            document.title = 'Proveedores'

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
        let today = new Date()
        let fecha_ = today.toISOString().split('T')[0]
        let hora = new Date().toLocaleTimeString().split(':')[0]
        let min = new Date().toLocaleTimeString().split(':')[1]
        let sec = new Date().toLocaleTimeString().split(':')[2]
        if (hora < 10) hora = '0' + hora
        let horafinal = hora + ':' + min + ':' + sec
        let fechaHora = fecha_ + ' ' + horafinal

        const listarProveedor = async () => {
            try {
                axios.post(URL + '/proveedor/all').then(json => {
                    if (json.data.ok)
                        setLista(json.data.data)
                    else toast.error(json.data.msg)
                })
            } catch (error) {
                return error
            }
        }
        const listarReciclaje = async () => {
            axios.post(URL + '/proveedor/reciclaje').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }
        const vaciarDatos = () => {
            setId({ campo: null, valido: null })
            setNombre({ campo: null, valido: null })
            setNit({ campo: null, valido: null })
            setTelefono({ campo: null, valido: null })
            setDireccion({ campo: null, valido: null })
            setCiudad({ campo: null, valido: null })
        }


        const rellenar = async (pro) => {
            setId({ campo: pro.id, valido: 'true' })
            setNombre({ campo: pro.nombre, valido: 'true' })
            setTelefono({ campo: pro.telefono, valido: 'true' })
            setNit({ campo: pro.nit, valido: 'true' })

            setDireccion({ campo: pro.direccion, valido: 'true' })
            setCiudad({ campo: pro.ciudad, valido: 'true' })
            setModalEditar(true)
        }


        const insertar = async () => {

            if (nombre.valido === 'true' && nit.valido === 'true' &&
                telefono.valido === 'true' ) {
                axios.post(URL + '/proveedor/insertar',
                    {
                        nombre: nombre.campo,
                        nit: nit.campo,
                        telefono: telefono.campo,
                        direccion: direccion.valido==='true'?direccion.campo:'SIN ESPECIFICAR',
                        ciudad: ciudad.valido ==='true'? ciudad.campo:'SIN ESPECIFICAR',
                        creado: fechaHora

                    }).then(json => {
                        if (json.data.ok) {
                            setLista(json.data.data)
                            toast.success(json.data.msg)
                            vaciarDatos()
                            setModalInsertar(false)
                        } else toast.error(json.data.msg)
                    })
            } else toast.error('Completar todos los campos de l formulario')
        }

        const update = async () => {

            if (id.valido === 'true' &&
                nombre.valido === 'true' && nit.valido === 'true' &&
                telefono.valido === 'true'  ) {
                axios.post(URL + '/proveedor/actualizar',
                    {
                        id: id.campo,
                        nombre: nombre.campo,
                        nit: nit.campo,
                        telefono: telefono.campo,
                        direccion: direccion.valido==='true'?direccion.campo:'SIN ESPECIFICAR',
                        ciudad: ciudad.valido ==='true'? ciudad.campo:'SIN ESPECIFICAR',
                        modificado: fechaHora

                    }).then(json => {
                        if (json.data.ok) {
                            setLista(json.data.data)
                            vaciarDatos()
                            setModalEditar(false)
                            toast.success(json.data.msg)
                        } else toast.error(json.data.msg)
                    })
            } else toast.error('Completar todos los campos de l formulario')
        }


        const eliminar = async (id) => {
            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok === true) {

                axios.post(URL + '/proveedor/eliminar', { id: id }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        toast.success(json.data.msg)
                    } else toast.error(json.data.msg)
                })
            }
        }

        const restaurar = async (ids) => {

            const ok = window.confirm('¿está seguro de restaurar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/proveedor/restaurar', { id: ids }).then(json => {
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
                dir = URL + '/proveedor/nextdelete'
            else dir = URL + '/proveedor/next'

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
                dir = URL + '/proveedor/anterioreliminados'
            else dir = URL + '/proveedor/anterior'
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
                dir = URL + '/proveedor/buscareliminados'
            else dir = URL + '/proveedor/buscar'
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
                                        Proveedores <spam className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</spam>
                                    </div >
                                    <div style={{ background: 'white' }}>
                                        <div className='contenedor-cabecera'>
                                            {eliminado === false &&
                                                <>
                                                    <Button className="btn-nuevo col-auto" onClick={() => setModalInsertar(true)} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle}></FontAwesomeIcon>Añadir Proveedor
                                                    </Button>
                                                    <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); seteliminado(true); setInputBuscar({ campo: null, valido: null }) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                    </Button>
                                                </>
                                            }
                                            {eliminado === true &&
                                                <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarProveedor(); setInputBuscar({ campo: null, valido: null }) }} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowAltCircleLeft}></FontAwesomeIcon>Regresar
                                                </Button>
                                            } 

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

                                            <div className=" table table-responsive  custom"  >

                                                <Table className="table  table-sm p-2">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-2 ">Nombre</th>
                                                            <th className="col-2  ">Nit</th>
                                                            <th className="col-2  ">Telefono</th>
                                                            <th className="col-2  ">Direccion</th>
                                                            <th className="col-1  ">Ciudad</th>
                                                            <th className="col-1  "></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lista.map((u) => (
                                                            <tr key={u.id} className='item'>
                                                                <td className="col-2">{u.nombre}</td>
                                                                <td className="col-2 ">{u.nit}</td>
                                                                <td className="col-2  ">{u.telefono}</td>
                                                                <td className="col-2  ">{u.direccion}</td>
                                                                <td className="col-1  ">{u.ciudad}</td>
                                                                {
                                                                    eliminado === false &&
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(u.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faEdit} onClick={() => rellenar(u)} className='botonEditar' />
                                                                    </td>
                                                                }
                                                                {eliminado === true &&
                                                                    <td className="col-1  pl-5">
                                                                        <Button className="btn-restaurar-tabla" onClick={() => { restaurar(u.id) }} >
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
                                            Registrar nuevo Proveedor
                                        </div>
                                        <ModalBody>
                                            <div className='row'>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="Proveedor"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Nombre'
                                                        msg={'Este campo admite solo letras'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6">
                                                    <ComponenteInputUser
                                                        estado={nit}
                                                        cambiarEstado={setNit}
                                                        name="nit"
                                                        placeholder="Nit"
                                                        ExpresionRegular={INPUT.NIT}  //expresion regular
                                                        etiqueta='NIT'
                                                        msg={'Escriba una el nit'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                                    <ComponenteInputUser
                                                        estado={telefono}
                                                        cambiarEstado={setTelefono}
                                                        name="telefono"
                                                        placeholder="Telefono"
                                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                        etiqueta='Telefono/cel.'
                                                        msg={'Este campo es numerico'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <ComponenteInputUser
                                                        estado={direccion}
                                                        cambiarEstado={setDireccion}
                                                        name="direccion"
                                                        placeholder="Direccion"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Direccion'
                                                        msg={'Este campo admite letras, numeros y caracteres'}
                                                        important = {false}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6">
                                                    <ComponenteInputUser
                                                        estado={ciudad}
                                                        cambiarEstado={setCiudad}
                                                        name="ciudad"
                                                        placeholder="CIUDAD"
                                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                        etiqueta='Ciudad'
                                                        msg={'Este campo solo admite letras'}
                                                        important = {false}
                                                    />
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <div className="row botonModal">
                                            <Button className="btn-restaurar col-auto" onClick={() => { setModalInsertar(false) }} >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                            </Button>
                                            <Button className="btn-nuevo col-auto" onClick={() => insertar()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Registrar
                                            </Button>
                                        </div>
                                    </Modal>

                                    <Modal isOpen={modalEditar}>

                                        <div className='titloFormulario' >
                                            Actualizar Proveedor
                                        </div>
                                        <ModalBody>
                                            <div className='row'>
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                                    <ComponenteInputUser
                                                        estado={nombre}
                                                        cambiarEstado={setNombre}
                                                        name="nombre"
                                                        placeholder="Proveedor"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Nombre'
                                                        msg={'Este campo admite solo letras'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6">
                                                    <ComponenteInputUser
                                                        estado={nit}
                                                        cambiarEstado={setNit}
                                                        name="nit"
                                                        placeholder="Nit"
                                                        ExpresionRegular={INPUT.NIT}  //expresion regular
                                                        etiqueta='NIT'
                                                        msg={'Escriba una el nit'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                                    <ComponenteInputUser
                                                        estado={telefono}
                                                        cambiarEstado={setTelefono}
                                                        name="telefono"
                                                        placeholder="Telefono"
                                                        ExpresionRegular={INPUT.TELEFONO}  //expresion regular
                                                        etiqueta='Telefono/cel.'
                                                        msg={'Este campo es numerico'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <ComponenteInputUser
                                                        estado={direccion}
                                                        cambiarEstado={setDireccion}
                                                        name="direccion"
                                                        placeholder="Direccion"
                                                        ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                        etiqueta='Direccion'
                                                        msg={'Este campo admite letras, numeros y caracteres'}
                                                    />
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6">
                                                    <ComponenteInputUser
                                                        estado={ciudad}
                                                        cambiarEstado={setCiudad}
                                                        name="ciudad"
                                                        placeholder="ciudad"
                                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                        etiqueta='Ciudad'
                                                        msg={'Este campo solo admite letras'}
                                                    />
                                                </div>
                                            </div>
                                        </ModalBody>
                                  

                                        <div className="row botonModal">
                                            <Button className="btn-restaurar col-auto" onClick={() => { setModalEditar(false); vaciarDatos() }}  >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                            </Button>
                                            <Button className="btn-nuevo col-auto" onClick={() => update()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar
                                            </Button>
                                        </div>
                                    </Modal>

                                </div>

                                <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>
                            </div>
                        </div>
                    </div >
                </div >
                <Toaster position='top-right' />
            </div >
        );
    } catch (error) {
        // auth.logout()
    }

}
export default Proveedor;
