<script>
    import DataStoreController from "../../../stores/DataStoreController";
    import ComponentLayout from "../components/ComponentLayout.svelte";
    import Mesh from "../components/Mesh.svelte";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import FileStoreController from "../../../stores/FileStoreController";
    import componentConstructor from "../../../libs/component-constructor";
    import MeshComponent from "../../../libs/engine/templates/components/MeshComponent";
    import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
    import loadMaterial from "../utils/load-material";
    import Entity from "../components/Entity.svelte";
    import Loader from "../../../libs/loader/Loader";


    export let translate
    export let engine

    let entity
    let components
    let savedState
    let scripts

    $: {
        entity = engine.selectedEntity
        components = Object.entries(entity.components).filter(([k]) => k !== COMPONENTS.PICK)
        scripts = entity.scripts
    }
    const onDrop = async e => {
        e.preventDefault()

        e.currentTarget.style.opacity = "1"

        try {
            const id = JSON.parse(e.dataTransfer.getData("text"))[0]
            let type = "SCRIPT"
            let itemFound = FileStoreController.data.components.find(s => s.registryID === id)
            if (!itemFound) {
                itemFound = FileStoreController.data.meshes.find(s => s.registryID === id)
                type = "MESH"
            }

            if (!itemFound) {
                itemFound = FileStoreController.data.materials.find(s => s.registryID === id)
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
                    if (!entity.components[COMPONENTS.MESH]) {
                        entity.components[COMPONENTS.MESH] = new MeshComponent()
                        if (!entity.components[COMPONENTS.TRANSFORM])
                            entity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                    }
                    await Loader.load(id, true)
                    entity.components[COMPONENTS.MESH].meshID = id
                    break
                case "MATERIAL":
                    await loadMaterial(id, (value, key) => {
                        entity.components[COMPONENTS.MESH][key] = value
                    })
                    break
            }
        } catch (err) {
            console.error(err, e.dataTransfer.getData("text"))
            alert.pushAlert(translate("COULD_NOT_FIND"), "error")
        }
    }
</script>

<div
        class="wrapper"
        on:dragleave={e => {
            e.preventDefault()
            e.currentTarget.style.opacity = "1"
        }}
        on:dragover={e => {
            e.preventDefault()
            e.currentTarget.style.opacity = ".5"
        }}
        on:drop={onDrop}
>
    <Entity entity={entity} translate={translate}/>
    {#each components as [componentKey, component]}
        {#if componentKey === COMPONENTS.MESH}
            <Mesh
                    translate={translate}
                    selected={component}
                    submit={async (value, key) => {
                            DataStoreController.saveEntity(
                                engine.selectedEntity.id,
                                componentKey,
                                key,
                                component[key]
                            )
                            component[key] = value
                            DataStoreController.saveEntity(
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
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     componentKey,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            component[key] = value
                            if(save)
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     componentKey,
                                      key,
                                      value
                                )
                        }}
            />

        {/if}
    {/each}
    {#each scripts as script, index}
        <ComponentLayout
                index={index}
                translate={translate}
                selected={script}
                submit={(key, value, save) => {
                            if(!savedState){
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     index,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            script[key] = value
                            if(save)
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     index,
                                      key,
                                      value
                                )
                        }}
        />
    {/each}
</div>


<style>

    .wrapper {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
        height: 100%;
    }
</style>