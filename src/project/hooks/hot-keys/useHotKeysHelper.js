import {useState} from "react"

export default function useHotKeysHelper(){
    const [allShortcuts, setAllShortcuts] = useState([])
    const [activeWindow, setActiveWindow] = useState()
    const [activeKeys, setActiveKeys] = useState({})

    return {
        activeKeys, setActiveKeys,
        allShortcuts,
        setAllShortcuts,
        activeWindow, setActiveWindow
    }
}