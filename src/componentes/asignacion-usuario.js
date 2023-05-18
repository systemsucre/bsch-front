
import React from 'react';

import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { ComponenteInputBuscar_ } from './elementos/input';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import Home from './elementos/home'
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';


function UsuarioAsignacion() {

    const [lista, setLista] = useState([]);
    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const auth = useAuth()

    try {

        useEffect(() => {
            if (inputBuscar.valido === null) listarUsuarios()
            if (inputBuscar.valido === 'false') listarUsuarios()
            document.title = 'Asignar Gastos'
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


        const buscar = () => {
            if (inputBuscar.valido === 'true') {
                axios.post(URL + '/usuario/buscar', { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)

                    } else toast.error(json.data.msg)
                })
            }
        }


        const siguiente = () => {
            let dir = URL + '/usuario/next'
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
            let dir = URL + '/usuario/anterior'
            if (lista.length > 0) {
                const last = lista[0].id
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
                                        Asignar gastos
                                    </div>
                                    <div style={{ background: 'white' }}>
                                        <div className='contenedor-cabecera'>
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
                                            <div className=" table table-responsive  custom">

                                                <Table className="table  table-sm">
                                                    <thead>
                                                        <tr >
                                                            <th className="col-2 ">C.I.</th>
                                                            <th className="col-3  ">Nombre</th>
                                                            <th className="col-2  ">Usuario</th>
                                                            <th className="col-2  ">Cel./Tel.</th>
                                                            <th className="col-1 "></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lista.map((u) => (

                                                            u.validar && (localStorage.getItem('username') != u.username) ?
                                                                <tr key={u.id} className='item' onClick={() => {
                                                                    localStorage.setItem('empleado', u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2);
                                                                    localStorage.setItem('idEmpleado', u.id)
                                                                }}>
                                                                    <td className="col-2 ">{u.ci}</td>
                                                                    <td className="col-3 ">{u.nombre + ' ' + u.apellido1 + ' ' + u.apellido2}</td>

                                                                    <td className="col-2  ">{u.username}</td>
                                                                    <td className="col-2  ">{u.celular}</td>
                                                                    <td className="col-1 largTable">
                                                                        <Link to='/asignaciones' className="btn-asignar-tabla">
                                                                            Asignar<FontAwesomeIcon className='btn-icon-asignar' icon={faArrowRight}></FontAwesomeIcon>
                                                                        </Link>
                                                                    </td>
                                                                </tr> : null
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

                                    </div>

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
        auth.logout()
    }

}
export default UsuarioAsignacion;
