<script lang="ts">
    import EntityInformation from "./EntityInformation.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import {onDestroy, onMount} from "svelte";
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS";

    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop";
    import handleComponentDrop from "../../utils/handle-component-drop";
    import UIComponent from "./UIComponent.svelte";
    import updateEntityComponent from "../../utils/update-entity-component";
    import getEntityTabs from "../../utils/get-entity-tabs";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import MeshComponent from "../../../../../../engine-core/instances/components/MeshComponent";
    import Entity from "../../../../../../engine-core/instances/Entity";
    import LocalizationEN from "../../../../../../shared/LocalizationEN";

    export let entity: Entity
    export let setTabs: Function
    export let tabIndex: number
    export let setTabIndex: Function

    let ref: HTMLElement
    let savedState = false
    let components
    $: components = entity.allComponents
    $: component = components[tabIndex]
    $: setTabs(entity.isCollection ? [...getEntityTabs(components).slice(0, 2)] : getEntityTabs(components))
    $: scripts = entity.scripts

    const draggable = dragDrop(false)
    onMount(() => {
        draggable.onMount({
            targetElement: ref.parentElement,
            onDrop: d => handleComponentDrop(entity, d),
            onDragOver: () => LocalizationEN.ADD_DRAG_DROP
        })
    })
    onDestroy(() => draggable.onDestroy())

    $: {
        if (component == null && tabIndex > 0)
            setTabIndex(-1)
    }

    function updateMaterialUniform(index: number, value: any) {
        const ref = <MeshComponent>component
        const uniforms = ref.materialUniforms
        ref.updateMaterialUniformValue(uniforms[index].key, value)
    }
</script>


<span style="display: none" bind:this={ref}></span>
{#if tabIndex === -1}
    <EntityInformation entity={entity}/>
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
            {LocalizationEN.NO_CUSTOM_COMPONENTS_LINKED}
        </div>
    {/if}
{:else if tabIndex < components.length && component}
    {#if component.componentKey === COMPONENTS.UI}
        <UIComponent
                entity={entity}
                submit={(k, v) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, true, component)}
        />
    {:else}
        <Layout
                entity={entity}
                key={component.componentKey}
                component={component}
                updateTabs={() => components = entity.allComponents}
                submit={(k, v, s) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, s, component)}
        />
        {#if component instanceof MeshComponent && component.hasMaterial}
            <fieldset>
                <legend>{LocalizationEN.MATERIAL_VALUES}</legend>
                <Checkbox
                        label={LocalizationEN.OVERRIDE_PROPERTIES}
                        handleCheck={() => updateEntityComponent(savedState, v => savedState = v, entity, "overrideMaterialUniforms", !component.overrideMaterialUniforms, true, component)}
                        checked={component.overrideMaterialUniforms}
                />
                {#if component.overrideMaterialUniforms}
                    <MaterialUniforms
                            uniforms={component.materialUniforms}
                            update={updateMaterialUniform}
                    />
                {/if}
            </fieldset>
        {/if}
    {/if}

{/if}
