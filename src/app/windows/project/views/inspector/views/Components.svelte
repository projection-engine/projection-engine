<script>
    import DataStoreController from "../../../stores/DataStoreController";
    import ComponentLayout from "../components/ComponentLayout.svelte";
    import Mesh from "../components/Mesh.svelte";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import FileStoreController from "../../../stores/FileStoreController";
    import componentConstructor from "../../../libs/component-constructor";


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
            const ref = FileStoreController.data.components.find(s => s.registryID === id)
            if (!ref) {
                alert.pushAlert(translate("SCRIPT_NOT_FOUND"), "error")
                console.error(id)
                return
            }
            await componentConstructor(entity, id)
        } catch (err) {
            console.error(err, e.dataTransfer.getData("text"))
            alert.pushAlert(translate("SCRIPT_NOT_FOUND"), "error")
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
        display: flex;
        flex-direction: column;
        gap: 4px;

        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
        height: 100%;
    }
</style>