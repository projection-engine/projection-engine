import shared from "../styles/ViewportOptions.module.css"
import styles from "../styles/CameraOptions.module.css"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import React, {useContext, useEffect, useMemo, useState} from "react"
import EditorCamera from "../../../engine-extension/camera/EditorCamera"
import {handleGrab} from "../transformCamera"
import Range from "../../../../components/range/Range"
import SettingsProvider from "../../../providers/SettingsProvider"
import CameraGizmo from "./CameraGizmo"

export default function Camera(props) {
    const  settingsContext = useContext(SettingsProvider)
    const {engine} = props

    useEffect(() => {
        if(engine.renderer) {
            engine.renderer.camera.ortho = settingsContext.ortho
            engine.renderer.camera.updateProjection()
        }
    }, [engine.renderer])
    const cameraIcon = useMemo(() => {
        if (!settingsContext.ortho)
            return (
                <div
                    style={{width: "20px", height: "20px", perspective: "40px", transformStyle: "preserve-3d"}}>
                    <Icon
                        styles={{fontSize: "1.1rem", transform: "rotateX(45deg)"}}
                    >grid_on</Icon>
                </div>
            )
        else
            return <Icon styles={{fontSize: "1rem"}} >grid_on</Icon>
    }, [settingsContext.ortho])

    const [cameraSpeed, setCameraSpeed] = useState(settingsContext.cameraSpeed)
    const [cameraScrollDelay, setCameraScrollDelay] = useState(settingsContext.cameraScrollDelay)
    const [cameraScrollSpeed, setCameraScrollSpeed] = useState(settingsContext.cameraScrollSpeed)
    function bind(yaw, pitch) {
        engine.renderer.camera.updateProjection()
        engine.renderer.camera.yaw = yaw
        engine.renderer.camera.pitch = pitch
        engine.renderer.camera.updateViewMatrix()
    }
    return (
        <div className={styles.wrapper} style={{right: props.sideBarOpen ? "25px" : undefined}}>
            <CameraGizmo  bind={bind} renderer={engine.renderer}/>
            <div className={shared.buttonGroup} style={{display: "grid", gap: "2px"}}>
                <Dropdown hideArrow={true}
                    className={shared.groupItemVert}
                >
                    <ToolTip styles={{textAlign: "left", display: "grid"}}>
                        Camera position
                    </ToolTip>
                    <Icon styles={{fontSize: "1.1rem"}} >videocam</Icon>
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: "Top",
                                onClick: () => bind(0, Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: "Bottom",
                                onClick: () => bind(0, -Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: "Left",
                                onClick: () => bind(Math.PI , 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: "Right",
                                onClick: () => bind(0,0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: "Front",
                                onClick: () =>  bind(Math.PI /2, 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: "Back",
                                onClick: () =>  bind(Math.PI * 1.5, 0)
                            }}/>
                    </DropdownOptions>
                </Dropdown>
                <Dropdown
                    className={shared.groupItemVert}
                    hideArrow={true}>
                    <ToolTip styles={{textAlign: "left", display: "grid"}}>
                       Camera sensitivity
                    </ToolTip>
                    <Icon
                        styles={{fontSize: "1rem"}}>directions_run</Icon>
                    <DropdownOptions>
                        <div className={shared.rangeWrapper} style={{display: "grid"}}>
                            <div className={shared.rangeLabel}>
                                Movement sensitivity
                            </div>
                            <Range
                                onFinish={v => {
                                    setCameraSpeed(v)
                                    settingsContext.cameraSpeed = v
                                }} accentColor={"red"}
                                handleChange={(v) => setCameraSpeed(v)}
                                value={cameraSpeed}
                                minValue={0.00000001}
                                precision={4}
                                incrementPercentage={.0001}
                            />
                        </div>
                        <div className={shared.rangeWrapper} style={{display: "grid"}}>
                            <div className={shared.rangeLabel}>
                                Zoom speed
                            </div>
                            <Range
                                onFinish={v => {
                                    setCameraScrollSpeed(v)
                                    settingsContext.cameraScrollSpeed = v
                                }} accentColor={"red"}
                                handleChange={(v) => setCameraScrollSpeed(v)}
                                value={cameraScrollSpeed}
                                minValue={0}
                                precision={4}
                                incrementPercentage={.0001}
                            />
                        </div>
                        <div className={shared.rangeWrapper} style={{display: "grid"}}>
                            <div className={shared.rangeLabel}>
                                Zoom delay
                            </div>
                            <Range
                                onFinish={v => {
                                    setCameraScrollDelay(v)
                                    settingsContext.cameraScrollDelay = v
                                }} accentColor={"red"}
                                handleChange={(v) => setCameraScrollDelay(v)}
                                value={cameraScrollDelay}
                                minValue={0}
                                precision={1}
                                incrementPercentage={.1}
                            />
                        </div>
                    </DropdownOptions>
                </Dropdown>
                <Button
                    className={shared.groupItemVert}
                    onClick={() => {
                        engine.renderer.camera.ortho = !engine.renderer.camera.ortho
                        engine.renderer.camera.updateProjection()

                        settingsContext.ortho = !settingsContext.ortho
                    }}>
                    <ToolTip styles={{textAlign: "left", display: "grid"}}>
                        <div>Switch between last Ortho/Perspective</div>
                    </ToolTip>
                    {cameraIcon}
                </Button>

                <div
                    className={shared.buttonGroup}
                    style={{
                        display: engine.renderer?.camera instanceof EditorCamera ? "grid" : "none",
                        transform: "translateY(12px)",
                        gap: "2px"
                    }}>

                    <div
                        className={[shared.groupItemVert, shared.dragInput].join(" ")}
                        onMouseDown={e => handleGrab(e, engine.renderer.camera, 0)}
                    >
                        <ToolTip styles={{textAlign: "left", display: "grid"}}>
                            Drag X to zoom in/out
                        </ToolTip>
                        <Icon >zoom_in</Icon>
                    </div>
                    <div
                        className={[shared.groupItemVert, shared.dragInput].join(" ")}
                        onMouseDown={e => handleGrab(e, engine.renderer.camera, 1)}
                        onDoubleClick={() => {
                            engine.renderer.camera.centerOn = [0, 0, 0]
                            engine.renderer.camera.updateViewMatrix()
                        }}>
                        <ToolTip styles={{textAlign: "left", display: "grid"}}>
                            <div>- Drag X to move forward/backwards</div>
                            <div>- Drag Y to move up/down</div>
                            <div>- Double click to center</div>
                        </ToolTip>
                        <Icon >back_hand</Icon>
                    </div>
                </div>
            </div>
        </div>
    )

}
Camera.propTypes = {
    sideBarOpen: PropTypes.bool,
    engine: PropTypes.object
}