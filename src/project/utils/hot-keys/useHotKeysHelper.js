import {useState} from "react"

export default function useHotKeysHelper(){
    const [allShortcuts, setAllShortcuts] = useState([])
    const [activeWindow, setActiveWindow] = useState()
	
    return {
        allShortcuts,
        setAllShortcuts,
        activeWindow, setActiveWindow
    }
}