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

    let cameraIsOrtho = false
    const translate = key => EnglishLocalization.PROJECT.VIEWPORT[key]
    const settings = get(settingsStore)
</script>

<div class={"wrapper"} style={{right: settings.visible.sideBarViewport ? "25px" : "0"}}>
    <CameraGizmo/>
    <div class="vertical-options">
        <Dropdown hideArrow={true}>
            <button  class={"item"} slot="button">
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
