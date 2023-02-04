<script>
    import Metadata from "./Metadata.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import {onDestroy, onMount} from "svelte";
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS";
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop";
    import handleComponentDrop from "../../utils/handle-component-drop";
    import UIComponent from "./UIComponent.svelte";
    import updateEntityComponent from "../../utils/update-entity-component";
    import getEntityTabs from "../../utils/get-entity-tabs";
    import TransformationForm from "./TransformationForm.svelte";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";

    export let entity
    export let setTabs
    export let tabIndex
    export let setTabIndex

    let ref
    let savedState
    let components
    $: components = entity.allComponents
    $: setTabs(getEntityTabs(components))
    $: scripts = entity.scripts

    const draggable = dragDrop(false)
    onMount(() => {
        draggable.onMount({
            targetElement: ref.parentElement,
            onDrop: d => handleComponentDrop(entity, d),
            onDragOver: () => LOCALIZATION_EN.ADD_DRAG_DROP
        })
    })
    onDestroy(() => draggable.onDestroy())

    $: {
        if (components[tabIndex] == null && tabIndex > 0)
            setTabIndex(-1)
    }

</script>


<span style="display: none" bind:this={ref}></span>
{#if tabIndex === -1}
    <Metadata entity={entity}/>
{:else if tabIndex === -2}
    {#if scripts.length > 0}
        {#each scripts as script, scriptIndex}
            <Layout
                    entity={entity}
                    index={scriptIndex}
                    component={scripts[scriptIndex]}
                    submit={(k, v) => scripts[scriptIndex][k] = v}
            />
        {/each}
    {:else}
        <div data-svelteempty="-">
            <Icon styles="font-size: 75px">code</Icon>
            {LOCALIZATION_EN.NO_CUSTOM_COMPONENTS_LINKED}
        </div>
    {/if}
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
                updateTabs={() => {
                    components = entity.allComponents
                }}
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
        {/if}
    {/if}

{/if}
