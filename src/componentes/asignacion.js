import React from 'react';

import { Table, Button, Modal, ModalBody,  } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowLeft, faArrowRight, faCheckCircle, faDollarSign, faEdit, faImage, faList, faPlusCircle, faSave, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputBuscar_, ComponenteInputfecha, ComponenteInputUser, Select1 } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de tipos
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';


function Asignacion() {
    const auth = useAuth()
    const [lista, setLista] = useState([]);
    const [listaProyecto, setListaProyecto] = useState([]);
    const listaTipo = [{ id: 1, nombre: 'EFECTIVO' }, { id: 2, nombre: 'CHEQUE' }, { id: 3, nombre: 'DEPÓSITO' }];
    const listaEstado = [{ id: 1, nombre: 'ASIGNADO' }, { id: 2, nombre: 'RENDIDO' }, { id: 3, nombre: 'APROBADO' }];
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalVer, setModalVer] = useState(false);
    const [eliminado, seteliminado] = useState(false)
    const [ventana, setVentana] = useState(1)

    let fecha__ = new Date().toLocaleDateString()
    // console.log('fecha de loggg : ', fecha.toLocaleString())
    let año = fecha__.split('/')[2]
    let mes = fecha__.split('/')[1]
    let dia = fecha__.split('/')[0]
    if (mes < 10) {
        mes = 0 + '' + mes
    }
    if (dia < 10) {
        dia = 0 + '' + dia

    }
    const [fecha, setFecha] = useState({ campo: año + '-' + mes + '-' + dia, valido: 'true' })
    const [id, setId] = useState({ campo: null, valido: null })
    const [idProyecto, setIdProyecto] = useState({ campo: null, valido: null })
    const [monto, setMonto] = useState({ campo: null, valido: null })
    const [tipo, setTipo] = useState({ campo: null, valido: null })
    const [inputBuscar_, setInputBuscar_] = useState({ campo: null, valido: null })
    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [descripcion, setDescripcion] = useState({ campo: null, valido: null })
    const [asignacion, setAsignacion] = useState([])
    const [comprobante, setComprovante] = useState({ campo: null, valido: null })


    const [listaGasto, setListaGasto] = useState([]);  // lista de gasto para una determinada asignacion
    const [idAsignacion, setIdAsignacion] = useState({ campo: null, valido: null })
    const [montoGastado, setMontoGatado] = useState(null);
    const [gasto, setGasto] = useState([])  // ver detalles del gasto especifico
    const [modalGastos, setModalGastos] = useState(false);
    const [image, setImagen] = useState(null);
    const [comprobanteImage, setComprobanteImage] = useState(null);
    const [nombreVentanaMOnto, setNombreVentanaMonto] = useState(null);
    const [ventanaProyecto, setVentanaProyecto] = useState(null);
    const [descripcionGasto, setDescripcionGasto] = useState(null);
    const [nombreVentana, setNombreVentana] = useState('GASTOS');






    let today = new Date()
    let fecha_ = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora < 10) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec
    let fechaHora = fecha_ + ' ' + horafinal

    try {

        useEffect(() => {
            if (inputBuscar.valido === null && eliminado === false) listarAsignacion()
            if (inputBuscar.valido === 'false' && eliminado === false) listarAsignacion()

            if (inputBuscar.valido === null && eliminado === true) listarReciclaje()
            if (inputBuscar.valido === 'false' && eliminado === true) listarReciclaje()
            document.title = localStorage.getItem('empleado')
        }, [inputBuscar])

        let usuarioLocal = parseInt(localStorage.getItem('idEmpleado'))
        if (!usuarioLocal)
            window.location.href = "/"

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

        const listarAsignacion = async () => {
            axios.post(URL + '/asignacion/all', { id: usuarioLocal }).then(json => {
                if (json.data.ok) setLista(json.data.data)
                else toast.error(json.data.msg)
            })
        }
        const listarProyecto = async () => {
            axios.post(URL + '/asignacion/listarproyecto', { id: usuarioLocal }).then(json => {
                if (json.data.ok) setListaProyecto(json.data.data)
                else toast.error(json.data.msg)
            })
        }

        const listarReciclaje = async () => {
            axios.post(URL + '/asignacion/reciclaje', { id: usuarioLocal }).then(json => {
                if (json.data.ok) {
                    // console.log(json.data.data)
                    setLista(json.data.data)
                }
                else
                    toast.error(json.data.msg)
            })
        }



        const rellenar = (s) => {
            setId({ campo: s.id, valido: 'true' })
            setIdProyecto({ campo: s.idproyecto, valido: 'true' })
            setFecha({ campo: s.fecha, valido: 'true' })
            setMonto({ campo: s.monto, valido: 'true' })
            setTipo({ campo: s.tipo, valido: 'true' })
            setDescripcion({ campo: s.descripcion, valido: 'true' })
            setComprovante({ campo: s.comprobante, valido: 'true' })
            setModalEditar(true)
        }



        const empty = () => {
            setId({ campo: null, valido: null })
            setIdProyecto({ campo: null, valido: null })
            setMonto({ campo: null, valido: null })
            setTipo({ campo: null, valido: null })
            setComprovante({ campo: null, valido: null })
            setModalInsertar(false)
            setModalEditar(false)
        }

        const insert = async () => {
            if (fecha.valido === 'true' && idProyecto.valido === 'true' &&
                monto.valido === 'true' && tipo.valido === 'true' && comprobante.valido === 'true' && descripcion.valido === 'true') {
                axios.post(URL + '/asignacion/insert', {
                    idpersonal: usuarioLocal,
                    idproyecto: idProyecto.campo,
                    fecha: fecha.campo,
                    monto: monto.campo,
                    tipo: tipo.campo,
                    comprobante: comprobante.campo,
                    descripcion: descripcion.campo,
                    creado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        empty()
                        // console.log(json.data.data, json.data.data.length, 'ver asignacion')
                        setModalVer(true)
                        setAsignacion(json.data.data)
                        toast.success(json.data.msg)
                        listarAsignacion()
                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }
        }

        // console.log(tipo)
        const update = async (e) => {
            if (id.valido === 'true' && fecha.valido === 'true' && idProyecto.valido === 'true' &&
                monto.valido === 'true' && tipo.valido === 'true' && descripcion.valido === 'true') {
                axios.post(URL + '/asignacion/update', {
                    id: id.campo,
                    idpersonal: usuarioLocal,
                    idproyecto: idProyecto.campo,
                    fecha: fecha.campo,
                    monto: monto.campo,
                    tipo: tipo.campo,
                    comprobante: comprobante.campo,
                    descripcion: descripcion.campo,
                    modificado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        empty()
                        setAsignacion(json.data.data)
                        toast.success(json.data.msg)
                        listarAsignacion()
                    }
                    else toast.error(json.data.msg)
                })

            } else {
                toast.error('Complete los campos')
            }
        }




        const aprobar = async (id) => {
            const ok = window.confirm('¿Está seguro de  realizar esta accion ?');
            if (ok) {
                axios.post(URL + '/asignacion/aprobar', { id: id, fecha: fechaHora }).then(json => {
                    if (json.data.ok) {
                        toast.success(json.data.msg)
                        setAsignacion(json.data.data)
                    }
                    else toast.error(json.data.msg)
                })
            }
        }

        const revertir = async (id) => {
            const ok = window.confirm('¿Está seguro de  realizar esta accion ?');
            if (ok) {
                axios.post(URL + '/asignacion/revertir', { id: id }).then(json => {
                    if (json.data.ok) {
                        toast.success(json.data.msg)
                        setAsignacion(json.data.data)
                    }
                    else toast.error(json.data.msg)
                })
            }
        }



        const check = async (id) => {
            axios.post(URL + '/asignacion/check', { id: id }).then(json => {
                if (json.data.ok) {
                    setAsignacion(json.data.data)
                    setModalVer(true)
                }
                else toast.error(json.data.msg)
            })
        }

        const buscar = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/asignacion/buscareliminados'
            else dir = URL + '/asignacion/buscar'
            if (inputBuscar.valido === 'true') {
                // console.log('pasa validaciones')

                axios.post(dir, { id: usuarioLocal, dato: inputBuscar.campo }).then(json => {
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
                dir = URL + '/asignacion/nextdelete'
            else dir = URL + '/asignacion/next'

            if (lista.length > 0) {
                const last = lista[lista.length - 1].id
                // console.log(last, lista)
                axios.post(dir, { id: last, idUser: usuarioLocal }).then(json => {
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
                dir = URL + '/asignacion/anterioreliminados'
            else dir = URL + '/asignacion/anterior'
            if (lista.length > 0) {
                const last = lista[0].id
                console.log(last, lista)
                axios.post(dir, { id: last, idUser: usuarioLocal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }
        const eliminar = async (id) => {
            const ok = window.confirm('¿Está seguro de eliminar este registro ?');
            if (ok) {
                axios.post(URL + '/asignacion/delete', { id: id, idUser: usuarioLocal, fecha: fechaHora }).then(json => {
                    if (json.data.ok) {
                        empty()
                        setLista(json.data.data)
                        toast.success(json.data.msg)
                        setModalVer(false)
                    }
                    else toast.error(json.data.msg)
                })
            }
        }
        const restaurar = async (ids) => {

            const ok = window.confirm('¿está seguro de restaurar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/asignacion/restaurar', { id: ids, fecha: fechaHora, idUser: usuarioLocal }).then(json => {
                        if (json.data.ok) {
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















        const searchMoney = async () => {
            if (inputBuscar_.valido === 'true') {
                axios.post(URL + '/gasto/searchgastos', { comprobante: inputBuscar_.campo, idasignacion: idAsignacion.campo }).then(json => {
                    if (json.data.ok) setListaGasto(json.data.data)
                    else toast.error(json.data.msg)
                })
            }
        }

        const listarGastos = async (id) => {
            axios.post(URL + '/gasto/listargasto', { id: id }).then(json => {
                if (json.data.ok) {
                    setMontoGatado(json.data.data[1])
                    setListaGasto(json.data.data[0]);
                    setVentana(2)
                }
                else toast.error(json.data.msg)
            })
        }
        const siguienteGastos = () => {
            let dir = URL + '/gasto/siguiente'

            if (listaGasto.length > 0) {
                const last = listaGasto[listaGasto.length - 1].id
                // console.log(last, lista)
                axios.post(dir, { id: last, asignacion: idAsignacion.campo }).then(json => {
                    if (json.data.ok) {
                        setListaGasto(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }

        const anteriorGastos = () => {
            let dir = URL + '/gasto/anterior'
            if (listaGasto.length > 0) {
                const last = listaGasto[0].id
                // console.log(last, listaGasto)
                axios.post(dir, { id: last, asignacion: idAsignacion.campo }).then(json => {
                    if (json.data.ok) {
                        setListaGasto(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }
        const verEgreso = async (id) => {
            axios.post(URL + '/gasto/veregreso', { id: id }).then(json => {
                if (json.data.ok) {
                    setGasto(json.data.data)
                    setModalGastos(true)
                }
                else toast.error(json.data.msg)
            })
        }



        return (
            <div>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content">
                                <div className="container-fluid pt-1">
                                    {ventana === 1 && <>
                                        <div className='tituloPaginas'>
                                            {"MONTOS ASIGNADOS AL SR(A).:  " + localStorage.getItem('empleado')}<spam className='text-eliminado'>{eliminado === false ? null : '     [Elementos eliminados]'}</spam>
                                        </div >
                                        <div style={{ background: 'white' }} >
                                            <div className='contenedor-cabecera'>


                                                <div className='row '>
                                                    {eliminado === false &&
                                                        <Button className="btn-nuevo col-auto" onClick={() => { setModalInsertar(true); listarProyecto() }} >
                                                            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>Nueva Asignación
                                                        </Button>
                                                    }

                                                    {eliminado === true &&
                                                        <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarAsignacion(); setInputBuscar({ campo: null, valido: null }) }} >
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
                                                        etiqueta={'Buscar'}
                                                    />
                                                </div>
                                                <div className="table table-responsive custom">

                                                    <Table className="table table-sm" >
                                                        <thead>
                                                            <tr >
                                                                <th className="col-1">Fecha</th>
                                                                <th className="col-3">Descripción</th>
                                                                <th className="col-2">Proyecto</th>
                                                                <th className="col-2">Comprobante</th>
                                                                <th className="col-1">Monto Bs.</th>
                                                                <th className="col-1">Tipo</th>
                                                                <th className="col-1">Estado</th>
                                                                <th className="col-2">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {lista.map((s) => (
                                                                <tr className='item' key={s.id} >
                                                                    <td className="col-1">{s.fecha}</td>
                                                                    <td className="col-3">{s.descripcion}</td>
                                                                    <td className="col-2">{s.proyecto}</td>
                                                                    <td className="col-2">{s.comprobante}</td>
                                                                    <td className="col-1">{s.monto}</td>
                                                                    {
                                                                        listaTipo.map((e) => (
                                                                            e.id === s.tipo && <td className="col-1">{e.nombre}</td>
                                                                        ))
                                                                    }
                                                                    {
                                                                        listaEstado.map((e) => (
                                                                            e.id === s.estado && <td className="col-1">{e.nombre}</td>
                                                                        ))
                                                                    }
                                                                    <td className="col-1 largTable">
                                                                        <FontAwesomeIcon icon={faList} onClick={() => check(s.id)} className='botonEliminar' />
                                                                        <FontAwesomeIcon icon={faDollarSign} onClick={() => {
                                                                            setVentana(2); listarGastos(s.id);
                                                                            setIdAsignacion({ campo: s.id, valido: 'true' }); setNombreVentanaMonto(s.monto);
                                                                            setVentanaProyecto(s.proyecto); setDescripcionGasto(s.descripcion); setNombreVentana(s.comprobante)
                                                                        }} className='botonEditar' />
                                                                    </td>
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
                                        </div></>
                                    }
                                    {
                                        ventana === 2 &&
                                        <div style={{background:'white'}}>
                                            <div className='nombre-reporte  m-3' style={{ color: 'rgb(114, 114, 114)', fontWeight: 'bold', fontSize: '16px' }}>
                                                {"GASTOS DEL SR(A).:  " + localStorage.getItem('empleado')}
                                            </div >
                                            <div className='groupInput' style={{ border: '0px' }}>
                                                <div className='nombre-reporte' style={{ color: 'rgba(255, 99, 132, 0.9)', fontWeight: 'bold', fontSize: '14px' }}>
                                                    Datos Generales
                                                </div>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <p className='textoDetalle'>{'PROYECTO : ' + ventanaProyecto}</p>
                                                        <p className='textoDetalle'>{'DECRIPCIÓN : ' + descripcionGasto}</p>
                                                        <p className='textoDetalle'>{'NUMERO ASIGNACION : ' + nombreVentana}</p>
                                                    </div>
                                                    <div className='col-6'>
                                                        <p className='titleDetalle'>{'MONTO ASIGNADO  : ' + nombreVentanaMOnto + '  Bs.'}</p>

                                                        {
                                                            montoGastado < nombreVentanaMOnto ?

                                                                <p className='textoDetalle'>{montoGastado?'MONTO GASTADO : ' + montoGastado + ' Bs.':'MONTO GASTADO : 0 Bs.'}</p> :
                                                                <p className='textoDetalle'>{montoGastado?'MONTO GASTADO : ' + montoGastado + ' Bs.':'MONTO GASTADO : 0 Bs.'}
                                                                    <span style={{ color: 'red', fontSize: '12px' }}> El gasto excedió a monto asignado</span></p>
                                                        }

                                                        <p className='titleDetalle'>{'SALDO EN CAJA  : ' + (nombreVentanaMOnto - montoGastado) + '  Bs.'}</p>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className='contenedor-cabecera'>
                                                <div className='row '>
                                                    <div class="container-4 col-auto " style={{ paddingTop: '5px', marginTop: '0px' }}>
                                                        <ComponenteInputBuscar_
                                                            estado={inputBuscar_}
                                                            cambiarEstado={setInputBuscar_}
                                                            name="inputBuscar"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            placeholder="Escriba para filtrar ..."
                                                            eventoBoton={searchMoney}
                                                            // evento2 = {b}
                                                            etiqueta={'Buscar'}
                                                        />
                                                    </div>
                                                    <Button className="btn-restaurar col-auto" onClick={() => { setVentana(1); listarAsignacion() }}> <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana</Button>
                                                </div>
                                            </div>
                                            <div className='contenedor-gastos' >
                                                <div className="table table-responsive custom-medium">

                                                    <Table className="table table-sm tableLarge" >
                                                        <thead>
                                                            <tr className='col-12'>
                                                                <th className="col-2">Fecha</th>
                                                                <th className="col-2 descripcion ">Descripción</th>
                                                                <th className="col-2">Egreso Bs.</th>
                                                                <th className="col-1"></th>
                                                                <th className="col-2">Comprobante</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {listaGasto.map((s) => (
                                                                <tr className='item' key={s.id} >
                                                                    <td className="col-2">{s.fecha}</td>
                                                                    <td className="col-2 descripcion">{s.descripcion}</td>
                                                                    <td className="col-2">{s.egreso}</td>
                                                                    <td className="col-1 largTable">
                                                                        {s.img &&
                                                                            <>
                                                                                <FontAwesomeIcon icon={faImage} onClick={() => {
                                                                                    setImagen(s.img); setId({ campo: s.id, valido: 'true' }); setComprobanteImage(s.comprobante); setVentana(3)
                                                                                }} className='botonEliminar' />
                                                                                <FontAwesomeIcon icon={faList} onClick={() => verEgreso(s.id)} className='botonEditar' />
                                                                            </>
                                                                        }
                                                                        {!s.img &&
                                                                            <FontAwesomeIcon icon={faList} onClick={() => verEgreso(s.id)} className='botonEditar-one' />
                                                                        }
                                                                    </td>
                                                                    <td className="col-2">{s.comprobante}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>

                                            <div className='contenedor-foot mb-2'>
                                                <div className='navegador-tabla'>
                                                    <div className='row'>
                                                        <FontAwesomeIcon className='col-auto anterior' icon={faArrowLeft} onClick={() => anteriorGastos()} > </FontAwesomeIcon>
                                                        <div className=' col-auto now'>{listaGasto.length > 0 ? listaGasto[listaGasto.length - 1].id + ' - ' + listaGasto[0].id : '0   -   0'}</div>
                                                        <FontAwesomeIcon className='col-auto next' icon={faArrowRight} onClick={() => siguienteGastos()}> </FontAwesomeIcon>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        ventana === 3 &&
                                        <>
                                            <article className='light-box pt-1'>
                                                <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '44px' }}><strong> {'NRO. COMPROBANTE  :  ' + comprobanteImage}</strong></p>
                                                <img src={URL + '/' + image} alt={'...'} />
                                            </article>
                                            <div className="row botonModal mt-2">
                                                <Button className='btn-restaurar col-auto' onClick={() => setVentana(2)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>
                                            </div>
                                        </>
                                    }

                                    <Modal isOpen={modalGastos}>
                                        {gasto.length > 0 &&
                                            <div className='titloFormulario' >
                                                DETALLES DEL GASTO
                                            </div>
                                        }
                                        <ModalBody>
                                            {gasto.length > 0 &&
                                                <>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Proyecto
                                                        </div>
                                                        <p className='textoDetalle'>{'PROYECTO : ' + gasto[0].proyecto}</p>
                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Datos Generales
                                                        </div>
                                                        <p className='textoDetalle'>{'PERSONAL : ' + gasto[0].personal}</p>
                                                        <p className='textoDetalle'>{'FECHA : ' + gasto[0].fecha}</p>
                                                        <p className='textoDetalle'>{'DESCRIPCION : ' + gasto[0].descripcion}</p>
                                                        <p className='textoDetalle'>{'ASIGNACION : ' + gasto[0].asignacion}</p>
                                                    </div>

                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Costos
                                                        </div>
                                                        <p className='textoDetalle'>{'EGRESO  :  ' + gasto[0].egreso + ' Bs.'}</p>
                                                        <p className='titleDetalle'>{'MONTO ASIGNADO :  ' + (nombreVentanaMOnto) + '  Bs.'}</p>
                                                        <p className='titleDetalle'>{'SALDO EN CAJA :  ' + (nombreVentanaMOnto - montoGastado) + '  Bs.'}</p>


                                                        {
                                                            listaTipo.map((e) => (
                                                                gasto[0].tipopago === e.id &&
                                                                <p className='textoDetalle'>{'TIPO PAGO : ' + e.nombre}</p>

                                                            ))

                                                        }
                                                        {gasto[0].factura === 0 &&
                                                            <p className='textoDetalle'>{'FACTURA : NO'}</p>
                                                        }

                                                        <p className='textoDetalle'>{'TIPO DE GASTO :  ' + gasto[0].tipo}</p>
                                                        <p className='textoDetalle'>{'CLASIFICACION DE GASTO :  ' + gasto[0].clasificacion}</p>

                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Proveedor
                                                        </div>
                                                        <p className='textoDetalle'><span>PROVEEDOR  </span>{gasto[0].proveedor ? '  :  ' + gasto[0].proveedor : 'SIN PROVEEDOR'}</p>

                                                    </div>

                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Interacciones
                                                        </div>
                                                        <p className='textoDetalle'>{'CREADO EN :  ' + gasto[0].creado}</p>
                                                        <p className='textoDetalle'><span>ACTUALIZADO EN :  </span>{gasto[0].modificado ? gasto[0].modificado : 'Aun no se actualizo el registro'}</p>
                                                    </div>
                                                </>
                                            }
                                        </ModalBody>
                                        <div className="row botonModal">
                                            <Button className='btn-restaurar col-auto' onClick={() => { setModalGastos(false); listarGastos(idAsignacion.campo) }}  >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>
                                        </div>
                                    </Modal>






                                    <Modal isOpen={modalVer}>
                                        {asignacion.length > 0 &&
                                            <div className='titloFormulario' >
                                                DETALLES DE LA ASIGNACIÓN
                                            </div>
                                        }
                                        <ModalBody>
                                            {asignacion.length > 0 &&
                                                <>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Datos Generales
                                                        </div>
                                                        <p className='textoDetalle'>{'PROYECTO : ' + asignacion[0][0].proyecto}</p>
                                                        <p className='textoDetalle'>{'PERSONAL ENCARGADO MONTO : ' + asignacion[0][0].personal}</p>

                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Costos
                                                        </div>
                                                        <p className='textoDetalle'>{'MONTO  :  ' + asignacion[0][0].monto + ' Bs.'}</p>
                                                        <p className='textoDetalle'> <span>Gasto</span> {asignacion[0][0].gastado ? ' :  ' + asignacion[0][0].gastado + ' Bs.' : " : 0 Bs."}</p>
                                                        <p className='textoDetalle'>{'SALDO EN CAJA  :  ' + (asignacion[0][0].monto - asignacion[0][0].gastado) + ' Bs.'}</p>
                                                        <p className='textoDetalle'>{'DESCRIPCIÓN :  ' + asignacion[0][0].descripcion}</p>
                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Fechas
                                                        </div>
                                                        <p className='textoDetalle'>{'FECHA ASIGNACION :  ' + asignacion[0][0].fecha}</p>
                                                        <p className='textoDetalle'><spam>FECHA RENDICION </spam>{asignacion[0][0].fecharendicion ? ' : ' + asignacion[0][0].fecharendicion : ' : Pendiente'}</p>
                                                        <p className='textoDetalle'><spam>FECHA APROBACION </spam>{asignacion[0][0].fechaaprobacion ? ' : ' + asignacion[0][0].fechaaprobacion : ' : Pendiente'}</p>
                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Modalidad de financiamiento
                                                        </div>
                                                        {listaTipo.map((e) => (
                                                            asignacion.map((a) => (
                                                                e.id === a[0].tipo && <p className='textoDetalle' key={e.id}>{'TIPO ASIGNACION :  ' + e.nombre}</p>
                                                            ))
                                                        ))}
                                                        {listaEstado.map((e) => (
                                                            asignacion.map((a) => (
                                                                e.id === a[0].estado && <p className='textoDetalle' key={e.id}>{'ESTADO :  ' + e.nombre}</p>
                                                            ))
                                                        ))}
                                                        <p className='textoDetalle'>{'NUMERO DETALE :  ' + asignacion[0][0].comprobante}</p>
                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Interacciones
                                                        </div>
                                                        <p className='textoDetalle'>{'USUARIO :  ' + asignacion[0][0].usuario}</p>
                                                        <p className='textoDetalle'>{'CREADO EN :  ' + asignacion[0][0].creado}</p>
                                                        <p className='textoDetalle'><span>ACTUALIZADO EN :  </span>{asignacion[0][0].modificado ? asignacion[0][0].modificado : 'Aun no se actualizo el registro'}</p>
                                                    </div>
                                                </>
                                            }
                                        </ModalBody>
                                        {asignacion.length > 0 &&
                                            <div className="row botonModal">

                                                {
                                                    eliminado === true && <>
                                                        <Button className='btn-restaurar col-auto' onClick={() => { setModalVer(false); listarAsignacion() }}  >
                                                            <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>
                                                        <Button className='btn-nuevo col-auto' onClick={() => restaurar(asignacion[0][0].id)} >
                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faWindowClose}></FontAwesomeIcon>Restaurar Registro </Button>
                                                    </>
                                                }

                                                {eliminado === false && <>
                                                    <Button className='btn-restaurar col-auto' onClick={() => { setModalVer(false) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar  </Button>
                                                    {asignacion[0][0].estado === 1 &&
                                                        <>
                                                            <Button className='btn-nuevo col-auto' onClick={() => { rellenar(asignacion[0][0]) }}>
                                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar</Button>
                                                            <Button className='btn-restaurar col-auto' onClick={() => { eliminar(asignacion[0][0].id) }} >
                                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Eliminar </Button>
                                                        </>
                                                    }
                                                    {asignacion[0][0].estado === 2 &&
                                                        <>
                                                            <Button className='btn-nuevo col-auto' onClick={() => { aprobar(asignacion[0][0].id) }}>
                                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faCheckCircle}></FontAwesomeIcon>Aprobar</Button>
                                                            <Button className='btn-nuevo col-auto' onClick={() => { revertir(asignacion[0][0].id) }}>
                                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowLeft}></FontAwesomeIcon>Revertir</Button>
                                                        </>
                                                    }
                                                </>
                                                }
                                            </div>
                                        }
                                    </Modal>



                                    <Modal isOpen={modalInsertar}>
                                        <div className='titloFormulario' >
                                            Registrar Asignacion
                                        </div>
                                        <ModalBody>
                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Fecha</p>
                                                <div className="col-4">
                                                    <ComponenteInputfecha
                                                        estado={fecha}
                                                        cambiartipo={setFecha}
                                                        name="fecha"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha'
                                                        msg='Seleccione una fecha especifica'
                                                    />
                                                </div>
                                                <div className="col-8">
                                                    <Select1
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdProyecto}
                                                        name="tipo"
                                                        ExpresionRegular={INPUT.ID}  //expresion regular
                                                        lista={listaProyecto}
                                                        etiqueta='Proyecto'
                                                        msg='Seleccione una opcion'
                                                    />
                                                </div>
                                            </div>
                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Datos Generales</p>
                                                <div className=" col-6">
                                                    <ComponenteInputUser
                                                        estado={monto}
                                                        cambiarEstado={setMonto}
                                                        name="monto"
                                                        placeholder="MONTO"
                                                        ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                        etiqueta='Monto asignado'
                                                        msg='Este campo es numérico'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <Select1
                                                        estado={tipo}
                                                        cambiarEstado={setTipo}
                                                        name="tipo"
                                                        ExpresionRegular={INPUT.ID}  //expresion regular
                                                        lista={listaTipo}
                                                        etiqueta='Tipo Asignacion'
                                                        msg='Seleccione una opcion'
                                                    />
                                                </div>

                                                <div className=" col-12">
                                                    <ComponenteInputUser
                                                        estado={descripcion}
                                                        cambiarEstado={setDescripcion}
                                                        name="descripcion"
                                                        placeholder="DESCRIPCIÓN"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Descripción'
                                                        msg='Este acepta letras, numero y algunos caracteres'
                                                    />
                                                </div>
                                            </div>


                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Comprobante</p>
                                                <div className=" col-6">
                                                    <ComponenteInputUser
                                                        estado={comprobante}
                                                        cambiarEstado={setComprovante}
                                                        name="comprobante"
                                                        placeholder="COMPROBANTE"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='NUMERO COMPROBANTE'
                                                        msg='Este campo es alfanumerico'
                                                    />
                                                </div>
                                            </div>
                                        </ModalBody>

                                        <div className="row botonModal">

                                            <Button className='btn-restaurar col-auto' onClick={() => setModalInsertar(false)} >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>

                                            <Button className='btn-nuevo col-auto' onClick={() => insert()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Registrar</Button>
                                        </div>
                                    </Modal>

                                    <Modal isOpen={modalEditar}>
                                        <div className='titloFormulario' >
                                            Actualizar Registro
                                        </div>
                                        <ModalBody>
                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Fecha</p>
                                                <div className="col-4">
                                                    <ComponenteInputfecha
                                                        estado={fecha}
                                                        cambiartipo={setFecha}
                                                        name="fecha"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha'
                                                        msg='Seleccione una fecha especifica'
                                                    />
                                                </div>
                                                <div className="col-8">
                                                    <Select1
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdProyecto}
                                                        name="tipo"
                                                        ExpresionRegular={INPUT.ID}  //expresion regular
                                                        lista={listaProyecto}
                                                        etiqueta='Proyecto'
                                                        msg='Seleccione una opcion'
                                                    />
                                                </div>
                                            </div>
                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Datos Generales</p>
                                                <div className=" col-6">
                                                    <ComponenteInputUser
                                                        estado={monto}
                                                        cambiarEstado={setMonto}
                                                        name="monto"
                                                        placeholder="MONTO"
                                                        ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                        etiqueta='Monto asignado'
                                                        msg='Este campo es numérico'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <Select1
                                                        estado={tipo}
                                                        cambiarEstado={setTipo}
                                                        name="tipo"
                                                        ExpresionRegular={INPUT.ID}  //expresion regular
                                                        lista={listaTipo}
                                                        etiqueta='Tipo Asignacion'
                                                        msg='Seleccione una opcion'
                                                    />
                                                </div>
                                                <div className=" col-12">
                                                    <ComponenteInputUser
                                                        estado={descripcion}
                                                        cambiarEstado={setDescripcion}
                                                        name="descripcion"
                                                        placeholder="DESCRIPCIÓN"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='Descripción'
                                                        msg='Este acepta letras, numero y algunos caracteres'
                                                    />
                                                </div>
                                            </div>


                                            <div className='groupInput row'>
                                                <p className='titleGroup'>Comprobante</p>
                                                <div className=" col-6">
                                                    <ComponenteInputUser
                                                        estado={comprobante}
                                                        cambiarEstado={setComprovante}
                                                        name="comprobante"
                                                        placeholder="COMPROBANTE"
                                                        ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                        etiqueta='NUMERO DETALLE'
                                                        msg='Este campo es alfanumerico'
                                                    />
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <div className="row botonModal">
                                            <Button className='btn-restaurar col-auto' onClick={() => setModalEditar(false)}  >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar </Button>

                                            <Button className='btn-nuevo col-auto' onClick={() => update()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar</Button>
                                        </div>
                                    </Modal>
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
        // auth.logout()
    }

}
export default Asignacion;
