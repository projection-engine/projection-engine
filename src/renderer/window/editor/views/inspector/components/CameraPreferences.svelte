<script>
    import CameraTracker from "../../../../../engine/tools/utils/CameraTracker"
    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import Layout from "./dynamic-form/Layout.svelte"
    import CAMERA_PROPS from "../../../../../engine/core/static/component-props/CAMERA_PROPS"
    import ContentField from "../../../../preferences/components/content/ContentField.svelte"
    import {onDestroy, onMount} from "svelte"
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte"
    import PropertyHeader from "../../../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import CAMERA_PREFERENCES from "../static/CAMERA_PREFERENCES"

    const COMPONENT_ID = crypto.randomUUID()
    let cameraSettings = {}
    let settings
    let camera

    onMount(() => {
    	SettingsStore.getInstance().addListener(COMPONENT_ID, data => {
    		cameraSettings = {...data.camera, props: CAMERA_PROPS}
    		settings = data
    		camera = data.camera
    	}, ["camera"])
    })

    onDestroy(() => SettingsStore.getInstance().removeListener(COMPONENT_ID))

    const updateCamera = (key, value, full) => {
    	if (full)
    		SettingsStore.updateStore({camera: {...camera, [key]: value}})
    	if (CameraTracker[key] !== undefined)
    		CameraTracker[key] = value
    }
</script>

<PropertyHeader title={LocalizationEN.EDITOR_CAMERA}/>
<Accordion startOpen={true} title={LocalizationEN.MOVEMENT}>
    {#if settings !== undefined}
        <div data-svelteform="-">
            {#each CAMERA_PREFERENCES as toRender}
                <ContentField {settings} toRender={toRender}/>
            {/each}
        </div>
    {/if}
</Accordion>
<Layout component={cameraSettings} submit={updateCamera}/>

