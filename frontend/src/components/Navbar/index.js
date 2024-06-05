import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";
import { FaUpload, FaHome  } from 'react-icons/fa';

const Navbar = () => {
    return (
        <>
            <Nav>
                <Bars />
                <NavMenu>
                    <NavLink to="/" >
                        <FaHome className="mr-2" />Home
                    </NavLink>
                    {/* <NavLink to="/dashboard" activeStyle>
                        <FaTachometerAlt className="mr-2" />Dashboard
                    </NavLink> */}
                    <NavLink to="/upload" activeStyle>
                        <FaUpload className="mr-2" /> Upload 
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/login">
                        Sign In
                    </NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;