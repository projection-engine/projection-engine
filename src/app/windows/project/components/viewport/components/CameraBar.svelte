<script>

    import updateCameraPlacement from "../utils/update-camera-placement"
    import Icon from "../../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import CAMERA_GIZMO from "../../../data/CAMERA_GIZMO"
    import {onDestroy, onMount} from "svelte";
    import CameraAPI from "../../../../../../../public/engine/production/apis/CameraAPI";
    import CameraTracker from "../../../../../../../public/engine/editor/libs/CameraTracker";
    import SettingsStore from "../../../stores/SettingsStore";

    export let translate
    let cameraIsOrtho = false
    let requested = false

    onMount(() => {
        CameraTracker.gizmoReference = document.getElementById(CAMERA_GIZMO)
        CameraTracker.update()
    })

    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())

    const onMouseMove = ({currentTarget, movementX, movementY}) => {
        if (currentTarget.isFocused) {
            if (!requested) {
                requested = true
                currentTarget.requestPointerLock()
            }
            if (movementY < 0)
                CameraTracker.pitch += .01 * Math.abs(movementY)
            else if (movementY > 0)
                CameraTracker.pitch -= .01 * Math.abs(movementY)

            if (movementX > 0)
                CameraTracker.yaw += .01 * Math.abs(movementX)
            else if (movementX < 0)
                CameraTracker.yaw -= .01 * Math.abs(movementX)

            CameraTracker.update()

        }
    }
    const onMouseUp = ({currentTarget}) => {
        currentTarget.isFocused = false
        requested = false
    }
</script>

<div class={"wrapper"} style={settings.visible.sideBarViewport ? "right: 25px" : undefined}>


    <div
            class={"gizmo-wrapper"}
            on:mousedown={({currentTarget}) => currentTarget.isFocused = true}
            on:mouseup={onMouseUp}
            on:mousemove={onMouseMove}
    >
        <div class={"camera-view"}>
            <div class={"cube"} id={CAMERA_GIZMO}>
                <div
                        class={"face front"}
                        style="background: hsl(205, 100%, var(--brightness))"
                        on:click={() => updateCameraPlacement(Math.PI / 2, 0)}
                >
                    Z+
                </div>
                <div
                        class={"face back darker"}
                        style="background: hsl(205, 100%, var(--brightness))"
                        on:click={() => updateCameraPlacement(Math.PI * 1.5, 0)}
                >
                    Z-
                </div>
                <div
                        class={"face right"}
                        style="background: hsl(0, 100%, var(--brightness))"
                        on:click={() => updateCameraPlacement(0, 0)}
                >
                    X+
                </div>
                <div
                        class={"face left darker"}
                        style="background: hsl(0, 100%, var(--brightness))"
                        on:click={() => updateCameraPlacement(Math.PI, 0)}
                >
                    X-
                </div>
                <div
                        class={"face top darker"}
                        style="background: hsl(120, 88%, var(--brightness))"
                        on:click={() => updateCameraPlacement(0, Math.PI / 2)}

                >
                    Y-
                </div>
                <div
                        class={"face bottom"}
                        style="background: hsl(120, 88%, var(--brightness))"
                        on:click={() => updateCameraPlacement(0, -Math.PI / 2)}
                >
                    Y+
                </div>
            </div>
        </div>
    </div>

    <Dropdown noBackground={true} hideArrow={true}>
        <button slot="button" class="option">
            <Icon>videocam</Icon>
            <ToolTip content={translate("CAMERA_POSITION")}/>
        </button>

        <button on:click={() => updateCameraPlacement(0, Math.PI /2)}>
            {translate("TOP")}
        </button>
        <button on:click={() => updateCameraPlacement(0, -Math.PI /2)}>
            {translate("BOTTOM")}
        </button>
        <button on:click={() => updateCameraPlacement(Math.PI, 0)}>
            {translate("LEFT")}
        </button>
        <button on:click={() => updateCameraPlacement(0, 0)}>
            {translate("RIGHT")}
        </button>
        <button on:click={() => updateCameraPlacement(Math.PI/2, 0)}>
            {translate("FRONT")}
        </button>
        <button on:click={() => updateCameraPlacement(Math.PI * 1.5, 0)}>
            {translate("BACK")}
        </button>
    </Dropdown>

    <button
            on:click={() => {
                const negated = !CameraAPI.isOrthographic
                CameraAPI.isOrthographic = negated
                CameraAPI.updateProjection()
                cameraIsOrtho  = negated
            }}
            class="option"
    >
        <ToolTip content={translate("SWITCH_PROJECTION")}/>
        {#if !cameraIsOrtho}
            <div style="width: 20px; height: 20px; perspective: 40px; transform-style: preserve-3d">
                <Icon styles="transform: rotateX(45deg)">grid_on</Icon>
            </div>
        {:else}
            <Icon styles="font-size: 1rem">grid_on</Icon>
        {/if}
    </button>

    <div class="option" on:mousedown={e => CameraTracker.transformCamera(e, 0)}>
        <ToolTip content={translate("ZOOM")}/>
        <Icon>zoom_in</Icon>
    </div>
    <div
            class="option"
            on:mousedown={e => CameraTracker.transformCamera(e,  1)}
            on:dblclick={() => {
                CameraTracker.centerOn = [...window.engineCursor.translation]
                CameraTracker.update()
            }}>
        <ToolTip content={translate("MOVE_IN_SCREEN_SPACE")}/>

        <Icon>back_hand</Icon>
    </div>

</div>


<style>
    .wrapper {
        display: grid;
        align-items: flex-start;
        justify-content: center;
        justify-items: center;

        gap: 2px;
        height: fit-content;
        transition: 150ms ease-in;
        position: absolute;
        right: 0;
        top: 2px;
        z-index: 15;

    }

    .option {
        border: none;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--pj-background-secondary);
        cursor: pointer;
    }

    .option:active {
        color: var(--pj-accent-color);
        border-color: var(--pj-accent-color);
    }


    .gizmo-wrapper {
        overflow: hidden;
        border-radius: 50%;
        padding: 4px;
        transition: 150ms linear;
        border: var(--pj-transparent-border) 1px solid;
    }

    .gizmo-wrapper:hover {
        background: rgb(255 255 255 / 25%);
    }

    .gizmo-wrapper:active {
        cursor: none;
        background: rgb(255 255 255 / 50%);
    }

    .camera-view {
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