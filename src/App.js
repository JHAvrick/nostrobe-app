import React, {useState} from 'react';
import 'normalize.css';
import './sidebar.css';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import { SidebarState, useSidebarState } from './state/sidebar-state';
import { elastic as Menu } from 'react-burger-menu';
import Header from './components/header/header';
import DesignsPage from './pages/designs/designs';
import AboutPage from './pages/about/about';
import ContactPage from './pages/contact/contact';

function App() {
  const sidebarOpen = useSidebarState();

  return (
    <div className="App">
      <Router>

        {/* Sidebar Menu */}
        <Menu 
          customBurgerIcon={false} 
          isOpen={sidebarOpen} 
          onStateChange={(state) => SidebarState.setState(state.isOpen)}
          disableOverlayClick>
          
          <Link onClick={() => SidebarState.setState(false)} to="/designs">Designs</Link>
          <Link onClick={() => SidebarState.setState(false)} to="/about">About</Link>
          <Link onClick={() => SidebarState.setState(false)} to="/contact">Contact</Link>
          <Link onClick={() => SidebarState.setState(false)} to="/store">Store</Link>
        </Menu>

        <div className="contentwrapper">
          <Header />

          <Switch>
            <Route path="/designs">
              <DesignsPage />
            </Route>

            {/* <Route path="/designs/:category">
              <DesignsPage />
            </Route>
            <Route path="/designs">
              <Redirect to="/designs/all" />
            </Route> */}


            <Route path="/about">
              <AboutPage />
            </Route>

            <Route path="/contact">
              <ContactPage />
            </Route>

            <Route path="/">
              <Redirect to="/designs" />
            </Route>
          </Switch>

        </div>
      </Router>

    </div>
  );
}

export default App;
