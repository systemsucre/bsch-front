import {
    LeyendaError, Input, Inputfecha, SelectStyle, InputDisabled, ContenedorCheck, InputArea, InputBuscador
} from './estilos';

import React from 'react';

import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faSearch, faNotesMedical, faCalendarAlt, faTrashAlt, faEdit, faCaretLeft, faCheck, faUpload, faCheckSquare, faExpandAlt, faAngleDown, faEraser, faDownload, faArrowRight, faImage, faImages, faList, faChair, faStream, faCode, faCalendarTimes, faCalendar, faQuestion } from '@fortawesome/free-solid-svg-icons';
import ReactPrint from 'react-to-print'
import { useRef } from 'react'

import './my_style.css';
import { URL } from '../../Auth/config';
import { useState, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast'

import Select from 'react-select';


const Select2_ = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, etiqueta, nombre = null, msg, important = true }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    // console.log(estado)
    const onChange_ = (e) => {
        // console.log(e, 'datos')
        cambiarEstado({ campo: e.value, valido: 'true' })
        // console.log(estado.campo)
    }
    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) {
                    funcion()
                }
                setMensaje(null)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }

    if (nombre) {
        lista.forEach(e => {
            // console.log(e, estado, 'nombre asignados sin el if')
            if (e.value == estado.campo) {
                // console.log(e, estado, 'asignado con if')
                nombre(e.label)
            }

        })
    }
    // console.log(estado, 'estado seleccionado')

    return (
        <div >
            <div className="field" style={{ position: 'relative' }}>
                <label>   {important ? etiqueta + '   *  ' : etiqueta}
                    <Select
                        name={Name}
                        onClick={validacion}
                        theme={(theme) => ({
                            ...theme,

                            borderRadius: 3,
                            border: 0,
                            colors: {
                                ...theme.colors,
                                primary25: 'primary50',
                                primary: '#17a2b8',
                            },
                        })}

                        // value={estado.campo}
                        // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                        // onBlur={validacion}  //si presionamos fuera del input
                        placeholder={'Seleccione'}
                        onChange={onChange_}
                        options={lista}
                    />

                    {/* <Select
                        name={Name}
                        className="form-control form-control-sm "
                        onChange={onChange}
                        // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                        // onBlur={validacion}  //si presionamos fuera del input
                        valido={estado.valido}
                        value={estado.campo || ''}
                        onClick={validacion}
                    >
                    </Select> */}
                    <LeyendaError>{mensaje}</LeyendaError>
                </label>
            </div>
        </div>
    )
}


const Select1 = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, nombre = null, funcion, etiqueta, msg }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    // console.log(estado)
    const onChange = (e) => {
        cambiarEstado({ campo: parseInt(e.target.value), valido: 'true' })
        // console.log(estado.campo)
    }
    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) {
                    funcion()
                }
                setMensaje(null)

                // nombre(lista[estado.campo].nombre)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }
    if (nombre) {
        lista.forEach(e => {
            // console.log(e, estado, 'nombre asignados sin el if')
            if (e.id == estado.campo) {
                // console.log(e, estado, 'asignado con if')
                nombre(e.nombre)
            }

        })
    }
    return (
        <div >
            <div className="field" style={{ position: 'relative' }}>
                <label>  {etiqueta + '   *  '}

                    <SelectStyle
                        name={Name}
                        className="form-control form-control-sm js-example-basic-multiple"
                        onChange={onChange}
                        // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                        // onBlur={validacion}  //si presionamos fuera del input
                        valido={estado.valido}
                        value={estado.campo || ''}
                        onClick={validacion}
                    >
                        <option>Seleccionar</option>

                        {lista.map((r) => (

                            <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                    </SelectStyle>
                    <LeyendaError>{mensaje}</LeyendaError>
                </label>
            </div>
        </div>
    )
}





const InputUsuario = ({ estado, cambiarEstado, tipo, name, placeholder, ExpresionRegular, eventoBoton, span }) => {

    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)

        }, 10000)
    }, [mensaje])

    // console.log(estado)
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value }) // cambiarEstado({ ...estado, campo: e.target})
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje('campo invalido !! ')
            }
        }
    }

    let tipoinput = ''
    if (tipo === 'password')
        tipoinput = tipo
    else
        tipoinput = 'text'

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            eventoBoton()
        }
    }

    return (
        <div>
            <div className="input-group mb-0" style={{ position: 'relative' }}>
                <Input
                    type={tipoinput}
                    className="form-control form-control-sm"
                    id={name}
                    name={name}
                    value={estado.campo || ''}
                    placeholder={placeholder}
                    onChange={onChange}
                    onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    onBlur={validacion}  //si presionamos fuera del input
                    onKeyDown={handleKeyPress}
                    valido={estado.valido}
                    style={{ fontSize: '12px', height: '20px' }}
                />

                <div className="input-group-append">
                    <div className="input-group-text styles" >
                        <span className={span}></span>
                    </div>
                </div>
            </div>
            {estado.valido === 'false' && <LeyendaError valido={estado.valido} >{mensaje}</LeyendaError>}
        </div>
    )
}

const ComponenteInputUser = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false, msg, important = true }) => {

    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        if (campoUsuario === true)
            cambiarEstado({ ...estado, campo: e.target.value })
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                setMensaje(null)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }


    return (
        <div >
            <div className=" field" style={{ position: 'relative', paddingBottom: '0px' }}>
                <label >{important ? etiqueta + '   *' : etiqueta}

                    <Input
                        type={tipo}
                        className="form-control form-control-sm"
                        id={name}
                        name={name}
                        expresionRegular={ExpresionRegular}
                        placeholder={placeholder}
                        value={estado.campo || ''}
                        onChange={onChange}
                        onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                        onBlur={validacion}  //si presionamos fuera del input
                        valido={estado.valido}
                    />
                    <LeyendaError>{mensaje}</LeyendaError>
                </label>
            </div>
        </div >

    )
}








const ComponenteInputUserDisabled = ({ estado, name, ExpresionRegular, span = '', etiqueta }) => {


    return (
        <div className="field" >
            <label> {etiqueta} </label>
            <InputDisabled
                type='text'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                value={estado.campo || ''}
                valido={estado.valido}
                toUpperCase
                disabled={true}
            />
            {span !== '' && <div className="input-group-append">
                <div className="input-group-text styles" >
                    <span className={span}></span>
                </div>
            </div>}
        </div>
    )
}


const ComponenteInputfecha = ({ estado, cambiarEstado, name, ExpresionRegular, etiqueta, msg }) => {

    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])
    // 
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})
        // console.log(estado)
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                setMensaje(null)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
        // console.log("fechas: ", estado)

    }

    return (
        <div>
            <div className="field" style={{ position: 'relative' }}>
                <label>{etiqueta + '   *'}
                    <Inputfecha
                        type='date'
                        className="form-control form-control-sm"
                        id={name}
                        name={name}
                        expresionRegular={ExpresionRegular}
                        min='1900-12-12'
                        // placeholder={placeholder}
                        value={estado.campo || ''}
                        onChange={onChange}
                        onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                        onBlur={validacion}  //si presionamos fuera del input
                        valido={estado.valido}
                    />
                    <LeyendaError  >{mensaje}</LeyendaError>
                </label>
            </div>
        </div >
    )
}


const ComponenteInputFile = ({ cambiarEstado, name, etiqueta, ExpresionRegular, msg }) => {

    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])


    const onchange = e => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(e.target.files[0].name)) {
                cambiarEstado(e.target.files[0])  //el valor del campo valido, debe ser una cadena 
                setMensaje(null)
            }
            else {
                toast.error('archivo invalido')
                cambiarEstado(null)
                setMensaje(msg)
            }
        }
    }

    // console.log(estado.campo.name)
    return (
        <div className=" field">
            <label >{etiqueta}
                < input
                    type='file'
                    className="form-control form-control-sm"
                    id={name}
                    name={name}
                    onChange={onchange}
                />
                <LeyendaError  >{mensaje}</LeyendaError>
            </label>
            <Toaster position='top-right' />
        </div>
    )
}

const ComponenteCheck = ({ id, item, admitidos, examen, mostrar }) => {

    const onChange = (e) => {
        if (e.target.checked) {
            admitidos.push(parseInt(e.target.value))
        }

        if (e.target.checked === false) {
            let indiceEliminar = null
            admitidos.forEach(x => {
                if (x == parseInt(e.target.value)) {
                    indiceEliminar = admitidos.indexOf(parseInt(e.target.value))
                    admitidos.splice(indiceEliminar, 1);
                }
            })
        }


        mostrar([])
        let nombres = []
        admitidos.forEach(x => {
            examen.forEach(y => {
                if (x === y.idItemServicio) {
                    nombres.push({ nombre: y.servicioSolicitado })
                }

            })
        })
        mostrar(nombres)
    }


    let check = false
    admitidos.forEach(e => {
        // console.log(e, id, 'comparacion')
        if (parseInt(id) === e) {
            check = true
        }
    })


    // console.log('seleccionados ', admitidos)

    return (
        <ContenedorCheck>
            <label htmlFor={id + 'ser'} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    name={id}
                    value={id}
                    id={id + 'ser'}
                    onChange={onChange}
                    defaultChecked={check}
                />
                <small>{item}</small>
            </label>
        </ContenedorCheck>
    )
}


const ComponenteCheckFactura = ({ check, setCheck, etiqueta, cambiarEstado }) => {

    const onChange = (e) => {
        if (e.target.checked) {
            setCheck(1)
            // cambiarEstado({campo:null, valido :'true'})
        }

        if (e.target.checked === false) {
            setCheck(0)
            //    cambiarEstado({campo:null, valido :null})
        }
    }


    let check_ = false
    if (check === 1)
        check_ = true

    // console.log('seleccionados ', check)

    return (
        <ContenedorCheck>
            <label htmlFor={'facturando'} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    onChange={onChange}
                    defaultChecked={check_}
                />
                <small>{etiqueta}</small>
            </label>
        </ContenedorCheck>
    )
}















































const ComponenteInputUserCodigo = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false }) => {

    const onChange = (e) => {
        if (campoUsuario === true)
            cambiarEstado({ ...estado, campo: e.target.value })
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }


    return (
        <div className="input-group form-inline ">
            <span className='btnIconoBuscador'><FontAwesomeIcon icon={faStream} /></span>
            <Input
                type={tipo}
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
            />
        </div>

    )
}

const ComponenteInputUserDiagnostico = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false }) => {

    const onChange = (e) => {
        if (campoUsuario === true)
            cambiarEstado({ ...estado, campo: e.target.value })
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }


    return (
        <div className="input-group form-inline ">
            <span className='btnIconoBuscador'>D.P.</span>
            {/* <FontAwesomeIcon icon={faStream} /> */}
            <Input
                type={tipo}
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
            />
        </div>
    )
}


const ComponenteInputfechaBuscar = ({ estado, cambiarEstado, name, ExpresionRegular, etiqueta }) => {


    // 
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})
        // console.log(estado)
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
        // console.log("fechas: ", estado)

    }

    return (
        <div className="input-group form-inline ">
            <span className='btnIconoBuscador'><FontAwesomeIcon icon={faCalendar} /></span>
            <Input
                type='date'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                min='1900-12-12'
                // placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
                toUpperCase
            />
        </div>
    )
}



















const ComponenteInputUserArea = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false }) => {

    const onChange = (e) => {
        if (campoUsuario === true)
            cambiarEstado({ ...estado, campo: e.target.value })
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }


    return (
        <div className=" field">
            <label >{etiqueta}</label>
            <InputArea
                type={tipo}
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
            />
        </div>
    )
}




const ComponenteInputUserRow = ({ estado, cambiarEstado, name, placeholder, ExpresionRegular, etiqueta, campoUsuario = false }) => {

    const onChange = (e) => {
        if (campoUsuario === true)
            cambiarEstado({ ...estado, campo: e.target.value })
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }

    return (
        <div className=" fieldRow">
            <label >{etiqueta + ': '}</label>
            <Input
                type='text'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
            />
        </div>
    )
}


const ComponenteInputBuscarPaciente = ({ estado, cambiarEstado, name, ExpresionRegular, etiqueta, placeholder, eventoBoton }) => {


    const onchange = (e) => {

        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})

    }

    const validacion = () => {
        if (ExpresionRegular) {

            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }

    }

    return (
        <div className='fieldBuscar'>
            <label>{etiqueta}</label>
            <div className="input-group form-inline">

                <Input
                    type='text'
                    value={estado.campo || ''}
                    id={name}
                    className="form-control form-control-sm"
                    name={name}
                    placeholder={placeholder}
                    onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    onBlur={validacion}  //si presionamos fuera del input
                    onChange={onchange}
                    valido={estado.valido}
                />
                <Button color="primary" className='btnIcono' onClick={eventoBoton}><FontAwesomeIcon icon={faSearch} /> </Button>
            </div>
        </div>
    )
}




const ComponenteInputBuscar = ({ estado, cambiarEstado, name, ExpresionRegular, placeholder, eventoBoton }) => {

    const onchange = (e) => {

        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})

    }

    const validacion = () => {
        if (ExpresionRegular) {

            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }

    }

    return (
        <div className="input-group form-inline ">
            <Input
                type='text'
                value={estado.campo || ''}
                id={name}
                className="form-control form-control-sm"
                name={name}
                placeholder={placeholder}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                onChange={onchange}
                valido={estado.valido}
            />
            <Button className='btnIcono' onClick={eventoBoton}><FontAwesomeIcon icon={faSearch} /> </Button>
        </div>
    )
}




const SelectRow = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, funcion2, etiqueta }) => {

    const onChange = (e) => {

        cambiarEstado({ campo: e.target.value, valido: 'true' })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                // console.log('servicio seleccionado: ', estado.campo)
                if (funcion) {
                    funcion()
                }
                if (funcion2) {
                    funcion2()
                }

            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }


    return (
        <div className="fieldRow ">
            <label>  {etiqueta} </label>

            <Select
                name={Name}
                className="form-control form-control-sm"
                onChange={onChange}
                // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                // onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
                value={estado.campo || ''}
                onClick={validacion}
            >
                <option>seleccione</option>
                {lista.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
            </Select>
        </div>
    )
}



const ComponenteCheckSiNo = ({ estado, cambiarEstado, name, etiqueta }) => {
    const onChange = (e) => {
        cambiarEstado({ campo: e.target.checked, valido: 'true' })
        console.log(estado)
    }

    return (
        <ContenedorCheck>
            <label htmlFor={name} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    name={name}
                    value={estado.campo}
                    id={name}
                    onChange={onChange}
                />
                {etiqueta}
            </label>
        </ContenedorCheck>
    )
}





const ComponenteInputfechaRow = ({ estado, cambiarEstado, name, ExpresionRegular, etiqueta }) => {

    // 
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})
        // console.log(estado)
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
        // console.log("fechas: ", estado)

    }

    return (
        <div className="fieldRow" >
            <label>{etiqueta}</label>
            <Inputfecha
                type='date'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                min='1900-12-12'
                // placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
                toUpperCase
            />
        </div>
    )
}


const ComponenteInputMes = ({ estado, cambiarEstado, name, ExpresionRegular, etiqueta, setIni, setFin, funcion }) => {

    const onChange = (e) => {
        // cambiarEstado({ campo: e.target.value, valido : 'true' }) // cambiarEstado({ ...estado, campo: e.target})
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ campo: e.target.value, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                let año = new Date(e.target.value + '-01').getFullYear();
                let mes = new Date(e.target.value + '-01').getMonth() + 1;


                const dias = new Date(año, mes + 1, 0).getDate()
                const ini = new Date(año, mes, 1).toISOString().split('T')[0]
                const fin = new Date(año, mes, dias).toISOString().split('T')[0]
                setIni({ campo: ini, valido: 'true' })
                setFin({ campo: fin, valido: 'true' })
                if (funcion)
                    funcion(ini, fin)
                console.log('fecha inicial y final resp', ini, fin)

            }
            else {
                cambiarEstado({ campo: null, valido: 'false' })
                console.log('fcha incompleto')
            }
        }
    }

    const validacion = () => {
        //     console.log('cambios')
        //     if (ExpresionRegular) {
        //         if (ExpresionRegular.test(estado.campo)) {
        //             cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
        //             console.log(estado.campo, new Date(estado.campo+'-01'),'mes actual en el componenete fecha')
        //         }
        //         else {
        //             cambiarEstado({ ...estado, valido: 'false' })
        //             console.log('fcha incompleto')
        //         }
        //     }
        //     // console.log("fechas: ", estado)

    }
    // console.log(estado)

    return (
        <div className="field" >
            <label>{etiqueta}</label>
            <Inputfecha
                type='month'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                min='1900-12-12'
                // placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
                toUpperCase
            />
        </div>
    )
}




const ComponenteInputHora = ({ estado, cambiarEstado, name, placeholder, ExpresionRegular, etiqueta }) => {

    // 
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value }) // cambiarEstado({ ...estado, campo: e.target})
        // console.log(estado)
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
        // console.log("fechas: ", estado)

    }

    return (
        <div className="field" >
            <label>{etiqueta}</label>
            <Inputfecha
                type='time'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                placeholder={placeholder}
                value={estado.campo || ''}
                onChange={onChange}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                valido={estado.valido}
            />
        </div>
    )
}

const ComponenteInputUserDisabledRow = ({ estado, name, ExpresionRegular, span = '', etiqueta }) => {


    return (
        <div className="fieldRow" >
            <label> {etiqueta} </label>
            <InputDisabled
                type='text'
                className="form-control form-control-sm"
                id={name}
                name={name}
                expresionRegular={ExpresionRegular}
                value={estado.campo || ''}
                valido={estado.valido}
                toUpperCase
                disabled={true}
            />
            {span !== '' && <div className="input-group-append">
                <div className="input-group-text styles" >
                    <span className={span}></span>
                </div>
            </div>}
        </div>
    )
}


const VerDependientes = ({ dependientes, cabeceras, actual, categoria, abrirModal }) => {

    // console.log('dependientes para item: ', categoria)
    return (
        dependientes.length > 0 ?
            <>
                <div className='row verSolicitud ' style={{ margin: '30px' }}>
                    <div className='col-5 fontTitulo'>
                        <label>{cabeceras[0]} </label>
                    </div>
                    <div className='col-7 fontContenido'>
                        <label>  {cabeceras[1]}</label>
                    </div>
                </div>
                {dependientes.map((d) => (
                    <div className='row verSolicitud' style={{ marginLeft: '30px' }} key={d.y}>
                        <div className='col-5 fontTitulo' >
                            {
                                d.x != null ? <label>{d.x + ' :  '} </label> : <label>{categoria + ' :  '} </label>
                            }
                        </div>
                        <div className='col-7 fontContenido' >
                            {categoria != null ? <Button>modificar</Button> : null}
                            <label>  {d.y}</label>
                        </div>
                    </div>
                ))}
                {categoria != null ? <Button onClick={() => abrirModal(true)}>agregar</Button> : null}

            </> :
            <div className='row verSolicitud' style={{ margin: '30px' }}>
                <div className='col-5 fontTitulo'>
                    <label>{'Total  ' + cabeceras[0] + ' :  '}</label>
                </div>
                <div className='col-7 fontContenido'>
                    <label>  {actual.length}</label>
                </div>
                {categoria != null && dependientes.length === 0 ?
                    <div className='col-12 fontContenido'>
                        <label  >{categoria}</label>
                        <p style={{ color: "red" }} >SIN COMPLEMENTOS</p>
                        <Button onClick={() => abrirModal(true)}>agregar</Button>

                    </div> : null
                }

            </div>

    )
}





















































const GenerarPdf = ({ informe, setEstado, lab, numero = null }) => {
    // console.log(lab[0][0].red, 'laboratorio')
    const ref = useRef()
    let hoy = new Date()
    let antes = new Date(informe[0].fechaNac) // formato: yyyy-MM-dd
    let edad1 = hoy.getFullYear() - antes.getFullYear()
    let mes = hoy.getMonth() - antes.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < antes.getDate())) {
        edad1--
    }
    let data = []
    let codigos = []
    informe.forEach(element => {
        data.push(element.codigo)
    });
    codigos = data.filter((item, index) => {
        return data.indexOf(item) === index
    })

    let tam = window.innerWidth
    return (
        <div className='row' style={{ background: 'white' }} >
            <div className='m-auto  col-12 col-sm-12 col-md-10 col-lg-8 ' style={{ background: 'white' }} >
                {/* style={{ paddingLeft: '100px', paddingRight: '0px', background: 'white' }} */}
                <div ref={ref} className='pl-xl-5 pr-xl-5 pl-lg-5 pr-lg-5 pl-md-5 pr-md-5  pl-sm-5 pr-sm-5 pl-0 pr-0 mt-5'>
                    <div className='title' style={{ padding: '5px' }}>
                        <img src="dist/img/sp.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                        <label>LABORATORIO DE ANALISIS CLINICO</label>
                    </div>
                    {/* <div style={{ fontSize: '15px', textAlign: 'center', margin: '20px' }}>Resultados siempre confiables</div> */}
                    <div style={{ fontSize: '12px', textAlign: 'center', margin: '10' }}>DATOS DEL PACIENTE</div>
                    <div className='row'>
                        <div className='col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12' >
                            <div style={{ height: '20px' }} ><label className='subtitulo'>NOMBRE  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].paciente}</label></div>
                            <div style={{ height: '20px' }}><label className='subtitulo'>FECHA DE NACIMIENTO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].fechaNac.split('T')[0]}</label></div>
                            <div style={{ height: '20px' }}><label className='subtitulo'> EDAD  </label><label style={{ fontSize: '12px' }}>{': ' + edad1 + ' años'}</label></div>
                            <div style={{ height: '20px' }}><label className='subtitulo'> SEXO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].sexo}</label></div>
                            <div style={{ height: '20px' }}><label className='subtitulo'> MEDICO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].solicitante}</label></div>
                        </div>
                        <div className='col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12'>
                            <div style={{ height: '20px' }} ><label className='subtitulo'> FECHA DE REPORTE  </label><label style={{ fontSize: '12px' }}>{' :  ' + informe[0].fechaHoraPublicacionRes.split('T')[0]}</label></div>
                            {/* {
                            informe.map((e) => (
                                e.encabezado === 1 &&
                                <div style={{ height: '20px' }}><label className='subtitulo'> {"Numero de muestra  " + "( " + e.prueba + ' )'}  </label><label style={{ fontSize: '12px' }}>{': ' + e.numIdentificacionLab}</label></div>

                            ))} */}
                        </div>
                    </div>

                    <div className="card-body table table-responsive mt-3" style={{ padding: '0px' }}>
                        <div style={{ height: '20px' }}><p className='subtitulo '> Servicios Solicitados </p></div>
                        <div className='table-responsive'>
                            <Table id="example12" className=" table table-sm">
                                <thead style={{ color: '#006572', background: 'white' }}>
                                    <tr >
                                        <th className="col-4 ">PARAMETRO</th>
                                        <th className="col-2 ">RESULTADO</th>
                                        <th className="col-2 ">UNIDAD</th>
                                        <th className="col-4 ">INDICE DE REFERENCIA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {codigos.map(cod => (
                                        informe.map(e => (
                                            cod === e.codigo &&
                                            <>
                                                {e.encabezado === 1 ?
                                                    <tr style={{ margin: '0px', padding: '0px', color: '#006572', fontSize: '14px' }} key={e.id}>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-4 ">{e.prueba}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-2 ">{e.resultado}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-2 ">{e.unidad ? e.unidad : 'No adminite'}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-4 ">{e.intervalo ? e.intervalo : 'No admite'}</td>
                                                    </tr> :
                                                    <tr style={{ margin: '0px', padding: '0px' }} key={e.id}>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-4 ">{e.prueba}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-2 ">{e.resultado}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-2 ">{e.unidad ? e.unidad : 'No adminite'}</td>
                                                        <td style={{ margin: '2px', padding: '2px' }} className="col-4 ">{e.intervalo ? e.intervalo : 'No admite'}</td>
                                                    </tr>
                                                }
                                            </>
                                        ))
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    <p className='nhc'> {'SERVICIO(S) SOLICITADO '}</p>
                    {codigos.map(cod => (
                        informe.map(e => (
                            cod === e.codigo && e.encabezado === 1 &&
                            <div key={e.id}>
                                <li key={e.id} style={{ color: '#006572', fontSize: '14px', margin: '2px', paddingBottom: '15px' }}>{e.prueba}</li>
                                {e.metodologia && <p style={{ fontSize: '11px', margin: '2px', padding: '2px' }}>{'APLICA LA METODOLOGIA ' + e.metodologia}</p>}


                            </div>
                        ))
                    ))}

                    <div style={{ textAlign: 'right' }}>

                        {informe[0].firma && <img src={URL + '/' + informe[0].firma} alt="frima concedida por El laboratorio de San Pedro Claver" style={{ width: '150px', fontSize: '10', height: '150px', margin: '10px' }} />}
                    </div>



                    <div className='mt-4' style={{ fontSize: '15px' }}><label className='subtitulo'>IMPORTANTE: Los resultados incluidos en este reporte no sustituyen la consulta médica. Para una interpretación adecuada,
                        es necesario que un médico los revise y coleccione con información clínica (signos, síntomas, antecedentes) y la obtenida de
                        otras pruebas complementarias. </label>
                    </div>

                    <div style={{ minHeigh: '20px', fontSize: '10px', color: '#757575', marginTop: '40px', fontFamily: 'Verdana' }}><p > {lab[0][0].red + '  -  ' + lab[0][0].nombre + '   |   ' + lab[0][0].direccion + '   ' + lab[0][0].telefono} </p></div>
                    {/* <div style={{ height: '20px', fontSize: '12px', color: '#757575', marginTop: '0px', fontFamily: 'Verdana' }}><p > {} </p></div> */}
                </div>
            </div>
            <div className='col-12 col-sm-12 col-md-2 col-lg-2 mt-5'>
                <div className='float-left'>
                    <div className='col-auto mb-2'>
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => setEstado(numero ? numero : 5)}>Cerrar <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    <div className='col-auto'>
                        {tam > 600 && <ReactPrint trigger={() => <Button className=' Historial ' >Imprimir <span className='btnNuevoIcono'><FontAwesomeIcon icon={faPrint}></FontAwesomeIcon></span> </Button>} content={() => ref.current} documentTitle={informe[0].fecha.split('T')[0] + '_' + informe[0].paciente} />}
                    </div>
                </div>
            </div>
        </div >
    )
}







const GenerarPdfTransfusional = ({ informe, setEstado, lab, numero = null }) => {
    // console.log(lab[0][0].red, 'laboratorio')
    const ref = useRef()
    let hoy = new Date()
    let antes = new Date(informe[0].fechaNac) // formato: yyyy-MM-dd
    let edad1 = hoy.getFullYear() - antes.getFullYear()
    let mes = hoy.getMonth() - antes.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < antes.getDate())) {
        edad1--
    }


    let tam = window.innerWidth
    return (
        <div className='mt-5 float-center' style={{ background: 'white' }} >
            {/* style={{ paddingLeft: '100px', paddingRight: '0px', background: 'white' }} */}
            <div ref={ref} className='col-12 pl-xl-5 pr-xl-5 pl-lg-5 pr-lg-5 pl-md-5 pr-md-5  pl-sm-5 pr-sm-5 pl-0 pr-0 mt-5'>
                <div className='title' style={{ padding: '5px' }}>
                    <img src="dist/img/sp.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                    <label>SERVICIOS TRANSFUSIONALES HOSP. SAN PEDRO CLAVER</label>
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center', margin: '10' }}>DATOS DEL PACIENTE</div>
                <div className='row'>
                    <div className='col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12' >
                        <div style={{ height: '20px' }} ><label className='subtitulo'>NOMBRE  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].paciente}</label></div>
                        <div style={{ height: '20px' }}><label className='subtitulo'>FECHA DE NACIMIENTO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].fechaNac.split('T')[0]}</label></div>
                        <div style={{ height: '20px' }}><label className='subtitulo'> EDAD  </label><label style={{ fontSize: '12px' }}>{': ' + edad1 + ' años'}</label></div>
                        <div style={{ height: '20px' }}><label className='subtitulo'> SEXO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].sexo}</label></div>
                        <div style={{ height: '20px' }}><label className='subtitulo'> MEDICO  </label><label style={{ fontSize: '12px' }}>{': ' + informe[0].solicitante}</label></div>
                    </div>
                    <div className='col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12'>
                        <div style={{ height: '20px' }} ><label className='subtitulo'> SOLICITUD RECEPCIONADA EN FECHA  </label><label style={{ fontSize: '12px' }}>{' :  ' + informe[0].fechaHoraPublicacionRes.split('T')[0]}</label></div>
                    </div>
                </div>

                <div className="card-body table table-responsive mt-3" style={{ padding: '0px' }}>
                    <div style={{ height: '20px' }}><p className='subtitulo '> Servicios Solicitados </p></div>
                    <div className='table-responsive'>
                        <Table id="example12" className=" table table-sm">
                            <thead style={{ color: '#006572', background: 'white' }}>
                                <tr >
                                    <th className="col-4 ">PARAMETRO</th>
                                    <th className="col-2 "></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    informe.map(e => (
                                        <tr style={{ margin: '0px', padding: '0px', color: '#006572', fontSize: '14px' }} key={e.id}>
                                            <td style={{ margin: '2px', padding: '2px' }} className="col-4 ">{e.prueba}</td>
                                            <td style={{ margin: '2px', padding: '2px' }} className="col-2 ">{e.resultado}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {informe[0].firma && <img src={URL + '/' + informe[0].firma} alt="frima concedida por El laboratorio de San Pedro Claver" style={{ width: '170px', fontSize: '10', height: '170px', margin: '30px' }} />}
                </div>

                <div style={{ height: '20px', fontSize: '12px', color: '#757575', marginTop: '40px', fontFamily: 'Verdana' }}><p > {lab[0][0].red + '  -  ' + lab[0][0].nombre} </p></div>
                <div style={{ height: '20px', fontSize: '12px', color: '#757575', marginTop: '0px', fontFamily: 'Verdana' }}><p > {lab[0][0].direccion + '   ' + lab[0][0].telefono} </p></div>
            </div>
            <div className='col-12'>
                <div className="card-footer clearfix">
                    <ul className="pagination pagination-sm m-0 float-right">
                        <button className='mt-3 mr-2 btnNuevo' onClick={() => setEstado(numero ? numero : 5)}>volver</button>
                        {tam > 600 && <ReactPrint trigger={() => <button className='mt-3 autorizar'><FontAwesomeIcon icon={faPrint} /> </button>} content={() => ref.current} documentTitle={informe[0].fecha.split('T')[0] + '_' + informe[0].paciente} />}
                    </ul>
                </div>
            </div>
        </div >
    )
}
















































































const VerSolicitud = ({ solicitud, abandonarVentanaVer, actualizarSolicitud, eliminarSolicitud, generarInforme, privilegios, setItem, verResultados, reportes = false }) => {
    let ventanaImagen = solicitud[0].rol || false
    let rol = 1
    if (ventanaImagen) {
        rol = solicitud[0].rol
    }
    // console.log(solicitud[0].rol, 'rol de usuario de servicios complementarios')
    // console.log(solicitud[0], 'publisher de la solicitud')

    return (
        <div className='row' style={{ background: '#e8e0d3' }}>
            <div className='col-11'>
                <div className='row'>
                    <div className='col-6 mt-5'>
                        {rol < 5 ? <div className='ItemSolicitado'>
                            <label className='titulo'>SERVICIOS SOLICITADOS</label>
                            {solicitud.map(s => (
                                <li className='nhc' key={s.servicioSolicitado}>  {s.servicioSolicitado} </li >
                            ))}
                        </div> :
                            <div className='ItemSolicitado'>
                                <label className='titulo'>SERVICIOS SOLICITADOS</label>
                                <div className='card-body table table-responsive' style={{ marginBottom: "0px", padding: '0px' }}>

                                    <Table style={{ border: 'none' }}>
                                        <thead>
                                            <tr >
                                                <th className="col-3"> SERVICIO</th>
                                                <th className="col-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                solicitud.map(e => (
                                                    <tr key={e.id} className='nhc'>
                                                        <td className='col-3' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.servicioSolicitado}</td>
                                                        {
                                                            solicitud[0].publisher === 1 && reportes === false &&
                                                            <td className='col-2' style={{ margin: "0px", padding: '3px', fontSize: '11px', textAlign: 'right' }} >
                                                                <Button className=' cancelarVentanaSolicitud ' style={{ height: '25px', width: '90%', textAlign: 'right' }}
                                                                    onClick={() => { setItem(e); verResultados(e) }}>
                                                                    VER RESULTADOS<span className='btnNuevoIcono'><FontAwesomeIcon icon={faImages}></FontAwesomeIcon></span> </Button>
                                                            </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>

                                </div>
                            </div>}
                    </div>
                    <div className='col-6 mt-3'>

                        <div className='paciente '><strong>{'PAC. ' + solicitud[0].paciente}</strong></div>
                        <p className='subPaciente'>{'CARNET IDENTIDAD ' + solicitud[0].ci}</p>

                        <div className='row pt-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faNotesMedical} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'SOLICITANTE: DR. ' + solicitud[0].solicitante}</strong></p>
                                <p className='diagnostico'><strong> {'DIAGNOSTICO PRELIMINAR : ' + solicitud[0].diagnostico}</strong></p>
                                <p className='codigoSol'>{'CODIGO SOLICITUD ' + solicitud[0].codigoSol}</p>
                                <p className='nhc'> {'NUMERO HISTORIAL CLINICO ' + solicitud[0].nhc}</p>
                                <p className='codigoSol'> {'SEGURO ' + solicitud[0].seguro}</p>
                            </div>
                        </div>

                        <div className='row pt-5 pb-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faCalendarAlt} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'FECHA SOLICITUD ' + solicitud[0].fecha + '  ' + solicitud[0].horaSol.split(':')[0] + ':' + solicitud[0].horaSol.split(':')[1]}</strong></p>
                                <p className='diagnostico'><strong><span>{"FECHA AUTORIZACION "}</span> {solicitud[0].fechaHoraAutorizacion ? solicitud[0].fechaHoraAutorizacion.split('T')[0] + '  ' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[1] : '-'}</strong></p>
                                <p className='codigoSol'><span>{'FECHA RECEPCION LABORATORIO '}</span> {solicitud[0].fechaRecLab ? solicitud[0].fechaRecLab.split('T')[0] + '   ' + solicitud[0].horaRecLab.split(':')[0] + ':' + solicitud[0].horaRecLab.split(':')[1] : '-'}</p>
                                <p className='codigoSol'><span>{'FECHA REPORTE DE RESULTADOS '}</span>  {solicitud[0].fechaHoraPublicacionRes ? solicitud[0].fechaHoraPublicacionRes.split('T')[0] + '         ' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[1] : '-'}</p>
                                <p className='genInforme pb-4'><span>{'FECHA GENERACION INFORME '}</span>   {solicitud[0].fechaGenInforme ? solicitud[0].fechaGenInforme.split('T')[0] + '  ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[0] + ' ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[1] : '-'} </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row p-2'>
                    <div className='col-auto '>
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => abandonarVentanaVer()}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    {
                        solicitud[0].estado === 0 && privilegios === 1 &&
                        <>
                            <div className='col-auto '>
                                <Button className=' Historial ' onClick={() => actualizarSolicitud()}>EDITAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>
                            </div>
                            <div className='col-auto '>
                                <Button className=' eliminarVentanaSolicitud ' onClick={() => eliminarSolicitud()}>ELIMINAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></span> </Button>
                            </div>
                        </>
                    }
                    {
                        solicitud[0].publisher === 1 && rol < 5 && reportes == false &&
                        <div className='col-auto '>
                            <Button className=' Historial ' onClick={() => generarInforme()}>GENERAR INFORME <span className='btnNuevoIcono'><FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon></span> </Button>
                        </div>
                    }
                </div>
            </div>
            <div className='col-1' style={{ background: '#062b48' }}>
            </div>
        </div >
    )
}












const VerSolicitudImagen = ({ solicitud, cerrar, openForm, reportar, rol, setItem }) => {

    let res = true
    solicitud.forEach(ele => {
        let i = solicitud.findIndex(e => e.id === ele.id)
        if (solicitud[i].resultado == null) {
            res = false
        }

    })

    return (
        <div className='row' style={{ background: '#e8e0d3' }}>
            <div className='col-11'>
                <div className='row'>
                    <div className='col-6 mt-5'>

                    </div>
                    <div className='col-6 mt-3'>

                        <div className='paciente '><strong>{'PAC. ' + solicitud[0].paciente}</strong></div>
                        <p className='subPaciente'>{'CARNET IDENTIDAD ' + solicitud[0].ci}</p>

                        <div className='row pt-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faNotesMedical} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'SOLICITANTE: DR. ' + solicitud[0].solicitante}</strong></p>
                                <p className='diagnostico'><strong> {'DIAGNOSTICO: ' + solicitud[0].diagnostico}</strong></p>
                                <p className='codigoSol'>{'CODIGO SOLICITUD ' + solicitud[0].codigoSol}</p>
                                <p className='nhc'> {'NUMERO HISTORIAL CLINICO ' + solicitud[0].nhc}</p>
                                <p className='codigoSol'> {'SEGURO ' + solicitud[0].seguro}</p>
                            </div>
                        </div>

                        <div className='row pt-5 pb-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faCalendarAlt} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'FECHA SOLICITUD ' + solicitud[0].fecha + '  ' + solicitud[0].horaSol.split(':')[0] + ':' + solicitud[0].horaSol.split(':')[1]}</strong></p>
                                <p className='diagnostico'><strong><span>{"FECHA AUTORIZACION "}</span> {solicitud[0].fechaHoraAutorizacion ? solicitud[0].fechaHoraAutorizacion.split('T')[0] + '  ' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[1] : '-'}</strong></p>
                                <p className='codigoSol'><span>{'FECHA RECEPCION LABORATORIO '}</span> {solicitud[0].fechaRecLab ? solicitud[0].fechaRecLab.split('T')[0] + '   ' + solicitud[0].horaRecLab.split(':')[0] + ':' + solicitud[0].horaRecLab.split(':')[1] : '-'}</p>
                                <p className='codigoSol'><span>{'FECHA REPORTE DE RESULTADOS '}</span>  {solicitud[0].fechaHoraPublicacionRes ? solicitud[0].fechaHoraPublicacionRes.split('T')[0] + '         ' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[1] : '-'}</p>
                                <p className='genInforme pb-4'><span>{'FECHA GENERACION INFORME '}</span>   {solicitud[0].fechaGenInforme ? solicitud[0].fechaGenInforme.split('T')[0] + '  ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[0] + ' ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[1] : '-'} </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row p-2'>
                    <div className='col-auto '>
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => cerrar(1)}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    <div className='col-auto '>
                        {solicitud[0].resultadoRecibido === 0 && rol < 4 && <Button className=' Historial ' onClick={() => openForm()}>EDITAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>}
                    </div>
                    <div className='col-auto '>
                        {res && solicitud[0].resultadoRecibido === 0 && rol != 4 && <Button className=' reportar ' onClick={() => reportar()}>REPORTAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></span> </Button>}
                    </div>
                </div>
            </div>
            <div className='col-1' style={{ background: '#062b48' }}>
            </div>
        </div>
    )
}
































const TituloPagina = ({ titulo }) => {
    return (
        <div className='titlePage' style={{ textAlign: "left", background: '#6ebdC9', paddingLeft: '6px' }}>
            {titulo}
        </div>
    )
}





const ComponenteInputBuscar_ = ({ estado, cambiarEstado, name, ExpresionRegular, placeholder, eventoBoton, etiqueta }) => {

    const onchange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})
    }
    const validacion = () => {
        if (ExpresionRegular) {

            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13 && estado.valido === 'true') {
            eventoBoton()
        }
    }

    return (
        <div className="fieldRow" >
            <label>{etiqueta + '  :   '}</label>
            <InputBuscador
                type='text'
                value={estado.campo || ''}
                id={'idBuscador'}
                className="form-control form-control-sm "
                name={name}
                placeholder={placeholder}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                onChange={onchange}
                valido={estado.valido}
                onKeyDown={handleKeyPress}
            // keyup = {teclaenter}
            />
            <button className="icon" onClick={eventoBoton}> <FontAwesomeIcon icon={faSearch} /></button>
        </div>
    )
}

const VerSolicitudComplementarios = ({ solicitud, cerrar, openForm, reportar, rol, setItem }) => {

    let res = true
    solicitud.forEach(ele => {
        let i = solicitud.findIndex(e => e.id === ele.id)
        if (solicitud[i].resultado == null) {
            res = false
        }

    })

    let data = []
    let codigos = []
    solicitud.forEach(element => {
        data.push(element.codigo)
    });
    codigos = data.filter((item, index) => {
        return data.indexOf(item) === index
    })

    return (
        <div className='row' style={{ background: '#e8e0d3' }}>
            <div className='col-11'>
                <div className='row'>
                    <div className='col-6 mt-0'>
                        <div className='ItemSolicitado'>
                            <label className='titulo'>SERVICIOS SOLICITADOS</label>
                            <div className='card-body table table-responsive' style={{ marginBottom: "0px", padding: '0px' }}>
                                {rol === 4 && <Table style={{ border: 'none' }}>
                                    <thead>
                                        <tr >
                                            <th className="col-3"> SERVICIO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            solicitud.map(e => (
                                                <tr key={e.id} className='nhc'>
                                                    <td className='col-3' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.servicioSolicitado}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>}
                                {(rol > 4 && rol < 9) &&
                                    <Table style={{ border: 'none' }}>
                                        <thead>
                                            <tr >
                                                <th className="col-3"> SERVICIO</th>
                                                <th className="col-1"></th>
                                                <th className="col-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                solicitud.map(e => (
                                                    <tr key={e.id} className='nhc'>
                                                        <td className='col-3' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.servicioSolicitado}</td>

                                                        {e.parcial === 1 && <td className="col-1 largTable">
                                                            <FontAwesomeIcon icon={faCheck} className='botonImagenOK' />
                                                        </td>}

                                                        {e.parcial === 0 && <td className="col-1 largTable">
                                                            <FontAwesomeIcon icon={faQuestion} className='botonImagenFalse' />
                                                        </td>}


                                                        {
                                                            solicitud[0].resultadoRecibido === 0 ?
                                                                <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px', textAlign: 'right' }} >
                                                                    <Button className=' Historial ' style={{ height: '25px', width: '90%' }}
                                                                        onClick={() => { setItem(e); openForm(e) }}>
                                                                        SUBIR IMAGEN<span className='btnNuevoIcono'><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></span> </Button>
                                                                </td> :
                                                                <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px', textAlign: 'right' }} >
                                                                    <Button className=' Historial ' style={{ height: '25px', width: '90%' }}
                                                                        onClick={() => { setItem(e); openForm(e) }}>
                                                                        VER IMAGEN<span className='btnNuevoIcono'><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></span> </Button>
                                                                </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>}
                                {rol < 4 &&
                                    <Table style={{ border: 'none' }}>
                                        <thead>
                                            <tr >
                                                <th className="col-4"> SERVICIO</th>
                                                <th className="col-2">RESULTADO</th>
                                                <th className="col-4">INTERVALO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                codigos.map(cod => (
                                                    solicitud.map(e => (
                                                        cod === e.codigo &&
                                                        <>
                                                            {
                                                                e.encabezado === 1 ?
                                                                    <tr key={e.id} className='nhc'>
                                                                        <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.servicioSolicitado}</td>
                                                                        <td className='col-3' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.resultado ? e.resultado : '-'}</td>
                                                                        <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.descripcion ? e.descripcion : '-'}</td>

                                                                    </tr> :
                                                                    <tr key={e.id} >
                                                                        <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.servicioSolicitado}</td>
                                                                        <td className='col-3' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.resultado ? e.resultado : '-'}</td>
                                                                        <td className='col-4' style={{ margin: "0px", padding: '3px', fontSize: '11px' }}>{e.descripcion ? e.descripcion : '-'}</td>

                                                                    </tr>
                                                            }
                                                        </>
                                                    ))
                                                ))
                                            }
                                        </tbody>
                                    </Table>}
                            </div>
                        </div>
                    </div>
                    <div className='col-6 mt-3'>

                        <div className='paciente '><strong>{'PAC. ' + solicitud[0].paciente}</strong></div>
                        <p className='subPaciente'>{'CARNET IDENTIDAD ' + solicitud[0].ci}</p>

                        <div className='row pt-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faNotesMedical} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'SOLICITANTE: DR. ' + solicitud[0].solicitante}</strong></p>
                                <p className='diagnostico'><strong> {'DIAGNOSTICO PRELIMINAR : ' + solicitud[0].diagnostico}</strong></p>
                                <p className='codigoSol'>{'CODIGO SOLICITUD ' + solicitud[0].codigoSol}</p>
                                <p className='nhc'> {'NUMERO HISTORIAL CLINICO ' + solicitud[0].nhc}</p>
                                <p className='codigoSol'> {'SEGURO ' + solicitud[0].seguro}</p>
                            </div>
                        </div>

                        <div className='row pt-5 pb-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faCalendarAlt} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'FECHA SOLICITUD ' + solicitud[0].fecha + '  ' + solicitud[0].horaSol.split(':')[0] + ':' + solicitud[0].horaSol.split(':')[1]}</strong></p>
                                <p className='diagnostico'><strong><span>{"FECHA AUTORIZACION "}</span> {solicitud[0].fechaHoraAutorizacion ? solicitud[0].fechaHoraAutorizacion.split('T')[0] + '  ' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[1] : '-'}</strong></p>
                                <p className='codigoSol'><span>{'FECHA RECEPCION LABORATORIO '}</span> {solicitud[0].fechaRecLab ? solicitud[0].fechaRecLab.split('T')[0] + '   ' + solicitud[0].horaRecLab.split(':')[0] + ':' + solicitud[0].horaRecLab.split(':')[1] : '-'}</p>
                                <p className='codigoSol'><span>{'FECHA REPORTE DE RESULTADOS '}</span>  {solicitud[0].fechaHoraPublicacionRes ? solicitud[0].fechaHoraPublicacionRes.split('T')[0] + '         ' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[1] : '-'}</p>
                                <p className='genInforme pb-4'><span>{'FECHA GENERACION INFORME '}</span>   {solicitud[0].fechaGenInforme ? solicitud[0].fechaGenInforme.split('T')[0] + '  ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[0] + ' ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[1] : '-'} </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row p-2 pt-0'>
                    <div className='col-auto '>
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => cerrar(1)}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    <div className='col-auto '>
                        {solicitud[0].resultadoRecibido === 0 && rol < 4 && <Button className=' Historial ' onClick={() => openForm()}>EDITAR RESULTADOS<span className='btnNuevoIcono'><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></span> </Button>}
                    </div>
                    <div className='col-auto '>
                        {res && solicitud[0].resultadoRecibido === 0 && rol != 4 && <Button className=' reportar ' onClick={() => reportar()}>REPORTAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></span> </Button>}
                    </div>
                </div>
            </div>
            <div className='col-1' style={{ background: '#062b48' }}>
            </div>
        </div>
    )
}



const VerSolicitudAutorizar = ({ solicitud, cerrar, autorizar, eliminar }) => {

    let res = true
    solicitud.forEach(ele => {
        let i = solicitud.findIndex(e => e.id === ele.id)
        if (solicitud[i].resultado == null && solicitud[i].intervalo == null) {
            res = false
        }

    })

    return (
        <div className='row' style={{ background: '#e8e0d3' }}>
            <div className='col-11'>
                <div className='row'>
                    <div className='col-6 mt-5'>
                        <div className='ItemSolicitado'>
                            <label className='titulo'>SERVICIOS SOLICITADOS</label>
                            {solicitud.map(s => (
                                <li className='nhc' key={s.servicioSolicitado}>  {s.servicioSolicitado} </li >
                            ))}
                        </div>
                    </div>
                    <div className='col-6 mt-3'>

                        <div className='paciente '><strong>{'PAC. ' + solicitud[0].paciente}</strong></div>
                        <p className='subPaciente'>{'CARNET IDENTIDAD ' + solicitud[0].ci}</p>

                        <div className='row pt-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faNotesMedical} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'SOLICITANTE: DR. ' + solicitud[0].solicitante}</strong></p>
                                <p className='diagnostico'><strong> {'DIAGNOSTICO PRELIMINAR: ' + solicitud[0].diagnostico}</strong></p>
                                <p className='codigoSol'>{'CODIGO SOLICITUD ' + solicitud[0].codigoSol}</p>
                                <p className='nhc'> {'NUMERO HISTORIAL CLINICO ' + solicitud[0].nhc}</p>
                                <p className='codigoSol'> {'SEGURO ' + solicitud[0].seguro}</p>
                            </div>
                        </div>

                        <div className='row pt-5 pb-5'>
                            <div className='col-1 '>
                                <div className='iconoverSolicitud'><FontAwesomeIcon icon={faCalendarAlt} /></div>
                            </div>
                            <div className='col-11 bloque'>
                                <p className='medico'><strong> {'FECHA SOLICITUD ' + solicitud[0].fecha + '  ' + solicitud[0].horaSol.split(':')[0] + ':' + solicitud[0].horaSol.split(':')[1]}</strong></p>
                                <p className='diagnostico'><strong><span>{"FECHA AUTORIZACION "}</span> {solicitud[0].fechaHoraAutorizacion ? solicitud[0].fechaHoraAutorizacion.split('T')[0] + '  ' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraAutorizacion.split('T')[1].split('.')[0].split(':')[1] : '-'}</strong></p>
                                <p className='codigoSol'><span>{'FECHA RECEPCION LABORATORIO '}</span> {solicitud[0].fechaRecLab ? solicitud[0].fechaRecLab.split('T')[0] + '   ' + solicitud[0].horaRecLab.split(':')[0] + ':' + solicitud[0].horaRecLab.split(':')[1] : '-'}</p>
                                <p className='codigoSol'><span>{'FECHA REPORTE DE RESULTADOS '}</span>  {solicitud[0].fechaHoraPublicacionRes ? solicitud[0].fechaHoraPublicacionRes.split('T')[0] + '         ' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[0] + ':' + solicitud[0].fechaHoraPublicacionRes.split('T')[1].split('.')[0].split(':')[1] : '-'}</p>
                                <p className='genInforme pb-4'><span>{'FECHA GENERACION INFORME '}</span>   {solicitud[0].fechaGenInforme ? solicitud[0].fechaGenInforme.split('T')[0] + '  ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[0] + ' ' + solicitud[0].fechaGenInforme.split('T')[1].split('.')[0].split(':')[1] : '-'} </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='row p-2'>
                    <div className='col-auto '>
                        <Button className=' cancelarVentanaSolicitud ' onClick={() => cerrar(1)}>CERRAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></span> </Button>
                    </div>
                    {solicitud[0].estado === 0 && <> <div className='col-auto '>
                        <Button className=' Historial ' onClick={() => autorizar()}> AUTORIZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faCheckSquare}></FontAwesomeIcon></span> </Button>
                    </div>
                        <div className='col-auto '>
                            <Button className=' reportar ' onClick={() => eliminar(true)}>RECHAZAR <span className='btnNuevoIcono'><FontAwesomeIcon icon={faEraser}></FontAwesomeIcon></span> </Button>
                        </div>
                    </>}
                </div>
            </div>
            <div className='col-1' style={{ background: '#062b48' }}>
            </div>
        </div>
    )
}



































export {
    InputUsuario,
    ComponenteInputUser,
    ComponenteInputBuscar,
    Select1, Select2_,
    ComponenteCheckFactura,

    ComponenteCheckSiNo,
    ComponenteInputBuscarPaciente,
    ComponenteInputUserDisabledRow,
    ComponenteInputUserRow,
    SelectRow,
    ComponenteInputFile,
    GenerarPdf,
    VerDependientes,
    ComponenteInputfechaRow,
    VerSolicitud,
    TituloPagina,
    ComponenteInputBuscar_,
    VerSolicitudComplementarios,
    VerSolicitudAutorizar,
    ComponenteInputfecha, ComponenteCheck, ComponenteInputUserDisabled, ComponenteInputHora, ComponenteInputUserArea
    , GenerarPdfTransfusional,
    ComponenteInputfechaBuscar,
    ComponenteInputUserCodigo,
    ComponenteInputUserDiagnostico,
    ComponenteInputMes

}



