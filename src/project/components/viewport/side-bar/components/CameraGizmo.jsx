import styles from "../../options/styles/ViewportOptions.module.css"
import CAMERA_GIZMO from "../../../../../static/misc/CAMERA_GIZMO"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef} from "react"


export default function CameraGizmo(props){
    const {bind, initialized} = props
    let requested = false
    const ref = useRef()

    function updateCameraRotation(){
        if(initialized) {
            const t = window.renderer.camera.getNotTranslatedViewMatrix()
            ref.current.style.transform = `translateZ(calc(var(--cubeSize) * -3)) matrix3d(${t})`
        }
    }
    useEffect(() => {
        updateCameraRotation()
    }, [initialized])
    return (
        <div 
            className={styles.cubeWrapper}
            onMouseDown={({currentTarget}) => currentTarget.isFocused = true}
            onMouseUp={({currentTarget}) => {
                currentTarget.isFocused = false
                requested = false
            }}
            onMouseMove={({currentTarget, movementX, movementY}) => {
                if(currentTarget.isFocused){

                    if (!requested) {
                        requested = true
                        currentTarget.requestPointerLock()
                    }

                    if (movementY < 0)
                        window.renderer.camera.pitch += .01 * Math.abs(movementY)

                    else if (movementY > 0)
                        window.renderer.camera.pitch -= .01 * Math.abs(movementY)

                    if (movementX > 0)
                        window.renderer.camera.yaw += .01 * Math.abs(movementX)
                    else if (movementX < 0)
                        window.renderer.camera.yaw -= .01 * Math.abs(movementX)

                    window.renderer.camera.updateViewMatrix()
                    updateCameraRotation()
                }
            }}
        >
            <div className={styles.cameraView}>
                <div className={styles.cube} id={CAMERA_GIZMO} ref={ref}>
                    <div
                        className={[styles.face, styles.front].join(" ")}
                        style={{background: "hsl(205, 100%, var(--brightness))"}}
                        onClick={() => {
                            bind(Math.PI / 2, 0)
                            updateCameraRotation()
                        }}
                    >
						Z+
                    </div>
                    <div 
                        className={[styles.face, styles.back, styles.darker].join(" ")}
                        style={{background: "hsl(205, 100%, var(--brightness))"}}
                        onClick={() => {
                            bind(Math.PI * 1.5, 0)
                            updateCameraRotation()
                        }}
                    >
                        Z-
                    </div>
                    <div 
                        className={[styles.face, styles.right].join(" ")}
                        style={{background: "hsl(0, 100%, var(--brightness))"}}
                        onClick={() => {
                            bind(0, 0)
                            updateCameraRotation()
                        }}
                    >
                        X+
                    </div>
                    <div
                        className={[styles.face, styles.left, styles.darker].join(" ")}
                        style={{background: "hsl(0, 100%, var(--brightness))"}}
                        onClick={() => {
                            bind(Math.PI, 0)
                            updateCameraRotation()
                        }}
                    >
                        X-
                    </div>
                    <div
                        className={[styles.face, styles.top, styles.darker].join(" ")}
                        style={{background: "hsl(120, 88%, var(--brightness))"}}
                        onClick={() => {
                            bind(0, Math.PI / 2)
                            updateCameraRotation()
                        }}

                    >
                        Y-
                    </div>
                    <div
                        className={[styles.face, styles.bottom].join(" ")}
                        style={{background: "hsl(120, 88%, var(--brightness))"}}
                        onClick={() => {
                            bind(0, -Math.PI / 2)
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

CameraGizmo.propTypes={
    bind: PropTypes.func
}