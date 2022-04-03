import Board from "../../components/flow/components/Board";
import useScriptingView from "./hooks/useScriptingView";
import Available from "../../components/flow/components/Available";
import styles from '../../components/flow/styles/Board.module.css'
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import ResizableBar from "../../components/resizable/ResizableBar";
import useHotKeys from "../../services/hooks/useHotKeys";
import {allNodes} from "./templates/AllNodes";
import NodeEditor from "./components/NodeEditor";
import Structure from "./components/Structure";
import mapNodes from "./utils/mapNodes";
import getHotKeys from "./utils/getHotKeys";
import getAvailableNodes from "./utils/getAvailableNodes";
import {AlertProvider, Button, LoaderProvider, Tab, Tabs} from "@f-ui/core";

import EntityReference from "./nodes/events/EntityReference";

export default function MinimalBlueprintView(props) {
    const load = useContext(LoaderProvider)
    const hook = useScriptingView(undefined, undefined, load, true)
    const ref = useRef()
    const wrapperRef = useRef()
    const controlProvider = useContext(ControlProvider)
    const [toCopy, setToCopy] = useState([])
    const [selectedVariable, setSelectedVariable] = useState()
    const [scale, setScale] = useState(1)
    useEffect(() => {
        if(hook.selected.length > 0)
        setSelectedVariable(undefined)
    }, [hook.selected])
    useEffect(() => {
        controlProvider.setTabAttributes(
            [
                {
                    label: 'Compile',
                    group: 'b',
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>check</span>,
                    onClick: () => {
                        // TODO - find errors
                    }
                },
                {
                    label: 'Save',
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                    onClick: () => props.submitPackage(mapNodes(hook, props.engine, {id: props.id, name: props.name}, true), false)
                },
                {
                    label: 'Save & close',
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                    onClick: () => props.submitPackage(mapNodes(hook, props.engine, {
                        id: props.id,
                        name: props.name
                    }, true), true)
                }
            ],
            props.name,
            <span
                style={{fontSize: '1.2rem'}}
                className={`material-icons-round`}>foundation</span>,
            () => null,
            true,
            props.index
        )

    }, [hook.nodes, hook.links, hook.variables, hook.groups, props.engine.entities])

    useHotKeys({
        focusTarget: props.id + '-board-wrapper',
        disabled: controlProvider.tab !== props.index,
        actions: getHotKeys(hook, props, toCopy, setToCopy)
    })

    const availableNodes = useMemo(() => {
        return getAvailableNodes(hook)
    }, [hook.variables])

    return (
        <div className={styles.prototypeWrapper} ref={ref} id={props.id + '-board-wrapper'}>
            <Structure
                hook={hook}
                isLevelBlueprint={true}
                engine={props.engine}
                selectedVariable={selectedVariable}
                setSelectedVariable={setSelectedVariable}
                focusNode={(n) => {
                    let f = document.getElementById(n)?.parentNode
                    if (f) {
                        const transformation = f
                            .getAttribute('transform')
                            .replace('translate(', '')
                            .replace(')', '')
                            .split(' ')
                        wrapperRef.current.lastChild.scrollLeft = parseFloat(transformation[0]) - wrapperRef.current.lastChild.offsetWidth / 2 + 150
                        wrapperRef.current.lastChild.scrollTop = parseFloat(transformation[1]) - wrapperRef.current.lastChild.offsetHeight / 2
                        hook.setSelected([n])

                    }
                }}
            />
            <ResizableBar type={"width"}/>
            <div ref={wrapperRef} className={styles.prototypeWrapperBoard}>
                <Board
                    id={props.id}
                    allNodes={availableNodes}
                    setAlert={props.setAlert}
                    parentRef={ref}
                    onEmptyClick={() => setSelectedVariable(undefined)}
                    onDrop={(ev) => {
                        const dt = ev.dataTransfer.getData('text')
                        const entity = props.engine.entities.find(e => e.id === dt)

                        if (entity)
                            return [true, new EntityReference(dt, entity?.name)]
                        else
                            return [true]
                    }}
                    hook={hook}
                    selected={hook.selected}
                    setSelected={hook.setSelected}
                    scale={scale}
                    setScale={setScale}
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
                    selected={hook.selected}
                    selectedVariable={selectedVariable}
                />
                <Available allNodes={allNodes}/>
            </div>
        </div>
    )
}

MinimalBlueprintView.propTypes = {
    engine: PropTypes.object,
    index: PropTypes.number.isRequired,
    setAlert: PropTypes.func.isRequired,
    id: PropTypes.string,
    submitPackage: PropTypes.func.isRequired

}