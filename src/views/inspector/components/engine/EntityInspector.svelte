<script>
    import Metadata from "./Metadata.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import {onDestroy, onMount} from "svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"
    import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import dragDrop from "../../../../components/drag-drop/drag-drop";
    import handleComponentDrop from "../../utils/handle-component-drop";
    import UIComponent from "./UIComponent.svelte";
    import updateEntityComponent from "../../utils/update-entity-component";

    import getEntityTabs from "../../utils/get-entity-tabs";
    import TransformationForm from "./TransformationForm.svelte";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import Accordion from "../../../../components/accordion/Accordion.svelte";

    export let entity

    let ref
    let savedState
    let tabIndex = -1

    let components
    let scripts
    $: {
        components = Array.from(entity.components.entries())
        scripts = entity.scripts
    }
    $: buttons = getEntityTabs(components, scripts)

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
        if (components[tabIndex] == null && tabIndex > 0)
            tabIndex = -1
    }

</script>

{#if entity != null}
    <div class="wrapper" bind:this={ref}>
        <div class="tabs shared">
            {#each buttons as button}
                {#if button.divider}
                    <div data-divider="-"></div>
                {:else}
                    <button
                            data-highlight={tabIndex === button.index ? "-" : undefined}
                            class="tab-button shared"
                            on:click={_ => tabIndex = button.index}
                    >
                        <Icon styles="font-size: .9rem">{button.icon}</Icon>
                        <ToolTip content={button.label}/>
                    </button>
                {/if}
            {/each}
        </div>
        <div class="content">
            {#if tabIndex === -3}
                {#if scripts.length > 0}
                    {#each scripts as script, scriptIndex}
                        <fieldset>
                            <Layout
                                    entity={entity}
                                    index={scriptIndex}
                                    component={scripts[scriptIndex]}
                                    submit={(k, v) => scripts[scriptIndex][k] = v}
                            />
                        </fieldset>
                    {/each}
                {:else}
                    <div data-empty="-">
                        <Icon styles="font-size: 75px">code</Icon>
                        {Localization.NO_CUSTOM_COMPONENTS_LINKED}
                    </div>
                {/if}
            {:else if tabIndex === -2}
                <Metadata entity={entity}/>
            {:else if tabIndex === -1}
                <TransformationForm/>
            {:else if tabIndex < components.length}
                {#if components[tabIndex][0] === COMPONENTS.UI}
                    <UIComponent
                            entity={entity}
                            submit={(k, v) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, true, components[tabIndex])}
                    />
                {:else if components[tabIndex][1] != null}
                    <Layout
                            entity={entity}
                            key={components[tabIndex][0]}
                            component={components[tabIndex][1]}
                            submit={(k, v, s) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, s, components[tabIndex])}
                    />
                    {#if components[tabIndex][0] === COMPONENTS.MESH && components[tabIndex][1].materialUniforms}
                        <fieldset>
                            <legend>{Localization.MATERIAL_VALUES}</legend>
                            <Checkbox
                                    label={Localization.OVERRIDE_PROPERTIES}
                                    handleCheck={() => updateEntityComponent(savedState, v => savedState = v, entity, "overrideMaterialUniforms", !components[tabIndex][1].overrideMaterialUniforms, true, components[tabIndex])}
                                    checked={components[tabIndex][1].overrideMaterialUniforms}
                            />
                            {#if components[tabIndex][1].overrideMaterialUniforms}
                                <MaterialUniforms
                                        uniforms={components[tabIndex][1].materialUniforms}
                                        update={() => {

                                        }}
                                />
                            {/if}
                        </fieldset>
                    {/if}
                {/if}

            {/if}
        </div>
    </div>
{/if}
<style>

    .wrapper {
        display: flex;
        overflow: hidden;
        height: 100%;
        padding: 2px;
        gap: 3px;
    }


    .content {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;

        align-content: flex-start;
        gap: 4px;

        padding-bottom: 25%;
        color: var(--pj-color-primary);
    }

</style>