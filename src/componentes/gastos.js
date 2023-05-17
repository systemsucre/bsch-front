import React from 'react';

import { Table, Button, Modal, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCaretLeft, faDollarSign, faEdit, faImage, faList, faPlus, faSave, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteCheckFactura, ComponenteInputBuscar_, ComponenteInputfecha, ComponenteInputFile, ComponenteInputUser, Select1, Select2_ } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de tipos
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import Home from './elementos/home'
import { Toaster, toast } from 'react-hot-toast'


import Compressor from 'compressorjs';
import { Link } from 'react-router-dom';


function Gastos() {

    const auth = useAuth()

    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalInsertarProveedor, setModalInsertarProveedor] = useState(false);
    const [modalInsertarClasificacion, setModalInsertarClasificacion] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalAsignacion, setModalAsignacion] = useState(false);
    const [modalGastos, setModalGastos] = useState(false);
    const [ventana, setVentana] = useState(1);
    const [nombreVentana, setNombreVentana] = useState('Asignaciones');
    const [ventanaProyecto, setVentanaProyecto] = useState(null);
    const [nombreVentanaMOnto, setNombreVentanaMonto] = useState(null);
    const [montoGastado, setMontoGatado] = useState(null);
    const [factura, setFactura] = useState(0);
    const [asignarArchivo, setAsignarArchivo] = useState(0);
    const [descripcionGasto, setDescripcionGasto] = useState(0);



    const [image, setImagen] = useState(null);
    const [comprobanteImage, setComprobanteImage] = useState(null);





    const [listaAsignacion, setListaAsignacion] = useState([]);  //lista asignacion principal
    const [listaGasto, setListaGasto] = useState([]);  // lista de gasto para una determinada asignacion
    const [asignacion, setAsignacion] = useState([])  // ver una asignacion en especifico
    const [gasto, setGasto] = useState([])  // ver detalles del gasto especifico
    const [clasificacionDB, setIdClasificacionDB] = useState([])  // idClasificaion de gasto desde la bd
    const [tipoDB, settipoDB] = useState([])  // idTipo de gasto desde la bd
    const [proveedor, setProveedor] = useState([])  // idTipo de gasto desde la bd


    const listaEstado = [{ id: 1, nombre: 'ASIGNADO' }, { id: 2, nombre: 'RENDIDO' }, { id: 3, nombre: 'APROBADO' }]
    const listaTipo = [{ id: 1, nombre: 'efectivo' }, { id: 2, nombre: 'cheque' }, { id: 3, nombre: 'deposito' }];


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

    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })  // BUSCADOR DE LA INFORMACION ASIGNACION Y GASTOS
    const [inputBuscar_, setInputBuscar_] = useState({ campo: null, valido: null })  // BUSCADOR DE LA INFORMACION ASIGNACION Y GASTOS


    const [id, setId] = useState({ campo: null, valido: null })
    const [fecha, setFecha] = useState({ campo: año + '-' + mes + '-' + dia, valido: 'true' })
    const [descripcion, setDescripcion] = useState({ campo: null, valido: null })
    const [monto, setMonto] = useState({ campo: null, valido: null })


    const [idTipo, setIdTipo] = useState({ campo: null, valido: null }) // idTipo de la informacion
    const [tipoPago, setTipoPago] = useState({ campo: null, valido: null }) // idTipo del pago que se realiza
    const [idClasificaion, setIdClasificacion] = useState({ campo: null, valido: null })
    const [idAsignacion, setIdAsignacion] = useState({ campo: null, valido: null })

    const [estadoCheck, setEstadoCheck] = useState({ campo: null, valido: null })
    const [idProveedor, setIdProveedor] = useState({ campo: null, valido: null })



    const [comprobante, setComprovante] = useState({ campo: null, valido: null })
    const [file, setFile] = useState({ campo: null, valido: null })





    ///PROVEDORES
    const [nombre, setNombre] = useState({ campo: null, valido: null })
    const [nit, setNit] = useState({ campo: null, valido: null })
    const [direccion, setDireccion] = useState({ campo: null, valido: null })
    const [telefono, setTelefono] = useState({ campo: null, valido: null })
    const [pais, setPais] = useState({ campo: null, valido: null })
    const [cuenta, setCuenta] = useState({ campo: null, valido: null })

    // cñasificacion


    const [clasificacion, setClasificacion] = useState({ campo: null, valido: null });





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
            if (inputBuscar.valido === null) listarAsignacion(parseInt(localStorage.getItem('idEmpleado')))
            if (inputBuscar.valido === 'false') listarAsignacion(parseInt(localStorage.getItem('idEmpleado')))

            document.title = localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')
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







        const listarAsignacion = async () => {
            axios.post(URL + '/gasto/listarasignacion').then(json => {
                if (json.data.ok) setListaAsignacion(json.data.data)
                else toast.error(json.data.msg)
            })
        }


        const siguiente = () => {
            let dir = URL + '/gasto/nextuser'

            if (listaAsignacion.length > 0) {
                const last = listaAsignacion[listaAsignacion.length - 1].id
                // console.log(last, lista)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setListaAsignacion(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }

        const anterior = () => {
            // alert()

            let dir = URL + '/gasto/anterioruser'
            if (listaAsignacion.length > 0) {
                const last = listaAsignacion[0].id
                // console.log(last, listaAsignacion)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setListaAsignacion(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                })
            }
        }






        const listarAsignacionBD = async () => {
            axios.post(URL + '/gasto/listarclasificacion').then(json => {
                if (json.data.ok) setIdClasificacionDB(json.data.data)
                else toast.error(json.data.msg)
            })
        }
        const listarTipoBD = async () => {
            axios.post(URL + '/gasto/listartipo').then(json => {
                if (json.data.ok) settipoDB(json.data.data)
                else toast.error(json.data.msg)
            })
        }



        const listarProveedor = async () => {
            axios.post(URL + '/gasto/listarproveedor').then(json => {
                if (json.data.ok) setProveedor(json.data.data)
                else toast.error(json.data.msg)
            })
        }

        const search = async () => {
            if (inputBuscar.valido === 'true') {
                axios.post(URL + '/gasto/searchassignment', { comprobante: inputBuscar.campo }).then(json => {
                    if (json.data.ok) setListaAsignacion(json.data.data)
                    else toast.error(json.data.msg)
                })
            }
        }

        const check = async (id) => {
            // alert(id)
            axios.post(URL + '/gasto/verasignacion', { id: id }).then(json => {
                if (json.data.ok) {
                    console.log(json.data.data)
                    setAsignacion(json.data.data)
                    setModalAsignacion(true)
                }
                else toast.error(json.data.msg)
            })
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


        const searchMoney = async () => {
            if (inputBuscar_.valido === 'true') {
                axios.post(URL + '/gasto/searchgastos', { comprobante: inputBuscar_.campo, idasignacion: idAsignacion.campo }).then(json => {
                    if (json.data.ok) setListaGasto(json.data.data)
                    else toast.error(json.data.msg)
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









        const rellenar = () => {
            if (gasto.length > 0) {
                setId({ campo: gasto[0].id, valido: 'true' })
                listarAsignacionBD(); listarTipoBD(); listarProveedor()
                setId({ campo: gasto[0].id, valido: 'true' })
                setFecha({ campo: gasto[0].fecha, valido: 'true' })
                setDescripcion({ campo: gasto[0].descripcion, valido: 'true' })
                setMonto({ campo: gasto[0].egreso, valido: 'true' })
                setTipoPago({ campo: gasto[0].tipopago, valido: 'true' })
                setFactura(gasto[0].factura)


                setIdTipo({ campo: gasto[0].idtipo, valido: 'true' })
                setIdClasificacion({ campo: gasto[0].idclasificacion, valido: 'true' })
                setIdProveedor({ campo: gasto[0].idproveedor, valido: 'true' })

                setComprovante({ campo: gasto[0].comprobante, valido: 'true' })
                gasto[0].img ? setAsignarArchivo(1) : setAsignarArchivo(0)
                setModalEditar(true)
            } else toast.error('Operacion no autorizado')
        }

        const empty = () => {
            setId({ campo: null, valido: null })
            setMonto({ campo: null, valido: null })
            setIdTipo({ campo: null, valido: null })
            setDescripcion({ campo: null, valido: null })
            setTipoPago({ campo: null, valido: null })
            setComprovante({ campo: null, valido: null })
            setIdTipo({ campo: null, valido: null })
            setIdClasificacion({ campo: null, valido: null })
            setIdProveedor({ campo: null, valido: null })
            setModalInsertar(false)
            setModalEditar(false)
        }




























        const insert = async () => {

            // console.log(file.size, 'imagen cargado')
            let calidad = null
            if (file.size < 500000)
                calidad = 0.1
            if (file.size < 1000000)
                calidad = 0.9
            if (file.size > 1000000)
                calidad = 0.6
            if (file.size > 3000000)
                calidad = 0.3
            if (file.size > 5000000)
                calidad = 0.2
            console.log(calidad, "calidad de la imagen")

            console.log(estadoCheck, 'tipo de la factura')

            if (fecha.valido === 'true' &&
                monto.valido === 'true' && idTipo.valido === 'true' &&
                comprobante.valido === 'true' && idTipo.valido === 'true' &&
                idClasificaion.valido === 'true' && tipoPago.valido === 'true'
            ) {
                axios.post(URL + '/gasto/insert', {
                    fecha: fecha.campo,
                    egreso: monto.campo,
                    descripcion: descripcion.campo,
                    comprobante: comprobante.campo,  // puede ser numero de recibo o numero de factura
                    idtipo: idTipo.campo,
                    idclasificacion: idClasificaion.campo,
                    idasignacion: idAsignacion.campo,
                    tipopago: tipoPago.campo,
                    factura: factura,
                    proveedor: idProveedor.campo,
                    creado: fechaHora,
                    archivo: asignarArchivo === 1 ? true : false

                }).then(json => {
                    if (json.data.ok) {
                        if (asignarArchivo === 0) {
                            console.log(json.data.data, 'sin imagen', file, idAsignacion, 'idAsignacion')
                            setGasto(json.data.data)
                            listarGastos(idAsignacion.campo)
                            setModalGastos(true)
                            empty()
                            toast.success(json.data.msg)
                        }
                        else {
                            new Compressor(file, {
                                quality: calidad,
                                success(result) {
                                    const formData = new FormData();
                                    formData.append('resultado', result, result.name);
                                    axios.post(URL + '/gasto/guardarImagen', formData, {
                                        params: {
                                            nombre: json.data.data
                                        }
                                    }).then(j => {
                                        if (j.data.ok) {
                                            console.log(j.data.data, 'con imagen')
                                            setModalGastos(true)
                                            setModalInsertar(false)
                                            setGasto(j.data.data)
                                            listarGastos(idAsignacion.campo)
                                            toast.success(j.data.msg)
                                            empty()
                                        } else toast.error(j.data.msg)
                                    })
                                },
                                error(err) {
                                    toast.error('Error al procesar imagen');
                                },
                            });
                        }

                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }
        }


















        // console.log(idTipo)
        const update = async (e) => {
            // console.log(file.size, 'imagen cargado')
            let calidad = null
            if (file.size < 500000)
                calidad = 0.1
            if (file.size < 1000000)
                calidad = 0.9
            if (file.size > 1000000)
                calidad = 0.6
            if (file.size > 3000000)
                calidad = 0.3
            if (file.size > 5000000)
                calidad = 0.2
            console.log(calidad, "calidad de la imagen")

            console.log(estadoCheck, 'tipo de la factura')

            if (fecha.valido === 'true' && id.valido === 'true' &&
                monto.valido === 'true' && idTipo.valido === 'true' &&
                comprobante.valido === 'true' && idTipo.valido === 'true' &&
                idClasificaion.valido === 'true' && tipoPago.valido === 'true'
            ) {
                axios.post(URL + '/gasto/update', {
                    id: id.campo,
                    fecha: fecha.campo,
                    egreso: monto.campo,
                    descripcion: descripcion.campo,
                    comprobante: comprobante.campo,  // puede ser numero de recibo o numero de factura
                    idtipo: idTipo.campo,
                    idclasificacion: idClasificaion.campo,
                    tipopago: parseInt(tipoPago.campo),
                    factura: factura,
                    proveedor: idProveedor.campo,
                    modificado: fechaHora,

                }).then(json => {
                    if (json.data.ok) {
                        if (asignarArchivo === 0) {
                            console.log(json.data.data, 'sin imagen', file)
                            setGasto(json.data.data)
                            toast.success(json.data.msg)
                            setModalGastos(true)
                            listaGasto(idAsignacion.campo)
                            empty()
                        }
                        else {
                            new Compressor(file, {
                                quality: calidad,
                                success(result) {
                                    const formData = new FormData();
                                    formData.append('resultado', result, result.name);

                                    let existeArchivo = false
                                    if (gasto[0].img)
                                        existeArchivo = true
                                    axios.post(URL + '/gasto/eliminarImagen', { id: id.campo, existeArchivo: existeArchivo }).then(json => {
                                        if (json.data.ok) {
                                            // setListaGasto(json.data.data)
                                            axios.post(URL + '/gasto/guardarImagen', formData, {
                                                params: { nombre: gasto[0].id }
                                            }).then(j => {
                                                if (j.data.ok) {
                                                    console.log(j.data.data, 'con imagen')
                                                    setModalGastos(true)
                                                    setModalEditar(false)
                                                    setGasto(j.data.data)
                                                    listaGasto(idAsignacion.campo)
                                                    toast.success(j.data.msg)
                                                    empty()
                                                } else toast.error(j.data.msg)
                                            })


                                        }
                                    })
                                },
                                error(err) {
                                    toast.error('Error al procesar imagen');
                                },
                            });
                        }

                    }
                    else
                        toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete los campos')
            }
        }


        const eliminarImagen = () => {
            let dir = URL + '/gasto/eliminarImagenArchivo'
            let ok = window.confirm('Desea eliminar este recibo ?')
            if (ok) {
                if (listaGasto.length > 0 && id.valido === 'true') {
                    axios.post(dir, { id: id.campo, idasignacion: idAsignacion.campo }).then(json => {
                        if (json.data.ok) {
                            setListaGasto(json.data.data)
                            setVentana(2)
                            toast.success(json.data.msg)
                        } else {
                            toast.error(json.data.msg)
                        }
                    })
                }
            }
        }




        const eliminar = async (id) => {
            const ok = window.confirm('¿Está seguro de eliminar este registro ?');
            if (ok) {
                axios.post(URL + '/gasto/delete', {
                    id: gasto[0].id,
                    idasignacion: idAsignacion.campo,
                    eliminar: gasto[0].img ? gasto[0].id : false
                }).then(json => {
                    if (json.data.ok) {
                        setListaGasto(json.data.data)
                        toast.success(json.data.msg)
                        setModalGastos(false)
                    }
                    else toast.error(json.data.msg)
                })
            }
        }


        const rendicion = async () => {
            const ok = window.confirm('¿Está seguro de cerrar esta asignacion ?');
            if (ok) {
                axios.post(URL + '/gasto/rendicion', { id: asignacion[0][0].id, fecha: fechaHora }).then(json => {
                    if (json.data.ok) {
                        setAsignacion(json.data.data)
                        toast.success(json.data.msg)
                    }
                    else toast.error(json.data.msg)
                })
            }
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


        const insertarClasificacion = async () => {

            if (clasificacion.valido === 'true') {

                axios.post(URL + '/clasificacion/insertaraux', {
                    nombre: clasificacion.campo,
                    creado: fechaHora
                }).then(json => {
                    if (json.data.ok) {
                        setModalInsertarClasificacion(false)
                        setIdClasificacionDB(json.data.data)
                        setClasificacion({ campo: null, valido: null })


                        toast.success(json.data.msg)
                    }
                    else toast.error(json.data.msg)
                })
            } else {
                toast.error('Complete todos los campos')
            }
        }

        const insertarProveedor = async () => {

            if (nombre.valido === 'true' && nit.valido === 'true' &&
                telefono.valido === 'true' && direccion.valido === 'true' &&
                pais.valido === 'true' && cuenta.valido === 'true') {
                axios.post(URL + '/proveedor/insertaraux',
                    {
                        nombre: nombre.campo,
                        nit: nit.campo,
                        telefono: telefono.campo,
                        direccion: direccion.campo,
                        pais: pais.campo,
                        cuenta: cuenta.campo,
                        creado: fechaHora

                    }).then(json => {
                        if (json.data.ok) {
                            toast.success(json.data.msg)
                            setModalInsertarProveedor(false)
                            setProveedor(json.data.data)

                            setNombre({ campo: null, valido: null })
                            setNit({ campo: null, valido: null })
                            setTelefono({ campo: null, valido: null })
                            setDireccion({ campo: null, valido: null })
                            setPais({ campo: null, valido: null })
                            setCuenta({ campo: null, valido: null })
                        } else toast.error(json.data.msg)
                    })
            } else toast.error('Completar todos los campos de l formulario')
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
                                        {ventana === 1 ? "MIS ASIGNACIONES" : 'MIS GASTOS'}
                                    </div >
                                    <div style={{ background: 'white' }} >
                                        {
                                            ventana === 1 &&
                                            <>
                                                <div className="contenedor-cabecera">

                                                </div>
                                                <div className='contenedor'>
                                                    <div className="container-4">
                                                        <ComponenteInputBuscar_
                                                            estado={inputBuscar}
                                                            cambiarEstado={setInputBuscar}
                                                            name="inputBuscar"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            placeholder="Escriba para filtrar ..."
                                                            eventoBoton={search}
                                                            // evento2 = {b}
                                                            etiqueta={'Buscar'}
                                                        />
                                                    </div>
                                                    <div className="table table-responsive custom">

                                                        <Table className="table table-sm tableLarge" >
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-2">Fecha</th>
                                                                    <th className="col-2">Proyecto</th>
                                                                    <th className="col-3 ">Descripcion</th>
                                                                    <th className="col-2">Comprobante</th>
                                                                    <th className="col-2">Monto Bs.</th>
                                                                    <th className="col-1 text-center">Tipo</th>
                                                                    <th className="col-2 text-center">Estado</th>
                                                                    <th className="col-2"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {listaAsignacion.map((s) => (
                                                                    <tr className='item' key={s.id}>
                                                                        <td className="col-2">{s.fecha}</td>
                                                                        <td className="col-2">{s.proyecto}</td>
                                                                        <td className="col-4 ">{s.descripcion}</td>
                                                                        <td className="col-2">{s.comprobante}</td>
                                                                        <td className="col-2 ">{s.monto}</td>
                                                                        {
                                                                            listaTipo.map((e) => (
                                                                                e.id === s.tipo && <td className="col-1 text-center">{e.nombre}</td>
                                                                            ))
                                                                        }

                                                                        {
                                                                            listaEstado.map((e) => (
                                                                                e.id === s.estado && <td className="col-1 text-center">{e.nombre}</td>
                                                                            ))
                                                                        }

                                                                        <td className="col-2 largTable">
                                                                            <FontAwesomeIcon icon={faList} onClick={() => check(s.id)} className='botonEliminar' />
                                                                            <FontAwesomeIcon icon={faDollarSign} onClick={() => {
                                                                                listarGastos(s.id); setNombreVentana(s.comprobante); setNombreVentanaMonto(s.monto)
                                                                                setIdAsignacion({ campo: s.id, valido: 'true' }); setDescripcionGasto(s.descripcion);
                                                                                setVentanaProyecto(s.proyecto)
                                                                            }} className='botonEditar' />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                        {listaAsignacion.length === 0 &&
                                                            <div className='paciente' style={{ width: '100%' }}><strong>NO SE ENCONTRO NINGUNA INFORMACION</strong></div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='contenedor-foot'>
                                                    <div className='navegador-tabla'>
                                                        <div className='row'>
                                                            <FontAwesomeIcon className='col-auto anterior' icon={faArrowLeft} onClick={() => anterior()} > </FontAwesomeIcon>
                                                            <div className=' col-auto now'>{listaAsignacion.length > 0 ? listaAsignacion[listaAsignacion.length - 1].id + ' - ' + listaAsignacion[0].id : '0   -   0'}</div>
                                                            <FontAwesomeIcon className='col-auto next' icon={faArrowRight} onClick={() => siguiente()}> </FontAwesomeIcon>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                        {
                                            ventana === 2 &&
                                            <>
                                                <div className='groupInput' style={{ border: '0px' }}>
                                                    <div className='titleDetalle' >
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

                                                                    <p className='textoDetalle'><spam> MONTO GASTADO</spam>{montoGastado ? ' Bs. ' + montoGastado : ' : 0 Bs.'}</p> :
                                                                    <p className='textoDetalle'>{'MONTO GASTADO : ' + montoGastado + ' Bs.'}
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

                                                        <Button className="btn-nuevo col-auto" onClick={() => {
                                                            setModalInsertar(true);
                                                            listarAsignacionBD(); listarTipoBD(); listarProveedor()
                                                        }}> <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlus}></FontAwesomeIcon>Registrar nuevo gasto</Button>
                                                        <Button className="btn-restaurar col-auto" onClick={() => setVentana(1)}> <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana</Button>
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
                                            </>
                                        }


                                        <Modal isOpen={modalAsignacion}>
                                            {asignacion.length > 0 &&
                                                <div className='titloFormulario' >
                                                    DETALLES DEL MONTO
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
                                                            <p className='textoDetalle'>{'MONTO ASIGNADO A  : ' + asignacion[0][0].personal}</p>

                                                        </div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Costos
                                                            </div>
                                                            <p className='textoDetalle'>{'MONTO  :  ' + asignacion[0][0].monto + '  Bs.'}</p>
                                                            <p className='textoDetalle'> <span>Gasto</span> {asignacion[0][0].gastado ? ' :  ' + asignacion[0][0].gastado + ' Bs.' : " : 0 Bs."}</p>
                                                            <p className='textoDetalle'>{'SALDO EN CAJA  :  ' + (asignacion[0][0].monto - asignacion[0][0].gastado) + '  Bs.'}</p>
                                                            <p className='textoDetalle'>{'DESCRIPCION :  ' + asignacion[0][0].descripcion}</p>
                                                        </div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Fechas
                                                            </div>
                                                            <p className='textoDetalle'>{'FECHA ASIGNACION :  ' + asignacion[0][0].fecha}</p>
                                                            <p className='textoDetalle'><spam>FECHA RENDICION :</spam>{asignacion[0][0].fecharendicion ? '      ' + asignacion[0][0].fecharendicion : 'Pendiente'}</p>
                                                            <p className='textoDetalle'><spam>FECHA APROBACION :</spam>{asignacion[0][0].fechaaprobacion ? '       ' + asignacion[0][0].fechaaprobacion : 'Pendiente'}</p>
                                                        </div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Modalidad de financiamiento
                                                            </div>
                                                            {listaTipo.map((e) => (
                                                                asignacion.map((a) => (
                                                                    e.id === a[0].idTipo && <p className='textoDetalle' key={e.id}>{'TIPO ASIGNACION :  ' + e.nombre}</p>
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
                                                    <Button className='btn-restaurar col-auto' onClick={() => { setModalAsignacion(false); listarAsignacion() }}  >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>

                                                    <Button className='btn-nuevo col-auto' onClick={() => { rendicion() }} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowRight}></FontAwesomeIcon>Rendir cuenta </Button>
                                                </div>
                                            }

                                        </Modal>








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

                                                <Button className='btn-nuevo col-auto' onClick={() => { rellenar() }} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar </Button>

                                                <Button className='btn-restaurar col-auto' onClick={() => eliminar()} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faTrashAlt}></FontAwesomeIcon>Eliminar </Button>
                                            </div>
                                        </Modal>


                                        {
                                            ventana === 3 &&
                                            <>
                                                <article className='light-box pt-1'>
                                                    <p className='medicoList' style={{ textAlign: 'left', color: 'white', paddingLeft: '44px' }}><strong> {'NRO. COMPROBANTE  :  ' + comprobanteImage}</strong></p>
                                                    <img src={URL + '/' + image} alt={'...'} />
                                                </article>
                                                <div className="row botonModal mt-2 mb-2">
                                                    <Button className='btn-restaurar col-auto' onClick={() => setVentana(2)} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>
                                                    <Button className='btn-restaurar col-auto' onClick={() => eliminarImagen()} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faTrashAlt}></FontAwesomeIcon>Eliminar Imagen </Button>
                                                </div>
                                            </>
                                        }



                                        <Modal isOpen={modalInsertar}>
                                            <div className='titloFormulario' >
                                                Registrar Gasto
                                            </div>
                                            <ModalBody>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <p className='titleDetalle'>{'SALDO EN CAJA :  ' + (nombreVentanaMOnto - montoGastado) + '  Bs.'}</p>
                                                    </div>
                                                    <div className='col-6'>
                                                        <p className='titleDetalle'>{'MONTO ASIGNADO :  ' + (nombreVentanaMOnto) + '  Bs.'}</p>

                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Datos generales</p>
                                                    <div className="col-6">
                                                        <ComponenteInputfecha
                                                            estado={fecha}
                                                            cambiartipo={setFecha}
                                                            name="fecha"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta='Fecha'
                                                            msg='Seleccione una fecha especifica'
                                                        />
                                                    </div><div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={monto}
                                                            cambiarEstado={setMonto}
                                                            name="egreso"
                                                            placeholder="EGRESO"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Egreso Bs.'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className=" col-12">
                                                        <ComponenteInputUser
                                                            estado={descripcion}
                                                            cambiarEstado={setDescripcion}
                                                            name="monto"
                                                            placeholder=" DESCRIPCION"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Descripcion'
                                                            msg='Este acepta letra numero letras y caracteres'
                                                        />
                                                    </div>

                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Caracteristicas del gasto</p>
                                                    <div className="col-2 pt-4">
                                                        <ComponenteCheckFactura
                                                            etiqueta='Factura'
                                                            check={factura}
                                                            setCheck={setFactura}
                                                            cambiarEstado={setEstadoCheck}

                                                        />
                                                    </div>
                                                    <div className=" col-10">
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
                                                    <div className="col-6">
                                                        <Select2_
                                                            estado={idTipo}
                                                            cambiarEstado={setIdTipo}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={tipoDB}
                                                            etiqueta='Tipo de gasto'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <Select2_
                                                            estado={idProveedor}
                                                            cambiarEstado={setIdProveedor}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={proveedor}
                                                            etiqueta='Proveedor'
                                                            msg='Seleccione una opcion'
                                                            important={false}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Button className="btn-nuevo-modal col-auto" onClick={() => setModalInsertarProveedor(true)}> <FontAwesomeIcon className='btn-icon-modal' icon={faPlus}></FontAwesomeIcon></Button>
                                                    </div>

                                                    <div className="col-11">
                                                        <Select2_
                                                            estado={idClasificaion}
                                                            cambiarEstado={setIdClasificacion}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={clasificacionDB}
                                                            etiqueta='Clasificacion de gasto'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Button className="btn-nuevo-modal col-auto" onClick={() => setModalInsertarClasificacion(true)}> <FontAwesomeIcon className='btn-icon-modal' icon={faPlus}></FontAwesomeIcon></Button>
                                                    </div>

                                                    <div className="col-9">
                                                        <Select1
                                                            estado={tipoPago}
                                                            cambiarEstado={setTipoPago}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={listaTipo}
                                                            etiqueta='Tipo de Transaccion'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-3 mt-4 pl-3 ">
                                                        <ComponenteCheckFactura
                                                            etiqueta='Archivo'
                                                            check={asignarArchivo}
                                                            setCheck={setAsignarArchivo}
                                                            cambiarEstado={setEstadoCheck}
                                                        />
                                                    </div>
                                                </div>
                                                {asignarArchivo === 1 &&
                                                    <div className='groupInput row'>
                                                        <p className='titleGroup'>Foto del archivo</p>
                                                        <div className='col-12'>
                                                            <ComponenteInputFile
                                                                estado={file}
                                                                cambiarEstado={setFile}
                                                                name='imagenFile'
                                                                // etiqueta={'seleccionar imagen'}
                                                                ExpresionRegular={INPUT.IMG}
                                                            />
                                                        </div>
                                                    </div>}
                                            </ModalBody>
                                            <div className="row botonModal">
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalInsertar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insert()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Añadir gasto
                                                </Button>
                                            </div>
                                        </Modal>




                                        <Modal isOpen={modalEditar}>
                                            <div className='titloFormulario' >
                                                Actualizar Registro
                                            </div>
                                            <ModalBody>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <p className='titleDetalle'>{'SALDO EN CAJA :  ' + (nombreVentanaMOnto - montoGastado) + '  Bs.'}</p>
                                                    </div>
                                                    <div className='col-6'>
                                                        <p className='titleDetalle'>{'MONTO ASIGNADO :  ' + (nombreVentanaMOnto) + '  Bs.'}</p>

                                                    </div>
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Datos generales</p>
                                                    <div className="col-6">
                                                        <ComponenteInputfecha
                                                            estado={fecha}
                                                            cambiartipo={setFecha}
                                                            name="fecha"
                                                            ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                            etiqueta='Fecha'
                                                            msg='Seleccione una fecha especifica'
                                                        />
                                                    </div><div className=" col-6">
                                                        <ComponenteInputUser
                                                            estado={monto}
                                                            cambiarEstado={setMonto}
                                                            name="egreso"
                                                            placeholder="EGRESO"
                                                            ExpresionRegular={INPUT.NUMEROS_P}  //expresion regular
                                                            etiqueta='Egreso'
                                                            msg='Este campo es numérico'
                                                        />
                                                    </div>
                                                    <div className=" col-12">
                                                        <ComponenteInputUser
                                                            estado={descripcion}
                                                            cambiarEstado={setDescripcion}
                                                            name="monto"
                                                            placeholder=" DESCRIPCION"
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                                            etiqueta='Descripcion'
                                                            msg='Este acepta letra numero letras y caracteres'
                                                        />
                                                    </div>

                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Caracteristicas del gasto</p>
                                                    <div className="col-2 pt-4">
                                                        <ComponenteCheckFactura
                                                            etiqueta='Factura'
                                                            check={factura}
                                                            setCheck={setFactura}
                                                            cambiarEstado={setEstadoCheck}

                                                        />
                                                    </div>
                                                    <div className=" col-10">
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
                                                    <div className="col-6">
                                                        <Select2_
                                                            estado={idTipo}
                                                            cambiarEstado={setIdTipo}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={tipoDB}
                                                            etiqueta='Tipo de gasto'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <Select2_
                                                            estado={idProveedor}
                                                            cambiarEstado={setIdProveedor}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={proveedor}
                                                            etiqueta='Proveedor'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Button className="btn-nuevo-modal col-auto" onClick={() => setModalInsertarProveedor(true)}> <FontAwesomeIcon className='btn-icon-modal' icon={faPlus}></FontAwesomeIcon></Button>
                                                    </div>

                                                    <div className="col-11">
                                                        <Select2_
                                                            estado={idClasificaion}
                                                            cambiarEstado={setIdClasificacion}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={clasificacionDB}
                                                            etiqueta='Clasificacion de gasto'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Button className="btn-nuevo-modal col-auto" onClick={() => setModalInsertarClasificacion(true)}> <FontAwesomeIcon className='btn-icon-modal' icon={faPlus}></FontAwesomeIcon></Button>
                                                    </div>

                                                    <div className="col-9">
                                                        <Select1
                                                            estado={tipoPago}
                                                            cambiarEstado={setTipoPago}
                                                            name="idTipo"
                                                            ExpresionRegular={INPUT.ID}  //expresion regular
                                                            lista={listaTipo}
                                                            etiqueta='Tipo de Transaccion'
                                                            msg='Seleccione una opcion'
                                                        />
                                                    </div>
                                                    <div className="col-3 mt-4 pl-3 ">
                                                        <ComponenteCheckFactura
                                                            etiqueta='Archivo'
                                                            check={asignarArchivo}
                                                            setCheck={setAsignarArchivo}
                                                            cambiarEstado={setEstadoCheck}
                                                        />
                                                    </div>
                                                </div>
                                                {asignarArchivo === 1 &&
                                                    <div className='groupInput row'>
                                                        <p className='titleGroup'>Foto del archivo</p>
                                                        <div className='col-12'>
                                                            <ComponenteInputFile
                                                                estado={file}
                                                                cambiarEstado={setFile}
                                                                name='imagenFile'
                                                                // etiqueta={'seleccionar imagen'}
                                                                ExpresionRegular={INPUT.IMG}
                                                            />
                                                        </div>
                                                    </div>}
                                            </ModalBody>
                                            {/* <div className="row botonModal">
                                                <div className="col-auto">
                                                    <Button className='cancelarVentanaSolicitud' onClick={() => setModalEditar(false)} >Cancelar <span ><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                                </div>
                                                <div className="col-auto">
                                                    <Button className='Historial' onClick={() => update()}>Actualizar <span ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                                </div>
                                            </div> */}
                                            <div className="row botonModal">
                                                <Button className='btn-restaurar col-auto' onClick={() => setModalEditar(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar</Button>

                                                <Button className='btn-nuevo col-auto' onClick={() => update()} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar </Button>
                                            </div>

                                        </Modal>


                                        <Modal isOpen={modalInsertarClasificacion}>
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
                                                <Button className="btn-restaurar col-auto" onClick={() => setModalInsertarClasificacion(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insertarClasificacion()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Añadir clasificación
                                                </Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalInsertarProveedor}>

                                            <div className='titloFormulario' >
                                                Nuevo Proveedor
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
                                                            ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
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
                                                            estado={pais}
                                                            cambiarEstado={setPais}
                                                            name="pais"
                                                            placeholder="pais"
                                                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular
                                                            etiqueta='Pais'
                                                            msg={'Este campo solo admite letras'}
                                                        />
                                                    </div>
                                                    < div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                                        <ComponenteInputUser
                                                            estado={cuenta}
                                                            cambiarEstado={setCuenta}
                                                            name="cuenta"
                                                            placeholder="Cuenta "
                                                            ExpresionRegular={INPUT.CUENTA}  //expresion regular
                                                            etiqueta='Cuenta Bancaria'
                                                            msg={'Este campo solo admite números'}
                                                        />
                                                    </div>
                                                </div>
                                            </ModalBody>
                                            <div className="row botonModal">

                                                <Button className="btn-restaurar col-auto" onClick={() => { setModalInsertarProveedor(false) }} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                                </Button>
                                                <Button className="btn-nuevo col-auto" onClick={() => insertarProveedor()}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave}></FontAwesomeIcon>Añadir proveedor
                                                </Button>

                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                <div className='footer-pague'> @COPYRIGHT  <Link className='ml-3' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div>
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
export default Gastos;
