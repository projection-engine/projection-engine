import {KEYS} from "../../../services/hooks/useHotKeys";
import createGroupShortcut from "../../../components/flow/utils/createGroupShortcut";
import mapNodes from "./mapNodes";
import compile from "./compile";
import EventTick from "../nodes/events/EventTick";
import deleteNode from "../../../components/flow/utils/deleteNode";
import cloneClass from "../../../services/utils/misc/cloneClass";
import randomID from "../../../services/utils/misc/randomID";
import EntityReference from "../nodes/events/EntityReference";
import Setter from "../nodes/utils/Setter";
import Getter from "../nodes/utils/Getter";

export default function getHotKeys(hook, props, toCopy, setToCopy) {
    return [
        {
            require: [KEYS.KeyG],
            callback: () => {
                if (hook.selected.length > 0)
                    createGroupShortcut(hook)
            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyS],
            callback: () => {

                const response = mapNodes(compile(hook.nodes, hook.links, hook.variables))
                props.submitPackage(
                    response,
                    false
                )
            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyC],
            callback: () => {
                setToCopy(hook.selected)
                if (hook.selected.length > 0)
                    props.setAlert({
                        type: 'success',
                        message: 'Entities copied.'
                    })
            }
        },
        {
            require: [KEYS.Delete],
            callback: () => {
                const clone = [...hook.selected]
                hook.setSelected([])
                clone.forEach(n => {
                    if (!(hook.nodes.find(nod => nod.id === n) instanceof EventTick))
                        deleteNode(n, hook)
                })


            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: () => {
                toCopy.forEach(toC => {
                    const toCopyNode = hook.nodes.find(n => n.id === toC)
                    if (toCopyNode && !(toCopyNode instanceof EventTick)) {
                        const nodeEl = document.getElementById(toC).parentNode
                        const transformation = nodeEl
                            .getAttribute('transform')
                            .replace('translate(', '')
                            .replace(')', '')
                            .split(' ')

                        const clone = cloneClass(toCopyNode)

                        switch (true) {
                            case clone instanceof Getter:
                                clone.id = clone.id.split('/getter/')[0] + '/getter/' + randomID()
                                break
                            case clone instanceof Setter:
                                clone.id = clone.id.split('/setter/')[0] + '/setter/' + randomID()
                                break
                            case clone instanceof EntityReference:
                                clone.id = clone.id.split('/')[0] + '/' + randomID()
                                break
                            default:
                                clone.id = randomID()
                                break
                        }

                        clone.x = parseFloat(transformation[0]) + 5
                        clone.y = parseFloat(transformation[1]) + 5

                        hook.setNodes(prev => {
                            return [...prev, clone]
                        })
                    }
                })
            }
        }
    ]
}