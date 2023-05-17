
import React from 'react';

import { Table, Modal, ModalBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCaretLeft, faRecycle, faArrowAltCircleLeft, faArrowLeft, faArrowRight, faWindowClose, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { Select1, ComponenteInputUser, ComponenteCheck, ComponenteInputBuscar_ } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'


function Usuario() {

    const [lista, setLista] = useState([]);
    const [usuario, setUsuario] = useState([]);

    const [modalEditar, setModalEditar] = useState(false);
    const [servicios, setServicios] = useState([])
    const [user, setUser] = useState([])
    const [rol, setRol] = useState([])

    const [id, setId] = useState({ campo: null, valido: null })
    const [idProyecto, setIdeProyecto] = useState({ campo: null, valido: null })
    const [idRol, setIdRol] = useState([])
    const [sueldo, setSueldo] = useState({ campo: null, valido: null })


    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [modalPrivilegios, setModalPrivilegios] = useState(false)
    const [modalVer, setModalVer] = useState(false)

    const [seleccion, setSeleccion] = useState([])
    const [seleccionMostrar, setSeleccionMostrar] = useState([])
    const [eliminado, seteliminado] = useState(false)



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
                if (json.data.ok)
                    setLista(json.data.data)
                else
                    toast.error(json.data.msg)
            })
        }
        const listarServicios = async () => {
            axios.post(URL + '/usuario/proyectos').then(json => {
                setServicios(json.data)
            })
        }
        const listarRol = async () => {
            axios.post(URL + '/usuario/rol').then(json => {
                setRol(json.data)
            })
        }

        const vaciarDatos = () => {
            setId({ campo: '', valido: null })
            setIdeProyecto({ campo: '', valido: null })
            setIdRol({ campo: '', valido: null })
        }


        const rellenar = async () => {
            listarServicios()
            listarRol()
            setModalPrivilegios(true)
        }



        const actualizarRol = async () => {

            let filtered = []
            seleccion.forEach(e => {
                if (e > 0 && e < 1000)
                    filtered.push(e)
            })

            // console.log(filtered);
            console.log(filtered, 'seleccion de todas los privilegios')


            if (seleccion.length > 0 && sueldo.valido === 'true' && idProyecto.valido === 'true') {

                let today = new Date()
                let fecha = today.toISOString().split('T')[0]
                console.log(filtered, 'seleccion de roles mas abajo')

                axios.post(URL + '/usuario/actualizarrol', {
                    id: id.campo,
                    sueldo: sueldo.campo,
                    idproyecto: idProyecto.campo,
                    modificado: fecha + ' ' + new Date().toLocaleTimeString(),
                    rol1: filtered
                }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data)

                        setUsuario(json.data.data)
                        setModalPrivilegios(false)
                        toast.success(json.data.msg)
                    } else toast.error(json.data.msg)
                })

            } else toast.error('Complete todos los campos')

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
                            setModalPrivilegios(false)
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
                if (id.valido === 'true') {
                    axios.post(URL + '/usuario/habilitar', {
                        id: id.campo,
                        modificado: fecha + ' ' + new Date().toLocaleTimeString()
                    }).then(json => {
                        if (json.data.ok) {
                            setUsuario(json.data.data)
                            toast.success(json.data.msg)
                            setModalPrivilegios(false)
                        } else toast.error(json.data.msg)
                    })
                }
            }
        }


        const verUsuario = (id) => {
            axios.post(URL + '/usuario/ver', { id: id }).then(json => {
                if (json.data.ok) {
                    setUsuario(json.data.data)
                    setModalVer(true)

                    let data = []
                    json.data.data.forEach(element => {
                        data.push(element.idRol)
                    });
                    setId({ campo: json.data.data[0].id, valido: 'true' });
                    setIdeProyecto({ campo: json.data.data[0].idproyecto, valido: 'true' });
                    setIdRol(data)
                    setSueldo({ campo: json.data.data[0].sueldo, valido: json.data.data[0].sueldo ? 'true' : null })
                    setUser(json.data.data)

                    json.data.data.forEach((x) => {
                        // console.log(x.idrol, 'niveles de accesos del usuario')
                        seleccion.push(parseInt(x.idrol))
                    })

                } else toast.error(json.data.msg)
            })
        }

        if(usuario.length>0)
            console.log( parseInt(localStorage.getItem('idEmpleado')), usuario[0].id, 'ids')
        return (
            <div>

                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper">
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content">
                                <div className="container-fluid pt-1">
                                    <div className='col-12 tituloPaginas'>
                                        Usuarios <spam className='text-eliminado'>{eliminado === false ? null : '[Elementos eliminados]'}</spam>
                                    </div >
                                    <div style={{ background: 'white' }}>
                                        <div className='contenedor-cabecera'>
                                            {eliminado === false &&
                                                <>

                                                    <Button className="btn-restaurar col-auto" onClick={() => { listarReciclaje(); seteliminado(true); setInputBuscar({ campo: null, valido: null }) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faRecycle}></FontAwesomeIcon>Ver reciclaje
                                                    </Button>
                                                </>
                                            }
                                            {eliminado === true &&
                                                <Button className="btn-nuevo col-auto" onClick={() => { seteliminado(false); listarUsuarios(); setInputBuscar({ campo: null, valido: null }) }} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faArrowAltCircleLeft}></FontAwesomeIcon>Regresar
                                                </Button>
                                            }

                                        </div>
                                        <div className='contenedor'>
                                            <div class="container-4">
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
                                            <div className=" table table-responsive  custom" style={{ height: '500px' }}>

                                                <Table className="table  table-sm p-2">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-1 ">C.I.</th>
                                                            <th className="col-2  ">Nombre</th>
                                                            <th className="col-2  ">Proyecto</th>
                                                            <th className="col-1  ">Usuario</th>
                                                            <th className="col-1  ">Cel./Tel.</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lista.map((u) => (
                                                            <>
                                                                {u.validar === 1 ?
                                                                    <tr key={u.id} className='item' onClick={() => {

                                                                        localStorage.setItem('empleado', u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2);
                                                                        localStorage.setItem('idEmpleado', u.id); verUsuario(u.id)
                                                                    }}>

                                                                        <td className="col-1 ">{u.ci}</td>
                                                                        <td className="col-2 ">{u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2}</td>
                                                                        <td className="col-2  ">{u.proyecto}</td>

                                                                        <td className="col-1  ">{u.username}</td>
                                                                        <td className="col-1  ">{u.celular}</td>


                                                                    </tr> :
                                                                    <tr key={u.id} className='item' style={{ background: '#F0E8E6' }} onClick={() => verUsuario(u.id)}>

                                                                        <td className="col-1 ">{u.ci}</td>
                                                                        <td className="col-2 ">{u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2}</td>
                                                                        <td className="col-2  ">{u.proyecto}</td>

                                                                        <td className="col-1  ">{u.username}</td>
                                                                        <td className="col-1  ">{u.celular}</td>

                                                                    </tr>}
                                                            </>
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
                                                        {eliminado === false &&  <div className='contenedor-float'>
                                                            <Button className='btn-eliminar-float ' onClick={() => { eliminar(usuario[0].id) }}><FontAwesomeIcon className='btn-eliminar-eliminar' icon={faTrashAlt}></FontAwesomeIcon> Eliminar</Button>
                                                        </div>
                                                        }

                                                    </div>
                                                    <div className='groupInput'>
                                                        <div className='titleDetalle' >
                                                            Proyecto asignado
                                                        </div>
                                                        <p className='textoDetalle'>{'Proyecto : ' + usuario[0].proyecto}</p>
                                                    </div>

                                                    <div>
                                                        <div className='groupInput'>
                                                            <div className='titleDetalle' >
                                                                Privilegios
                                                            </div>
                                                            <p className='textoDetalle'>{'Rol(es)'}</p>

                                                            {
                                                                usuario[0].rol ?
                                                                    usuario.map((ele) => (
                                                                        <li className='textoDetalle'>{ele.rol}</li>
                                                                    )) :
                                                                    <p className='textoDetalle'><span> Sin asignar roles </span></p>

                                                            }

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
                                                    <Button className='btn-restaurar col-auto' onClick={() => { setModalVer(false); setSeleccion([]) }} >
                                                        <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>

                                                    <Button className='btn-nuevo col-auto' onClick={() => restaurar(usuario[0].id)} >
                                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faWindowClose}></FontAwesomeIcon>Restaurar Registro </Button>

                                                </>
                                            }

                                            {eliminado === false && usuario.length > 0 && <>
                                                <Button className='btn-restaurar col-auto' onClick={() => { setModalVer(false); setSeleccion([]) }} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar ventana </Button>

                                                <Button className='btn-nuevo col-auto' onClick={() => { rellenar() }}>
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit}></FontAwesomeIcon>Actualizar</Button>


                                            </>
                                            }

                                        </div>
                                    </Modal>




                                    <Modal isOpen={modalPrivilegios}>

                                        <div className='titloFormulario' >
                                            Actualizar Datos
                                        </div>
                                        <ModalBody>
                                            {usuario.length > 0 && <><div className='titleDetalle' >
                                                {usuario[0].validar === 0 ? <div style={{ color: '#bb2124', fontSize: '16px' }}>USUARIO SIN VALIDAR</div> : <div>'USUARIO CON PERMISOS'</div>}
                                            </div>
                                                <p className='textoDetalle'>{usuario[0].nombre + ' ' + usuario[0].apellido1 + ' ' + usuario[0].apellido2}</p></>}

                                            <div className='row m-4 pt-3 groupInput'>

                                                {rol.map((x) => (

                                                    <div key={x.id} className="col-3 col-sm-3 col-md-4 col-lg-4 col-xl-3" >
                                                        {
                                                            <ComponenteCheck
                                                                id={x.id}
                                                                item={x.nombre}
                                                                admitidos={seleccion}
                                                                // funcion={asignarseleccion}
                                                                examen={usuario}
                                                                mostrar={setSeleccionMostrar}
                                                            />
                                                        }
                                                    </div>
                                                ))}
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-2 mt-0 pr-1">
                                                    <Select1
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdeProyecto}
                                                        name="proyecto"
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={servicios}
                                                        etiqueta={'Proyecto'}
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
                                            </div>
                                        </ModalBody>
                                        {usuario.length > 0 && <div className="row botonModal">
                                            <div className="col-auto">
                                                <Button className='cancelarVentanaSolicitud' onClick={() => { setModalPrivilegios(false) }} >Cerrar <span ><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                                            </div>
                                            <div className="col-auto">
                                                <Button className='actualizar' onClick={() => actualizarRol()}>Actualizar <span ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                                            </div>

                                            {usuario[0].validar === 1 &&
                                                <Button className='btn-deshabilitar col-auto' onClick={() => deshabilitar()}><FontAwesomeIcon className='btn-icon-deshabilitar' icon={faToggleOff}></FontAwesomeIcon>Deshabilitar </Button>
                                            }
                                            {usuario[0].validar === 0 &&
                                                <Button className='btn-deshabilitar col-auto' onClick={() => habilitar()}><FontAwesomeIcon className='btn-icon-deshabilitar' icon={faToggleOn}></FontAwesomeIcon>Habilitar </Button>
                                            }
                                        </div>}
                                    </Modal>
                                </div>
                                <div className='footer-pague'> @COPYRIGHT todos los derechos reservados <spam className='spam-footer'>Empresa Contructora BSCH 2023</spam></div>
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
