<script>

    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import ENTITY_TAB from "../static/ENTITY_TAB";
    import Scripts from "../components/Scripts.svelte";
    import Camera from "../components/Camera.svelte";
    import Probe from "../components/Probe.svelte";
    import Lights from "../components/Lights.svelte";
    import Mesh from "../components/Mesh.svelte";
    import Transform from "../components/Transform.svelte";
    import updateTransformation from "../utils/update-transformation";
    import MaterialInstance from "../../../libs/engine/instances/MaterialInstance";
    import FALLBACK_MATERIAL from "../../../static/misc/FALLBACK_MATERIAL";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Rendering from "../components/Rendering.svelte";
    import PostProcessing from "../components/PostProcessing.svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import {onDestroy} from "svelte";

    export let engine
    export let currentTab
    export let translate
    $: currentComponent = engine.selectedEntity ? Object.keys(engine.selectedEntity.components)[currentTab] : undefined
    $: componentRef = currentComponent ? engine.selectedEntity.components[currentComponent] : undefined
    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())
    const submit = (component, key, data) => engine.selectedEntity.components[component][key] = data

    console.log(settings)
</script>

{#if (parseInt(currentTab) > -1 || currentTab === ENTITY_TAB) && engine.selectedEntity && !engine.executingAnimation && !engine.selectedEntity.components[COMPONENTS.FOLDER]}
    <div class="wrapper">
        {#if currentTab !== ENTITY_TAB}
            {#if currentComponent === COMPONENTS.CAMERA}
                <Camera
                        translate={translate}
                        selected={componentRef}
                        submit={(key, value) => componentRef[key] = value}
                />
            {:else if currentComponent === COMPONENTS.TRANSFORM}
                <Transform
                        translate={translate}
                        entityID={engine.selectedEntity.id}
                        engine={engine}

                        selected={engine.selectedEntity.components[COMPONENTS.TRANSFORM]}
                        submitRotation={(axis, data) => updateTransformation(axis, data, "rotation", engine.selectedEntity,)}
                        submitScaling={(axis, data) => updateTransformation(axis, data, "scaling", engine.selectedEntity,)}
                        submitTranslation={(axis, data) => updateTransformation(axis, data, "translation", engine.selectedEntity)}
                />
            {:else if currentComponent === COMPONENTS.MESH}
                <Mesh
                        translate={translate}
                        entityID={engine.selectedEntity.id}
                        engine={engine}
                        selected={componentRef}
                        submit={async (val, key) => {
                            if (key)
                                submit(COMPONENTS.MESH, key, val)
                            else {
                                if (val) {
                                    const exists = window.renderer.materials.find(m => m.id === val.id)
                                    if (!exists) {
                                        let newMat
                                        await new Promise(resolve => {
                                            newMat = new MaterialInstance({
                                                id: val.id,
                                                onCompiled:() => resolve(),
                                                settings: val.blob.settings,
                                                vertex: val.blob.vertexShader,
                                                fragment: val.blob.shader,
                                                uniformData: val.blob.uniformData
                                            })
                                        })
                                        engine.setMaterials(prev => {
                                            return [...prev, newMat]
                                        })
                                    }
                                }

                                if (val) {
                                    componentRef.materialID = val.id
                                    componentRef.uniforms = val.blob.uniforms
                                } else
                                    componentRef.materialID = FALLBACK_MATERIAL
                            }
                        }}

                />
            {:else if currentComponent === COMPONENTS.DIRECTIONAL_LIGHT || currentComponent === COMPONENTS.POINT_LIGHT}
                <Lights
                        translate={translate}
                        entityID={engine.selectedEntity.id}
                        type={currentComponent}
                        selected={componentRef}
                        submit={(data, k) => submit(currentComponent, k, data)}
                        submitColor={(data) => submit(currentComponent, "color", data)}
                />

            {:else if currentComponent === COMPONENTS.PROBE}
                <Probe
                        translate={translate}
                        selected={componentRef}
                        submit={(data, key) => {
                            submit(currentComponent, key, data)
                            alert.pushAlert(translate("RECOMPUTE_PROBES"), "alert")
                        }}
                />
            {/if}
        {:else}
            <Scripts
                    translate={translate}
                    entity={engine.selectedEntity}
            />
        {/if}
    </div>
{:else if engine.executingAnimation}
    <div class="empty">
        <Icon styles="font-size: 140px">
            play_arrow
        </Icon>
        {translate("STOP_SIMULATION")}
    </div>
{:else}
    <div class="wrapper">
        {#if currentTab === "-2"}
            <Rendering translate={translate}/>
        {:else}
            <PostProcessing
                selected={settings}
                submit={(key, value) => DataStoreController.updateSettings({...settings, [key]: value})}
            />
        {/if}
    </div>
{/if}

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;

        height: fit-content;
        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
    }

    .empty {
        width: 100%;
        height: 100%;
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        text-align: center;
        color: var(--pj-color-primary);
        font-size: 0.75rem;
        font-weight: 550;
    }

</style>