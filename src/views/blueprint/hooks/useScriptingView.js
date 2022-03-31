import {useContext, useEffect, useState} from "react";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {LoaderProvider} from "@f-ui/core";
import EventTick from "../nodes/events/EventTick";
import EVENTS from "../../../services/utils/misc/EVENTS";
import GetWorldTranslation from "../nodes/transformation/GetWorldTranslation";
import GetWorldRotation from "../nodes/transformation/GetWorldRotation";
import SetWorldTranslation from "../nodes/transformation/SetWorldTranslation";
import SetWorldRotation from "../nodes/transformation/SetWorldRotation";
import QuaternionToEuler from "../nodes/transformation/QuaternionToEuler";
import Getter from "../nodes/utils/Getter";
import Setter from "../nodes/utils/Setter";
import Add from "../nodes/operators/math/Add";
import Subtract from "../nodes/operators/math/Subtract";
import Divide from "../nodes/operators/math/Divide";
import Multiply from "../nodes/operators/math/Multiply";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import ToVector from "../nodes/operators/conversions/ToVector";
import FromVector from "../nodes/operators/conversions/FromVector";
import Print from "../nodes/utils/Print";
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
import MouseX from "../nodes/events/MouseX";
import MouseY from "../nodes/events/MouseY";
import MousePosition from "../nodes/events/MousePosition";
import EntityReference from "../nodes/events/EntityReference";
import ProjectLoader from "../../../services/workers/ProjectLoader";
import COMPONENTS from "../../../services/engine/templates/COMPONENTS";
import {ENTITY_ACTIONS} from "../../../services/utils/entityReducer";


export default function useScriptingView(file, engine, load) {
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])
    const [groups, setGroups] = useState([])
    const [variables, setVariables] = useState([])
    const [changed, setChanged] = useState(false)

    const [selected, setSelected] = useState([])
    const quickAccess = useContext(QuickAccessProvider)


    useEffect(() => {
        if (engine.gpu)
            parse(file, quickAccess, setNodes, setLinks, setVariables, setGroups, load, engine, quickAccess.fileSystem)
    }, [file, engine.gpu])


    return {
        groups, setGroups,
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
        changed,

        setChanged
    }
}


const INSTANCES = {
    GetWorldTranslation: () => new GetWorldTranslation(),
    GetWorldRotation: () => new GetWorldRotation(),
    SetWorldTranslation: () => new SetWorldTranslation(),
    SetWorldRotation: () => new SetWorldRotation(),

    QuaternionToEuler: () => new QuaternionToEuler(),
    EventTick: () => new EventTick(),
    Getter: () => new Getter(),
    Setter: () => new Setter(),

    Add: () => new Add(),
    Subtract: () => new Subtract(),
    Divide: () => new Divide(),
    Multiply: () => new Multiply(),

    SetTransformationRelativeOrigin: () => new SetTransformationRelativeOrigin(),
    SetLocalRotation: () => new SetLocalRotation(),
    ToVector: () => new ToVector(),
    FromVector: () => new FromVector(),

    Print: () => new Print(),


    And: () => new And(),
    Branch: () => new Branch(),
    Equal: () => new Equal(),
    Greater: () => new Greater(),
    GreaterEqual: () => new GreaterEqual(),
    Less: () => new Less(),
    LessEqual: () => new LessEqual(),
    Nand: () => new Nand(),
    Nor: () => new Nor(),
    Not: () => new Not(),
    NotEqual: () => new NotEqual(),
    Or: () => new Or(),

    MouseX: () => new MouseX(),
    MouseY: () => new MouseY(),
    MousePosition: () => new MousePosition(),
    EntityReference: () => new EntityReference()
}

function parse(file, quickAccess, setNodes, setLinks, setVariables, setGroups, load, engine, fileSystem) {
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
                            if (file.groups)
                                setGroups(file.groups)
                            if (file.variables)
                                setVariables(file.variables)
                            if (file.entities) {
                                ProjectLoader.loadMeshes(file.entities.map(e => e.components[COMPONENTS.MESH].meshID), fileSystem, engine.gpu)
                                    .then(meshes => {
                                        engine.setMeshes(meshes.filter(m => m))
                                        engine.dispatchEntities({
                                            type: ENTITY_ACTIONS.DISPATCH_BLOCK,
                                            payload: file.entities.map((e, i) => ProjectLoader.mapEntity(e, i, meshes, [], engine.gpu))
                                        })
                                    })
                            }


                            load.finishEvent(EVENTS.LOAD_FILE)
                        } else
                            load.finishEvent(EVENTS.LOAD_FILE)

                    })
            } else
                load.finishEvent(EVENTS.LOADING_MATERIAL)
        })
}