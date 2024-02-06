import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Header = () => {
    const auth = useContext(AuthContext);

    return (
        <>
            <nav className="navbar navbar-expand-xl navbar-expand-lg navbar-light bg-light px-5">
                <div className="container-fluid">
                    <NavLink
                        className="navbar-brand"
                        to="/home">
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                                    to="/home">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                                    to="/rest">
                                    Restaurants
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                                    to="/dishes">
                                    Dishes
                                </NavLink>
                            </li>
                        </ul>
                        {!auth.isLoggedin() ? (
                            <ul className="navbar-nav d-flex">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">
                                        Register
                                    </NavLink>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav d-flex">
                                <li className="nav-item">
                                    <span className="nav-link mx-4">
                                        {`Hello ${auth.getUser().name}`}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link"
                                        to="/login"
                                        onClick={() => auth.logout()}
                                    >
                                        Logout
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
