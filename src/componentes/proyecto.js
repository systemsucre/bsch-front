import React from 'react';

import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowLeft, faArrowRight, faCaretLeft, faEdit, faPlus, faPlusCircle, faRecycle, faSave, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputBuscar_, ComponenteInputfecha, ComponenteInputUser, ComponenteInputUserDisabled, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';


function Proyecto() {

    const auth = useAuth()
    const [lista, setLista] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalVer, setModalVer] = useState(false);

    const [id, setId] = useState({ campo: null, valido: null })
    const [numero, setNumero] = useState({ campo: null, valido: null })
    const [codigo, setCodigo] = useState({ campo: null, valido: null })

    const [proyecto, setProyecto] = useState({ campo: null, valido: null })
    const [nombreCompleto, setNombreCompleto] = useState({ campo: null, valido: null })
    const [montoContrato, setMontoContrato] = useState({ campo: null, valido: null })
    const [montoModificado, setMontoModificado] = useState({ campo: null, valido: null })
    const [montoFinal, setMontoFinal] = useState({ campo: null, valido: null })
    const [montoPagado, setMontoPagado] = useState({ campo: null, valido: null })
    const [fechaInicio, setFechaInicio] = useState({ campo: null, valido: null })
    const [plazoInicio, setPlazoInicio] = useState({ campo: null, valido: null })
    const [ampliacion, setAmpliacion] = useState({ campo: null, valido: null })
    const [modificado, setModificado] = useState({ campo: null, valido: null })
    const [creado, setCreado] = useState({ campo: null, valido: null })
    const [usuario, setUsuario] = useState({ campo: null, valido: null })
    const [fechaConclusion, setFechaConclusion] = useState({ campo: null, valido: null })
    const [eliminado, seteliminado] = useState(false)

    const [listEstado, setListEstado] = useState([])

    // console.log(listEstado[0].id, 'id seleccionado')
    // const [estado, setEstado] = useState({ campo: listEstado[0].id, valido: 'true' })
    const [idEstado, setIdEstado] = useState({ campo: null, valido: null })
    const [estado, setEstado] = useState({ campo: null, valido: null })


    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora < 10) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec
    let fechaHora = fecha + ' ' + horafinal


    try {

        useEffect(() => {
            listarProyectos()
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

        const listarProyectos = async () => {
            axios.post(URL + '/proyecto/all').then(json => {
                if (json.data.ok) setLista(json.data.data)
                else toast.error(json.data.msg)
            })
        }

        const listarEstados = async () => {
            axios.post(URL + '/proyecto/estado').then(json => {
                if (json.data.ok) setListEstado(json.data.data)
                else toast.error(json.data.msg)
            })
        }

        const verDetalles = (id) => {

            axios.post(URL + '/proyecto/ver', { id: id }).then(json => {
                if (json.data.ok) {
                    setId({ campo: json.data.data[0].id, valido: 'true' })
                    setNumero({ campo: json.data.data[0].numero, valido: 'true' })
                    setCodigo({ campo: json.data.data[0].codigo, valido: 'true' })
                    setProyecto({ campo: json.data.data[0].proyecto, valido: 'true' })
                    setNombreCompleto({ campo: json.data.data[0].nombrecompleto, valido: 'true' })
                    setMontoContrato({ campo: json.data.data[0].montocontrato, valido: 'true' })
                    setMontoModificado({ campo: json.data.data[0].montomodificado, valido: 'true' })

                    setMontoFinal({ campo: json.data.data[0].montocontrato + json.data.data[0].montomodificado, valido: 'true' })

                    setMontoPagado({ campo: json.data.data[0].montopagado, valido: 'true' })
                    // setSaldoCobrar({ campo: json.data.data[0].montopagado-montoFinal.campo, valido: 'true' })

                    setFechaInicio({ campo: json.data.data[0].fechainicio, valido: 'true' })
                    setPlazoInicio({ campo: json.data.data[0].plazoinicio, valido: 'true' })
                    setAmpliacion({ campo: json.data.data[0].ampliacion, valido: 'true' })


                    let fechaini = new Date(json.data.data[0].fechainicio)

                    let aumento = json.data.data[0].plazoinicio + json.data.data[0].ampliacion
                    fechaini.setDate(fechaini.getDate() + aumento)

                    setFechaConclusion({ campo: fechaini.toISOString().split('T')[0], valido: 'true' })
                    setEstado({ campo: json.data.data[0].estado, valido: 'true' })
                    setIdEstado({ campo: json.data.data[0].idestado, valido: 'true' })
                    setCreado({ campo: json.data.data[0].creado, valido: 'true' })
                    setModificado({ campo: json.data.data[0].modificado, valido: 'true' })
                    setUsuario({ campo: json.data.data[0].nombre + ' ' + json.data.data[0].apellido1 + ' ' + json.data.data[0].apellido2, valido: 'true' })

                    setModalVer(true)
                } else toast.error(json.data.msg)
            })

        }

        const vaciarDatos = () => {
            setId({ campo: null, valido: null })
            setNumero({ campo: null, valido: null })
            setCodigo({ campo: null, valido: null })
            setProyecto({ campo: null, valido: null })
            setNombreCompleto({ campo: null, valido: null })
            setMontoContrato({ campo: null, valido: null })
            setMontoModificado({ campo: null, valido: null })
            setMontoPagado({ campo: null, valido: null })
            setFechaInicio({ campo: null, valido: null })
            setPlazoInicio({ campo: null, valido: null })
            setAmpliacion({ campo: null, valido: null })
            setFechaConclusion({ campo: null, valido: null })
            setEstado({ campo: null, valido: null })
        }

        const abrirModalInsetar = () => {
            vaciarDatos()
            setModalInsertar(true);
            listarEstados()
        }

        const rellenar = (s) => {
            setId({ campo: s.id, valido: 'true' })
            setNumero({ campo: s.numero, valido: 'true' })
            setCodigo({ campo: s.codigo, valido: 'true' })
            setProyecto({ campo: s.proyecto, valido: 'true' })
            setNombreCompleto({ campo: s.nombrenompleto, valido: 'true' })
            setMontoContrato({ campo: s.montocontrato, valido: 'true' })
            setMontoModificado({ campo: s.montomodificado, valido: 'true' })
            setMontoPagado({ campo: s.montopagado, valido: 'true' })
            setFechaInicio({ campo: s.fechainicio, valido: 'true' })
            setPlazoInicio({ campo: s.plazoinicio, valido: 'true' })
            setAmpliacion({ campo: s.ampliacion, valido: 'true' })
            setFechaConclusion({ campo: s.fechaconclusion, valido: 'true' })
            setEstado({ campo: s.estado, valido: 'true' })
            setModalEditar(true)
        }

        const insertar = async () => {

            // console.log("datos lista : ", codigo, laboratorio)

            if (numero.valido === 'true' && codigo.valido === 'true' && proyecto.valido === 'true' && nombreCompleto.valido === 'true' &&
                montoContrato.valido === 'true' && montoModificado.valido === 'true' && montoPagado.valido === 'true' &&
                fechaInicio.valido === 'true' && plazoInicio.valido === 'true' && ampliacion.valido === 'true' && idEstado.valido === 'true') {
                axios.post(URL + '/proyecto/insertar', {
                    numero: numero.campo,
                    codigo: codigo.campo,
                    nombre: proyecto.campo,
                    nombrecompleto: nombreCompleto.campo,
                    montocontrato: montoContrato.campo,
                    montomodificado: montoModificado.campo,
                    montopagado: montoPagado.campo,
                    fechainicio: fechaInicio.campo,
                    plazoinicio: plazoInicio.campo,
                    ampliacion: plazoInicio.campo,
                    idEstado: idEstado.campo,
                    creado: fechaHora
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
                toast.error('Complete los campos')
            }
        }

        // console.log(estado)
        const actualizar = async (e) => {
            if (id.valido === 'true' && numero.valido === 'true' && codigo.valido === 'true' && proyecto.valido === 'true' && nombreCompleto.valido === 'true' &&
                montoContrato.valido === 'true' && montoModificado.valido === 'true' && montoPagado.valido === 'true' &&
                fechaInicio.valido === 'true' && plazoInicio.valido === 'true' && ampliacion.valido === 'true' && idEstado.valido === 'true') {
                axios.post(URL + '/proyecto/actualizar', {
                    id: id.campo,
                    numero: numero.campo,
                    codigo: codigo.campo,
                    nombre: proyecto.campo,
                    nombrecompleto: nombreCompleto.campo,
                    montocontrato: montoContrato.campo,
                    montomodificado: montoModificado.campo,
                    montopagado: montoPagado.campo,
                    fechainicio: fechaInicio.campo,
                    plazoinicio: plazoInicio.campo,
                    ampliacion: plazoInicio.campo,
                    fechaconclusion: fechaConclusion.campo,
                    idEstado: idEstado.campo,
                    modificado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()

                        setId({ campo: json.data.data[0].id, valido: 'true' })
                        setNumero({ campo: json.data.data[0].numero, valido: 'true' })
                        setCodigo({ campo: json.data.data[0].codigo, valido: 'true' })
                        setProyecto({ campo: json.data.data[0].proyecto, valido: 'true' })
                        setNombreCompleto({ campo: json.data.data[0].nombrecompleto, valido: 'true' })
                        setMontoContrato({ campo: json.data.data[0].montocontrato, valido: 'true' })
                        setMontoModificado({ campo: json.data.data[0].montomodificado, valido: 'true' })

                        setMontoFinal({ campo: json.data.data[0].montocontrato + json.data.data[0].montomodificado, valido: 'true' })

                        setMontoPagado({ campo: json.data.data[0].montopagado, valido: 'true' })
                        // setSaldoCobrar({ campo: json.data.data[0].montopagado-montoFinal.campo, valido: 'true' })

                        setFechaInicio({ campo: json.data.data[0].fechainicio, valido: 'true' })
                        setPlazoInicio({ campo: json.data.data[0].plazoinicio, valido: 'true' })
                        setAmpliacion({ campo: json.data.data[0].ampliacion, valido: 'true' })


                        let fechaini = new Date(json.data.data[0].fechainicio)

                        let aumento = json.data.data[0].plazoinicio + json.data.data[0].ampliacion
                        fechaini.setDate(fechaini.getDate() + aumento)

                        setFechaConclusion({ campo: fechaini.toISOString().split('T')[0], valido: 'true' })
                        setEstado({ campo: json.data.data[0].estado, valido: 'true' })
                        setIdEstado({ campo: json.data.data[0].idestado, valido: 'true' })
                        setCreado({ campo: json.data.data[0].creado, valido: 'true' })
                        setModificado({ campo: json.data.data[0].modificado, valido: 'true' })
                        setUsuario({ campo: json.data.data[0].nombre + ' ' + json.data.data[0].apellido1 + ' ' + json.data.data[0].apellido2, valido: 'true' })
                        toast.success(json.data.msg)
                        setModalEditar(false)
                    }
                    else toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete los campos')
            }

        }

        const eliminar = async () => {
            const ok = window.confirm('¿está lista de eliminar este registro ?');
            if (ok) {
                axios.post(URL + '/proyecto/eliminar', { id: id.campo, fecha:fechaHora }).then(json => {
                    if (json.data.ok) {
                        vaciarDatos()
                        setLista(json.data.data)
                        toast.success(json.data.msg)
                        setModalVer(false)
                    }
                    else toast.error(json.data.msg)
                })
            }
        }

        const siguiente = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/proyecto/siguienteeliminado'
            else dir = URL + '/proyecto/siguiente'

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
                dir = URL + '/proyecto/anterioreliminado'
            else dir = URL + '/proyecto/anterior'
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


    

        const restaurar = async (ids) => {

            const ok = window.confirm('¿está seguro de restaurar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/proyecto/restaurar', { id: ids, fecha:fechaHora }).then(json => {
                        if (json.data.ok) {
                            vaciarDatos()
                            setLista(json.data.data)
                            toast.success(json.data.msg)
                            seteliminado(false)
                            setModalVer(false)
                        }
                        else
                            toast.error(json.data.msg)
                    })

                }
            }
        }

        const listarReciclaje = async () => {
            axios.post(URL + '/proyecto/reciclaje').then(json => {
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }
        return (
            <div>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content">
                                <div className="container-fluid">
                                    <div className='tituloPaginas'>
                                        Proyectos <spam className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</spam>
                                    </div >

                                    <div  style={{ background: 'white' }} >
                                        <div className="contenedor-cabecera">
                                            <div className='row' >
                                                {eliminado === false &&
                                                    <>
                                                        <Button className="btn-nuevo col-auto" onClick={abrirModalInsetar} >
                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle}></FontAwesomeIcon>Registrar Proyecto
                                                        </Button>
                                                        <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); seteliminado(true) }} >
                                                            <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                        </Button>
                                                    </>
                                                }

                                                {eliminado === true &&
                                                    <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarProyectos() }} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowAltCircleLeft}></FontAwesomeIcon>Regresar
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                        <div className='contenedor'>
                                          
                                            <div className="table table-responsive custom">

                                                <Table className="table table-sm" >
                                                    <thead>
                                                        <tr className='col-12'>
                                                            <th className="col-1">Número</th>
                                                            <th className="col-1">Codigo</th>
                                                            <th className="col-2">Nombre</th>
                                                            <th className="col-2">Monto final</th>
                                                            <th className="col-3">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lista.map((s) => (
                                                            <tr className='item' key={s.id} onClick={() => verDetalles(s.id)}>
                                                                <td className="col-1">{s.numero}</td>
                                                                <td className="col-1">{s.codigo}</td>
                                                                <td className="col-2">{s.nombre}</td>
                                                                <td className="col-2">{s.montocontrato + s.montomodificado}</td>
                                                                <td className="col-3">{s.estado}</td>
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
                                                    <tfoot>

                                                    </tfoot>
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


                                        <Modal isOpen={modalVer}>
                                            <div className='titloFormulario' >
                                                {'PROYECTO ' + proyecto.campo}
                                            </div>
                                            <ModalBody>
                                                <div className='groupInput'>
                                                    <div className='titleDetalle' >
                                                        Datos Generales
                                                    </div>
                                                    <p className='textoDetalle'>{'NUMERO : ' + numero.campo}</p>
                                                    <p className='textoDetalle'>{'CODIGO : ' + codigo.campo}</p>
                                                    <p className='textoDetalle'>{'PROYECTO : ' + proyecto.campo}</p>
                                                    <p className='textoDetalle'>{'NOMBRE COMPLETO : ' + nombreCompleto.campo}</p>
                                                </div>
                                                <div className='groupInput'>
                                                    <div className='titleDetalle' >
                                                        Costos
                                                    </div>
                                                    <p className='textoDetalle'>{'MONTO CONTRATO :  Bs.' + montoContrato.campo}</p>
                                                    <p className='textoDetalle'>{'MONTO MODIFICADO :  Bs.' + montoModificado.campo}</p>
                                                    <p className='textoDetalle'>{'MONTO FINAL :  Bs.' + montoFinal.campo}</p>
                                                    <p className='textoDetalle'>{'MONTO PAGADO :  Bs.' + montoPagado.campo}</p>
                                                    <p className='textoDetalle'><span>SALDO POR COBRAR :  </span>{(montoFinal.campo - montoPagado.campo)}</p>
                                                </div>
                                                <div className='groupInput'>
                                                    <div className='titleDetalle' >
                                                        Plazos
                                                    </div>
                                                    <p className='textoDetalle'>{'FECHA INICIO :  ' + fechaInicio.campo}</p>
                                                    <p className='textoDetalle'>{'PLAZO INCIAL :  ' + plazoInicio.campo+' Dias.'}</p>
                                                    <p className='textoDetalle'>{'AMPLIACION :  ' + ampliacion.campo+' Dias.'}</p>
                                                    <p className='textoDetalle'>{'FECHA CONCLUSION :  ' + fechaConclusion.campo}</p>
                                                    <p className='textoDetalle'>{'ESTADO :  ' + estado.campo}</p>
                                                </div>
                                                <div className='groupInput'>
                                                    <div className='titleDetalle' >
                                                        Interacciones
                                                    </div>
                                                    <p className='textoDetalle'>{'USUARIO :  ' + usuario.campo}</p>
                                                    <p className='textoDetalle'>{'CREADO EN :  ' + creado.campo}</p>
                                                    <p className='textoDetalle'><span>ACTUALIZADO EN :  </span>{modificado.campo ? modificado.campo : 'Aun no se actualizo el registro'}</p>
                                                </div>
                                            </ModalBody>
                                            <div className="row botonModal">
                                                <div className="col-auto">
                                                    <Button className='cancelarVentanaSolicitud' onClick={() => { setModalVer(false); listarProyectos() }} >Cerrar <span ><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='actualizar' onClick={() => { setModalEditar(true); listarEstados() }}>Actualizar <span ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='eliminar' onClick={() => { eliminar() }}>Eliminar <span ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalInsertar}>
                                            <div className='titloFormulario' >
                                                Registrar Proyecto
                                            </div>
                                            <ModalBody>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Datos Generales</p>
                                                    <div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={numero}
                                                            cambiarEstado={setNumero}
                                                            name="numero"
                                                            placeholder="NUMERO"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Número'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={codigo}
                                                            cambiarEstado={setCodigo}
                                                            name="codigo"
                                                            placeholder="CODIGO"
                                                            ExpresionRegular={INPUT.CODIGO}  //expresion regular
                                                            etiqueta='Código'
                                                            msg='Este campo cadenas alfanuméricos'
                                                        />
                                                    </div>
                                                    <div className="col-8">
                                                        <ComponenteInputUser
                                                            estado={proyecto}
                                                            cambiarEstado={setProyecto}
                                                            name="proyecto"
                                                            placeholder="PROYECTO"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Proyecto'
                                                            msg='Este campo solo acepta letras'
                                                        />
                                                    </div>
                                                    <div className=" col-12">
                                                        <ComponenteInputUser
                                                            estado={nombreCompleto}
                                                            cambiarEstado={setNombreCompleto}
                                                            name="nombrecompleto"
                                                            placeholder="NOMBRE COMPLETO"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Nombre completo'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Costos</p>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoContrato}
                                                            cambiarEstado={setMontoContrato}
                                                            name="montocontrato"
                                                            placeholder="MONTO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto contrato Bs.'
                                                            msg='Este campo es numérico'

                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoModificado}
                                                            cambiarEstado={setMontoModificado}
                                                            name="montomodificado"
                                                            placeholder="MODIFICADO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto modificado Bs.'
                                                            msg='Este campo es numérico'

                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoPagado}
                                                            cambiarEstado={setMontoPagado}
                                                            name="montopagado"
                                                            placeholder="MONTO PAGADO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto pagado Bs.'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Plazos</p>
                                                    <div className="col-7">
                                                        <ComponenteInputfecha
                                                            estado={fechaInicio}
                                                            cambiarEstado={setFechaInicio}
                                                            name="fechainicio"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta='Fecha inicio'
                                                            msg='Seleccione una fecha especifica'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <ComponenteInputUser
                                                            estado={plazoInicio}
                                                            cambiarEstado={setPlazoInicio}
                                                            name="plazoinicial"
                                                            placeholder="PLAZO INICIAL"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Plazo inicial (días)'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <ComponenteInputUser
                                                            estado={ampliacion}
                                                            cambiarEstado={setAmpliacion}
                                                            name="ampliacion"
                                                            placeholder="AMPLIACION"
                                                            ExpresionRegular={INPUT.NUMEROS_PN}  //expresion regular
                                                            etiqueta='Ampliación (días)'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <div className="col-10">
                                                        <Select1
                                                            estado={idEstado}
                                                            cambiarEstado={setIdEstado}
                                                            name="estado"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={listEstado}
                                                            etiqueta='Estado'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                </div>
                                            </ModalBody>


                                            <div className="row botonModal">

                                                <Button className="btn-restaurar col-auto" onClick={() => setModalInsertar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insertar()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Registrar proyecto
                                                </Button>
                                            </div>

                                        </Modal>

                                        <Modal isOpen={modalEditar}>
                                            <div className='titloFormulario' >
                                                Actualizar Registro
                                            </div>
                                            <ModalBody>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Datos Generales</p>
                                                    <div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={numero}
                                                            cambiarEstado={setNumero}
                                                            name="numero"
                                                            placeholder="NUMERO"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Número'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={codigo}
                                                            cambiarEstado={setCodigo}
                                                            name="codigo"
                                                            placeholder="CODIGO"
                                                            ExpresionRegular={INPUT.CODIGO}  //expresion regular
                                                            etiqueta='Código'
                                                            msg='Este campo cadenas alfanuméricos'
                                                        />
                                                    </div>
                                                    <div className="col-8">
                                                        <ComponenteInputUser
                                                            estado={proyecto}
                                                            cambiarEstado={setProyecto}
                                                            name="proyecto"
                                                            placeholder="PROYECTO"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Proyecto'
                                                            msg='Este campo solo acepta letras'
                                                        />
                                                    </div>
                                                    <div className=" col-12">
                                                        <ComponenteInputUser
                                                            estado={nombreCompleto}
                                                            cambiarEstado={setNombreCompleto}
                                                            name="nombrecompleto"
                                                            placeholder="NOMBRE COMPLETO"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Nombre completo'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Costos</p>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoContrato}
                                                            cambiarEstado={setMontoContrato}
                                                            name="montocontrato"
                                                            placeholder="MONTO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto contrato Bs.'
                                                            msg='Este campo es numérico'

                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoModificado}
                                                            cambiarEstado={setMontoModificado}
                                                            name="montomodificado"
                                                            placeholder="MODIFICADO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto modificado Bs.'
                                                            msg='Este campo es numérico'

                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <ComponenteInputUser
                                                            estado={montoPagado}
                                                            cambiarEstado={setMontoPagado}
                                                            name="montopagado"
                                                            placeholder="MONTO PAGADO"
                                                            ExpresionRegular={INPUT.NUMEROS}  //expresion regular
                                                            etiqueta='Monto pagado Bs.'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Plazos</p>
                                                    <div className="col-7">
                                                        <ComponenteInputfecha
                                                            estado={fechaInicio}
                                                            cambiarEstado={setFechaInicio}
                                                            name="fechainicio"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta='Fecha inicio'
                                                            msg='Seleccione una fecha especifica'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <ComponenteInputUser
                                                            estado={plazoInicio}
                                                            cambiarEstado={setPlazoInicio}
                                                            name="plazoinicial"
                                                            placeholder="PLAZO INICIAL"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Plazo inicial (días)'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <ComponenteInputUser
                                                            estado={ampliacion}
                                                            cambiarEstado={setAmpliacion}
                                                            name="ampliacion"
                                                            placeholder="AMPLIACION"
                                                            ExpresionRegular={INPUT.NUMEROS_PN}  //expresion regular
                                                            etiqueta='Ampliación (días)'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <div className="col-10">
                                                        <Select1
                                                            estado={idEstado}
                                                            cambiarEstado={setIdEstado}
                                                            name="estado"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={listEstado}
                                                            etiqueta='Estado'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                </div>
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
                                    </div>
                                    <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster position='top-right' />
            </div >
        );
    } catch (error) {
        auth.logout()
    }


}
export default Proyecto;
