import styles from "../styles/SideOptions.module.css"
import CAMERA_GIZMO from "../../../static/misc/CAMERA_GIZMO"
import React, {useEffect, useRef} from "react"
import updateCameraPlacement from "../utils/updateCameraPlacement"


export default function CameraGizmo() {
    let requested = false
    const camera = useRef(window.renderer.camera)

    function updateCameraRotation() {
        const transformationMatrix = camera.current.getNotTranslatedViewMatrix()
        camera.current.gizmoReference.style.transform = `translateZ(calc(var(--cubeSize) * -3)) matrix3d(${transformationMatrix})`
    }

    useEffect(() => {
        camera.current.gizmoReference = document.getElementById(CAMERA_GIZMO)
        updateCameraRotation()
    }, [])

    return (
        <div
            className={styles.cubeWrapper}
            onMouseDown={({currentTarget}) => currentTarget.isFocused = true}
            onMouseUp={({currentTarget}) => {
                currentTarget.isFocused = false
                requested = false
            }}
            onMouseMove={({currentTarget, movementX, movementY}) => {
                if (currentTarget.isFocused) {
                    if (!requested) {
                        requested = true
                        currentTarget.requestPointerLock()
                    }
                    if (movementY < 0)
                        camera.current.pitch += .01 * Math.abs(movementY)
                    else if (movementY > 0)
                        camera.current.pitch -= .01 * Math.abs(movementY)

                    if (movementX > 0)
                        camera.current.yaw += .01 * Math.abs(movementX)
                    else if (movementX < 0)
                        camera.current.yaw -= .01 * Math.abs(movementX)

                    camera.current.updateViewMatrix()
                    updateCameraRotation()
                }
            }}
        >
            <div className={styles.cameraView}>
                <div className={styles.cube} id={CAMERA_GIZMO}>
                    <div
                        className={[styles.face, styles.front].join(" ")}
                        style={{background: "hsl(205, 100%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(Math.PI / 2, 0)
                            updateCameraRotation()
                        }}
                    >
						Z+
                    </div>
                    <div
                        className={[styles.face, styles.back, styles.darker].join(" ")}
                        style={{background: "hsl(205, 100%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(Math.PI * 1.5, 0)
                            updateCameraRotation()
                        }}
                    >
						Z-
                    </div>
                    <div
                        className={[styles.face, styles.right].join(" ")}
                        style={{background: "hsl(0, 100%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(0, 0)
                            updateCameraRotation()
                        }}
                    >
						X+
                    </div>
                    <div
                        className={[styles.face, styles.left, styles.darker].join(" ")}
                        style={{background: "hsl(0, 100%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(Math.PI, 0)
                            updateCameraRotation()
                        }}
                    >
						X-
                    </div>
                    <div
                        className={[styles.face, styles.top, styles.darker].join(" ")}
                        style={{background: "hsl(120, 88%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(0, Math.PI / 2)
                            updateCameraRotation()
                        }}

                    >
						Y-
                    </div>
                    <div
                        className={[styles.face, styles.bottom].join(" ")}
                        style={{background: "hsl(120, 88%, var(--brightness))"}}
                        onClick={() => {
                            updateCameraPlacement(0, -Math.PI / 2)
                            updateCameraRotation()
                        }}
                    >
						Y+
                    </div>
                </div>
            </div>
        </div>

    )
}