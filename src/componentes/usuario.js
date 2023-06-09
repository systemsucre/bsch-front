
import React from 'react';

import { Table, Modal, ModalBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCaretLeft, faRecycle, faArrowAltCircleLeft, faArrowLeft, faArrowRight, faWindowClose, faToggleOff, faToggleOn, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { Select1, ComponenteInputUser, ComponenteInputBuscar_ } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import md5 from 'md5'
import { Link } from 'react-router-dom';



function Usuario() {

    const [lista, setLista] = useState([]);
    const [usuario, setUsuario] = useState([]);


    const [rol, setRol] = useState([])

    const [id, setId] = useState({ campo: null, valido: null })
    const [idRol, setIdRol] = useState({ campo: null, valido: null })
    const [sueldo, setSueldo] = useState({ campo: null, valido: null })
    const [username, setUsername] = useState({ campo: '', valido: null })
    const [password, setPassword] = useState({ campo: '', valido: null })
    const [nombre, setNombre] = useState({ campo: '', valido: null })
    const [ci, setCi] = useState({ campo: '', valido: null })
    const [apellidoPat, setApellidoPat] = useState({ campo: '', valido: null })
    const [apellidoMat, setApellidoMat] = useState({ campo: '', valido: null })
    const [telefono, setTelefono] = useState({ campo: '', valido: null })



    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [modalInsertar, setModalInsertar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [modalVer, setModalVer] = useState(false)
    const [enviado, setEnviado] = useState(0);


    const [eliminado, seteliminado] = useState(false)



    const [Pass1, setPass1] = useState({ campo: null, valido: null })
    const [Pass2, setPass2] = useState({ campo: null, valido: null })

    const [modalPass, setModalPass] = useState(false)



    const auth = useAuth()

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
            if (inputBuscar.valido === null && eliminado === false) listarUsuarios()
            if (inputBuscar.valido === 'false' && eliminado === false) listarUsuarios()

            if (inputBuscar.valido === null && eliminado === true) listarReciclaje()
            if (inputBuscar.valido === 'false' && eliminado === true) listarReciclaje()
            document.title = 'Usuarios'

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

        const listarUsuarios = async () => {
            try {
                axios.post(URL + '/usuario/all').then(json => {
                    if (json.data.ok)
                        setLista(json.data.data)
                    else toast.error(json.data.msg)
                })
            } catch (error) {
                return error
            }
        }
        const listarReciclaje = async () => {
            axios.post(URL + '/usuario/reciclaje').then(json => {
                if (json.data.ok) {
                    setLista(json.data.data)
                }
                else
                    toast.error(json.data.msg)
            })
        }

        const listarRol = async () => {
            axios.post(URL + '/usuario/rol').then(json => {
                setRol(json.data)
            })
        }

        const vaciarDatos = () => {
            setId({ campo: '', valido: null })
            setIdRol({ campo: '', valido: null })
            setIdRol({ campo: '', valido: null })
        }


        const rellenar = async () => {
            listarRol()
            setId({ campo: usuario[0].id, valido: 'true' })
            usuario[0].idRol ? setIdRol({ campo: usuario[0].idRol, valido: 'true' }) : setIdRol({ campo: null, valido: null })
            usuario[0].sueldo ? setSueldo({ campo: usuario[0].sueldo, valido: 'true' }) : setIdRol({ campo: null, valido: null })
            setNombre({ campo: usuario[0].nombre, valido: 'true' })
            setApellidoPat({ campo: usuario[0].apellido1, valido: 'true' })
            setApellidoMat({ campo: usuario[0].apellido2, valido: 'true' })
            setCi({ campo: usuario[0].ci, valido: 'true' })
            setTelefono({ campo: usuario[0].celular, valido: 'true' })
            setModalActualizar(true)
        }






        const eliminar = async (id = null) => {
            const ok = window.confirm('¿está seguro de eliminar este registro?');
            if (ok === true && id != null) {

                axios.post(URL + '/usuario/eliminar', { id: id, fecha: fechaHora }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        toast.success(json.data.msg)
                        setModalVer(false)
                    } else toast.error(json.data.msg)
                })
            }
        }


        const restaurar = async (ids) => {

            const ok = window.confirm('¿está seguro de restaurar este registro?');
            if (ok) {
                if (ids !== null) {

                    axios.post(URL + '/usuario/restaurar', { id: ids, fecha: fechaHora }).then(json => {
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
        const siguiente = () => {
            let dir = null
            if (eliminado)
                dir = URL + '/usuario/nextdelete'
            else dir = URL + '/usuario/next'

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
                dir = URL + '/usuario/anterioreliminados'
            else dir = URL + '/usuario/anterior'
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
                dir = URL + '/usuario/buscareliminados'
            else dir = URL + '/usuario/buscar'
            if (inputBuscar.valido === 'true') {
                console.log('pasa validaciones')

                axios.post(dir, { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok)
                        setLista(json.data.data)
                    else toast.error(json.data.msg)
                })
            }
        }


        const deshabilitar = async () => {
            const ok = window.confirm('Esta seguro de esta operacion ?');


            if (ok === true) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                if (id.valido === 'true') {
                    axios.post(URL + '/usuario/deshabilitar', {
                        id: id.campo,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        if (json.data.ok) {
                            setUsuario(json.data.data)
                            toast.success(json.data.msg)
                            setModalActualizar(false)
                        } else toast.error(json.data.msg)
                    })
                }
            }
        }

        const habilitar = async () => {
            const ok = window.confirm('Esta seguro de esta operacion ?');
            if (ok === true) {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                if (id.valido === 'true' && idRol.valido === 'true' && sueldo.valido === 'true') {
                    axios.post(URL + '/usuario/habilitar', {
                        id: id.campo,
                        idrol: idRol.campo,
                        sueldo: sueldo.campo,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        if (json.data.ok) {
                            setUsuario(json.data.data)
                            toast.success(json.data.msg)
                            setModalActualizar(false)
                        } else toast.error(json.data.msg)
                    })
                } else toast.error('seleccione el rol e inserte el sueldo')
            }
        }


        const verUsuario = (id) => {
            axios.post(URL + '/usuario/ver', { id: id }).then(json => {
                if (json.data.ok) {
                    setUsuario(json.data.data)
                    setModalVer(true)

                    setIdRol({ campo: json.data.data[0].idRol, valido: 'true' });
                    setSueldo({ campo: json.data.data[0].sueldo, valido: json.data.data[0].sueldo ? 'true' : null })
                    setId({ campo: json.data.data[0].id, valido: 'true' })
                } else toast.error(json.data.msg)
            })
        }

        const cambiarContraseña = () => {
            if (Pass1.valido === 'true' && Pass2.valido === 'true') {
                if (Pass1.campo === Pass2.campo) {
                    let passMd5 = md5(Pass1.campo)
                    axios.post(URL + '/usuario/recet', { id: id.campo, pass1: passMd5, fecha: fechaHora }).then(j => {
                        if (j.data.ok) {
                            setModalPass(false)
                            toast.success(j.data.msg)
                            setPass1({ campo: null, valido: null })
                            setPass2({ campo: null, valido: null })
                        } else toast.error(j.data.msg)

                    })
                } else { toast.error('Confirme corresctamente su nueva contraseña'); return }
            }
            else { toast.error('Complete todos los campos'); return }
        }
        const insertar = async () => {

            if (idRol.valido === 'true' && username.valido === 'true' && password.valido === 'true' && telefono.valido === 'true' && ci.valido === 'true' &&
                nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true' && sueldo.valido === 'true' && enviado === 0) {
                setEnviado(1)
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                const pas = md5(password.campo)
                axios.post(URL + '/usuario/registrar', {
                    idrol: idRol.campo,
                    sueldo: sueldo.campo,
                    username: username.campo,
                    xyz: pas,
                    ci: ci.campo,
                    nombre: nombre.campo,
                    apellido1: apellidoPat.campo,
                    apellido2: apellidoMat.campo,
                    telefono: telefono.campo,
                    creado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {

                    if (json.data.ok) {
                        toast.success(json.data.msg)
                        setLista(json.data.data)
                        setModalInsertar(false)
                        setId({ campo: null, valido: null })
                        setPassword({ campo: null, valido: null })
                        setUsername({ campo: null, valido: null })
                        setIdRol({ campo: null, valido: null })
                        setSueldo({ campo: null, valido: null })
                        setNombre({ campo: null, valido: null })
                        setApellidoPat({ campo: null, valido: null })
                        setApellidoMat({ campo: null, valido: null })
                        setCi({ campo: null, valido: null })
                        setTelefono({ campo: null, valido: null })
                        setEnviado(0)

                    } else { toast.error(json.data.msg); setEnviado(0) }
                })
            } else toast.error('Complete todos los campos requeridos en el formulario')
        }

        const actualizar = async () => {

            if (id.valido === 'true' && idRol.valido === 'true' && telefono.valido === 'true' && ci.valido === 'true' &&
                nombre.valido === 'true' && apellidoPat.valido === 'true' && apellidoMat.valido === 'true' && sueldo.valido === 'true') {
                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                axios.post(URL + '/usuario/actualizar', {
                    id: id.campo,
                    idrol: idRol.campo,
                    sueldo: sueldo.campo,
                    ci: ci.campo,
                    nombre: nombre.campo,
                    apellido1: apellidoPat.campo,
                    apellido2: apellidoMat.campo,
                    telefono: telefono.campo,
                    modificado: fecha + ' ' + new Date().toLocaleTimeString()
                }).then(json => {

                    if (json.data.ok) {
                        toast.success(json.data.msg)
                        setUsuario(json.data.data)
                        setModalActualizar(false)
                        setId({ campo: null, valido: null })
                        setIdRol({ campo: null, valido: null })
                        setSueldo({ campo: null, valido: null })
                        setNombre({ campo: null, valido: null })
                        setApellidoPat({ campo: null, valido: null })
                        setApellidoMat({ campo: null, valido: null })
                        setCi({ campo: null, valido: null })
                        setTelefono({ campo: null, valido: null })
                    } else toast.error(json.data.msg)
                })
            } else toast.error('Complete todos los campos requeridos en el formulario')
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
                                        Gestionar Usuarios <span className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</span>
                                    </div >
                                    <div style={{ background: 'white' }}>
                                        <div className='contenedor-cabecera'>
                                            {eliminado === false &&
                                                <div className='row'>
                                                    <Button className="btn-nuevo col-auto" onClick={() => { setModalInsertar(true); listarRol() }} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlus}></FontAwesomeIcon>Registrar usuario
                                                    </Button>
                                                    <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); setInputBuscar({ campo: null, valido: null }); seteliminado(true) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                    </Button>
                                                </div>
                                            }
                                            {eliminado === true &&
                                                <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarUsuarios(); setInputBuscar({ campo: null, valido: null }) }} >
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
                                            <div className=" table table-responsive  custom" >

                                                <Table className="table  table-sm p-2 tabla-movil">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-1 ">C.I.</th>
                                                            <th className="col-2  ">Nombre</th>
                                                            <th className="col-1  ">Usuario</th>
                                                            <th className="col-1  ">Cel./Tel.</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lista.map((u) => (
                                                            u.validar === 1 ?
                                                                <tr key={u.id} className='item' onClick={() => {

                                                                    localStorage.setItem('empleado', u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2);
                                                                    localStorage.setItem('idEmpleado', u.id); verUsuario(u.id)
                                                                }}>

                                                                    <td className="col-1 ">{u.ci}</td>
                                                                    <td className="col-2 ">{u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2}</td>

                                                                    <td className="col-1  ">{u.username}</td>
                                                                    <td className="col-1  ">{u.celular}</td>


                                                                </tr> :
                                                                <tr key={u.id} className='item' style={{ background: '#F0E8E6' }} onClick={() => verUsuario(u.id)}>

                                                                    <td className="col-1 ">{u.ci}</td>
                                                                    <td className="col-2 ">{u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2}</td>

                                                                    <td className="col-1  ">{u.username}</td>
                                                                    <td className="col-1  ">{u.celular}</td>

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

                                    <Modal isOpen={modalVer}>

                                        {usuario.length > 0 &&
                                            <div className='titloFormulario' >
                                                DATOS DEL USUARIO
                                            </div>
                                        }
                                        <ModalBody>
                                            {usuario.length > 0 &&
                                                <div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Datos Generales
                                                        </div>
                                                        <p className='textoDetalle'>{'Usuario : ' + usuario[0].nombre + ' ' + usuario[0].apellido1 + ' ' + usuario[0].apellido2}</p>
                                                        <p className='textoDetalle'><span>Sueldo</span>{usuario[0].sueldo ? '  :  ' + usuario[0].sueldo + ' Bs.' : 'sin validar'}</p>
                                                        <p className='textoDetalle'>{'celular : ' + usuario[0].celular}</p>
                                                        <p className='textoDetalle'>{'usuario : ' + usuario[0].username}</p>
                                                        {usuario[0].validar ? null : <div className='titloFormulario' style={{ color: '#bb2124' }}>
                                                            USUARIO SIN HABILITAR
                                                        </div>}
                                                        {eliminado === false && <div className='contenedor-float'>
                                                            <Button className='btn-eliminar-float ' onClick={() => { eliminar(usuario[0].id) }}><FontAwesomeIcon className='btn-eliminar-eliminar' icon={faTrashAlt}></FontAwesomeIcon> Eliminar</Button>
                                                        </div>
                                                        }

                                                    </div>

                                                    <div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Privilegio
                                                            </div>
                                                            <p className='textoDetalle'><span> {usuario[0].rol}</span></p>
                                                        </div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Otra información
                                                            </div>
                                                            <p className='textoDetalle'><span>Ultima interaccion por : </span>{usuario[0].creador ? usuario[0].creador : 'sin validar'}</p>
                                                            <p className='textoDetalle'><span>Registro Creado en  </span>{usuario[0].fechacreacion ? '  :  ' + usuario[0].fechacreacion : 'Sin fecha'}</p>
                                                            <p className='textoDetalle'><span>ultima actualizacion  : </span>{usuario[0].fechamodificado ? usuario[0].fechamodificado : 'Todavia no se ha actualizado'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                            }
                                        </ModalBody>
                                        <div className="row botonModal">
                                            {
                                                eliminado === true && <>
                                                    <Button className='btn-restaurar col-auto' onClick={() => { setModalVer(false) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>

                                                    <Button className='btn-nuevo col-auto' onClick={() => restaurar(usuario[0].id)} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faWindowClose}></FontAwesomeIcon>Restaurar Registro </Button>

                                                </>
                                            }

                                            {eliminado === false && usuario.length > 0 && <>
                                                <Button className='btn-restaurar col-auto' onClick={() => {
                                                    setModalVer(false); listarUsuarios()
                                                }} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>


                                                <Button className='btn-nuevo col-auto' onClick={() => { rellenar() }}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar</Button>
                                                <Button className='btn-restaurar col-auto' onClick={() => {
                                                    setModalPass(true)
                                                }} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faLock}></FontAwesomeIcon>Reset</Button>

                                            </>
                                            }

                                        </div>
                                    </Modal>




                                    <Modal isOpen={modalInsertar}>

                                        <div className='titloFormulario' >
                                            Registrar usuario
                                        </div>
                                        <ModalBody>
                                            <div className='row'>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                    <Select1
                                                        estado={idRol}
                                                        cambiarEstado={setIdRol}
                                                        name="proyecto"
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={rol}
                                                        etiqueta={'Rol'}
                                                        msg='Seleccione una opción'
                                                    >
                                                    </Select1>
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                    <ComponenteInputUser
                                                        estado={sueldo}
                                                        cambiarEstado={setSueldo}
                                                        name="sueldo"
                                                        placeholder="Sueldo"
                                                        ExpresionRegular={INPUT.NUMEROS_P}
                                                        etiqueta={'Sueldo Bs.'}
                                                        msg='Campo Numérico'
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <ComponenteInputUser
                                                        estado={username}
                                                        cambiarEstado={setUsername}
                                                        name="username"
                                                        placeholder="Usuario"
                                                        ExpresionRegular={INPUT.INPUT_USUARIO}
                                                        etiqueta={'Usuario'}
                                                        campoUsuario={true}
                                                        msg='Este campo solo acepta letras'
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
                                                        msg='Este campo acepta todos los caracteres'

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
                                                        msg='Este campo acepta solo numeros'
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
                                                        msg='Este campo acepta solo letras'

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
                                                        msg='Este campo acepta solo letras'
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
                                                        msg='Este campo acepta solo letras'
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
                                                        msg='Este campo acepta solo números'

                                                    />
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <div className="row botonModal">
                                            <Button className='btn-restaurar col-auto' onClick={() => { setModalInsertar(false) }} >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar </Button>

                                            <Button className='btn-nuevo col-auto' onClick={() => insertar()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlus}></FontAwesomeIcon>Registrar</Button>
                                        </div>
                                    </Modal>


                                    <Modal isOpen={modalActualizar}>

                                        <div className='titloFormulario' >
                                            Actualizar Datos del usuario
                                        </div>
                                        <ModalBody>
                                            {usuario.length > 0 && <><div className='titleDetalle' >
                                                {usuario[0].validar === 0 ? <div style={{ color: '#bb2124', fontSize: '16px' }}>USUARIO SIN VALIDAR</div> : <div>USUARIO CON PERMISOS</div>}
                                            </div>
                                                <p className='textoDetalle mt-2'>{usuario[0].nombre + ' ' + usuario[0].apellido1 + ' ' + usuario[0].apellido2}</p></>}

                                            <div className='row mt-3 mb-2 pt-3 groupInput'>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                    <Select1
                                                        estado={idRol}
                                                        cambiarEstado={setIdRol}
                                                        name="proyecto"
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={rol}
                                                        etiqueta={'Rol'}
                                                    >
                                                    </Select1>
                                                </div>
                                                < div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                    <ComponenteInputUser
                                                        estado={sueldo}
                                                        cambiarEstado={setSueldo}
                                                        name="sueldo"
                                                        placeholder="Sueldo"
                                                        ExpresionRegular={INPUT.NUMEROS_P}
                                                        etiqueta={'Sueldo Bs.'}
                                                        msg='Campo Numérico'
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
                                        </ModalBody>
                                        {usuario.length > 0 &&
                                            <div className="row botonModal">
                                                <Button className='btn-restaurar col-auto' onClick={() => {
                                                    setModalActualizar(false)
                                                }} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>
                                                <Button className='btn-nuevo col-auto' onClick={() => { actualizar() }}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar</Button>

                                                {usuario[0].validar === 1 &&
                                                    <Button className='btn-restaurar col-auto' onClick={() => deshabilitar()}
                                                    >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faToggleOff}></FontAwesomeIcon>Deshabilitar</Button>
                                                }
                                                {usuario[0].validar === 0 &&
                                                    <Button className='btn-restaurar col-auto' onClick={() => habilitar()}
                                                    >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faToggleOn}></FontAwesomeIcon>Habilitar</Button>}
                                            </div>}
                                    </Modal>



                                    <Modal isOpen={modalPass}>
                                        <div className='titloFormulario' >
                                            CAMBIAR CONTRASEÑA
                                        </div>
                                        <ModalBody>
                                            {usuario.length > 0 && <><div className='titleDetalle' >
                                                {usuario[0].validar === 0 ? <div style={{ color: '#bb2124', fontSize: '16px' }}>USUARIO SIN VALIDAR</div> : <div>USUARIO CON PERMISOS</div>}
                                            </div>
                                                <p className='textoDetalle mt-2'>{usuario[0].nombre + ' ' + usuario[0].apellido1 + ' ' + usuario[0].apellido2}</p></>}
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">

                                                <ComponenteInputUser
                                                    estado={Pass1}
                                                    cambiarEstado={setPass1}
                                                    name="pass1"
                                                    placeholder="Nueva contraseña"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='Nueva contraseña'
                                                    campoUsuario={true}
                                                    msg='Complete este campo'
                                                /></div>
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">

                                                <ComponenteInputUser
                                                    estado={Pass2}
                                                    cambiarEstado={setPass2}
                                                    name="pass2"
                                                    placeholder="Confirmar Contraseña"
                                                    ExpresionRegular={INPUT.DIRECCION}  //expresion regular
                                                    etiqueta='Confirmar Contraseña"'
                                                    campoUsuario={true}
                                                    msg='Complete este campo'
                                                /></div>

                                        </ModalBody>
                                        <div className="row botonModal">
                                            <Button className="btn-restaurar col-auto" onClick={() => setModalPass(false)}  >
                                                <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cancelar
                                            </Button>
                                            <Button className="btn-nuevo col-auto" onClick={() => cambiarContraseña()}>
                                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Reiniciar contraseña
                                            </Button>
                                        </div>
                                    </Modal>
                                </div>
                                <div className='footer-pague'>©EMPRESA CONSTRUCTORA BSCH <Link className='ml-3' to={'#'} onClick={() => { window.location.href = 'https://wa.me/59171166513' }}>
                                    <span className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</span></Link> </div>
                            </div>
                        </div>
                    </div >
                </div >
                <Toaster position='top-right' />
            </div >
        );
    } catch (error) {
        auth.logout()
    }

}
export default Usuario;
