<script>
    import EntityInformation from "./EntityInformation.svelte"
    import Layout from "./dynamic-form/Layout.svelte"
    import {onDestroy, onMount} from "svelte"
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS"

    import dragDrop from "../../../../../shared/components/drag-drop/drag-drop"
    import UIComponent from "./UIComponent.svelte"
    import MaterialUniforms from "../MaterialUniforms.svelte"
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import MeshComponent from "../../../../../../engine-core/instances/components/MeshComponent"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../../util/InspectorUtil"
    import INSPECTOR_TABS from "../../static/INSPECTOR_TABS"

    /** @type {Entity} */
    export let entity
    /** @type {function} */
    export let setTabs
    /** @type {number} */
    export let tabIndex
    /** @type {function} */
    export let setTabIndex
    const TAB_OFFSET = INSPECTOR_TABS.length
    let ref
    let savedState = false
    let components
    let component
    let scripts
    $: {
    	components = entity.allComponents
    	component = components[tabIndex - TAB_OFFSET + 1]
    	scripts = entity.scripts
    	setTabs(entity.isCollection ? [...InspectorUtil.getEntityTabs(components).slice(0, 2)] : InspectorUtil.getEntityTabs(components))
    }

    const draggable = dragDrop(false)
    onMount(() => {
    	draggable.onMount({
    		targetElement: ref.parentElement,
    		onDrop: d => InspectorUtil.handleComponentDrop(entity, d),
    		onDragOver: () => LocalizationEN.ADD_DRAG_DROP
    	})
    })
    onDestroy(() => draggable.onDestroy())


    function updateMaterialUniform(index, value) {
    	const ref = component
    	const uniforms = ref.materialUniforms
    	ref.updateMaterialUniformValue(uniforms[index].key, value)
    }
</script>

<span style="display: none" bind:this={ref}></span>
{#if tabIndex === TAB_OFFSET}
    <EntityInformation entity={entity}/>
{:else if tabIndex === TAB_OFFSET + 1}
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
                submit={(k, v) => InspectorUtil.updateEntityComponent(savedState, v => savedState = v, entity, k, v, true, component)}
        />
    {:else}
        <Layout
                entity={entity}
                key={component.componentKey}
                component={component}
                updateTabs={() => components = entity.allComponents}
                submit={(k, v, s) => InspectorUtil.updateEntityComponent(savedState, v => savedState = v, entity, k, v, s, component)}
        />
        {#if component instanceof MeshComponent && component.hasMaterial}
            <fieldset>
                <legend>{LocalizationEN.MATERIAL_VALUES}</legend>
                <Checkbox
                        label={LocalizationEN.OVERRIDE_PROPERTIES}
                        handleCheck={() => InspectorUtil.updateEntityComponent(savedState, v => savedState = v, entity, "overrideMaterialUniforms", !component.overrideMaterialUniforms, true, component)}
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
