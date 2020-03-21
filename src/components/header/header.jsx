import React from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { SidebarState, useSidebarState } from '../../state/sidebar-state';
import Burger from '@animated-burgers/burger-squeeze';
import HexagonPNG from '../../assets/hexagon.png';
import { Link } from "react-router-dom";
import '@animated-burgers/burger-squeeze/dist/styles.css';
import './header.css';
import './hamburger.css';
import { useLocation } from "react-router-dom";

/**
 * TODO: This is a very brittle nav implementation, consider refactoring
 */
const NavPositions = {
  designs: "0%",
  about: "26.5%",
  contact: "53%"
}

function Header(props) {
  const sidebarOpen = useSidebarState();
  const location = useLocation();

  let pathname = location.pathname.replace(/\//g, "");
  return (
    <header className="header">
        <Logo className="header__logo" />
        <nav className="header__nav">
          <span className="header__nav-selection" style={{ left: NavPositions[pathname] }}></span> 
          <Link className={pathname === "designs" ? "header__nav-item--selected" : "header__nav-item" } to="/designs"> Designs </Link>
          <Link className={pathname === "about" ? "header__nav-item--selected" : "header__nav-item" } to="/about"> About </Link>
          <Link className={pathname === "contact" ? "header__nav-item--selected" : "header__nav-item" } to="/contact"> Contact </Link>
          <a className="header__nav-item" target="blank" rel="noopener noreferrer" href="https://www.redbubble.com/people/-nostrobe/shop"> Store </a>
        </nav>

        <div className="header__burger-wrapper" onClick={() => SidebarState.setState(!sidebarOpen)}>
          <img alt="Burger Menu Backdrop" className="hexagon" src={HexagonPNG}/>
          <Burger isOpen={sidebarOpen} />
        </div>

    </header>
  );
}


Header.defaultProps = {
  onSidebarToggled: function(){}
}

export default Header;
