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
import Cos from "../nodes/operators/math/Cos";
import Sin from "../nodes/operators/math/Sin";
import ASin from "../nodes/operators/math/ASin";
import ACos from "../nodes/operators/math/ACos";
import ATan from "../nodes/operators/math/ATan";
import Tan from "../nodes/operators/math/Tan";
import Mod from "../nodes/operators/math/Mod";
import Abs from "../nodes/operators/math/Abs";
import KeyPress from "../nodes/events/KeyPress";


export default function useScriptingView(file, engine={}, load, isLevelBlueprint) {
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])
    const [groups, setGroups] = useState([])
    const [variables, setVariables] = useState([])
    const [changed, setChanged] = useState(false)

    const [selected, setSelected] = useState([])
    const quickAccess = useContext(QuickAccessProvider)


    useEffect(() => {
        if (engine.gpu || isLevelBlueprint)
            parse(file, quickAccess, setNodes, setLinks, setVariables, setGroups, load, engine, quickAccess.fileSystem, isLevelBlueprint)
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
    [GetWorldTranslation.name]: () => new GetWorldTranslation(),
    [GetWorldRotation.name]: () => new GetWorldRotation(),
    [SetWorldTranslation.name]: () => new SetWorldTranslation(),
    [SetWorldRotation.name]: () => new SetWorldRotation(),

    [QuaternionToEuler.name]: () => new QuaternionToEuler(),
    [EventTick.name]: () => new EventTick(),
    [Getter.name]: () => new Getter(),
    [Setter.name]: () => new Setter(),

    [Add.name]: () => new Add(),
    [Subtract.name]: () => new Subtract(),
    [Divide.name]: () => new Divide(),
    [Multiply.name]: () => new Multiply(),

    [SetTransformationRelativeOrigin.name]: () => new SetTransformationRelativeOrigin(),
    [SetLocalRotation.name]: () => new SetLocalRotation(),
    [ToVector.name]: () => new ToVector(),
    [FromVector.name]: () => new FromVector(),

    [Print.name]: () => new Print(),


    [And.name]: () => new And(),
    [Branch.name]: () => new Branch(),
    [Equal.name]: () => new Equal(),
    [Greater.name]: () => new Greater(),
    [GreaterEqual.name]: () => new GreaterEqual(),
    [Less.name]: () => new Less(),
    [LessEqual.name]: () => new LessEqual(),
    [Nand.name]: () => new Nand(),
    [Nor.name]: () => new Nor(),
    [Not.name]: () => new Not(),
    [NotEqual.name]: () => new NotEqual(),
    [Or.name]: () => new Or(),

    [MouseX.name]: () => new MouseX(),
    [MouseY.name]: () => new MouseY(),
    [MousePosition.name]: () => new MousePosition(),
    [EntityReference.name]: () => new EntityReference(),

    [Cos.name]: () => new Cos(),
    [Sin.name]: () => new Sin(),
    [ASin.name]: () => new ASin(),
    [ACos.name]: () => new ACos(),
    [ATan.name]: () => new ATan(),
    [Tan.name]: () => new Tan(),
    [Mod.name]: () => new Mod(),
    [Abs.name]: () => new Abs(),
    [KeyPress.name]: () => new KeyPress(),
}

function parse(file, quickAccess, setNodes, setLinks, setVariables, setGroups, load, engine, fileSystem, isLevelBlueprint) {
    if (!isLevelBlueprint)
        quickAccess.fileSystem
            .readRegistryFile(file.registryID)
            .then(res => {
                if (res) {
                    quickAccess.fileSystem
                        .readFile(quickAccess.fileSystem.path + '\\assets\\' + res.path, 'json')
                        .then(file => {
                            parseFile(file, load, engine, setLinks, setNodes, setVariables, setGroups, fileSystem, isLevelBlueprint)
                        })
                } else
                    load.finishEvent(EVENTS.LOADING_MATERIAL)
            })
    else {
        quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + '\\levelBlueprint.flow')
            .then(async res => {
                if (!res)
                    await quickAccess.fileSystem.createFile('levelBlueprint.flow', JSON.stringify({nodes: [], links: [], variables: [], groups: []}))
                else {
                    const f = await quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + '\\levelBlueprint.flow', 'json')
                    console.log(file)
                    parseFile(f, load, engine, setLinks, setNodes, setVariables, setGroups, fileSystem, isLevelBlueprint)
                }
            })
    }
}

function parseFile(file, load, engine, setLinks, setNodes, setVariables, setGroups, fileSystem, isLevelBlueprint) {

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
        if (file.entities && !isLevelBlueprint) {
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

}