import {useContext, useEffect, useState} from "react";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {LoaderProvider} from "@f-ui/core";
import EventTick from "../nodes/EventTick";
import Lerp from "../../material/nodes/Lerp";
import Mask from "../../material/nodes/Mask";
import OneMinus from "../../material/nodes/OneMinus";
import HeightLerp from "../../material/nodes/HeightLerp";
import Add from "../../material/nodes/Add";
import Multiply from "../../material/nodes/Multiply";
import Power from "../../material/nodes/Power";
import Numeric from "../../material/nodes/Numeric";
import Color from "../../material/nodes/Color";
import TextureSample from "../../material/nodes/TextureSample";
import Material from "../../material/nodes/Material";
import Vector from "../../material/nodes/Vector";
import ParallaxOcclusionMapping from "../../material/nodes/ParallaxOcclusionMapping";
import applyViewport from "../../material/utils/applyViewport";
import EVENTS from "../../../services/utils/misc/EVENTS";
import GetWorldTranslation from "../nodes/translation/GetWorldTranslation";
import GetWorldRotation from "../nodes/translation/GetWorldRotation";
import SetWorldTranslation from "../nodes/translation/SetWorldTranslation";
import SetWorldRotation from "../nodes/translation/SetWorldRotation";
import QuaternionToEuler from "../nodes/QuaternionToEuler";


export default function useScriptingView(file) {
    const [nodes, setNodes] = useState([new EventTick()])
    const [links, setLinks] = useState([])
    const [changed, setChanged] = useState(false)

    const [selected, setSelected] = useState([])
    const quickAccess = useContext(QuickAccessProvider)
    const load = useContext(LoaderProvider)

    useEffect(() => {

        parse(file, quickAccess, setNodes, setLinks, load)

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


const INSTANCES = {
    GetWorldTranslation: () => new GetWorldTranslation(),
    GetWorldRotation: () => new GetWorldRotation(),
    SetWorldTranslation: () => new SetWorldTranslation(),
    SetWorldRotation: () => new SetWorldRotation(),

    QuaternionToEuler: () => new QuaternionToEuler(),
    EventTick: () => new EventTick()
}

function parse(file, quickAccess, setNodes, setLinks, load) {
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
                                    if (o !== 'inputs' && o !== 'output')
                                        i[o] = f[o]
                                })
                                return i
                            })

                            setNodes(newNodes)
                            setLinks(file.links)
                            load.finishEvent(EVENTS.LOAD_FILE)
                        } else
                            load.finishEvent(EVENTS.LOAD_FILE)

                    })
            } else
                load.finishEvent(EVENTS.LOADING_MATERIAL)
        })
}