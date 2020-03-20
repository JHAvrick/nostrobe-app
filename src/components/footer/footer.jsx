import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './footer.css';

import {FaDribbble} from 'react-icons/fa'
import {TiSocialInstagram }from 'react-icons/ti';

function Footer(props) {

  return (
    <footer className="footer">
        <div className="footer__left">
            <small>&copy; Copyright {new Date().getFullYear()}, No Strobe. All rights reserved.</small>
        </div>
        <div className="footer__right">
            <a href="https://www.instagram.com/_nostrobe_/" target="blank" rel="noopener noreferrer" className="footer__item"> 
                <TiSocialInstagram size={15} /> 
                Instagram
            </a>
            <a href="#" target="blank" rel="noopener noreferrer" className="footer__item"> 
                <FaDribbble size={15} /> 
                Dribbble
            </a>

            {/* <span className="footer__label">
                Instagram
            </span> */}

        </div>
    </footer>
  );
}

export default Footer;
