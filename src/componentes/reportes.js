import { Button, Modal, ModalBody, ToastHeader } from 'reactstrap';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faProjectDiagram, faUser, faDollarSign, faWindowClose, faDownload, faArrowCircleLeft, } from '@fortawesome/free-solid-svg-icons';

import Home from './elementos/home'
import { URL, INPUT } from '../Auth/config'  // variables globales que estan disponibles para todo el sistema client

import useAuth from "../Auth/useAuth" // verificacion de la existencia de la sesion
import { ComponenteInputfecha, Select2_, Select1 } from './elementos/input';  // componente input que incluye algunas de las
import axios from 'axios';

// import { utils, writeFile } from 'https://unpkg.com/xlsx/xlsx.mjs';
import { Toaster, toast } from 'react-hot-toast'
const ExcelJS = require('exceljs')




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
    const [dataGasto, setDataGasto] = useState([]) // cantidad de solicitudes en inicio y registros
    const [dataAsignacion, setDataAsignacion] = useState([]) // cantidad de solicitudes en inicio y registros


    const [ventana, setventana] = useState(1)
    const [modalproyecto, setmodalproyecto] = useState(false)
    const [modalpersona, setmodalpersona] = useState(false)
    const [modalestado, setmodalestado] = useState(false)
    const [modaltipo, setmodaltipo] = useState(false)
    const [totalAsignacion, setTotalAsignacion] = useState(0)
    const [totalGasto, setTotalGAsto] = useState(0)
    const [cantidadAsignacion, setCantidadAsignacion] = useState(0)
    const [cantidadGasto, setCantidadGasto] = useState(0)
    const [dataProyecto, setDataProyecto] = useState([])


    // titulo reportes

    const [nombreProyecto, setNombreProyecto] = useState(null)
    const [nombrePersonal, setNombrePersona] = useState(null)
    const [nombreAsignacion, setNombreAsignacion] = useState(null)
    const [nombreTipo, setNombreTipo] = useState(null)

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
            document.title = 'Reportes BSCH'
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
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto totalGasto', json.data.data[0], 'lista totalGasto' )

                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        // console.log(json.data.data[3], 'data asignacion',)
                        // console.log(json.data.data[0].totalgasto, 'gasto ', json.data.data[1].totalasignacion, 'asignacion')
                        setTotalGAsto(json.data.data[0].totalgasto)
                        setTotalAsignacion(json.data.data[1].totalasignacion)
                        setDataGasto(json.data.data[2])
                        setDataAsignacion(json.data.data[3])
                        setCantidadGasto(json.data.data[4].cantidadgasto)
                        setCantidadAsignacion(json.data.data[5].cantidadasignacion)
                        setDataProyecto(json.data.data[6])

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
                await axios.post(dir, { ini: fechaIni.campo, fin: fechaFin.campo, estado: idEstado.campo, persona: idPersona.campo }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto totalGasto', json.data.data[0], 'lista totalGasto' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        // console.log(json.data.data[3][0].proyecto, 'proyecto')
                        setTotalGAsto(json.data.data[0].totalgasto)
                        setTotalAsignacion(json.data.data[1].totalasignacion)
                        setDataGasto(json.data.data[2])
                        setDataAsignacion(json.data.data[3])
                        setCantidadGasto(json.data.data[4].cantidadgasto)
                        setCantidadAsignacion(json.data.data[5].cantidadasignacion)
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
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto totalGasto', json.data.data[0], 'lista totalGasto' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        setTotalGAsto(json.data.data[0].totalgasto)
                        setTotalAsignacion(json.data.data[1].totalasignacion)
                        setDataGasto(json.data.data[2])
                        setDataAsignacion(json.data.data[3])
                        setCantidadGasto(json.data.data[4].cantidadgasto)
                        setCantidadAsignacion(json.data.data[5].cantidadasignacion)
                        setDataProyecto(json.data.data[6])
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
                        // console.log(json.data.data[1], 'monto asignado', json.data.data[2], 'monto totalGasto', json.data.data[0], 'lista totalGasto' )
                        if (json.data.data[0].length == 0) {
                            toast.error('No hay datos para mostrar, seleccione otro parametros')
                            return
                        }
                        setTotalGAsto(json.data.data[0].totalgasto)
                        setTotalAsignacion(json.data.data[1].totalasignacion)
                        setDataGasto(json.data.data[2])
                        setDataAsignacion(json.data.data[3])
                        setventana(2)
                        setmodaltipo(false)
                        setSeccion(4)
                    } else toast.error(json.data.msg)
                })
            } else { toast.error('Seleccione todos los campos ') }
        }









        const descargar = () => {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'BSCH';
            workbook.lastModifiedBy = 'BSCH';

            const principal = workbook.addWorksheet('Panel', { views: [{ showGridLines: false }], properties: { tabColor: { argb: '28B463' } }, pageSetup: { paperSize: 9, orientation: 'landscape' }, })
            const asignaciones = workbook.addWorksheet('Asignaciones', { properties: { tabColor: { argb: '138D75' } }, pageSetup: { paperSize: 9, orientation: 'landscape' } });
            const gastos = workbook.addWorksheet('Gastos', { properties: { tabColor: { argb: '5499C7' } }, pageSetup: { paperSize: 9, orientation: 'landscape' } });

            asignaciones.properties.outlineLevelCol = 5;
            asignaciones.properties.outlineLevelRow = 5;
            asignaciones.properties.defaultRowHeight = 20;
            principal.properties.outlineLevelCol = 5;
            principal.properties.outlineLevelRow = 5;
            principal.properties.defaultRowHeight = 20;
            gastos.properties.outlineLevelCol = 5;
            gastos.properties.outlineLevelRow = 5;
            gastos.properties.defaultRowHeight = 20;


            // adjust pageSetup settings afterwards
            asignaciones.pageSetup.margins = {
                left: 0.7, right: 0.7,
                top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            };
            gastos.pageSetup.margins = {
                left: 0.7, right: 0.7,
                top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            };

            principal.pageSetup.margins = {
                left: 0.7, right: 0.7,
                top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            };


            const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            let dateIniFormato = new Date(fechaIni.campo.split('-')[0] + '/' + fechaIni.campo.split('-')[1] + '/' + fechaIni.campo.split('-')[2]).toLocaleDateString('es-ES', opciones);
            let dateFinFormato = new Date(fechaFin.campo.split('-')[0] + '/' + fechaFin.campo.split('-')[1] + '/' + fechaFin.campo.split('-')[2]).toLocaleDateString('es-ES', opciones)

            let estado_ = 'RENDIDO'
            if (seccion == 2 || seccion == 3) {
                estado_= nombreAsignacion
            }
            if (seccion === 1 || seccion === 3) {
                if (seccion === 1) {
                    principal.mergeCells('C2:N3')
                    principal.getCell('D2').value = 'REPORTE POR PROYECTO';
                    principal.getCell('D2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '138D75' }, }
                    principal.getCell('D2').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('D2').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };

                    principal.mergeCells('C4:N4');
                    principal.getCell('C4').value = dataAsignacion[0].proyecto;
                    principal.getCell('C4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '73C6B6' }, }
                    principal.getCell('C4').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('C4').font = { name: 'Arial', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };
                }
                if (seccion === 3) {
                    principal.mergeCells('C2:N3')
                    principal.getCell('D2').value = 'REPORTE POR ESTADO DE ASIGNACION';
                    principal.getCell('D2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '138D75' }, }
                    principal.getCell('D2').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('D2').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };

                    principal.mergeCells('C4:N4');
                    principal.getCell('C4').value = 'ESTADO '+estado_;
                    principal.getCell('C4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '73C6B6' }, }
                    principal.getCell('C4').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('C4').font = { name: 'Arial', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };
                }
                // total gastos 
                principal.mergeCells('C6:E6');
                principal.getCell('C6').value = 'MONTO PROYECTO';
                principal.getCell('C6').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('C6').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 10, italic: false };

                principal.mergeCells('F6:G6');
                principal.getCell('F6').value = 'Bs. ' + dataProyecto[0].total
                principal.getCell('F6').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('F6').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 10, italic: false };

                principal.mergeCells('C7:E7');
                principal.getCell('C7').value = 'TOTAL GASTO PROYECTO';
                principal.getCell('C7').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('C7').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 10, italic: false };

                principal.mergeCells('F7:G7');
                principal.getCell('F7').value = 'Bs. ' + dataProyecto[0].egreso
                principal.getCell('F7').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('F7').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 10, italic: false };

                principal.mergeCells('C9:E9');
                principal.getCell('C9').value = 'MONTO DISPONIBLE';
                principal.getCell('C9').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('C9').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

                principal.mergeCells('F9:G9');
                principal.getCell('F9').value = 'Bs. ' + (dataProyecto[0].total - dataProyecto[0].egreso)
                principal.getCell('F9').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('F9').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

                principal.mergeCells('C10:E10');
                principal.getCell('C10').value = '% DISPONIBLE';
                principal.getCell('C10').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('C10').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

                principal.mergeCells('F10:G10');
                principal.getCell('F10').value = (100 - ((dataProyecto[0].egreso * 100) / dataProyecto[0].total)).toFixed(3) + '%'
                principal.getCell('F10').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell('F10').font = { name: 'Arial Black', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };
            }

            if (seccion === 2) {
                principal.mergeCells('C2:N3')
                principal.getCell('D2').value = 'MONTOS POR REPORTAR PERSONAL';
                principal.getCell('D2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '138D75' }, }
                principal.getCell('D2').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell('D2').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };

                principal.mergeCells('C4:N4');
                principal.getCell('C4').value = dataAsignacion[0].personal;
                principal.getCell('C4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '73C6B6' }, }
                principal.getCell('C4').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell('C4').font = { name: 'Arial', color: { argb: 'ECF0F1' }, family: 2, size: 14, italic: false };

            }


            principal.mergeCells('H5:N5');
            principal.getCell('I5').value = dateIniFormato + '  al  ' + dateFinFormato
            principal.getCell('I5').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I5').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 10, italic: false };

            principal.getCell('I5').border = { bottom: { style: 'medium', color: { argb: '138D75' } } };
            principal.getCell('K5').border = { bottom: { style: 'medium', color: { argb: '138D75' } } };
            principal.getCell('L5').border = { bottom: { style: 'medium', color: { argb: '138D75' } } };
            principal.getCell('M5').border = { bottom: { style: 'medium', color: { argb: '138D75' } } };

            principal.mergeCells('I6:J6');
            principal.getCell('I6').value = 'Total Asignado';
            principal.getCell('I6').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I6').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

            principal.mergeCells('M6:N6');
            principal.getCell('M6').value = totalAsignacion?'Bs. ' + totalAsignacion:'Bs. 0'
            principal.getCell('M6').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('M6').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

            principal.mergeCells('I7:J7');
            principal.getCell('I7').value = 'Total Gasto';
            principal.getCell('I7').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I7').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

            principal.mergeCells('M7:N7');
            principal.getCell('M7').value = totalGasto ? 'Bs. ' + totalGasto:'Bs. 0'
            principal.getCell('M7').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('M7').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

            principal.mergeCells('H8:J8');
            principal.getCell('I8').value = 'Monto no Gastado';
            principal.getCell('I8').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I8').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };

            principal.mergeCells('M8:N8');
            principal.getCell('M8').value = 'Bs. ' + (totalAsignacion - totalGasto)
            principal.getCell('M8').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('M8').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 12, italic: false };


            principal.mergeCells('I9:L9');
            principal.getCell('I9').value = 'Item Asignaciones';
            principal.getCell('I9').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I9').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 11, italic: false };

            principal.mergeCells('M9:N9');
            principal.getCell('M9').value = cantidadAsignacion
            principal.getCell('M9').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('M9').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 11, italic: false };

            principal.mergeCells('I10:L10');
            principal.getCell('I10').value = 'Item Gastos';
            principal.getCell('I10').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('I10').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 11, italic: false };

            principal.mergeCells('M10:N10');
            principal.getCell('M10').value = cantidadGasto
            principal.getCell('M10').alignment = { vertical: 'center', horizontal: 'right' };
            principal.getCell('M10').font = { name: 'Arial', color: { argb: '616A6B' }, family: 2, size: 11, italic: false };






            principal.mergeCells('J14:N14');
            principal.getCell('J14').border = { bottom: { style: 'medium', color: { argb: '138D75' } } };

            principal.mergeCells('J15:N15');
            principal.getCell('J15').value = new Date().toLocaleDateString('es-ES', opciones);
            principal.mergeCells('C16:H16');
            principal.getCell('C16').value = '©EMPRESA CONSTRUCTORA BSCH';



            asignaciones.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
            ];

            asignaciones.getRow(1).font = {
                name: 'Roboto, sans-serif', family: 4, size: 10, bold: true, italic: true,
            }

            let celdas = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1']
            celdas.forEach(e => {
                asignaciones.getCell(e).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '138D75' },
                }
            })







            gastos.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
            ];

            gastos.getRow(1).font = {
                name: 'Roboto, sans-serif', family: 4, size: 10, bold: true, italic: true,
            }

            let celdasGastos = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1']
            celdasGastos.forEach(e => {
                gastos.getCell(e).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '5499C7' },
                    bgColor: 'white'
                }
            })



            asignaciones.getColumn(4).numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';
            asignaciones.columns = [
                { header: 'PERSONAL', key: 'PER', width: 25 },
                { header: 'PROYECTO', key: 'PRO', width: 25 },
                { header: 'DESCRIPCION', key: 'DESC', width: 40 },
                { header: 'MONTO', key: 'monto', width: 10 },
                { header: 'COMPROBANTE', key: 'COMP', width: 20 },
                { header: 'MÉTODO', key: 'MET', width: 15 },
                { header: 'ESTADO', key: 'EST', width: 12 },
                { header: 'ASIGNACION', key: 'FECHA', width: 18 },
                { header: 'RENDICION', key: 'FECHAREN', width: 15 },
                { header: 'APROBACION', key: 'FECHAAPRO', width: 15 }
            ];
            dataAsignacion.forEach(e => {
                let tipo = null
                if (e.tipo == 1) tipo = 'Efectivo'
                if (e.tipo == 2) tipo = 'Cheque'
                if (e.tipo == 3) tipo = 'Deposito'
                asignaciones.addRow([e.personal, e.proyecto, e.descripcion, 'Bs. ' + e.monto,
                e.comprobante, tipo, estado_, e.fechaasignacion, e.fecharendicion,
                e.fechaaprobacion])
            })

            const monto = asignaciones.getColumn(4)
            monto.eachCell((cell) => {
                const cellValue = asignaciones.getCell(cell?.address).value
                if (cellValue != '', cellValue != 'MONTO') {
                    asignaciones.getCell(cell?.address).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'A2D9CE' },
                    }
                }
            })


            gastos.views = [
                { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
            ];

            gastos.getColumn(10).numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';
            gastos.columns = [
                { header: 'PROYECTO', key: 'PRO', width: 25 },
                { header: 'PERSONAL', key: 'PER', width: 25 },
                { header: 'DESCRIPCION ASIGNACION', key: 'DESCA', width: 40 },
                { header: 'COMPROBANTE ASIGNACION', key: 'COMPA', width: 20 },
                { header: 'DESCRIPCION ', key: 'DESCG', width: 40 },
                { header: 'COMPROBANTE ', key: 'COMPG', width: 20 },
                { header: 'TIPO ', key: 'TIPOGA', width: 40 },
                { header: 'CLASIFICACION ', key: 'CLASG', width: 40 },
                { header: 'FECHA', key: 'FECHA', width: 20 },
                { header: 'EGRESO', key: 'EGR', width: 10 },
                { header: 'METODO PAGO', key: 'MET', width: 15 },
                { header: 'FACTURA', key: 'FAC', width: 15 },
                { header: 'PROVEEDOR', key: 'PROV', width: 13 },
            ];

            gastos.getColumn(1).hidden = true
            gastos.getColumn(2).hidden = true
            gastos.getColumn(3).hidden = true
            gastos.getColumn(4).hidden = true


            dataGasto.forEach(e => {
                let met = null
                if (e.metodo == 1) met = 'Efectivo'
                if (e.metodo == 2) met = 'Cheque'
                if (e.metodo == 3) met = 'Deposito'
                let fac = null
                if (e.facturagasto == 1) fac = 'SI'
                if (e.facturagasto == 0) fac = 'NO'
                gastos.addRow([e.proyecto, e.personal, e.descripcionasignacion,
                e.detalleasignacion, e.descripciongasto, e.detallegasto, e.tipogasto,
                e.clasificaciongasto, e.fechagasto, 'Bs. ' + e.egresogasto, met, fac, e.proveedor])
            })

            const egreso = gastos.getColumn(10)
            egreso.eachCell((cell) => {
                const cellValue = gastos.getCell(cell?.address).value
                if (cellValue != '', cellValue != 'EGRESO') {
                    gastos.getCell(cell?.address).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'A9CCE3' },
                    }
                }
            })

            // convinar celdar



            asignaciones.pageSetup.margins = {
                left: 0.7, right: 0.7,
                top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            };
            gastos.pageSetup.margins = {
                left: 0.7, right: 0.7,
                top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            };


            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'REPORTE DE GASTOS-BSCH.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
            })






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
                                    <div style={{ background: 'white' }}>

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

                                                {/* <div className='col-12 col-sm-6 col-md-6 col-lg-6' onClick={() => setmodaltipo(true)}>
                                                    <div className='card-type-information'>
                                                        Tipo
                                                        <p className='text-card-type-information'>Consultar por tipo registro</p>
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
                                                <div className='contenedor' style={{ height: '100%' }}>
                                                    {seccion == 1 && <div className='nombre-reporte' style={{ color: 'rgb(114, 114, 114)', fontWeight: 'bold', fontSize: '14px' }}>{'MODALIDAD DE REPORTE [POR PROYECTO] (PROYECTO ' + nombreProyecto + ')'}</div>}
                                                    {seccion == 2 && <div className='nombre-reporte' style={{ color: 'rgb(114, 114, 114)', fontWeight: 'bold', fontSize: '14px' }}>{'MODALIDAD DE REPORTE [POR PERSONAL] (PERSONAL ' + nombrePersonal + ')'}</div>}
                                                    {seccion == 3 &&
                                                        <>
                                                            <div className='nombre-reporte' style={{ color: 'rgb(114, 114, 114)', fontWeight: 'bold', fontSize: '16px' }}>{'MODALIDAD DE REPORTE [POR ESTADO DE ASIGNACION] '}</div>
                                                            <div className='nombre-reporte' style={{ color: 'rgba(255, 99, 132, 0.9)', fontWeight: 'bold', fontSize: '14px' }}>{'PROYECTO ' + nombreProyecto}</div>
                                                            <div className='nombre-reporte' style={{ color: 'rgba(53, 162, 235, 0.9)', fontWeight: 'bold', fontSize: '12px' }}>{'ESTADO ASIGNACIÓN (' + nombreAsignacion + ')'}</div>
                                                        </>}
                                                    {seccion == 4 && <>
                                                        <div className='nombre-reporte' style={{ color: 'rgb(114, 114, 114)', fontWeight: 'bold', fontSize: '16px' }}>{'MODALIDAD DE REPORTE [TIPO DE REGISTRO] '}</div>
                                                        <div className='nombre-reporte' style={{ color: 'rgba(255, 99, 132, 0.9)', fontWeight: 'bold', fontSize: '14px' }}>{'PROYECTO ' + nombreProyecto}</div>
                                                        <div className='nombre-reporte' style={{ color: 'rgba(53, 162, 235, 0.9)', fontWeight: 'bold', fontSize: '12px' }} >{'TIPO REGISTRO ' + nombreTipo}</div>
                                                    </>}
                                                    <label className='labels'>
                                                        {
                                                            fechaFin.valido === 'true' && fechaIni.valido === 'true' &&
                                                            fechaIni.campo + ' al ' + fechaFin.campo
                                                        }</label>

                                                    <div className='mt-3' style={{ borderBottom: "3px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Total Asignado</label>
                                                            <label className='col-2 labels float-left'>{totalAsignacion ? 'Bs. ' + totalAsignacion : ' 0 Bs.'}</label>
                                                        </div>
                                                    </div>

                                                    <div className=' mt-4' style={{ borderBottom: "3px solid rgba(53, 162, 235, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(53, 162, 235, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Monto totalGasto</label>
                                                            <label className='col-2 labels float-left'>{totalGasto ? 'Bs. ' + totalGasto : ' 0 Bs.'}</label>
                                                        </div>
                                                    </div>
                                                    <div className='mt-3' style={{ borderBottom: "3px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-8 labels float-left'>Saldo caja</label>
                                                            <label className='col-2 labels float-left'>{'Bs. ' + (totalAsignacion - totalGasto)}</label>
                                                        </div>
                                                    </div>
                                                    <br></br>
                                                    <br></br>

                                                    <div className='mt-3 col-12 col-sm-5 col-md-4 col-lg-4 ' style={{ borderBottom: "2px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv-1 col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-9 labels float-left' style={{ fontSize: '11px' }}>Asignaciones realizados</label>
                                                            <label className='col-2 labels float-left' style={{ fontSize: '11px' }}>{(cantidadAsignacion)}</label>
                                                        </div>
                                                    </div>

                                                    <div className='mt-3 col-12 col-sm-5 col-md-4 col-lg-4 ' style={{ borderBottom: "2px solid rgba(255, 99, 132, 0.5)" }}>
                                                        <div className='row' >
                                                            <div className='smalldiv-1 col-1' style={{ background: 'rgba(255, 99, 132, 0.5)' }}></div>
                                                            <label className='col-9 labels float-left' style={{ fontSize: '11px' }}>Gastos realizados</label>
                                                            <label className='col-2 labels float-left' style={{ fontSize: '11px' }}>{(cantidadGasto)}</label>
                                                        </div>
                                                    </div>
                                                    <div className="row botonModal pt-3">
                                                        <Button className='btn-nuevo col-auto' onClick={() => descargar()}>
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
