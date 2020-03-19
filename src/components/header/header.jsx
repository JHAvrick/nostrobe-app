import React, { useState } from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { SidebarState, useSidebarState } from '../../state/sidebar-state';
import Burger from '@animated-burgers/burger-squeeze';
import HexagonPNG from '../../assets/hexagon.png';
import { Link } from "react-router-dom";
import '@animated-burgers/burger-squeeze/dist/styles.css';
import './header.css';
import './hamburger.css';


function Header(props) {
  const sidebarOpen = useSidebarState();

  return (
    <div className="header">
        <Logo className="header__logo" />
        <nav className="header__nav">
          <Link className="header__nav-item" to="/designs"> Designs </Link>
          <Link className="header__nav-item" to="/about"> About </Link>
          <Link className="header__nav-item" to="/contact"> Contact </Link>
          <Link className="header__nav-item" to="/store"> Store </Link>
        </nav>

        <div className="header__burger-wrapper" onClick={() => SidebarState.setState(!sidebarOpen)}>
          <img className="hexagon" src={HexagonPNG}/>
          <Burger isOpen={sidebarOpen} />
        </div>

    </div>
  );
}

Header.defaultProps = {
  onSidebarToggled: function(){}
}

export default Header;
