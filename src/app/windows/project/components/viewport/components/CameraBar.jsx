import styles from "../styles/SideOptions.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import React, {useContext, useMemo, useState} from "react"
import {handleGrab} from "../utils/transform-camera"
import CameraGizmo from "./CameraGizmo"
import useLocalization from "../../../../global/useLocalization"
import updateCameraPlacement from "../utils/update-camera-placement"
import SettingsProvider from "../../../context/SettingsProvider"

export default function CameraBar() {
    const [cameraIsOrtho, setCameraIsOrtho] = useState(false)
    const cameraIcon = useMemo(() => {
        if (!cameraIsOrtho)
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
    }, [cameraIsOrtho])


    const translate = useLocalization("PROJECT", "VIEWPORT")
    const settings = useContext(SettingsProvider)
    return (
        <div className={styles.cameraWrapper} style={{right: settings.visible.sideBarViewport ? "25px" : "0"}}>
            <CameraGizmo />
            <div
                style={{
                    display: "grid",
                    gap: "2px"
                }}>
                <Dropdown
                    hideArrow={true}
                    className={styles.groupItemVert}
                >
                    <ToolTip styles={{textAlign: "left", display: "grid"}}>
                        Camera position
                    </ToolTip>
                    <Icon styles={{fontSize: "1.1rem"}} >videocam</Icon>
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: translate("TOP"),
                                onClick: () => updateCameraPlacement(0, Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: translate("BOTTOM"),
                                onClick: () => updateCameraPlacement(0, -Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: translate("LEFT"),
                                onClick: () => updateCameraPlacement(Math.PI , 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: translate("RIGHT"),
                                onClick: () => updateCameraPlacement(0,0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: translate("FRONT"),
                                onClick: () =>  updateCameraPlacement(Math.PI /2, 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: translate("BACK"),
                                onClick: () =>  updateCameraPlacement(Math.PI * 1.5, 0)
                            }}/>
                    </DropdownOptions>
                </Dropdown>

                <Button
                    className={styles.groupItemVert}
                    onClick={() => {
                        const negated = !window.renderer.camera.ortho
                        window.renderer.camera.ortho = negated
                        window.renderer.camera.updateProjection()
                        setCameraIsOrtho(negated)
                    }}>
                    <ToolTip styles={{textAlign: "left", display: "grid"}}>
                        {translate("SWITCH_PROJECTION")}
                    </ToolTip>
                    {cameraIcon}
                </Button>

                <div
                    style={{
                        display: "grid",
                        transform: "translateY(12px)",
                        gap: "2px"
                    }}
                >

                    <div
                        className={[styles.groupItemVert, styles.dragInput].join(" ")}
                        onMouseDown={e => handleGrab(e, window.renderer.camera, 0)}
                    >
                        <ToolTip styles={{textAlign: "left", display: "grid"}}>
                            {translate("DRAG_X_ZOOM")}
                        </ToolTip>
                        <Icon >zoom_in</Icon>
                    </div>
                    <div
                        className={[styles.groupItemVert, styles.dragInput].join(" ")}
                        onMouseDown={e => handleGrab(e, window.renderer.camera, 1)}
                        onDoubleClick={() => {
                            window.renderer.camera.centerOn = [0, 0, 0]
                            window.renderer.camera.updateViewMatrix()
                        }}>
                        <ToolTip styles={{textAlign: "left", display: "grid"}}>
                            <div>{translate("DRAG_X_DIR")}</div>
                            <div>{translate("DRAG_Y_DIR")}</div>
                            <div>{translate("DOUBLE_CLICK")}</div>
                        </ToolTip>
                        <Icon >back_hand</Icon>
                    </div>
                </div>
            </div>
        </div>
    )

}