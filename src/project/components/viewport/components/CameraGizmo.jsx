import styles from "../styles/ViewportOptions.module.css"
import CAMERA_GIZMO from "../../../engine-extension/CAMERA_GIZMO"
import PropTypes from "prop-types"
import React, {useEffect, useRef} from "react"


export default function CameraGizmo(props){
    const {bind, renderer} = props
    let requested = false
    const ref = useRef()

    function updateCameraRotation(){
        const camera = renderer.camera
        const t = camera.getNotTranslatedViewMatrix()
        ref.current.style.transform = `translateZ(calc(var(--cubeSize) * -3)) matrix3d(${t})`
    }
    useEffect(() => {
        if(renderer)
            updateCameraRotation()
    }, [renderer])
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
                    const camera = renderer.camera
                    if (!requested) {
                        requested = true
                        currentTarget.requestPointerLock()
                    }

                    if (movementY < 0)
                        camera.pitch += .01 * Math.abs(movementY)

                    else if (movementY > 0)
                        camera.pitch -= .01 * Math.abs(movementY)

                    if (movementX > 0)
                        camera.yaw += .01 * Math.abs(movementX)
                    else if (movementX < 0)
                        camera.yaw -= .01 * Math.abs(movementX)
             
                    camera.updateViewMatrix()
                    updateCameraRotation()
                }
            }}
        >
            <div className={styles.cameraView}>
                <div className={styles.cube} id={CAMERA_GIZMO} ref={ref}>
                    <div
                        className={[styles.face, styles.front].join(" ")}
                        onClick={() => {
                            bind(Math.PI / 2, 0)
                            updateCameraRotation()
                        }}
                    >
						Z+
                    </div>
                    <div 
                        className={[styles.face, styles.back].join(" ")}
					    onClick={() => {
                            bind(Math.PI * 1.5, 0)
                            updateCameraRotation()
                        }}
                    >
                        Z-
                    </div>
                    <div 
                        className={[styles.face, styles.right].join(" ")}
                        onClick={() => {
                            bind(0, 0)
                            updateCameraRotation()
                        }}
                    >
                        X+
                    </div>
                    <div
                        className={[styles.face, styles.left].join(" ")}
                        onClick={() => {
                            bind(Math.PI, 0)
                            updateCameraRotation()
                        }}
                    >
                        X-
                    </div>
                    <div
                        className={[styles.face, styles.top].join(" ")}
						 onClick={() => {
                            bind(0, Math.PI / 2)
                            updateCameraRotation()
                        }}
                    >
                        Y+
                    </div>
                    <div
                        className={[styles.face, styles.bottom].join(" ")}
						 onClick={() => {
                            bind(0, -Math.PI / 2)
                            updateCameraRotation()
                        }}
                    >
                        Y-
                    </div>
                </div>
            </div>
        </div>

    )
}

CameraGizmo.propTypes={
    renderer: PropTypes.object,
    bind: PropTypes.func
}