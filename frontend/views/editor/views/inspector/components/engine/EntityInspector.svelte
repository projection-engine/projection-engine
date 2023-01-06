<script>
    import Metadata from "./Metadata.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import {onDestroy, onMount} from "svelte";
    import COMPONENTS from "../../../../../../../engine-core/static/COMPONENTS";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import dragDrop from "../../../../../../components/drag-drop/drag-drop";
    import handleComponentDrop from "../../utils/handle-component-drop";
    import UIComponent from "./UIComponent.svelte";
    import updateEntityComponent from "../../utils/update-entity-component";

    import getEntityTabs from "../../utils/get-entity-tabs";
    import TransformationForm from "./TransformationForm.svelte";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import Checkbox from "../../../../../../components/checkbox/Checkbox.svelte";
    import GPU from "../../../../../../../engine-core/GPU";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";

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
            onDragOver: () => LOCALIZATION_EN.ADD_DRAG_DROP
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
                        {LOCALIZATION_EN.NO_CUSTOM_COMPONENTS_LINKED}
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
                            <legend>{LOCALIZATION_EN.MATERIAL_VALUES}</legend>
                            <Checkbox
                                    label={LOCALIZATION_EN.OVERRIDE_PROPERTIES}
                                    handleCheck={() => updateEntityComponent(savedState, v => savedState = v, entity, "overrideMaterialUniforms", !components[tabIndex][1].overrideMaterialUniforms, true, components[tabIndex])}
                                    checked={components[tabIndex][1].overrideMaterialUniforms}
                            />
                            {#if components[tabIndex][1].overrideMaterialUniforms}
                                <MaterialUniforms
                                        uniforms={components[tabIndex][1].materialUniforms}
                                        update={(index, value) => {
                                            const uniforms = components[tabIndex][1].materialUniforms
                                            uniforms[index].data = value
                                            components[tabIndex][1].materialUniforms = uniforms

                                        }}
                                />
                            {/if}
                        </fieldset>
                    {:else if components[tabIndex][0] === COMPONENTS.SKYLIGHT}
                        <fieldset>
                            <legend>{LOCALIZATION_EN.PROBE}</legend>
                            <button
                                    class="recompute-button"
                                    on:click={() => {
                                    GPU.activeSkylightEntity = entity
                                }}>
                                {LOCALIZATION_EN.RECOMPUTE_CAPTURE}
                            </button>
                        </fieldset>
                    {/if}
                {/if}

            {/if}
        </div>
    </div>
{/if}
<style>
    .recompute-button {
        height: 25px;
        width: 100%;
        background: var(--pj-background-primary);
    }

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