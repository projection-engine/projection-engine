<script lang="ts">
    import EntityInformation from "./EntityInformation.svelte"
    import Layout from "./dynamic-form/Layout.svelte"
    import {onDestroy, onMount} from "svelte"

    import dragDrop from "../../../../shared/components/drag-drop/drag-drop"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../util/InspectorUtil"
    import INSPECTOR_TABS from "../static/INSPECTOR_TABS"
    import type Entity from "../../../../../engine/core/instances/Entity";

    export let entity: Entity
    export let tabIndex: number

    const TAB_OFFSET = INSPECTOR_TABS.length
    let ref
    let toRender
    $: toRender = [
        ...entity.scripts.map(c => ({type: "script", data: c})),
        ...entity.allComponents.map(c => ({type: "component", data: c}))
    ]
    $: form = toRender[tabIndex - TAB_OFFSET - 2]
    const draggable = dragDrop(false)
    onMount(() => {
        draggable.onMount({
            targetElement: ref.parentElement,
            onDrop: d => InspectorUtil.handleComponentDrop(entity, d),
            onDragOver: () => LocalizationEN.ADD_DRAG_DROP
        })
    })
    onDestroy(() => draggable.onDestroy())

    const submit = (k, v) => {
        InspectorUtil.updateEntityComponent(entity, k, v, form.data)
        entity = entity
    }
    $: console.trace("UPDATED ENTITY", entity)
</script>

<span style="display: none" bind:this={ref}></span>
{#if tabIndex === TAB_OFFSET}
    <EntityInformation entity={entity}/>
{:else if form != null}
    {#if form.type === "script"}
        <Layout
                {entity}
                index={tabIndex - TAB_OFFSET}
                component={form.data}
                submit={(k, v) => form.data[k] = v}
        />
    {:else}
        <Layout
                {entity}
                key={form.data.componentKey}
                component={form.data}
                updateTabs={() => entity = entity}
                submit={submit}
        />
    {/if}
{/if}
