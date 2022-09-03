<script>
    import EngineStore from "../../../stores/EngineStore";
    import ComponentLayout from "../components/ComponentLayout.svelte";
    import Mesh from "../components/Mesh.svelte";
    import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
    import FilesStore from "../../../stores/FilesStore";
    import componentConstructor from "../../../libs/component-constructor";
    import MeshComponent from "../../../libs/engine/production/templates/MeshComponent";
    import loadMaterial from "../utils/load-material";

    import Loader from "../../../libs/loader/Loader";
    import {onDestroy, onMount} from "svelte";
    import Entity from "../../../libs/engine/production/templates/Entity";
    import UIElement from "../../../libs/engine/production/templates/UIElement";
    import dragDrop from "../../../../../components/drag-drop";


    export let translate

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

    const draggable = dragDrop(false)
    onMount(() => {
        const parent = ref.parentElement
        draggable.onMount({
            targetElement: parent,
            onDrop: async (data) => {
                try {
                    const id = JSON.parse(data)[0]

                    let type = "SCRIPT"
                    let itemFound = FilesStore.data.components.find(s => s.registryID === id)
                    if (!itemFound) {
                        itemFound = FilesStore.data.meshes.find(s => s.registryID === id)
                        type = "MESH"
                    }

                    if (!itemFound) {
                        itemFound = FilesStore.data.materials.find(s => s.registryID === id)
                        type = "MATERIAL"
                    }

                    if (!itemFound) {
                        alert.pushAlert(translate("COULD_NOT_FIND"), "error")
                        console.error(id)
                        return
                    }
                    switch (type) {
                        case "SCRIPT":
                            await componentConstructor(entity, id,  true)
                            break
                        case "MESH":
                            if (entity instanceof UIElement)
                                break
                            if (!entity.components[COMPONENTS.MESH])
                                entity.components[COMPONENTS.MESH] = new MeshComponent()

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
                    console.error(err)
                    alert.pushAlert(translate("COULD_NOT_FIND"), "error")
                }
            },
            onDragOver: () =>  "Add component, mesh or material"
        })


    })
    onDestroy(() => draggable.onDestroy())

</script>

<span bind:this={ref} style="display: none"></span>
{#if entity instanceof Entity}
    {#each components as [componentKey, component]}
        {#if componentKey === COMPONENTS.MESH}
            <Mesh
                    translate={translate}
                    component={component}
                    submit={async (value, key) => {
                        EngineStore.saveEntity(
                            entity.id,
                            componentKey,
                            key,
                            component[key]
                        )
                        component[key] = value
                        EngineStore.saveEntity(
                            entity.id,
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
                    component={component}
                    submit={(key, value, save) => {
                            if(!savedState){
                                EngineStore.saveEntity(
                                    entity.id,
                                     componentKey,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            component[key] = value
                            if(save)
                                EngineStore.saveEntity(
                                    entity.id,
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
            component={script}
            submit={(key, value, save) => {
                            if(!savedState){
                                EngineStore.saveEntity(
                                    entity.id,
                                     index,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            script[key] = value
                            if(save)
                                EngineStore.saveEntity(
                                    entity.id,
                                     index,
                                      key,
                                      value
                                )
                        }}
    />
{/each}

