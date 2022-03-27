import {useContext, useEffect, useState} from "react";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {LoaderProvider} from "@f-ui/core";
import EventTick from "../nodes/EventTick";
import EVENTS from "../../../services/utils/misc/EVENTS";
import GetWorldTranslation from "../nodes/transformation/GetWorldTranslation";
import GetWorldRotation from "../nodes/transformation/GetWorldRotation";
import SetWorldTranslation from "../nodes/transformation/SetWorldTranslation";
import SetWorldRotation from "../nodes/transformation/SetWorldRotation";
import QuaternionToEuler from "../nodes/QuaternionToEuler";
import Getter from "../nodes/Getter";
import Setter from "../nodes/Setter";
import Add from "../nodes/basic/Add";
import Subtract from "../nodes/basic/Subtract";
import Divide from "../nodes/basic/Divide";
import Multiply from "../nodes/basic/Multiply";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import ToVector from "../nodes/basic/ToVector";
import FromVector from "../nodes/basic/FromVector";


export default function useScriptingView(file) {
    const [nodes, setNodes] = useState([new EventTick()])
    const [links, setLinks] = useState([])
    const [variables, setVariables] = useState([])
    const [changed, setChanged] = useState(false)

    const [selected, setSelected] = useState([])
    const quickAccess = useContext(QuickAccessProvider)
    const load = useContext(LoaderProvider)

    useEffect(() => {

        parse(file, quickAccess, setNodes, setLinks, setVariables, load)

    }, [file])


    return {

        selected,
        setSelected,
        setNodes,
        nodes,

        variables,
        setVariables,

        links,
        setLinks,
        quickAccess,
        load,
        changed, setChanged
    }
}


const INSTANCES = {
    GetWorldTranslation: () => new GetWorldTranslation(),
    GetWorldRotation: () => new GetWorldRotation(),
    SetWorldTranslation: () => new SetWorldTranslation(),
    SetWorldRotation: () => new SetWorldRotation(),

    QuaternionToEuler: () => new QuaternionToEuler(),
    EventTick: () => new EventTick(),
    Getter:  () => new Getter(),
    Setter:  () => new Setter(),

    Add:  () => new Add(),
    Subtract:  () => new Subtract(),
    Divide:  () => new Divide(),
    Multiply:  () => new Multiply(),

    SetTransformationRelativeOrigin:  () => new SetTransformationRelativeOrigin(),
    SetLocalRotation:  () => new SetLocalRotation(),
    ToVector:  () => new ToVector(),
    FromVector:  () => new FromVector()
}

function parse(file, quickAccess, setNodes, setLinks, setVariables, load) {
    quickAccess.fileSystem
        .readRegistryFile(file.registryID)
        .then(res => {
            if (res) {

                quickAccess.fileSystem
                    .readFile(quickAccess.fileSystem.path + '\\assets\\' + res.path, 'json')
                    .then(file => {
                        if (file && Object.keys(file).length > 0) {
                            const newNodes = file.nodes.map(f => {
                                const i = INSTANCES[f.instance]()
                                Object.keys(f).forEach(o => {

                                        i[o] = f[o]
                                })
                                return i
                            })

                            setNodes(newNodes)
                            setLinks(file.links)
                            if(file.variables)
                                setVariables(file.variables)
                            load.finishEvent(EVENTS.LOAD_FILE)
                        } else
                            load.finishEvent(EVENTS.LOAD_FILE)

                    })
            } else
                load.finishEvent(EVENTS.LOADING_MATERIAL)
        })
}