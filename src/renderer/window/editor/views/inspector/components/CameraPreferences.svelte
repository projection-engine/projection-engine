<script>
    import EditorCameraSystem from "../../../../../engine/tools/systems/EditorCameraSystem"
    import SettingsStore from "../../../../shared/stores/SettingsStore"
    import CAMERA_PROPS from "../static/component-props/CAMERA_PROPS"
    import ContentField from "../../../../preferences/components/content/ContentField.svelte"
    import {onDestroy, onMount} from "svelte"
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte"
    import PropertyHeader from "../../../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import CAMERA_PREFERENCES from "../static/CAMERA_PREFERENCES"
    import ComponentProperty from "./ComponentProperty.svelte";
    import COMPONENT_PROP_TYPES from "../../../static/COMPONENT_PROP_TYPES";
    import COMPONENT_ATTRIBUTES from "../static/COMPONENT_ATTRIBUTES";
    import {Components} from "@engine-core/engine.enum";
    import UUIDGen from "../../../../../../shared/UUIDGen";

    const COMPONENT_ID = UUIDGen()
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
        if (EditorCameraSystem[key] !== undefined)
            EditorCameraSystem[key] = value
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

{#if Object.hasOwn(COMPONENT_ATTRIBUTES, Components.CAMERA)}
    {#each COMPONENT_ATTRIBUTES[Components.CAMERA] as propAttr, index}
        {#if propAttr.type === COMPONENT_PROP_TYPES.GROUP && Array.isArray(propAttr.children)}
            <Accordion
                    startOpen={index === 0}
                    title={LocalizationEN[propAttr.label] || propAttr.label}
                    styles="display: flex; flex-direction: column; gap: 4px;"
            >
                {#each propAttr.children as attribute}
                    <ComponentProperty
                            component={cameraSettings}
                            submit={updateCamera}
                            attribute={attribute}
                    />
                {/each}
            </Accordion>
        {:else if propAttr.type !== COMPONENT_PROP_TYPES.GROUP }
            <ComponentProperty
                    component={cameraSettings}
                    submit={updateCamera}
                    attribute={propAttr}
            />
        {/if}
    {/each}
{/if}

