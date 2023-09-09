<script lang="ts">
    import EntityInformation from "./EntityInformation.svelte"
    import ComponentForm from "./ComponentForm.svelte"
    import {onDestroy, onMount} from "svelte"
    import dragDrop from "../../../../shared/components/drag-drop/drag-drop"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../util/InspectorUtil"
    import INSPECTOR_TABS from "../static/INSPECTOR_TABS"
    import type EditorEntity from "../../../../../engine/tools/EditorEntity";
    import AbstractComponent from "@engine-core/lib/components/AbstractComponent";

    export let entity: EditorEntity
    export let tabIndex: number

    const TAB_OFFSET = INSPECTOR_TABS.length
    let ref
    let toRender: { type: string, data: AbstractComponent }[]
    $: toRender = entity.allComponents.map(c => ({type: "component", data: c}))
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
</script>

<span style="display: none" bind:this={ref}></span>
{#if tabIndex === TAB_OFFSET}
    <EntityInformation entity={entity}/>
{:else if form != null}
    <ComponentForm
            {entity}
            key={form.data.getComponentKey()}
            component={form.data}
            updateTabs={() => entity = entity}
            submit={submit}
    />
{/if}
