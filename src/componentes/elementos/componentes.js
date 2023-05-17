
import { Button } from "reactstrap"
import { ComponenteInputBuscar } from "./input"

const Cabecera = ({ estado, cambiarEstado, name, className_, ExpresionRegular, placeholder, abrirFormulario, nombreBoton }) => {


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
        <div className="row">
            <div className="mt-2 ml-1 col-lg-8 col-md-8 col-sm-8 col-6 ">
                <Button color="success" onClick={abrirFormulario}>{nombreBoton}</Button>
            </div>
            <div className=" mt-2 col-lg-3 col-md-2 col-sm-3 col-5 pr-0 pl-0 ml-0">
                <ComponenteInputBuscar
                    type='text'
                    value={estado.campo}
                    id={name}
                    className={className_ || 'form-control'}
                    name={name}
                    value={estado.campo}
                    placeholder={placeholder}
                    onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    onBlur={validacion}  //si presionamos fuera del input
                    onChange={onchange}
                    valido={estado.valido}
                />
            </div>
        </div>
    )
}
export { Cabecera }