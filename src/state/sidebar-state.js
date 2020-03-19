import EventEmitter from '../util/event-emitter';
import { useEffect, useState } from 'react';

const SidebarState = {
    isOpen: false,
    events: new EventEmitter(),
    setState: function(state){
        if (this.isOpen === state) return;
        this.isOpen = state;
        this.events.emit("stateChange", this.isOpen);
    }
}

const hideSideBarMatch = window.matchMedia("(max-width: 950px)");

function useSidebarState(){
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Hide the sidebar if the screen is large enough to show the main navigation
     */
    const handleWindowResize = (state) => {
        if (!hideSideBarMatch.matches){
            setIsOpen(false);
        }
    }
    const handleStateChange = (state) => setIsOpen(state);
    useEffect(() => {
        SidebarState.events.on("stateChange", handleStateChange);
        window.addEventListener("resize", handleWindowResize);
        return (() => {
            SidebarState.events.removeListener("stateChange", handleStateChange)
            window.removeEventListener("resize", handleWindowResize);
        });
    })

    return isOpen;
}

export { SidebarState, useSidebarState } ;