<script lang="ts">
    import Metadata from "./EntityInformation.svelte";
    import Layout from "./dynamic-form/Layout.svelte";
    import {onDestroy, onMount} from "svelte";
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS";
    import LOCALIZATION_EN from "../../../../../../static/objects/LOCALIZATION_EN";
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
    import Component from "../../../../../../engine-core/instances/components/Component";

    export let entity: Entity
    export let setTabs: Function
    export let tabIndex: number
    export let setTabIndex: Function

    let ref: HTMLElement
    let savedState = false
    let components: [string, Component][] = []
    $: components = entity.allComponents
    $: component = components[tabIndex]?.[1]
    $: setTabs(entity.isCollection ? [getEntityTabs(components)[0]] : getEntityTabs(components))
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

    function updateMaterialUniform(index: number, value: any) {
        const ref = <MeshComponent>component
        const uniforms = ref.materialUniforms
        ref.updateMaterialUniformValue(uniforms[index].key, value)
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
    {:else if component}
        <Layout
                entity={entity}
                key={components[tabIndex][0]}
                component={component}
                updateTabs={() => components = entity.allComponents}
                submit={(k, v, s) => updateEntityComponent(savedState, v => savedState = v, entity, k, v, s, components[tabIndex])}
        />
        {#if component instanceof MeshComponent && component.hasMaterial}
            <fieldset>
                <legend>{LOCALIZATION_EN.MATERIAL_VALUES}</legend>
                <Checkbox
                        label={LOCALIZATION_EN.OVERRIDE_PROPERTIES}
                        handleCheck={() => updateEntityComponent(savedState, v => savedState = v, entity, "overrideMaterialUniforms", !components[tabIndex][1].overrideMaterialUniforms, true, components[tabIndex])}
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
