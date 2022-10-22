<script>
    import EngineStore from "../../../../stores/EngineStore";
    import ComponentLayout from "./Layout.svelte";
    import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.js";
    import FilesStore from "../../../../stores/FilesStore";
    import componentConstructor from "../../../../libs/component-constructor";
    import loadMaterial from "../../../../libs/loader/utils/load-material";

    import Loader from "../../../../libs/loader/Loader";
    import {onDestroy, onMount} from "svelte";

    import dragDrop from "../../../../components/drag-drop/drag-drop";
    import EntityAPI from "../../../../../public/engine/lib/apis/EntityAPI";
    import Localization from "../../../../libs/Localization";
    import PointLightComponent from "../../../../../public/engine/lib/components/rendering/PointLightComponent";
    import DirectionalLightComponent
        from "../../../../../public/engine/lib/components/rendering/DirectionalLightComponent";
    import UIComponent from "./UIComponent.svelte";
    import SelectionStore from "../../../../stores/SelectionStore";
    import ActionHistoryAPI from "../../../../libs/ActionHistoryAPI";

    export let entity
    const translate = key => Localization.PROJECT.INSPECTOR[key]
    let ref
    let components
    let savedState
    let scripts
    $: {
        components = Array.from(entity.components.entries())
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
                        itemFound = FilesStore.data.textures.find(s => s.registryID === id)
                        type = "IMAGE"
                    }
                    if (!itemFound) {
                        itemFound = FilesStore.data.materials.find(s => s.registryID === id)
                        type = "MATERIAL"
                    }

                    if (!itemFound) {
                        throw new Error("File not found")
                    }
                    switch (type) {
                        case "SCRIPT":
                            await componentConstructor(entity, id, true)
                            break
                        case "MESH":
                            if (!entity.components.get(COMPONENTS.MESH))
                                entity.addComponent(COMPONENTS.MESH)

                            await Loader.load(id, true)
                            entity.components.get(COMPONENTS.MESH).meshID = id
                            break
                        case "MATERIAL":
                            await loadMaterial(id, (value, key) => {
                                entity.components.get(COMPONENTS.MESH)[key] = value
                            })
                            break
                        case "IMAGE": {
                            const res = await EngineStore.loadTextureFromImageID(id)
                            if (res)
                                (entity.addComponent(COMPONENTS.SPRITE)).imageID = res

                            break
                        }
                        default:
                            break
                    }
                } catch (err) {
                    console.error(err)
                }
            },
            onDragOver: () => translate("ADD_DRAG_DROP")
        })


    })
    onDestroy(() => draggable.onDestroy())
    const submit = (key, value, save, componentKey, component) => {
        if (component instanceof DirectionalLightComponent || component instanceof PointLightComponent) {
            entity.needsLightUpdate = true
            EntityAPI.packageLights(true)
        }
        if (!savedState) {
            ActionHistoryAPI.saveEntity(
                entity.id,
                componentKey,
                key,
                value
            )
            savedState = true
        }
        component[key] = value
        if (save) {
            SelectionStore.updateStore()
            ActionHistoryAPI.saveEntity(
                entity.id,
                componentKey,
                key,
                value
            )
        }
    }
</script>

<span bind:this={ref} style="display: none"></span>
{#each components as [componentKey, component]}
    {#if componentKey === COMPONENTS.UI}
        <UIComponent entity={entity}  submit={(k, v) => submit(k, v, true, componentKey, component)}/>
    {:else}
        <ComponentLayout
                entity={entity}
                key={componentKey}
                translate={translate}
                component={component}
                submit={(k, v, s) => submit(k,v,s, componentKey, component)}
        />
    {/if}
{/each}

{#each scripts as script, index}
    <ComponentLayout
            entity={entity}
            index={index}
            translate={translate}
            component={script}

            submit={(key, value, save) => {

                if(!savedState){
                    ActionHistoryAPI.saveEntity(
                        entity.id,
                         index,
                          key,
                          value
                    )
                    savedState = true
                }
                script[key] = value
                if(save)
                    ActionHistoryAPI.saveEntity(
                        entity.id,
                         index,
                          key,
                          value
                    )
            }}
    />
{/each}

