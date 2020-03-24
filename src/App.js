import React from 'react';
import 'normalize.css';
import './sidebar.css';
import './App.css';

import Helmet from 'react-helmet';
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
import Footer from './components/footer/footer';
import DesignsPage from './pages/designs/designs';
import Page from './pages/page';

function App() {
  const sidebarOpen = useSidebarState();

  return (
    <div className="App">
      <Helmet>
          <meta charSet="utf-8" />
          <title>No Strobe</title>
          <meta name="description" content="No Strobe - Modern Prints & Designs"/>
          <meta name="keywords" content="design,illustration,vector,modern,art,shoegaze,strompbox,prints,minimalist,abstract,redbubble,zazzle,society6,teepublic" />
          <link rel="canonical" href="https://nostrobe.com" />
      </Helmet>
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
          <a onClick={() => SidebarState.setState(false)} 
             target="blank" 
             rel="noopener noreferrer" 
             href="https://www.redbubble.com/people/-nostrobe/shop">
              Store
          </a>
        </Menu>

        <Header />
        <div className="contentwrapper">
          <Switch>
            {/* <Route path="/designs">
              <DesignsPage />
            </Route> */}

            <Route path="/designs/:category">
              <DesignsPage />
            </Route>
            <Route path="/designs">
              <Redirect to="/designs/all?page=0" />
            </Route> 


            <Route path="/about">
              <Page name="about" />
            </Route>

            <Route path="/contact">
              <Page name="contact" />
            </Route>

            <Route path="/">
              <Redirect to="/designs" />
            </Route>
          </Switch>

          <Footer />
        </div>
      </Router>

    </div>
  );
}

export default App;
