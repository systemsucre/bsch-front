import { Button, Modal, ModalBody } from 'reactstrap';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faProjectDiagram, faUser, faDollarSign, faWindowClose, faDownload, faArrowCircleLeft, } from '@fortawesome/free-solid-svg-icons';

import Home from './elementos/home'
import { URL, INPUT } from '../Auth/config'  // variables globales que estan disponibles para todo el sistema client

import useAuth from "../Auth/useAuth" // verificacion de la existencia de la sesion
import { ComponenteInputfecha, Select2_, Select1 } from './elementos/input';  // componente input que incluye algunas de las
import axios from 'axios';

// import { utils, writeFile } from 'https://unpkg.com/xlsx/xlsx.mjs';
import { utils, writeFile } from 'sheetjs-style';
import { Toaster, toast } from 'react-hot-toast'
import { Link } from 'react-router-dom';



function Reportes() {


    const [fechaIni, setFechaIni] = useState({ campo: null, valido: null })
    const [fechaFin, setFechaFin] = useState({ campo: null, valido: null })


    // const [cantidad, setCantidad] = useState([]) // cantidad de solicitudes en inicio y registros
    const [proyecto, setProyecto] = useState([]) // cantidad de solicitudes en inicio y registros
    const [persona, setPersona] = useState([]) // cantidad de solicitudes en inicio y registros
    const [tipo, setTipo] = useState([]) // cantidad de solicitudes en inicio y registros
    const estado = [{ id: 1, nombre: 'ASIGNADO' }, { id: 2, nombre: 'RENDIDO' }, { id: 3, nombre: 'APROBADO' }];    



    const [idPersona, setIdPersona] = useState({ campo: null, valido: null })
    const [idEstado, setIdEstado] = useState({ campo: null, valido: null })
    const [idTipo, setIdTipo] = useState({ campo: null, valido: null })
    const [idProyecto, setIdProyecto] = useState({ campo: null, valido: null })
    const [data, setData] = useState([]) // cantidad de solicitudes en inicio y registros


    const [ventana, setventana] = useState(1)
    const [modalproyecto, setmodalproyecto] = useState(false)
    const [modalpersona, setmodalpersona] = useState(false)
    const [modalestado, setmodalestado] = useState(false)
    const [modaltipo, setmodaltipo] = useState(false)
    const [total, setotal] = useState(0)
    const [modalclasifi, setmodalclasifi] = useState(false)
    const [gastado, setgastado] = useState(0)


    // titulo reportes

    const [nombreProyecto, setNombreProyecto] = useState(null)
    const [nombrePersonal, setNombrePersona] = useState(null)
    const [nombreAsignacion, setNombreAsignacion] = useState(null)
    const [nombreTipo, setNombreTipo] = useState(null)
    const [nombreClasifi, setNombreClasifi] = useState(null)

    const [seccion, setSeccion] = useState(0)

    const auth = useAuth()
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
        useEffect(() => {
            listarProyecto()
            listarPersonal()
            listarTipo()
        }, [])

        const listarProyecto = async () => {
            axios.post(URL + '/reportes/proyecto').then(json => {
                if (json.data.ok) setProyecto(json.data.data)
                else toast.error(json.data.msg)
            })
        }
        const listarPersonal = async () => {
            axios.post(URL + '/reportes/personal').then(json => {
                console.log(json.data.data, 'personal')
                if (json.data.ok) setPersona(json.data.data)
                else toast.error(json.data.msg)
            })
        }
        const listarTipo = async () => {
            axios.post(URL + '/reportes/tipo').then(json => {
                if (json.data.ok) setTipo(json.data.data)
                else toast.error(json.data.msg)
            })
        }




        const consultarPorProyecto = async () => {
            let dir = URL + '/reportes/porproyecto'
            if (fechaIni.valido === 'true' && fechaFin.valido === 'true' && idProyecto.valido === "true") {
                await axios.post(dir, { ini: fechaIni.campo, fin: fechaFin.campo, proyecto: idProyecto.campo }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto gastado', json.data.data[0], 'lista gastado' )

                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        console.log(json.data.data, 'monto asignado',)
                        setData(json.data.data[0])
                        setotal(json.data.data[1].total)
                        setgastado(json.data.data[2].total)
                        setventana(2)
                        setmodalproyecto(false)
                        setSeccion(1)
                    } else toast.error(json.data.msg)
                })
            } else { toast.error('Seleccione el rango de fecha y el proyecto ') }
        }
        const consultarPorPersona = async () => {
            let dir = URL + '/reportes/porpersona'
            if (fechaIni.valido === 'true' && fechaFin.valido === 'true' && idPersona.valido === "true") {
                await axios.post(dir, { ini: fechaIni.campo, fin: fechaFin.campo, persona: idPersona.campo }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto gastado', json.data.data[0], 'lista gastado' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        setData(json.data.data[0])
                        setotal(json.data.data[1].total)
                        setgastado(json.data.data[2].total)
                        setventana(2)
                        setmodalpersona(false)
                        setSeccion(2)
                    } else toast.error(json.data.msg)
                })
            } else { toast.error('Seleccione el rango de fecha y el personal ') }
        }

        const consultarPorEstado = async () => {
            let dir = URL + '/reportes/porestado'
            if (fechaIni.valido === 'true' && fechaFin.valido === 'true' && idEstado.valido === "true" && idProyecto.valido === 'true') {
                await axios.post(dir, { ini: fechaIni.campo, fin: fechaFin.campo, proyecto: idProyecto.campo, estado: idEstado.campo }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto gastado', json.data.data[0], 'lista gastado' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        setData(json.data.data[0])
                        setotal(json.data.data[1].total)
                        setgastado(json.data.data[2].total)
                        setventana(2)
                        setmodalestado(false)
                        setSeccion(3)
                    } else toast.error(json.data.msg)
                })
            } else { toast.error('Seleccione todos los campos ') }
        }

        const consultarPorTipo = async () => {
            let dir = URL + '/reportes/portipo'
            if (fechaIni.valido === 'true' && fechaFin.valido === 'true' && idTipo.valido === "true" && idProyecto.valido === 'true') {
                await axios.post(dir, { ini: fechaIni.campo, fin: fechaFin.campo, proyecto: idProyecto.campo, tipo: idTipo.campo }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto gastado', json.data.data[0], 'lista gastado' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        setData(json.data.data[0])
                        setotal(json.data.data[1].total)
                        setgastado(json.data.data[2].total)
                        setventana(2)
                        setmodaltipo(false)
                        setSeccion(4)
                    } else toast.error(json.data.msg)
                })
            } else { toast.error('Seleccione todos los campos ') }
        }






        const genExcel = () => {
            console.log(data, 'datos desde la base de datos')
            let name = 'REPORTE DE GASTOS MES ' + fechaIni.campo + '  HASTA ' + fechaFin.campo
            let defaultCellStyle = {
                font: {
                    name: "Verdana",
                    sz: 8,
                    color: "FF00FF88"
                },
                fill: {
                    fgColor: { rgb: "000000" }
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "red" } }
                },
            };

            var wb = utils.book_new();
            wb.Props = {
                Title: "INFORME DE GASTOS",
                Subject: "REPORTE EMPRESA CBS CHUQUISACA",
                Author: "SISTEMA DE INFORMACION DE CONTROL DE GASTOS",
                CreatedDate: new Date()
            };
            wb.SheetNames.push("REPORTES DE GASTOS"); // libro de trabajo


            const title1 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title2 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title3 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title4 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title5 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title6 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]
            const title7 = [{ fechaasignacion: '', montoasignado: 'wdwqdwqdwqd', fechagasto: 'dqwdwqdwqdwqd', descripcionasignacion: 'wdwqdwqdw', descripciongasto: '', gasto: '', comprobanteasignacion: '', comprobantegasto: '', proyecto: '', personal: '' }]



            data.unshift(title1)
            data.unshift(title2)
            data.unshift(title3)
            data.unshift(title4)
            data.unshift(title5)
            data.unshift(title6)
            data.unshift(title7)
            var ws = utils.json_to_sheet(data);


            utils.sheet_add_aoa(ws, [['', "", "", "", "", "", '', '']], { origin: 'A1' });
            if (seccion == 1) {
                utils.sheet_add_aoa(ws, [['', 'PROYECTO '+ nombreProyecto, "", '','',  '', "", "", '']], { origin: 'A2' });
                utils.sheet_add_aoa(ws, [['', 'MODALIDAD DE REPORTE [POR PROYECTO] En fecha : ' + new Date().toLocaleDateString()]], { origin: 'A3' });
            }
            if (seccion == 2) {
                utils.sheet_add_aoa(ws, [['', 'TRAB. '+ nombrePersonal,"", '','', '', "", "", '']], { origin: 'A2' });
                utils.sheet_add_aoa(ws, [['', 'MODALIDAD DE REPORTE [POR PERSONAL]  En fecha : ' + new Date().toLocaleDateString()]], { origin: 'A3' });
            }
            if (seccion == 3) {
                utils.sheet_add_aoa(ws, [['', 'PROYECTO ' + nombreProyecto,"", '', '',  '', '', "", '']], { origin: 'A1' });
                utils.sheet_add_aoa(ws, [['', 'ESTADO  ' + nombreAsignacion, "", '', '','', '', "", '']], { origin: 'A2' });
                utils.sheet_add_aoa(ws, [['', 'MODALIDAD DE REPORTE [POR ESTADO DE ASIGNACION]   En fecha : ' + new Date().toLocaleDateString()]], { origin: 'A3' });

            }
            if (seccion == 4) {
                utils.sheet_add_aoa(ws, [['', 'PROYECTO ' + nombreProyecto, '', "", '', '', '', "", '']], { origin: 'A1' });
                utils.sheet_add_aoa(ws, [['','TIPO REG.  ' + nombreTipo, '', "", '', '',  '', "", '']], { origin: 'A2' });
                utils.sheet_add_aoa(ws, [['', 'MODALIDAD DE REPORTE [tIPO DE REGISTRO] En fecha : ' + new Date().toLocaleDateString()]], { origin: 'A3' });

            }

            utils.sheet_add_aoa(ws, [['', '', '']], { origin: 'A4' });
            utils.sheet_add_aoa(ws, [['', 'MONTO ASIGNADO:   Bs. ', total]], { origin: 'A4' });
            utils.sheet_add_aoa(ws, [['', 'MONTO GASTADO:  Bs. ', gastado]], { origin: 'A5' });
            utils.sheet_add_aoa(ws, [['', 'MONTO DISPONIBLE:  Bs. ', (total - gastado)]], { origin: 'A6' });
            utils.sheet_add_aoa(ws, [['', "PROYECTO", "PERSONAL", "FECHA ASIGNACION", "MONTO ASIGNADO BS.", "DESCRIPCION ASIGNACION", "COMPROBANTE ASIGNACION", "FECHA GASTO", "DESCRIPCION GASTO", 'MONTO GASTADO BS.', 'COMPROBANTE GASTO']], { origin: 'A8' });

            ws["I1"].s = {
                font: {
                    name: 'times new roman',
                    sz: 0,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },

            };
            ws["A1"].s = {
                font: {
                    name: 'times new roman',
                    sz: 0,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },

            };
            // ws["A2"].s = {
            //     font: {
            //         name: 'times new roman',
            //         sz: 0,
            //         bold: true,
            //         color: { rgb: "FFFFFF" },
            //     },
            //     alignment: {
            //         vertical: 'center',
            //         horizontal: 'left'
            //     },


            // };
            // ws["B2"].s = {
            //     font: {
            //         name: 'times new roman',
            //         sz: 12,
            //         bold: true,
            //         color: { rgb: "000000" },
            //     },
            //     alignment: {
            //         vertical: 'center',
            //         horizontal: 'left'
            //     },



            // };

            // ws["C2"].s = {
            //     font: {
            //         name: 'times new roman',
            //         sz: 12,
            //         bold: true,
            //         color: { rgb: "000000" },
            //     },
            //     alignment: {
            //         vertical: 'center',
            //         horizontal: 'right'
            //     },

            //     fill: {
            //         fgColor: {
            //             rgb: "FFFF00"
            //         }
            //     },

            // };

            ws["D2"].s = {
                font: {
                    name: 'Verdana',
                    sz: 10,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'right'
                },


            };
            console.log('hasta aqui')


            ws["E2"].s = {
                font: {
                    name: 'verdana',
                    sz: 10,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'center'
                },


            };

            ws["E1"].s = {
                font: {
                    name: 'verdana',
                    sz: 10,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'center'
                },



            };
            ws["F2"].s = {
                font: {
                    name: 'Verdana',
                    sz: 10,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },


            };
            ws["G2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },


            };


            ws["I2"].s = {
                font: {
                    name: 'times new roman',
                    sz: 14,
                    bold: true,
                    color: { rgb: "000000" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },



            };

            ws["A1"].s = {
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "FFFFFF" } }
                },


            };
            ws["B8"].s = {
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["C8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["D8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["E8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["F8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["G8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["H8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["I8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["J8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["K8"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    vertical: 'center',
                    horizontal: 'left'
                },
                border: {
                    bottom: { style: 'medium', color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: {
                        rgb: "006572"
                    }
                }
            };
            ws["J1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
             
            };
            ws["K1"].s = {									// set the style for target cell
                font: {
                    name: 'arial',
                    sz: 9,
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
               
            };
            const vacio = data.reduce((w, r) => Math.max(w, 'este'.length + 2), 1);
            const fechaasignacion = data.reduce((w, r) => Math.max(w, 'estevfvsdvdsvd'.length + 15), 1);
            const montoasignado = data.reduce((w, r) => Math.max(w, 'este la cadena'.length ), 1);
            const fechagasto = data.reduce((w, r) => Math.max(w, 'estevfvsdvdsvd'.length +5), 1);
            const descripcionasignacion = data.reduce((w, r) => Math.max(w, 'este es '.length + 10), 1);
            const descripciongasto = data.reduce((w, r) => Math.max(w, 'este esF '.length + 20), 1);
            const gasto = data.reduce((w, r) => Math.max(w, 'este es NDJ'.length + 13), 1);
            const comprobantegasto = data.reduce((w, r) => Math.max(w, 'este es la cadena '.length + 2), 1);
            const personalExcel = data.reduce((w, r) => Math.max(w, 'este es la cadena mas '.length + 2), 1);



            ws["!cols"] = [{ wch: vacio }, { wch: fechaasignacion }, { wch: montoasignado }, { wch: fechagasto }, { wch: descripcionasignacion }, { wch: descripciongasto }, { wch: gasto },
            { wch: 15 }, { wch: 40 }, { wch: comprobantegasto }, { wch: 30 }, { wch: personalExcel }];

            wb.Sheets["REPORTES DE GASTOS"] = ws;
            writeFile(wb, name + '.xlsx', { defaultCellStyle: defaultCellStyle });
            data.shift()
            data.shift()
            data.shift()
            data.shift()
            data.shift()
            data.shift()
            data.shift()
        }


        return (
            <>
                <div className="hold-transition sidebar-mini" >
                    <div className="wrapper" >
                        <Home />
                        <div className="content-wrapper" >
                            <div className="content" >
                                <div className="container-fluid pt-1" >
                                    <div className='tituloPaginas'>
                                        Generación de Reportes
                                    </div >
                                    <div style={{ background: 'white'}}>

                                        {ventana === 1 &&
                                            <div className='row contenedor-reportes'>

                                                <div className='col-12 col-sm-6 col-md-6 col-lg-6 '>
                                                    <div className=' card-project ' onClick={() => setmodalproyecto(true)}>
                                                        <FontAwesomeIcon icon={faProjectDiagram}></FontAwesomeIcon>
                                                        <p className='text-card-project'>Consultar Por proyecto</p>
                                                    </div>
                                                </div>
                                                <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
                                                    <div className='card-personal' onClick={() => setmodalpersona(true)}>
                                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                                        <p className='text-card-personal'> Consultar por Personal</p>
                                                    </div>
                                                </div>
                                                <div className='col-12 col-sm-6 col-md-6 col-lg-6 '>
                                                    <div className='card-state' onClick={() => setmodalestado(true)} >
                                                        <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon>
                                                        <p className='text-card-state'>Consultar por Estado</p>
                                                    </div>
                                                </div>

                                                <div className='col-12 col-sm-6 col-md-6 col-lg-6' onClick={() => setmodaltipo(true)}>
                                                    <div className='card-type-information'>
                                                        Tipo
                                                        <p className='text-card-type-information'>Consultar por tipo registro</p>
                                                    </div>
                                                </div>

                                                {/* <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
                                                    <div className='card-clasification'>
                                                        Clasificación

                                                        <p className='text-card-clasification'>Consultar por clasificacion </p>
                                                    </div>
                                                </div> */}
                                            </div>
                                        }

                                        {ventana === 2 &&
                                            <>
                                                <div className='contenedor-cabecera'>
                                                    <div className='row '>
                                                        <Button className="btn-restaurar col-auto" onClick={() => setventana(1)} >
                                                            <FontAwesomeIcon className='btn-icon-eliminar' icon={faArrowCircleLeft}></FontAwesomeIcon>Volver
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className='contenedor'>
                                                    {seccion == 1 && <div className='nombre-reporte' style={{color:'rgb(114, 114, 114)', fontWeight: 'bold' ,fontSize :'14px'}}>{'MODALIDA DE REPORTE [POR PROYECTO] (PROYECTO ' + nombreProyecto + ')'}</div>}
                                                    {seccion == 2 && <div className='nombre-reporte' style={{color:'rgb(114, 114, 114)', fontWeight: 'bold' ,fontSize :'14px'}}>{'MODALIDAD DE REPORTE [POR PERSONAL] (PERSONAL ' + nombrePersonal + ')'}</div>}
                                                    {seccion == 3 &&
                                                        <>
                                                            <div className='nombre-reporte' style={{color:'rgb(114, 114, 114)', fontWeight: 'bold' ,fontSize :'16px'}}>{'MODALIDAD DE REPORTE [POR ESTADO DE ASIGNACION] '}</div>
                                                            <div className='nombre-reporte' style={{color:'rgba(255, 99, 132, 0.9)', fontWeight: 'bold' ,fontSize :'14px'}}>{'PROYECTO ' + nombreProyecto}</div>
                                                            <div className='nombre-reporte' style={{color:'rgba(53, 162, 235, 0.9)',fontWeight: 'bold' , fontSize:'12px'}}>{'ESTADO ASIGNACIÓN (' + nombreAsignacion+')'}</div>
                                                        </>}
                                                    {seccion == 4 && <>
                                                        <div className='nombre-reporte' style={{color:'rgb(114, 114, 114)', fontWeight: 'bold' ,fontSize :'16px'}}>{'MODALIDAD DE REPORTE [TIPO DE REGISTRO] '}</div>
                                                        <div className='nombre-reporte' style={{color:'rgba(255, 99, 132, 0.9)', fontWeight: 'bold' ,fontSize :'14px'}}>{'PROYECTO ' + nombreProyecto}</div>
                                                        <div className='nombre-reporte' style={{color:'rgba(53, 162, 235, 0.9)',fontWeight: 'bold' , fontSize:'12px'}} >{'TIPO REGISTRO ' + nombreTipo}</div>
                                                    </>}
                                                    <label className='labels'>
                                                        {
                                                            fechaFin.valido === 'true' && fechaIni.valido === 'true' &&
                                                            fechaIni.campo + ' al ' + fechaFin.campo

                                                            // new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaIni.campo))[0].toUpperCase() +
                                                            // new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaIni.campo)).substring(1) + ' ' + new Date().getFullYear() + ' al ' +
                                                            // new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaFin.campo))[0].toUpperCase() +
                                                            // new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaFin.campo)).substring(1) + ' ' + new Date().getFullYear()
                                                        }</label>

                                                    <div className='mt-3' style={{ borderBottom: "3px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Total Asignado</label>
                                                            <label className='col-2 labels float-left'>{total?'Bs. ' + total:' 0 Bs.'}</label>
                                                        </div>
                                                    </div>

                                                    <div className=' mt-4' style={{ borderBottom: "3px solid rgba(53, 162, 235, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(53, 162, 235, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Monto gastado</label>
                                                            <label className='col-2 labels float-left'>{gastado?'Bs. ' + gastado:' 0 Bs.'}</label>
                                                        </div>
                                                    </div>
                                                    <div className='mt-3' style={{ borderBottom: "3px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Saldo caja</label>
                                                            <label className='col-2 labels float-left'>{'Bs. ' + (total - gastado)}</label>
                                                        </div>
                                                    </div>
                                                    <div className="row botonModal pt-3">
                                                        <Button className='btn-nuevo col-auto' onClick={() => genExcel()}>
                                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faFileExcel} ></FontAwesomeIcon>Exportar Excel</Button>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <Modal isOpen={modalproyecto}>
                                            <div className='titloFormulario' >
                                                Reporte por Proyecto
                                            </div>
                                            <ModalBody>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Fecha (Asignación)</p>
                                                    <ComponenteInputfecha
                                                        estado={fechaIni}
                                                        cambiarEstado={setFechaIni}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha inicio'
                                                    />
                                                    <ComponenteInputfecha
                                                        estado={fechaFin}
                                                        cambiarEstado={setFechaFin}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta=' fecha fin'
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <Select1
                                                        name="proyecto"
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdProyecto}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={proyecto}
                                                        nombre={setNombreProyecto}
                                                        etiqueta='Proyecto'
                                                    />
                                                </div>

                                            </ModalBody>
                                            <div className="row botonModal">

                                                <Button className='btn-restaurar col-auto' onClick={() => setmodalproyecto(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>
                                                <Button className='btn-nuevo col-auto' onClick={() => consultarPorProyecto()} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faDownload} ></FontAwesomeIcon>Generar reporte</Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modalpersona}>
                                            <div className='titloFormulario' >
                                                Reporte por Personal
                                            </div>
                                            <ModalBody>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Fecha (Asignación)</p>
                                                    <ComponenteInputfecha
                                                        estado={fechaIni}
                                                        cambiarEstado={setFechaIni}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha inicio'
                                                    />
                                                    <ComponenteInputfecha
                                                        estado={fechaFin}
                                                        cambiarEstado={setFechaFin}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta=' fecha fin'
                                                    />
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Personal</p>
                                                    <Select1
                                                        name="personal"
                                                        estado={idPersona}
                                                        cambiarEstado={setIdPersona}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={persona}
                                                        nombre={setNombrePersona}
                                                        etiqueta='Personal'
                                                    />
                                                </div>

                                            </ModalBody>
                                            <div className="row botonModal">

                                                <Button className='btn-restaurar col-auto' onClick={() => setmodalpersona(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>
                                                <Button className='btn-nuevo col-auto' onClick={() => consultarPorPersona()} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faDownload} ></FontAwesomeIcon>Generar reporte</Button>
                                            </div>
                                        </Modal>


                                        <Modal isOpen={modalestado}>
                                            <div className='titloFormulario' >
                                                Reporte por estado de Asignación
                                            </div>
                                            <ModalBody>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Fecha (Asignación)</p>
                                                    <ComponenteInputfecha
                                                        estado={fechaIni}
                                                        cambiarEstado={setFechaIni}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha inicio'
                                                    />
                                                    <ComponenteInputfecha
                                                        estado={fechaFin}
                                                        cambiarEstado={setFechaFin}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta=' fecha fin'
                                                    />
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Estado de asignación</p>
                                                    <Select1
                                                        name="personal"
                                                        estado={idEstado}
                                                        cambiarEstado={setIdEstado}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={estado}
                                                        nombre={setNombreAsignacion}
                                                        etiqueta='Estado'
                                                    />
                                                </div>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Proyecto</p>
                                                    <Select1
                                                        name="proyecto"
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdProyecto}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={proyecto}
                                                        nombre={setNombreProyecto}
                                                        etiqueta='Proyecto'
                                                    />
                                                </div>

                                            </ModalBody>
                                            <div className="row botonModal">

                                                <Button className='btn-restaurar col-auto' onClick={() => setmodalestado(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>
                                                <Button className='btn-nuevo col-auto' onClick={() => consultarPorEstado()} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faDownload} ></FontAwesomeIcon>Generar reporte</Button>
                                            </div>
                                        </Modal>

                                        <Modal isOpen={modaltipo}>
                                            <div className='titloFormulario' >
                                                Reporte por Clasificación (Tipo)
                                            </div>
                                            <ModalBody>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Fecha(Asignación)</p>
                                                    <ComponenteInputfecha
                                                        estado={fechaIni}
                                                        cambiarEstado={setFechaIni}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta='Fecha inicio'
                                                    />
                                                    <ComponenteInputfecha
                                                        estado={fechaFin}
                                                        cambiarEstado={setFechaFin}
                                                        name="fechaini"
                                                        ExpresionRegular={INPUT.FECHA}  //expresion regular
                                                        etiqueta=' fecha fin'
                                                    />
                                                </div>
                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Tipo de registro</p>
                                                    <Select2_
                                                        name="personal"
                                                        estado={idTipo}
                                                        cambiarEstado={setIdTipo}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={tipo}
                                                        nombre={setNombreTipo}
                                                        etiqueta='Tipo'
                                                    />
                                                </div>

                                                <div className='groupInput row'>
                                                    <p className='titleGroup'>Proyecto</p>
                                                    <Select1
                                                        name="proyecto"
                                                        estado={idProyecto}
                                                        cambiarEstado={setIdProyecto}
                                                        ExpresionRegular={INPUT.ID}
                                                        lista={proyecto}
                                                        nombre={setNombreProyecto}
                                                        etiqueta='Proyecto'
                                                    />
                                                </div>

                                            </ModalBody>
                                            <div className="row botonModal">

                                                <Button className='btn-restaurar col-auto' onClick={() => setmodaltipo(false)} >
                                                    <FontAwesomeIcon className='btn-icon-eliminar' icon={faWindowClose}></FontAwesomeIcon>Cerrar </Button>
                                                <Button className='btn-nuevo col-auto' onClick={() => consultarPorTipo()} >
                                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faDownload} ></FontAwesomeIcon>Generar reporte</Button>
                                            </div>
                                        </Modal>


                                    </div>
                                </div>
                                {/* <div className='footer-pague'> @COPYRIGHT  <Link className='ml-5' to={'#'} onClick={()=>{window.location.href ='https://wa.me/59171166513'}}> 
                                <spam className='spam-footer'> Desarrollador: Gustavo Aguilar Torres</spam></Link> </div> */}

                            </div>
                        </div >
                    </div>
                    <Toaster position='top-right' />
                </div >
            </>
        );
    } catch (error) {
        auth.logout()
    }
}
export default Reportes;
