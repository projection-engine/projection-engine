<script>

    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import ENTITY_TAB from "../static/ENTITY_TAB";
    import ComponentLayout from "../components/ComponentLayout.svelte";
    import Mesh from "../components/Mesh.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Rendering from "../components/Rendering.svelte";
    import PostProcessing from "../components/PostProcessing.svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import Component from "../../../libs/engine/libs/basic/Component";

    export let engine
    export let currentTab
    export let removeComponent
    export let translate
    $: currentComponent = engine.selectedEntity ? Object.keys(engine.selectedEntity.components)[currentTab] : undefined
    $: componentRef = currentComponent ? engine.selectedEntity.components[currentComponent] : undefined
    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())
    const submit = (component, key, data) => engine.selectedEntity.components[component][key] = data

    let savedState = false
    $: {
        if (engine.selectedEntity)
            savedState = false
    }

</script>

{#if componentRef?.constructor?.name === Component.name}
    <button class="delete-button" on:click={() => {
        removeComponent(currentComponent)
    }}>
        <Icon>
            delete_forever
        </Icon>
        {translate("REMOVE_COMPONENT")}
    </button>
{/if}
{#if (parseInt(currentTab) > -1 || currentTab === ENTITY_TAB) && engine.selectedEntity && !engine.selectedEntity.components[COMPONENTS.FOLDER]}
    <div class="wrapper">
        {#if currentTab !== ENTITY_TAB}
            {#if currentComponent === COMPONENTS.MESH}
                <Mesh
                        translate={translate}
                        selected={componentRef}
                        submit={async (value, key) => {
                            DataStoreController.saveEntity(
                                engine.selectedEntity.id,
                                currentComponent,
                                key,
                                componentRef[key]
                            )
                            componentRef[key] = value
                            DataStoreController.saveEntity(
                                engine.selectedEntity.id,
                                currentComponent,
                                key,
                                value
                            )
                        }}

                />
            {:else}
                <ComponentLayout
                        translate={translate}
                        selected={componentRef}
                        submit={(key, value, save) => {
                            if(!savedState){
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     currentComponent,
                                      key,
                                      value
                                )
                                savedState = true
                            }
                            componentRef[key] = value
                            if(save)
                                DataStoreController.saveEntity(
                                    engine.selectedEntity.id,
                                     currentComponent,
                                      key,
                                      value
                                )
                        }}
                />

            {/if}

        {/if}
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
        gap: 4px;

        height: fit-content;
        width: 100%;
        max-width: 100%;
        padding: 4px 4px 32px;
        color: var(--pj-color-primary);
        overflow-x: hidden;
    }

    .delete-button {
        width: 100%;
        display: flex;
        align-items: center;
        --pj-accent-color: #ff5555;
        margin-top: 4px;
        margin-left: 4px;
        margin-right: 4px;
        border: none;
    }
</style>