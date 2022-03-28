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
import Add from "../nodes/operators/math/Add";
import Subtract from "../nodes/operators/math/Subtract";
import Divide from "../nodes/operators/math/Divide";
import Multiply from "../nodes/operators/math/Multiply";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import ToVector from "../nodes/operators/conversions/ToVector";
import FromVector from "../nodes/operators/conversions/FromVector";
import Print from "../nodes/Print";
import And from "../nodes/operators/boolean/And";
import Branch from "../nodes/operators/boolean/Branch";
import Equal from "../nodes/operators/boolean/Equal";
import Greater from "../nodes/operators/boolean/Greater";
import GreaterEqual from "../nodes/operators/boolean/GreaterEqual";
import Less from "../nodes/operators/boolean/Less";
import LessEqual from "../nodes/operators/boolean/LessEqual";
import Nand from "../nodes/operators/boolean/Nand";
import Nor from "../nodes/operators/boolean/Nor";
import Not from "../nodes/operators/boolean/Not";
import NotEqual from "../nodes/operators/boolean/NotEqual";
import Or from "../nodes/operators/boolean/Or";
import Xor from "../nodes/operators/boolean/Xor";


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
    FromVector:  () => new FromVector(),

    Print:  () => new Print(),


    And:  () => new And(),
    Branch:  () => new Branch(),
    Equal:  () => new Equal(),
    Greater:  () => new Greater(),
    GreaterEqual:  () => new GreaterEqual(),
    Less:  () => new Less(),
    LessEqual:  () => new LessEqual(),
    Nand:  () => new Nand(),
    Nor:  () => new Nor(),
    Not:  () => new Not(),
    NotEqual:  () => new NotEqual(),
    Or:  () => new Or(),
    Xor:  () => new Xor()
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