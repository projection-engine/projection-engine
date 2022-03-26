import {useContext, useEffect, useState} from "react";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {LoaderProvider} from "@f-ui/core";


export default function useScriptingView(file) {
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])
    const [changed, setChanged] = useState(false)

    const [selected, setSelected] = useState([])
    const quickAccess = useContext(QuickAccessProvider)
    const load = useContext(LoaderProvider)

    useEffect(() => {
        // if(engine.gpu && engine.meshes.length > 0){
        //   parseMaterialFile(file, quickAccess, setNodes, setLinks, engine, load)
        // }
    }, [file])


    return {

        selected,
        setSelected,
        setNodes,
        nodes,
        links,
        setLinks,
        quickAccess,
        load,
        changed, setChanged
    }
}