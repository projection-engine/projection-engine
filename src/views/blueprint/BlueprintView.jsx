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
import MinimalTabs from "./components/MinimalTabs";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import useEngine from "../../services/hooks/useEngine";
import Viewport from "../../components/viewport/Viewport";
import FormTabs from "../scene/forms/FormTabs";
import COMPONENTS from "../../services/engine/templates/COMPONENTS";
import ScriptComponent from "../../services/engine/ecs/components/ScriptComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import useForm from "../scene/utils/useForm";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";
import sceneStyles from '../scene/styles/Scene.module.css'
import handleDrop from "../../services/utils/handleDrop";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";
import CAMERA_TYPES from "../../services/engine/templates/CAMERA_TYPES";
import ViewportOptions from "../../components/viewport/ViewportOptions";
import EntityReference from "./nodes/events/EntityReference";

export default function BlueprintView(props) {
    const settings = useContext(SettingsProvider)
    const load = useContext(LoaderProvider)
    const engine = useEngine(props.file.registryID, false, {
        ...settings,
        shadingModel: SHADING_MODELS.FLAT,
        cameraType: CAMERA_TYPES.SPHERICAL
    }, load, true)

    const hook = useScriptingView(props.file, engine, load)
    const ref = useRef()
    const wrapperRef = useRef()
    const controlProvider = useContext(ControlProvider)
    const [toCopy, setToCopy] = useState([])
    const [selectedVariable, setSelectedVariable] = useState()
    const [scale, setScale] = useState(1)
    const [open, setOpen] = useState(0)
    const [currentTab, setCurrentTab] = useState(0)
    const alert = useContext(AlertProvider)
    const setAlert = ({type, message}) => {
        alert.pushAlert(message, type)
    }

    useEffect(() => {
        controlProvider.setTabAttributes(
            [
                {
                    label: 'Save',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                    onClick: () => props.submitPackage(mapNodes(hook, engine), false)
                },
                {
                    label: 'Save & close',
                    disabled: hook.disabled,
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                    onClick: () => props.submitPackage(mapNodes(hook, engine), true)
                }
            ],
            props.file.name,
            <span
                style={{fontSize: '1.2rem'}}
                className={`material-icons-round`}>functions</span>,
            (newTab) => {
                if (newTab === props.index)
                    engine.setCanRender(true)
                else
                    engine.setCanRender(false)
            },
            true,

            props.index
        )

    }, [hook.nodes, hook.links, hook.variables, hook.groups, engine.entities])

    useHotKeys({
        focusTarget: props.file.registryID + '-board',
        disabled: controlProvider.tab !== props.index,
        actions: getHotKeys(hook, props, toCopy, setToCopy)
    })


    const availableNodes = useMemo(() => {
        return getAvailableNodes(hook)
    }, [hook.variables])

    const currentForm = useForm(
        engine,

        setAlert,
        false,

        hook.quickAccess,
        load,
        currentTab
    )


    return (
        <div className={styles.prototypeWrapper} ref={ref}>

            <Structure
                hook={hook}
                openTab={open}
                engine={engine}
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
            <MinimalTabs

                tabs={['Viewport', 'Event graph']}
                reference={wrapperRef}
                className={styles.prototypeWrapperBoard}
                open={open}
                setOpen={setOpen}
                onTabSwitch={i => {
                    if (i === 0)
                        engine.setCanRender(true)
                    else
                        engine.setCanRender(false)
                }}
            >
                <div style={{
                    display: open === 0 ? undefined : 'none',
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <ViewportOptions engine={engine} id={props.file.fileID} minimal={true}/>
                    <Viewport
                        allowDrop={true}
                        id={props.file.registryID}
                        showPosition={false}
                        handleDrop={event => handleDrop(event, hook.quickAccess.fileSystem, engine, setAlert, load)}
                        engine={engine}/>
                </div>

                    <Board
                        hide={open === 0}
                        allNodes={availableNodes}
                        setAlert={props.setAlert}
                        parentRef={ref}
                        onDrop={(ev) => {
                            const dt = ev.dataTransfer.getData('text')
                            const entity = engine.entities.find(e => e.id === dt)
                            if(entity)
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


            </MinimalTabs>
            <ResizableBar type={'width'}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '275px',
                gap: '3px',
                overflow: 'hidden'
            }}>
                {open === 0 ?
                    <div className={sceneStyles.wrapperContent}>
                        {currentForm.open ? (
                            <div className={sceneStyles.header}>
                                <label>{currentForm.name}</label>
                                <Button
                                    styles={{height: '20px', width: '20px'}}
                                    onClick={() => engine.setLockedEntity(engine.lockedEntity === currentForm.selected?.id ? undefined : currentForm.selected.id)}
                                    className={styles.button}
                                    highlight={engine.lockedEntity === currentForm.selected?.id}
                                    variant={"outlined"}>
                                    <span className={'material-icons-round'} style={{fontSize: '1rem'}}>push_pin</span>
                                </Button>
                            </div>
                        ) : null}

                        <div className={sceneStyles.content}>
                            {currentForm.open ?
                                <FormTabs
                                    addComponent={() => {
                                        currentForm.selected.components[COMPONENTS.SCRIPT] = new ScriptComponent()
                                        engine.dispatchEntities({
                                            type: ENTITY_ACTIONS.ADD_COMPONENT,
                                            payload: {
                                                entityID: engine.selected[0],
                                                data: currentForm.selected.components[COMPONENTS.SCRIPT],
                                                key: COMPONENTS.SCRIPT
                                            }
                                        })
                                    }}
                                    entity={currentForm.selected}
                                    currentTab={currentTab}
                                    setCurrentTab={setCurrentTab}
                                />
                                :
                                null
                            }
                            {currentForm.content}
                        </div>
                    </div>
                    :
                    <>
                        <NodeEditor
                            hook={hook}
                            selected={hook.selected[0]}
                            selectedVariable={selectedVariable}
                        />

                        <Available allNodes={allNodes}/>
                    </>
                }
            </div>
        </div>
    )
}

BlueprintView.propTypes = {
    index: PropTypes.number.isRequired,
    setAlert: PropTypes.func.isRequired,
    file: PropTypes.shape({
        registryID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.string,
    }),
    submitPackage: PropTypes.func.isRequired

}