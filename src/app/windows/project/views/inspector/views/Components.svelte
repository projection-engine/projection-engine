<script>
    import RendererStoreController from "../../../stores/RendererStoreController";
    import ComponentLayout from "../components/ComponentLayout.svelte";
    import Mesh from "../components/Mesh.svelte";
    import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
    import CBStoreController from "../../../stores/CBStoreController";
    import componentConstructor from "../../../libs/component-constructor";
    import MeshComponent from "../../../libs/engine/production/templates/components/MeshComponent";
    import TransformComponent from "../../../libs/engine/production/templates/components/TransformComponent";
    import loadMaterial from "../utils/load-material";

    import Loader from "../../../libs/loader/Loader";
    import {onDestroy, onMount} from "svelte";
    import Entity from "../../../libs/engine/production/templates/basic/Entity";
    import UIElement from "../../../libs/engine/production/templates/basic/UIElement";


    export let translate
    export let engine
    export let entity

    let ref
    let components
    let savedState
    let scripts

    $: {
        if (entity instanceof Entity)
            components = Object.entries(entity.components)
        scripts = entity.scripts
    }
    const handler = async (e) => {
        e.preventDefault()
        switch (e.type) {
            case "dragleave":
                e.currentTarget.style.opacity = "1"
                break
            case "dragover":
                e.currentTarget.style.opacity = ".5"
                break
            case "drop":
                e.currentTarget.style.opacity = "1"

                try {
                    const id = JSON.parse(e.dataTransfer.getData("text"))[0]
                    let type = "SCRIPT"
                    let itemFound = CBStoreController.data.components.find(s => s.registryID === id)
                    if (!itemFound) {
                        itemFound = CBStoreController.data.meshes.find(s => s.registryID === id)
                        type = "MESH"
                    }

                    if (!itemFound) {
                        itemFound = CBStoreController.data.materials.find(s => s.registryID === id)
                        type = "MATERIAL"
                    }

                    if (!itemFound) {
                        alert.pushAlert(translate("COULD_NOT_FIND"), "error")
                        console.error(id)
                        return
                    }
                    switch (type) {
                        case "SCRIPT":
                            await componentConstructor(entity, id)
                            break
                        case "MESH":
                            if (entity instanceof UIElement)
                                break
                            if (!entity.components[COMPONENTS.MESH]) {
                                entity.components[COMPONENTS.MESH] = new MeshComponent()
                                if (!entity.components[COMPONENTS.TRANSFORM])
                                    entity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                            }
                            await Loader.load(id, true)
                            entity.components[COMPONENTS.MESH].meshID = id
                            break
                        case "MATERIAL":
                            if (entity instanceof UIElement)
                                break
                            await loadMaterial(id, (value, key) => {
                                entity.components[COMPONENTS.MESH][key] = value
                            })
                            break
                    }
                } catch (err) {
                    console.error(err, e.dataTransfer.getData("text"))
                    alert.pushAlert(translate("COULD_NOT_FIND"), "error")
                }
                break
        }
    }
    onMount(() => {
        const parent = ref.parentElement
        parent.addEventListener("dragleave", handler)
        parent.addEventListener("dragover", handler)
        parent.addEventListener("drop", handler)

    })
    onDestroy(() => {
        const parent = ref.parentElement
        parent.removeEventListener("dragleave", handler)
        parent.removeEventListener("dragover", handler)
        parent.removeEventListener("drop", handler)
    })

</script>

<span bind:this={ref} style="display: none"></span>
{#if entity instanceof Entity}
    {#each components as [componentKey, component]}
        {#if componentKey === COMPONENTS.MESH}
            <Mesh
                    translate={translate}
                    selected={component}
                    submit={async (value, key) => {
                        RendererStoreController.saveEntity(
                            engine.selectedEntity.id,
                            componentKey,
                            key,
                            component[key]
                        )
                        component[key] = value
                        RendererStoreController.saveEntity(
                            engine.selectedEntity.id,
                            componentKey,
                            key,
                            value
                        )
                    }}

            />
        {:else}
            <ComponentLayout
                    key={componentKey}
                    translate={translate}
                    selected={component}
                    submit={(key, value, save) => {
                            if(!savedState){
                                RendererStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     componentKey,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            component[key] = value
                            if(save)
                                RendererStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     componentKey,
                                      key,
                                      value
                                )
                        }}
            />

        {/if}
    {/each}
{:else if scripts.length > 0}
    <div data-divider="-"></div>
{/if}
{#each scripts as script, index}
    <ComponentLayout
            index={index}
            translate={translate}
            selected={script}
            submit={(key, value, save) => {
                            if(!savedState){
                                RendererStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     index,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            script[key] = value
                            if(save)
                                RendererStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     index,
                                      key,
                                      value
                                )
                        }}
    />
{/each}

