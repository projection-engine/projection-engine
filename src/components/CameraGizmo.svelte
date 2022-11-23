<script>

    import CAMERA_GIZMO from "../static/CAMERA_GIZMO"
    import {onMount} from "svelte";
    import CameraTracker from "../lib/engine-tools/lib/CameraTracker";
    import CAMERA_ROTATIONS from "../lib/engine-tools/static/CAMERA_ROTATIONS";
    import focusOnCamera from "../utils/focus-on-camera";

    let ref
    onMount(() => CameraTracker.gizmoReference = document.getElementById(CAMERA_GIZMO))
</script>


<div
        class="gizmo-wrapper"
        bind:this={ref}
        on:mousedown={_ => {
            focusOnCamera()
            ref.addEventListener("mousemove", CameraTracker.forceRotationTracking, {once: true})
        }}
        on:mouseup={_ => ref.removeEventListener("mousemove", CameraTracker.forceRotationTracking)}
>
    <div class="camera-view">
        <div
                class="cube"
                id={CAMERA_GIZMO}
        >
            <div
                    class="face front"
                    style="background: hsl(205, 100%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.FRONT)}
            >
                Z+
            </div>
            <div
                    class="face back darker"
                    style="background: hsl(205, 100%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.BACK)}
            >
                Z-
            </div>
            <div
                    class="face right"
                    style="background: hsl(0, 100%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.RIGHT)}
            >
                X+
            </div>
            <div
                    class="face left darker"
                    style="background: hsl(0, 100%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.LEFT)}
            >
                X-
            </div>
            <div
                    class="face top darker"
                    style="background: hsl(120, 88%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.TOP)}

            >
                Y-
            </div>
            <div
                    class="face bottom"
                    style="background: hsl(120, 88%, var(--brightness))"
                    on:click={() => CameraTracker.rotate(CAMERA_ROTATIONS.BOTTOM)}
            >
                Y+
            </div>
        </div>
    </div>
</div>


<style>
    .gizmo-wrapper {
        position: absolute;
        right: 0;
        overflow: hidden;
        border-radius: 50%;
        padding: 4px;
        transition: 150ms linear;
        backdrop-filter: blur(10px);
        opacity: .85;
        border: var(--pj-transparent-border) 1px solid;
    }

    .gizmo-wrapper:hover {
        background: rgb(255 255 255 / 25%);
        opacity: 1;
    }

    .gizmo-wrapper:active {
        opacity: 1;
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