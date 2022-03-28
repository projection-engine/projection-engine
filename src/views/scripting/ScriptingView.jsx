import Board from "../../components/flow/components/Board";
import useScriptingView from "./hooks/useScriptingView";
import Available from "./components/Available";
import styles from '../../components/flow/styles/Board.module.css'
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import ResizableBar from "../../components/resizable/ResizableBar";
import EVENTS from "../../services/utils/misc/EVENTS";
import compile from "./utils/compile";
import useHotKeys, {KEYS} from "../../services/hooks/useHotKeys";
import cloneClass from "../../services/utils/misc/cloneClass";
import randomID from "../../services/utils/misc/randomID";
import deleteNode from "../../components/flow/utils/deleteNode";
import EventTick from "./nodes/EventTick";
import {allNodes} from "./templates/AllNodes";
import NodeEditor from "./components/NodeEditor";
import SetWorldRotation from "./nodes/transformation/SetWorldRotation";
import Setter from "./nodes/Setter";
import Getter from "./nodes/Getter";
import Structure from "./components/Structure";

export default function ScriptingView(props) {
    const hook = useScriptingView(props.file)
    const ref = useRef()
    const controlProvider = useContext(ControlProvider)
    const [selectedVariable, setSelectedVariable] = useState()
    const mapNodes = (res) => {
        const parsedNodes = hook.nodes.map(n => {
            const docNode = document.getElementById(n.id).parentNode
            const transformation = docNode
                .getAttribute('transform')
                .replace('translate(', '')
                .replace(')', '')
                .split(' ')

            return {
                ...n,
                x: parseFloat(transformation[0]),
                y: parseFloat(transformation[1]),
                instance: n.constructor.name
            }
        })


        return JSON.stringify({
            nodes: parsedNodes,
            links: hook.links,
            variables: hook.variables,
            response: res,
            type: res.variant
        })
    }

    useEffect(() => {
        controlProvider.setTabAttributes(
            [
                {
                    label: 'Save',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                    onClick: () => {
                        const response = mapNodes(compile(hook.nodes, hook.links, hook.variables))
                        props.submitPackage(
                            response,
                            false
                        )

                    }
                },
                {
                    label: 'Save & close',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                    onClick: () => {

                        const response = mapNodes(compile(hook.nodes, hook.links, hook.variables))
                        props.submitPackage(
                            response,
                            true
                        )

                    }
                }
            ],
            props.file.name,
            <span
                style={{fontSize: '1.2rem'}}
                className={`material-icons-round`}>functions</span>,
            () => null,
            true,

            props.index
        )

    }, [hook.nodes, hook.links, hook.variables])
    const [toCopy, setToCopy] = useState([])
    useHotKeys({
        focusTarget: props.file.fileID + '-board',
        disabled: controlProvider.tab !== props.index,
        actions: [
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
                    hook.selected.forEach(n => {
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
                            const nodeEl = document.getElementById(toC)

                            const clone = cloneClass(toCopyNode)
                            clone.id = randomID()
                            clone.x = nodeEl.getBoundingClientRect().x + 5
                            clone.y = nodeEl.getBoundingClientRect().y + 5

                            hook.setNodes(prev => {
                                return [...prev, clone]
                            })
                        }
                    })
                }
            }
        ]
    })

    const availableNodes = useMemo(() => {
        return [...allNodes, ...hook.variables.map(v => {
            return [
                {
                    label: <label className={styles.label}>Getter - {v.name}</label>,
                    dataTransfer: JSON.stringify({
                        key: v.id,
                        type: 'getter'
                    }),
                    getNewInstance: () => new Getter(v.id + '/getter/' + randomID(), v.name + ' - Getter', v.type)
                },
                {
                    label: <label className={styles.label}>Setter - {v.name}</label>,
                    dataTransfer: JSON.stringify({
                        key: v.id,
                        type: 'setter'
                    }),
                    getNewInstance: () => new Setter(v.id + '/setter/' + randomID(), v.name + ' - Setter', v.type)
                }
            ]
        }).flat()]
    }, [hook.variables])

    return (
        <div className={styles.prototypeWrapper} ref={ref}>

            <Structure
                hook={hook}
                selectedVariable={selectedVariable} setSelectedVariable={setSelectedVariable}
                selected={hook.selected[0]}
            />

            <ResizableBar type={"width"}/>
            <div className={styles.prototypeWrapperBoard} id={props.file.fileID + '-board'}>
                <Board
                    allNodes={availableNodes}
                    setAlert={props.setAlert}
                    parentRef={ref}
                    hook={hook}
                    selected={hook.selected}
                    setSelected={hook.setSelected}
                />
            </div>
            <ResizableBar type={'width'}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '275px',
                gap: '3px',
                overflow: 'hidden'
            }}>
                <NodeEditor
                    hook={hook}
                    selected={hook.selected[0]}
                    selectedVariable={selectedVariable}
                />

                <Available/>
            </div>

        </div>
    )
}

ScriptingView.propTypes = {
    index: PropTypes.number.isRequired,
    setAlert: PropTypes.func.isRequired,
    file: PropTypes.shape({
        fileID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.string,
    }),
    submitPackage: PropTypes.func.isRequired,

}