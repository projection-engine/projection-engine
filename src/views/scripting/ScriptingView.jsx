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

export default function ScriptingView(props) {
    const hook = useScriptingView(props.file)
    const ref = useRef()
    const wrapperRef = useRef()
    const controlProvider = useContext(ControlProvider)
    const [toCopy, setToCopy] = useState([])
    const [selectedVariable, setSelectedVariable] = useState()
    const [scale, setScale] = useState(1)

    useEffect(() => {
        controlProvider.setTabAttributes(
            [
                {
                    label: 'Save',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                    onClick: () => props.submitPackage(mapNodes(hook), false)
                },
                {
                    label: 'Save & close',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                    onClick: () => props.submitPackage(mapNodes(hook), true)
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

    }, [hook.nodes, hook.links, hook.variables, hook.groups])

    useHotKeys({
        focusTarget: props.file.fileID + '-board',
        disabled: controlProvider.tab !== props.index,
        actions: getHotKeys(hook, props, toCopy, setToCopy)
    })

    const availableNodes = useMemo(() => {
        return getAvailableNodes(hook)
    }, [hook.variables])

    return (
        <div className={styles.prototypeWrapper} ref={ref}>

            <Structure
                hook={hook}
                selectedVariable={selectedVariable} setSelectedVariable={setSelectedVariable}
                selected={hook.selected[0]}
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
            <div className={styles.prototypeWrapperBoard} ref={wrapperRef} id={props.file.fileID + '-board'}>
                <Board
                    allNodes={availableNodes}
                    setAlert={props.setAlert}
                    parentRef={ref}
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
                    selected={hook.selected[0]}
                    selectedVariable={selectedVariable}
                />

                <Available allNodes={allNodes}/>
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