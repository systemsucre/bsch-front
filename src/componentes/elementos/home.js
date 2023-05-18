import useAuth from "../../Auth/useAuth";
import { Link } from "react-router-dom";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDigitalTachograph, faDollarSign, faHouseUser, faInfo, faPowerOff, faShieldAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';


function Home() {
    const auth = useAuth()

    const salir = () => {
        let ok = window.confirm('Cerrar Sesion ?')
        if (ok) {
            auth.logout()
        }
    }

    let tam = window.innerWidth

    return (
        <>
            <div>
                <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ height: '60px' }}>
                    <ul className="navbar-nav" style={{ paddingTop: '10px' }}>
                        <li key="uniqueId1" className="nav-item">
                            <p className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars"></i></p>
                        </li>
                        <li key="uniqueId2" className="nav-item d-none d-sm-inline-block">
                            <Link to="/" className="nav-link">Inicio</Link>
                        </li>
                    </ul>

                </nav>
                <aside className="main-sidebar sidebar-dark-primary " style={{ height: '100%' }}>
                    {tam < 700 &&
                        <p className="nav-link mt-2" style={{ color: 'white' }} data-widget="pushmenu" role="button"> <i className="fas fa-bars"></i> </p>
                    }
                    {(parseInt(localStorage.getItem('numRol')) === 1) && tam < 700 &&
                        <div data-widget="pushmenu" role="button">

                            <Link to='/informacion' className="nav-link" > <div className="brand-link pb-0" >
                                <div className="text-center">
                                    <img src="dist/img/empresa.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px' }} />
                                </div>
                                <div className="text-center">
                                    <p className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}</p>
                                    <p><small className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('rol')}</small></p>
                                    <Link to={'/miPerfil'}>  <p className="brand-text font-weight-light" style={{ fontSize: '14px', color: 'white' }}>Gestionar mi Perfil</p></Link>


                                </div>
                            </div>
                            </Link>
                        </div>}
                    {(parseInt(localStorage.getItem('numRol')) === 1) && tam >= 700 &&
                        <Link to='/informacion' className="nav-link" > <div className="brand-link pb-0" >
                            <div className="text-center">
                                <img src="dist/img/empresa.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px' }} />
                            </div>
                            <div className="text-center">
                                <p className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}</p>
                                <p><small className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('rol')}</small></p>
                                <Link to={'/miPerfil'}>  <p className="brand-text font-weight-light" style={{ fontSize: '14px', color: 'white' }}>Gestionar mi Perfil</p></Link>


                            </div>
                        </div>
                        </Link>
                    }
                    {parseInt(localStorage.getItem('numRol')) === 2 && tam < 700 && <div className="brand-link pb-0" data-widget="pushmenu" role="button" >
                        <div className="text-center">
                            <img src="dist/img/empresa.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="text-center">
                            <p className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}</p>
                            <p><small className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('rol')}</small></p>
                            <Link to={'/miPerfil'}>  <p className="brand-text font-weight-light" style={{ fontSize: '14px', color: 'white' }}>Gestionar mi Perfil</p></Link>
                        </div>
                    </div>}
                    {parseInt(localStorage.getItem('numRol')) === 2 && tam >= 700 && <div className="brand-link pb-0" >
                        <div className="text-center">
                            <img src="dist/img/empresa.png" alt="perfil" className="img-circle elevation-4" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="text-center">
                            <p className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}</p>
                            <p><small className="brand-text font-weight-light" style={{ fontSize: '14px' }}>{localStorage.getItem('rol')}</small></p>
                            <Link to={'/miPerfil'}>  <p className="brand-text font-weight-light" style={{ fontSize: '14px', color: 'white' }}>Gestionar mi Perfil</p></Link>
                        </div>
                    </div>}

                    <div className="sidebar">
                        <nav className="mt-1">

                            <div>
                                <ul className="nav nav-pills nav-sidebar flex-column " data-widget="treeview" role="menu" data-accordion="false">
                                    {(parseInt(localStorage.getItem('numRol')) === 1) && tam < 700 && <>

                                        < div data-widget="pushmenu" role="button">
                                            <li key="uniqueId1s0sss" className="nav-item">
                                                <Link to='/asignacion-usuario' className="nav-link">
                                                    <FontAwesomeIcon icon={faDollarSign} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Asignación</p>
                                                </Link>
                                            </li>
                                            <li key="uniqueId7s" className="nav-item ">
                                                <Link to='/tipo' className="nav-link">
                                                    <FontAwesomeIcon icon={faInfo} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Tipo Información</p>
                                                </Link>
                                            </li>
                                            <li key="uniquseId7" className="nav-item ">
                                                <Link to='/clasificacion' className="nav-link">
                                                    <FontAwesomeIcon icon={faInfo} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Clasificación</p>
                                                </Link>
                                            </li>
                                            <li key="uniqsueId7fd" className="nav-item ">
                                                <Link to='/proyecto' className="nav-link">
                                                    <FontAwesomeIcon icon={faShieldAlt} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Proyecto</p>
                                                </Link>
                                            </li>
                                            <li key="uniqsueId7" className="nav-item ">
                                                <Link to='/reportes' className="nav-link">
                                                    <FontAwesomeIcon icon={faDigitalTachograph} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Reportes</p>
                                                </Link>
                                            </li>


                                            <li key="uniqsueId7gt" className="nav-item ">
                                                <Link to='/proveedor' className="nav-link">
                                                    <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Proveedor</p>
                                                </Link>
                                            </li>

                                            <li key="uniqueId1s0" className="nav-item">
                                                <Link to='/usuarios' className="nav-link">
                                                    <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                                    <p className="ml-2">Gestionar Usuarios</p>
                                                </Link>
                                            </li>
                                        </div>

                                    </>
                                    }

                                    {(parseInt(localStorage.getItem('numRol')) === 1) && tam >= 700 && <>

                                        <li key="uniqueId1s0sss1" className="nav-item">
                                            <Link to='/asignacion-usuario' className="nav-link">
                                                <FontAwesomeIcon icon={faDollarSign} className='nav-icon'></FontAwesomeIcon>
                                                <p>Asignacion</p>
                                            </Link>
                                        </li>
                                        <li key="uniqueId7s1" className="nav-item ">
                                            <Link to='/tipo' className="nav-link">
                                                <FontAwesomeIcon icon={faInfo} className='nav-icon'></FontAwesomeIcon>
                                                <p>Tipo Información</p>
                                            </Link>
                                        </li>
                                        <li key="uniquseId71" className="nav-item ">
                                            <Link to='/clasificacion' className="nav-link">
                                                <FontAwesomeIcon icon={faInfo} className='nav-icon'></FontAwesomeIcon>
                                                <p>Clasificación</p>
                                            </Link>
                                        </li>
                                        <li key="uniqsueId7fd1" className="nav-item ">
                                            <Link to='/proyecto' className="nav-link">
                                                <FontAwesomeIcon icon={faShieldAlt} className='nav-icon'></FontAwesomeIcon>
                                                <p>Proyecto</p>
                                            </Link>
                                        </li>
                                        <li key="uniqsueId71" className="nav-item ">
                                            <Link to='/reportes' className="nav-link">
                                                <FontAwesomeIcon icon={faDigitalTachograph} className='nav-icon'></FontAwesomeIcon>
                                                <p>Reportes</p>
                                            </Link>
                                        </li>


                                        <li key="uniqsueId7gt1" className="nav-item ">
                                            <Link to='/proveedor' className="nav-link">
                                                <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                                <p>Proveedor</p>
                                            </Link>
                                        </li>

                                        <li key="uniqueId1s01" className="nav-item">
                                            <Link to='/usuarios' className="nav-link">
                                                <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                                <p>Gestionar Usuarios</p>
                                            </Link>
                                        </li>
                                    </>

                                    }


                                    {parseInt(localStorage.getItem('numRol')) === 2 && tam < 700 && < div data-widget="pushmenu" role="button">
                                        <li key="uniqueId101" className="nav-item">
                                            <Link to='/gastos' className="nav-link">
                                                <FontAwesomeIcon icon={faDollarSign} className='nav-icon'></FontAwesomeIcon>
                                                <p className="ml-2">Gastos</p>
                                            </Link>
                                        </li>
                                        <li key="uniquseId71" className="nav-item ">
                                            <Link to='/clasificacion' className="nav-link">
                                                <FontAwesomeIcon icon={faHouseUser} className='nav-icon'></FontAwesomeIcon>
                                                <p className="ml-2">Clasificación</p>
                                            </Link>
                                        </li>
                                        <li key="uniqsueId7gt1" className="nav-item ">
                                            <Link to='/proveedor' className="nav-link">
                                                <FontAwesomeIcon icon={faUserFriends} className='nav-icon '></FontAwesomeIcon>
                                                <p className="ml-2">Proveedor</p>
                                            </Link>
                                        </li>
                                    </div>
                                    }

                                    {parseInt(localStorage.getItem('numRol')) === 2 && tam >= 700 && <>
                                        <li key="uniqueId10vff" className="nav-item">
                                            <Link to='/gastos' className="nav-link">
                                                <FontAwesomeIcon icon={faDollarSign} className='nav-icon'></FontAwesomeIcon>
                                                <p>Gastos</p>
                                            </Link>
                                        </li>
                                        <li key="uniquseId7" className="nav-item ">
                                            <Link to='/clasificacion' className="nav-link">
                                                <FontAwesomeIcon icon={faHouseUser} className='nav-icon'></FontAwesomeIcon>
                                                <p>Clasificación</p>
                                            </Link>
                                        </li>
                                        <li key="uniqsueId7gt" className="nav-item ">
                                            <Link to='/proveedor' className="nav-link">
                                                <FontAwesomeIcon icon={faUserFriends} className='nav-icon'></FontAwesomeIcon>
                                                <p >Proveedor</p>
                                            </Link>
                                        </li>
                                    </>
                                    }
                                    <br></br>
                                    <li key="uniqueId10gh" className="nav-item " onClick={salir}>
                                        <Link to='#' className="nav-link" >
                                            <FontAwesomeIcon icon={faPowerOff} className='nav-icon' ></FontAwesomeIcon >
                                            <p>Cerrar Sesion</p>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </nav>
                    </div>
                </aside>
            </div >

        </>
    )
}
export default Home;