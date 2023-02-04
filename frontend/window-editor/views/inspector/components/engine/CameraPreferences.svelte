<script>
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
    import SettingsStore from "../../../../../shared/stores/SettingsStore";
    import Layout from "./dynamic-form/Layout.svelte";
    import CAMERA_PROPS from "../../../../../../engine-core/static/component-props/CAMERA_PROPS";
    import Builder from "../../../../../window-preferences/components/content/ContentField.svelte";
    import Component from "../../../../../../engine-core/instances/components/Component";
    import {onDestroy} from "svelte";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import PropertyHeader from "../../../../../shared/components/PropertyHeader.svelte";

    let settings
    const unsubscribe = SettingsStore.getStore(v => settings = v)
    onDestroy(unsubscribe)
    const updateCamera = (key, value, full) => {
        if (full)
            SettingsStore.updateStore({...settings, camera: {...settings.camera, [key]: value}})
        if (CameraTracker[key] !== undefined)
            CameraTracker[key] = value
    }
    $: cameraSettings = {...settings.camera, props: CAMERA_PROPS}
    const CAMERA_SETTINGS = [
        {
            type: Component.propTypes.NUMBER,
            label: LOCALIZATION_EN.SCREEN_GRABBING_SPEED,
            key: ["camera", "screenSpaceMovementSpeed"],
            target: "settings",
            min: .01,
            increment: .1,
            onChange: v => {
                CameraTracker.screenSpaceMovementSpeed = v
                return v
            }
        },
        {
            type: Component.propTypes.NUMBER,
            label: LOCALIZATION_EN.TRANSLATION,
            key: ["camera", "movementSpeed"],
            target: "settings",
            min: .01,
            increment: .1,
            onChange: v => {
                CameraTracker.movementSpeed = v
                return v
            }
        },
        {
            type: Component.propTypes.NUMBER,
            label: LOCALIZATION_EN.ROTATION,
            key: ["camera", "turnSpeed"],
            target: "settings",
            min: .01,
            increment: .001,
            onChange: v => {
                CameraTracker.turnSpeed = v
                return v
            }
        },
        {
            type: Component.propTypes.NUMBER,
            label: LOCALIZATION_EN.SMOOTHING,
            key: ["camera", "smoothing"],
            target: "settings",
            min: 0,
            max: 10,
            increment: .001,
            onChange: v => 1 / v
        }
    ]
</script>

<PropertyHeader title={LOCALIZATION_EN.EDITOR_CAMERA}/>

<Accordion startOpen={true} title={LOCALIZATION_EN.MOVEMENT}>
    <div data-svelteform="-">
        {#each CAMERA_SETTINGS as toRender}
            <Builder toRender={toRender} settings={settings}/>
        {/each}
    </div>
</Accordion>

<Layout
        component={cameraSettings}
        submit={updateCamera}
/>

