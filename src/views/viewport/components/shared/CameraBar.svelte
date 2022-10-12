<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import CAMERA_GIZMO from "../../../../data/CAMERA_GIZMO"
    import {onDestroy, onMount} from "svelte";
    import CameraAPI from "../../../../../public/engine/production/apis/CameraAPI";
    import CameraTracker from "../../../../../public/engine/editor/libs/CameraTracker";
    import SettingsStore from "../../../../stores/SettingsStore";
    import Localization from "../../../../libs/libs/Localization";
    import CAMERA_ROTATIONS from "../../../../../public/engine/editor/data/CAMERA_ROTATIONS";
    import ViewportActions from "../../../../libs/ViewportActions";

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    let cameraIsOrtho = false
    let ref
    onMount(() => {
        CameraTracker.gizmoReference = document.getElementById(CAMERA_GIZMO)
    })
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())

</script>

<div class="wrapper">
    <div
            class={"gizmo-wrapper"}
            bind:this={ref}
            on:mousedown={_ => ref.addEventListener("mousemove", CameraTracker.forceRotationTracking, {once: true})}
            on:mouseup={_ => ref.removeEventListener("mousemove", CameraTracker.forceRotationTracking)}
    >
        <div class={"camera-view"}>
            <div class={"cube"} id={CAMERA_GIZMO}>
                <div
                        class={"face front"}
                        style="background: hsl(205, 100%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.FRONT)}
                >
                    Z+
                </div>
                <div
                        class={"face back darker"}
                        style="background: hsl(205, 100%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.BACK)}
                >
                    Z-
                </div>
                <div
                        class={"face right"}
                        style="background: hsl(0, 100%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.RIGHT)}
                >
                    X+
                </div>
                <div
                        class={"face left darker"}
                        style="background: hsl(0, 100%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.LEFT)}
                >
                    X-
                </div>
                <div
                        class={"face top darker"}
                        style="background: hsl(120, 88%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.TOP)}

                >
                    Y-
                </div>
                <div
                        class={"face bottom"}
                        style="background: hsl(120, 88%, var(--brightness))"
                        on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.BOTTOM)}
                >
                    Y+
                </div>
            </div>
        </div>
    </div>

    <button
            on:click={() => {
                // TODO
            }}
            class="option"
    >
        <ToolTip content={translate("SWITCH_BETWEEN_CAMERAS")}/>
        <Icon styles="font-size: 1rem">videocam</Icon>
    </button>

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


    <button
            on:click={() => ViewportActions.focus()}
            class="option"
            style="margin-top: 4px"
    >
        <ToolTip content={translate("FOCUS")}/>
        <Icon styles="font-size: 1rem">my_location</Icon>
    </button>

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
        top: 25px;
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