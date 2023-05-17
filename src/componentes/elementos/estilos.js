import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const colores = {
    bordes: "#17a2b8",
    error: "#dc3545",
    texto: 'rgb(238, 131, 131)',
    exito: '#17a2b8',
    // "#28a745",
    encabezado: "#006572",
    borde: "#6c757d"
}

const grupoInput = styled.div`
     
`;

const Line = styled.div` 
    width: ${props => props.valor}%
`;


const InputBuscador = styled.input` 

    border: 1px solid ${colores.borde};

    &:focus {
        border:1px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
        
    `}
`;

const Input = styled.input` 

    width:100%;
    height: 20px;
    font-size: 10px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border: 1.5px solid ${colores.borde};

    &:focus {
        border:1.5px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1.5px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1.5px solid ${colores.error} !important;
        color:red
        
    `}
`;

const InputFile = styled.input` 


    width:100%;
    height: 24px;
    font-size: 13px;
    padding: 3px 15px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:2px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 2px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 2px solid ${colores.error} !important;
        
    `}
`;

const InputTabla = styled.input` 


    width:100%;
    height: 20px;
    font-size: 10px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:2px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.encabezado === 'true' && css`
        border: 2px solid ${colores.encabezado}
    `}

    ${props => props.valido === 'false' && css`
        border: 2px solid ${colores.error} !important;
        
    `}
`;





const InputArea = styled.textarea` 

    width:100%;
    height: 25px;
    font-size: 12px;
    padding: 0 0px 0 0px;  //campos donde va abarcar el texto dentro del input  
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:2px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 2px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 2px solid ${colores.error} !important;
    `}
`;


const InputDisabled = styled.input` 



    width:100%;
    height: 10px;
    font-size: 10px;
    padding: 0 0px 0 2px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:2px solid ${colores.bordes};
        outline: node;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 2px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 2px solid ${colores.error} !important;
    `} 
`;
const Inputfecha = styled.input` 


    width:100%;
    height: 18px;
    font-size: 11px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:1px solid ${colores.bordes};
        outline: node;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
    `}
`;

const IconoValidacionfecha = styled(FontAwesomeIcon)`
    position: absolute;
    right: 30px;
    bottom : 8px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}


    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;

const IconoValidacionhora = styled(FontAwesomeIcon)`
    position: absolute;
    right: 40px;
    bottom : 8px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}


    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;

const Label = styled.div`

    width:100%;
    height: 13px;
    font-size: 10px;
    // background-color: black;
    // color: azure;
    padding: 0 0px 0 0px;  //campos donde va abarcar el texto dentro del input {-, DERECHA,-,-}
    font-family: Arial, Helvetica, sans-serif;
    // text-align: left;
    text-align: center;


`;
const RegistraResultados = styled.div`

    width:100%;
    height: 13px;
    font-size: 12px;
    padding: 0 0px 0 0px;  //campos donde va abarcar el texto dentro del input {-, DERECHA,-,-}
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;


`;

const LabelModal = styled.div`

    width:100%;
    height: 13px;
    font-size: 12px;
    // background-color: black;
    // color: azure;
    padding: 0 5px 0 0px;  //campos donde va abarcar el texto dentro del input {-, DERECHA,-,-}
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    // text-align: center;

`;

const Labelinicio = styled.div`

    width:100%;
    height: 40px;
    font-size: 20px;
    // background-color: black;
    color: azure;
    padding: 5px 5px 5px 0px;  //campos donde va abarcar el texto dentro del input {arriba, DERECHA,abajo,izquierda}
    font-family: Arial;
    // text-align: left;
    text-align: center;
    border-bottom: 1px solid;

`;

const Parrafos = styled.p`
    width:100%;
    height: 12px;
    font-size: 12px;
    padding: 0 0px 0 0px;  //campos donde va abarcar el texto dentro del input
`;



const SelectStyle = styled.select`
    width:100%;
    height: 10px;
    font-size: 10px;
  //  padding: 0 5px 0 5px;  //campos donde va abarcar el texto dentro del input
    padding: 0 5px 0 5px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

    &:focus {
        border:1px solid ${colores.bordes};
        outline: node;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito} !important;
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
    `}
`;


const LeyendaError = styled.span`
    font-size: 11px;
    margin-bottom: 0px;   
    margin-top: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding-bottom:0px;
    padding-top:0px;
    padding-left:0px;
    padding-right:0px;
    text-align: left; 
    position: absolute;

    color: ${colores.texto};

    ${props => props.valido === 'true' && css`
        display: none;    
    `}

    ${props => props.valido === 'false' && css`
        display: none;
    `}
` ;

const IconoValidacion = styled(FontAwesomeIcon)`
    position: absolute;
    right: 60px;
    bottom : 8px;
    z-index: 100;
    font-size : 12px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}


    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;



//para los campos en general que no cuenten con icono de span
const IconoValidacionCampos = styled(FontAwesomeIcon)`
    position: absolute;
    right: 15px;
    // left : 140px;
    bottom : 8px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}



    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;


//para los campos select
const IconoValidacionSelect = styled(FontAwesomeIcon)`
    position: absolute;
    right: 3px;
    bottom : 8px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}



    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;

const IconoValidacionCamposSelect = styled(FontAwesomeIcon)`
    position: absolute;
    right: 20px;
    bottom : 27px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}


    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
        bottom : 74px;
    `}
    
`;

//para los campos en general que no cuenten con icono de span pero con boton 
const IconoValidacionCamposBuscar = styled(FontAwesomeIcon)`
    position: absolute;
    right: 40px;
    bottom : 12px;
    z-index: 100;
    font-size : 16px;
    opacity: 0;

    ${props => props.valido === 'true' && css`
    opacity: 1;   
    color: ${colores.exito};
`}


    ${props => props.valido === 'false' && css`
        opacity: 1;
        color: ${colores.error};
    `}
    
`;



const ContenedorCheck = styled.div`

margin: 0px;
padding:0px;
height:auto;
width:100%;
font-size : 11.5px;
grid-column :span 2;  // abarca dos columnas
input {
    margin-right : 5px;  //para separar el parrafo de la casilla check
}

@media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
    grid-column: span 1;
}
`;

const ContenedorCheck2 = styled.p` //con contenido mas grande que la anterior
height:20px;
width:100%;
font-size : 11.5px;
grid-column :span 2;  // abarca dos columnas
input {
    margin-right : 5px;  //para separar el parrafo de la casilla check
}

@media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
    grid-column: span 1;
}
`;

const ContenedorCheckSimple = styled.p` //con contenido mas grande que la anterior
height:20px;
width:100%;
font-size : 13px;
grid-column :span 2;  // abarca dos columnas
input {
    margin-right : 5px;  //para separar el parrafo de la casilla check
}

@media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
    grid-column: span 1;
}
`;

const ContenedorBotonCentrado = styled.div`  //cuando una operacion se realiza con exito
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: span 2 ;
    
    @media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
        grid-column: span 1;
    }
`;

const ContenedorMensajeExito = styled.p`
    font-size : 14px;
    color: ${colores.exito};
`;
const ContenedormensajeError = styled.div`
height : 40px;
line-height : 45px;
background: #f66860;
margin:2px;
padding: 0px 20px 8px 20px;
border-radius: 3px;
grid-column: span 2;
// display: none;

p {
    
    margin-left: 0;
}
B {
    margin-left: 2px;
}
`;
export {
    Line,
    grupoInput, Input, InputTabla, Inputfecha, SelectStyle, LeyendaError, IconoValidacion, ContenedorCheck, ContenedorCheck2, ContenedorBotonCentrado,
    ContenedorMensajeExito, ContenedormensajeError,InputFile,
    IconoValidacionCampos, IconoValidacionCamposBuscar, IconoValidacionCamposSelect, IconoValidacionSelect, IconoValidacionfecha,
    RegistraResultados, InputDisabled, InputArea, IconoValidacionhora, Label, Parrafos, ContenedorCheckSimple, Labelinicio, LabelModal, InputBuscador
}