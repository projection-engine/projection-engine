<script>

    import CAMERA_GIZMO from "../../../data/misc/CAMERA_GIZMO"
    import updateCameraPlacement from "../utils/update-camera-placement"
    import {onMount} from "svelte";

    let requested = false


    function updateCameraRotation() {
        const camera = window.renderer.camera
        const transformationMatrix = camera.getNotTranslatedViewMatrix()
        camera.gizmoReference.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${transformationMatrix})`
    }

    onMount(() => {
        window.renderer.camera.gizmoReference = document.getElementById(CAMERA_GIZMO)
        updateCameraRotation()
    })

</script>


<div
    class={"wrapper"}
    on:mousedown={({currentTarget}) => currentTarget.isFocused = true}
    on:mouseup={({currentTarget}) => {
        currentTarget.isFocused = false
        requested = false
    }}
    on:mousemove={({currentTarget, movementX, movementY}) => {
        const camera = window.renderer.camera
        if (currentTarget.isFocused) {
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
    <div class={"cameraView"}>
        <div class={"cube"} id={CAMERA_GIZMO}>
            <div
                class={"face front"}
                style="background: hsl(205, 100%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(Math.PI / 2, 0)
                    updateCameraRotation()
                }}
            >
                Z+
            </div>
            <div
                class={"face back darker"}
                style="background: hsl(205, 100%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(Math.PI * 1.5, 0)
                    updateCameraRotation()
                }}
            >
                Z-
            </div>
            <div
                class={"face right"}
                style="background: hsl(0, 100%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(0, 0)
                    updateCameraRotation()
                }}
            >
                X+
            </div>
            <div
                class={"face left darker"}
                style="background: hsl(0, 100%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(Math.PI, 0)
                    updateCameraRotation()
                }}
            >
                X-
            </div>
            <div
                class={"face top darker"}
                style="background: hsl(120, 88%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(0, Math.PI / 2)
                    updateCameraRotation()
                }}

            >
                Y-
            </div>
            <div
                class={"face bottom"}
                style="background: hsl(120, 88%, var(--brightness))"
                on:click={() => {
                    updateCameraPlacement(0, -Math.PI / 2)
                    updateCameraRotation()
                }}
            >
                Y+
            </div>
        </div>
    </div>
</div>


<style>

    .wrapper {
        overflow: hidden;
        border-radius: 50%;
        padding: 4px;
        transition: 150ms linear;
    }

    .wrapper:hover {
        background: rgb(255 255 255 / 25%);
    }

    .wrapper:active {
        cursor: none;
        background: rgb(255 255 255 / 50%);
    }

    .cameraView {
        --cube-size: 25px;

        width: calc(var(--cube-size) * 2);
        height: calc(var(--cube-size) * 2);
        transform: scale3d(1.5, 1.5, 1.5);
        perspective: calc(var(--cube-size) * 2);
    }

    .cube {
        width: calc(var(--cube-size) * 2);
        height: calc(var(--cube-size) * 2);
        position: relative;
        transform-style: preserve-3d;
        transform: translateZ(calc(var(--cube-size) * -3));
    }

    .face {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8rem;
        font-weight: 900 !important;
        border: transparent 1px solid;
        position: absolute;
        width: var(--cube-size);
        height: var(--cube-size);
        border-radius: 50%;
        text-align: center;

        --brightness: 45%;
    }

    .face:hover {
        border-color: darkorange;
        border-width: 2px;

        --brightness: 50%;
    }

    .front {
        transform: rotateY(0deg) translateZ(var(--cube-size)) translateX(50%) translateY(50%);
    }

    .back {
        transform: rotateY(180deg) translateZ(var(--cube-size)) translateX(-50%) translateY(50%);
    }

    .left {
        transform: rotateY(-90deg) translateZ(calc(var(--cube-size) * 0.5)) translateY(50%);
    }

    .right {
        transform: rotateY(90deg) translateZ(calc(var(--cube-size) * 1.5)) translateY(50%);
    }

    .bottom {
        transform: rotateX(90deg) translateZ(calc(var(--cube-size) * 0.5)) translateX(50%);
    }

    .top {
        transform: rotateX(-90deg) translateZ(calc(var(--cube-size) * 1.5)) translateX(50%);
    }

    .darker {
        color: transparent;
    }

    .darker:hover {
        color: var(--pj-color-secondary);
    }
</style>