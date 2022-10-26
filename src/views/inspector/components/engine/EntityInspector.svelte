<script>
    import Metadata from "./Metadata.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import ActionHistoryAPI from "../../../../libs/ActionHistoryAPI";
    import {onDestroy, onMount} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Localization from "../../../../templates/Localization";
    import dragDrop from "../../../../components/drag-drop/drag-drop";
    import handleComponentDrop from "../../utils/handle-component-drop";
    import UIComponent from "./UIComponent.svelte";
    import updateEntityComponent from "../../utils/update-entity-component";
    import updateEntityScript from "../../utils/update-entity-script";
    import getEntityTabs from "../../utils/get-entity-tabs";

    export let entity

    let ref
    let savedState
    let tabIndex = -2

    let components
    let scripts
    $: {
        components = Array.from(entity.components.entries())
        scripts = entity.scripts
    }
    $: buttons = getEntityTabs(components, scripts)
    const submitTransformationChange = (key, value, save) => {
        if (!savedState) {
            ActionHistoryAPI.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
            savedState = true
        }
        if (key === "pivotPoint")
            entity.__pivotChanged = true
        entity[key] = value
        entity.__changedBuffer[0] = 1
        if (save)
            ActionHistoryAPI.saveEntity(
                entity.id,
                undefined,
                key,
                value
            )
    }

    const draggable = dragDrop(false)
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: d => handleComponentDrop(entity, d),
            onDragOver: () => Localization.ADD_DRAG_DROP
        })
    })
    onDestroy(() => draggable.onDestroy())

    $: {
        if (components[tabIndex] == null && scripts[tabIndex - 1] == null && tabIndex > 0)
            tabIndex = -2
    }
</script>

<div class="wrapper" bind:this={ref}>
    <div class="tabs">
        {#each buttons as button}
            {#if button.isFirstScript}
                <div data-divider="-"></div>
            {/if}
            <button
                    class:highlight={tabIndex === button.index}
                    class="tab-button"
                    on:click={_ => {
                        console.log(button)
                        tabIndex = button.index
                    }}
            >
                <Icon styles="font-size: .9rem">{button.icon}</Icon>
                <ToolTip content={button.label}/>
            </button>
        {/each}
    </div>
    <div class="content">
        {#if tabIndex === -2}
            <Metadata entity={entity}/>
        {:else if tabIndex === -1}
            <Layout
                    key="TRANSFORMATION"
                    component={entity}
                    entity={entity}
                    submit={submitTransformationChange}
            />
        {:else if tabIndex < components.length}
            {#if components[tabIndex][0] === COMPONENTS.UI}
                <UIComponent
                        entity={entity}
                        submit={(k, v) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, true, components[tabIndex])}
                />
            {:else}
                <Layout
                        entity={entity}
                        key={components[tabIndex][0]}
                        component={components[tabIndex][1]}
                        submit={(k, v, s) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, s, components[tabIndex])}
                />
            {/if}
        {:else}

            <Layout
                    entity={entity}
                    index={tabIndex - components.length}
                    component={entity.scripts[tabIndex - components.length]}
                    submit={(k, v, s) => updateEntityScript(savedState, v => savedState = v, entity, tabIndex - components.length, k, v, s)}
            />
        {/if}
    </div>
</div>

<style>

    .wrapper {
        border-top: var(--pj-border-primary) 1px solid;
        display: flex;
        overflow: hidden;
        height: 100%;
        padding: 2px;
        gap: 3px;
    }

    .tab-button {
        width: 100%;
        min-width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .tabs {
        height: 100%;

        display: grid;
        align-content: flex-start;
        justify-content: center;
        gap: 2px;

        overflow-x: hidden;
        min-width: 25px;
        width: 25px;
        overflow-y: auto;


    }

    .highlight {
        background: var(--pj-background-primary);
        color: var(--pj-accent-color);
    }

    .content {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
        padding-bottom: 25%;
        color: var(--pj-color-primary);
        overflow-x: hidden;
        height: 100%;
    }

</style>