import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export default function useActiveRoute(route, onFocus) {
    const location = useLocation();
    useEffect(() => {
        console.log(route, location.pathname)
        if (location.pathname === route) {
            console.log(route)
            onFocus()
        }
    }, [location, onFocus])
}