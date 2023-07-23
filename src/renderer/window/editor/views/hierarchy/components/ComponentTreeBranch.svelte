<!--suppress ALL -->
<script lang="ts">
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Component from "../../../../../engine/core/instances/components/Component";
    import HierarchyUtil from "../../../util/HierarchyUtil";
    import EditorUtil from "../../../util/EditorUtil";


    export let depth: number
    export let component: Component

    $: icon = EditorUtil.getComponentIcon(component.componentKey)
    $: label = EditorUtil.getComponentLabel(component.componentKey)
    $: entity = component.entity
</script>


<div
        class="wrapper hierarchy-branch"
        class:element={true}
        data-svelteentity={entity.id}
        style={"padding-left:" +  (depth * 18 + "px;") + (component.entity.active ? "" : "opacity: .5") }
>
    <div class="info hierarchy-branch" data-sveltenode={entity.id}
         on:click={e => HierarchyUtil.updateSelection(entity.id, e.ctrlKey)}>
        {#each {length: depth} as _, i}
            <div data-sveltevertdivider="-"
                 style={`border-left-style: ${i === 0 ? "solid" : "dashed"}; left: ${i * 18}px`} class="divider"></div>
        {/each}
        <div class="button-small hierarchy-branch"></div>
        <button
                class="button-icon hierarchy-branch"
                on:click={() => SelectionStoreUtil.setLockedEntity(entity.id)}
        >
            <Icon styles="font-size: 1rem; color: var(--pj-accent-color-tertiary)">{icon}</Icon>
        </button>
        <small>{label}</small>
    </div>
</div>

<style>
    small {
        font-size: .7rem;
    }

    .divider {
        position: absolute;
        height: 23px;
        transform: translateX(.3rem);
        z-index: 10;
        background: none;
        border-left: var(--pj-border-secondary) 1px dashed;
    }
</style>
