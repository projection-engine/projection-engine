<script>
    import {handleGrab} from "../utils/transform-camera"
    import updateCameraPlacement from "../utils/update-camera-placement"
    import {get} from "svelte/store";
    import {settingsStore} from "../../../stores/settings-store";
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import CameraGizmo from "./CameraGizmo.svelte";
    import CAMERA_GIZMO from "../../../static/misc/CAMERA_GIZMO"
    import {onMount} from "svelte";

    let requested = false
    let camera = window.renderer.camera

    function updateCameraRotation() {
        const transformationMatrix = camera.getNotTranslatedViewMatrix()
        camera.gizmoReference.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${transformationMatrix})`
    }

    onMount(() => {
        camera.gizmoReference = document.getElementById(CAMERA_GIZMO)
        updateCameraRotation()
    })

    export let translate
    let cameraIsOrtho = false

    const settings = get(settingsStore)


</script>

<div class={"wrapper"} style={{right: settings.visible.sideBarViewport ? "25px" : "0"}}>

    <div
            class={"gizmo-wrapper"}
            on:mousedown={({currentTarget}) => currentTarget.isFocused = true}
            on:mouseup={({currentTarget}) => {
        currentTarget.isFocused = false
        requested = false
    }}
            on:mousemove={({currentTarget, movementX, movementY}) => {
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

    <div class="vertical-options">
        <Dropdown hideArrow={true}>
            <button class={"item"} slot="button">
                <Icon styles={"font-size: 1.1rem"}>videocam</Icon>
                <ToolTip>
                    Camera position
                </ToolTip>
            </button>

            <button class={"item"} on:click={() => updateCameraPlacement(0, Math.PI /2)}>
                {translate("TOP")}
            </button>
            <button class={"item"} on:click={() => updateCameraPlacement(0, -Math.PI /2)}>
                {translate("BOTTOM")}
            </button>
            <button class={"item"} on:click={() => updateCameraPlacement(Math.PI, 0)}>
                {translate("LEFT")}
            </button>
            <button class={"item"} on:click={() => updateCameraPlacement(0, 0)}>
                {translate("RIGHT")}
            </button>
            <button class={"item"} on:click={() => updateCameraPlacement(Math.PI/2, 0)}>
                {translate("FRONT")}
            </button>
            <button class={"item"} on:click={() => updateCameraPlacement(Math.PI * 1.5, 0)}>
                {translate("BACK")}
            </button>
        </Dropdown>

        <button
                class={"item"}
                on:click={() => {
                const negated = !window.renderer.camera.ortho
                window.renderer.camera.ortho = negated
                window.renderer.camera.updateProjection()
                cameraIsOrtho  = negated
            }}>
            <ToolTip>
                {translate("SWITCH_PROJECTION")}
            </ToolTip>
            {#if !cameraIsOrtho}
                <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                    <Icon styles="font-size: 1.1rem; transform: rotateX(45deg)">grid_on</Icon>
                </div>
            {:else}
                <Icon styles="font-size: 1rem">grid_on</Icon>
            {/if}
        </button>

        <div class="vertical-options">
            <div class={"item dragInput"} on:mousedown={e => handleGrab(e, window.renderer.camera, 0)}>
                <ToolTip styles={{textAlign: "left", display: "grid"}}>
                    {translate("DRAG_X_ZOOM")}
                </ToolTip>
                <Icon>zoom_in</Icon>
            </div>
            <div
                    class={"item dragInput"}
                    on:mousedown={e => handleGrab(e, window.renderer.camera, 1)}
                    on:dblclick={() => {
                    window.renderer.camera.centerOn = [0, 0, 0]
                    window.renderer.camera.updateViewMatrix()
                }}>
                <ToolTip>
                    <div>{translate("DRAG_X_DIR")}</div>
                    <div>{translate("DRAG_Y_DIR")}</div>
                    <div>{translate("DOUBLE_CLICK")}</div>
                </ToolTip>
                <Icon>back_hand</Icon>
            </div>
        </div>
    </div>
</div>


<style>

    .gizmo-wrapper {
        overflow: hidden;
        border-radius: 50%;
        padding: 4px;
        transition: 150ms linear;
    }

    .gizmo-wrapper:hover {
        background: rgb(255 255 255 / 25%);
    }

    .gizmo-wrapper:active {
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